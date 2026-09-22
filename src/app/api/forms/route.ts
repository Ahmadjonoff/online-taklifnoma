import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
};

// DB'ni cheksiz uzun matn bilan to'ldirishning oldini olish.
const MAX_NAME_LENGTH = 80;
const MAX_TEXT_LENGTH = 500;

export async function POST(req: Request) {
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
      include: { order: { select: { status: true } } },
    });

    if (!invitation || invitation.order.status !== "PAID") {
      return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
    }

    if (kind === "rsvp") {
      await prisma.rsvpResponse.create({
        data: {
          invitationId: invitation.id,
          guestName: name,
          attending: body.attending === "keladi",
          guestsCount:
            body.attending === "keladi" ? Math.max(1, body.guests ?? 1) : 0,
          comment: body.comment ?? "",
        },
      });
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
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Noma'lum tur" }, { status: 400 });
  } catch (e) {
    console.error("RSVP/tilak yuborishda xatolik:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
