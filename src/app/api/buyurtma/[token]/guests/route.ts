import { NextResponse } from "next/server";
import { guestOwner, listGuests, MAX_GUEST_NAME, MAX_GUESTS, newGuestCode } from "@/lib/guests";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rateLimit";

/**
 * Luxury: mijozning shaxsiy mehmon havolalari. Ruxsat — buyurtma tokeni
 * (faqat mijozda), faqat tasdiqlangan Luxury buyurtma.
 */
type Ctx = { params: Promise<{ token: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const inv = await guestOwner((await params).token);
  if (!inv) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json({ guests: await listGuests(inv.id) });
}

export async function POST(req: Request, { params }: Ctx) {
  if (!rateLimit(`guests:${clientIp(req)}`, 30, 60_000)) {
    return NextResponse.json({ error: "Juda ko'p urinish" }, { status: 429 });
  }
  const inv = await guestOwner((await params).token);
  if (!inv) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as { names?: unknown };
  const names = (Array.isArray(body.names) ? body.names : [])
    .filter((n): n is string => typeof n === "string")
    .map((n) => n.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, MAX_GUEST_NAME))
    .filter(Boolean);
  if (!names.length) return NextResponse.json({ error: "Ism kiritilmagan" }, { status: 400 });

  const existing = await prisma.guest.count({ where: { invitationId: inv.id } });
  if (existing + names.length > MAX_GUESTS) {
    return NextResponse.json({ error: `Ko'pi bilan ${MAX_GUESTS} ta mehmon` }, { status: 400 });
  }
  await prisma.guest.createMany({
    data: names.map((name) => ({ invitationId: inv.id, name, code: newGuestCode() })),
  });
  return NextResponse.json({ guests: await listGuests(inv.id) });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const inv = await guestOwner((await params).token);
  if (!inv) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  const { id } = (await req.json().catch(() => ({}))) as { id?: unknown };
  if (typeof id !== "number") return NextResponse.json({ error: "id kerak" }, { status: 400 });
  // Faqat shu taklifnomaning mehmoni o'chiriladi
  await prisma.guest.deleteMany({ where: { id, invitationId: inv.id } });
  return NextResponse.json({ guests: await listGuests(inv.id) });
}
