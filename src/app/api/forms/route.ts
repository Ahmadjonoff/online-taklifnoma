import { NextResponse } from "next/server";
import { parseStoredCustomization } from "@/lib/customization";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { validateGuestSubmission } from "@/lib/validation";

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

    // Mijoz tilaklarni o'chirgan bo'lsa — ular ochiq ko'rsatilmaydi
    if (
      !invitation ||
      invitation.order.status !== "PAID" ||
      !parseStoredCustomization(invitation.options).wishes
    ) {
      return NextResponse.json({ wishes: [] });
    }

    return NextResponse.json({ wishes: invitation.wishes });
  } catch (e) {
    console.error("Tilaklarni olishda xatolik:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

// Spamdan himoya: tilaklar taklifnomada hammaga ko'rinadi — bot bitta
// taklifnomani to'ldirib tashlamasin. Bir IP uchun daqiqasiga 20 ta (mobil
// operatorlarda ko'p mehmon bitta IP ortida — CGNAT), shu
// taklifnomaga esa (IP'dan qat'i nazar) soatiga 300 ta yozuv.
const IP_LIMIT = 20;
const IP_WINDOW_MS = 60_000;
const INVITATION_LIMIT = 300;
const INVITATION_WINDOW_MS = 60 * 60_000;

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const slug = typeof body?.slug === "string" ? body.slug : "";
    const parsed = validateGuestSubmission(body);
    if (!slug || !parsed.ok) {
      return NextResponse.json(
        { error: parsed.ok ? "Ma'lumotlar to'liq emas" : parsed.error },
        { status: 400 }
      );
    }

    if (!(await rateLimit(`forms:${clientIp(req)}`, IP_LIMIT, IP_WINDOW_MS))) {
      return NextResponse.json(
        { error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." },
        { status: 429 }
      );
    }

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      include: { order: { select: { status: true } } },
    });

    if (!invitation || invitation.order.status !== "PAID") {
      return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
    }

    // Mijoz o'chirgan bo'limga qo'lda yuborilgan so'rov ham qabul qilinmaydi
    const custom = parseStoredCustomization(invitation.options);
    if ((parsed.value.kind === "rsvp" && !custom.rsvp) || (parsed.value.kind === "wish" && !custom.wishes)) {
      return NextResponse.json({ error: "Bu bo'lim o'chirilgan" }, { status: 403 });
    }

    if (!(await rateLimit(`forms-inv:${invitation.id}`, INVITATION_LIMIT, INVITATION_WINDOW_MS))) {
      return NextResponse.json(
        { error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." },
        { status: 429 }
      );
    }

    const v = parsed.value;
    if (v.kind === "rsvp") {
      // Faqat shu taklifnomaning mehmoni bo'lsa bog'lanadi
      const guest = v.guest
        ? await prisma.guest.findFirst({
            where: { code: v.guest, invitationId: invitation.id },
            select: { id: true },
          })
        : null;
      await prisma.rsvpResponse.create({
        data: {
          invitationId: invitation.id,
          guestId: guest?.id ?? null,
          guestName: v.name,
          attending: v.attending,
          guestsCount: v.guestsCount,
          comment: v.comment,
        },
      });
      return NextResponse.json({ ok: true });
    }

    await prisma.wish.create({
      data: {
        invitationId: invitation.id,
        guestName: v.name,
        message: v.message,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("RSVP/tilak yuborishda xatolik:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
