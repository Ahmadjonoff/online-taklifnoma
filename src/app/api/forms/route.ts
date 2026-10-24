import { after, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { notifyCustomerResponse } from "@/lib/telegramBot";

/** Ochiq taklifnoma uchun tilaklarni olish (galereya). */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "slug kerak" }, { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      include: {
        order: { select: { status: true } },
        wishes: {
          orderBy: { id: "desc" },
          take: 50,
          select: { id: true, guestName: true, message: true, createdAt: true },
        },
      },
    });

    if (!invitation || invitation.order.status !== "PAID") {
      return NextResponse.json({ wishes: [] });
    }

    return NextResponse.json({ wishes: invitation.wishes });
  } catch (e) {
    console.error("Tilaklarni olishda xatolik:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

type Body = {
  kind?: "rsvp" | "wish";
  slug?: string;
  name?: string;
  attending?: "keladi" | "kelolmaydi";
  guests?: number;
  comment?: string;
  message?: string;
  /** Shaxsiy mehmon havolasi kodi (?g=) — javob shu mehmonga bog'lanadi */
  guest?: string;
};

// DB'ni cheksiz uzun matn bilan to'ldirishning oldini olish.
const MAX_NAME_LENGTH = 80;
const MAX_TEXT_LENGTH = 500;
// Bitta javobdagi mehmonlar soni (oila bilan) — mazmunsiz katta raqamlar statistikani buzmasin
const MAX_PARTY = 20;

// Spamdan himoya: bitta IP uchun 1 daqiqada ko'pi bilan 10 ta javob/tilak
const FORM_LIMIT = 10;
const FORM_WINDOW_MS = 60_000;

export async function POST(req: Request) {
  if (!rateLimit(`form:${clientIp(req)}`, FORM_LIMIT, FORM_WINDOW_MS)) {
    return NextResponse.json({ error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." }, { status: 429 });
  }
  try {
    const body = (await req.json()) as Body;
    const { kind, slug, name } = body;

    if (!slug || !name || !kind) {
      return NextResponse.json(
        { error: "Ma'lumotlar to'liq emas" },
        { status: 400 }
      );
    }

    if (
      name.length > MAX_NAME_LENGTH ||
      (body.comment?.length ?? 0) > MAX_TEXT_LENGTH ||
      (body.message?.length ?? 0) > MAX_TEXT_LENGTH
    ) {
      return NextResponse.json(
        { error: "Matn juda uzun" },
        { status: 400 }
      );
    }

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      include: { order: { select: { status: true, notifyChatId: true, accessToken: true } } },
    });

    if (!invitation || invitation.order.status !== "PAID") {
      return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
    }

    // Mijoz botga ulangan bo'lsa — javob/tilak darhol uning Telegramiga
    const notify = (r: { kind: "rsvp" | "wish"; attending?: boolean; guests?: number; text?: string }) => {
      const chatId = invitation.order.notifyChatId;
      if (!chatId) return;
      const pageUrl = `${new URL(req.url).origin}/buyurtma/${invitation.order.accessToken}`;
      after(() => notifyCustomerResponse(chatId, { invitationTitle: invitation.title, name, pageUrl, ...r }));
    };

    if (kind === "rsvp") {
      // Faqat shu taklifnomaning mehmoni bo'lsa bog'lanadi
      const guest =
        typeof body.guest === "string" && /^[a-z0-9]{6,16}$/i.test(body.guest)
          ? await prisma.guest.findFirst({
              where: { code: body.guest, invitationId: invitation.id },
              select: { id: true },
            })
          : null;
      await prisma.rsvpResponse.create({
        data: {
          invitationId: invitation.id,
          guestId: guest?.id ?? null,
          guestName: name,
          attending: body.attending === "keladi",
          guestsCount:
            body.attending === "keladi" ? Math.min(MAX_PARTY, Math.max(1, Math.floor(Number(body.guests) || 1))) : 0,
          comment: body.comment ?? "",
        },
      });
      notify({ kind: "rsvp", attending: body.attending === "keladi", guests: Number(body.guests) || 1, text: body.comment });
      return NextResponse.json({ ok: true });
    }

    if (kind === "wish") {
      await prisma.wish.create({
        data: {
          invitationId: invitation.id,
          guestName: name,
          message: body.message ?? "",
        },
      });
      notify({ kind: "wish", text: body.message });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Noma'lum tur" }, { status: 400 });
  } catch (e) {
    console.error("RSVP/tilak yuborishda xatolik:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
