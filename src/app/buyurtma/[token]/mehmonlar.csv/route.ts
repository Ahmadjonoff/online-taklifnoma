import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** CSV katak: ; va qo'shtirnoqli matn Excel'da buzilmasin; formula sifatida ochilmasin */
function cell(v: string | number): string {
  let s = String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

/**
 * Mehmonlar javoblari (RSVP) — Excel uchun CSV. Faqat buyurtma tokenini
 * biladigan mijoz yuklab oladi (ketma-ket id bo'yicha emas).
 */
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const order = await prisma.order.findUnique({
    where: { accessToken: token },
    select: {
      status: true,
      invitation: { select: { slug: true, rsvps: { orderBy: { createdAt: "asc" } } } },
    },
  });
  if (!order?.invitation || order.status !== "PAID") {
    return new Response("Topilmadi", { status: 404 });
  }

  const fmt = new Intl.DateTimeFormat("uz-UZ", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const rows = [
    ["Ism", "Javob", "Mehmonlar soni", "Izoh", "Sana"],
    ...order.invitation.rsvps.map((r) => [
      r.guestName,
      r.attending ? "Keladi" : "Kela olmaydi",
      r.attending ? r.guestsCount : 0,
      r.comment,
      fmt.format(r.createdAt),
    ]),
  ];
  // BOM — Excel UTF-8 (o'zbek/rus harflari) ni to'g'ri ochishi uchun; ";" —
  // o'zbek/rus Excel sozlamalarida standart ajratgich
  const csv = "\uFEFF" + rows.map((r) => r.map(cell).join(";")).join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mehmonlar-${order.invitation.slug}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
