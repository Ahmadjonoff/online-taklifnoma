import { parseStoredCustomization } from "@/lib/customization";
import { calendarTitle, icsContent } from "@/lib/invitationConfig";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** «Kalendarga qo'shish» (Apple Calendar / Outlook) — Luxury taklifnomalar uchun */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const inv = await prisma.invitation.findUnique({
    where: { slug },
    include: { order: { select: { status: true } } },
  });
  if (!inv || inv.order.status !== "PAID" || !parseStoredCustomization(inv.options).calendar) {
    return new Response("Topilmadi", { status: 404 });
  }

  const d = inv.eventDate;
  const pad = (n: number) => String(n).padStart(2, "0");
  const origin = new URL(req.url).origin;
  const ics = icsContent(
    {
      title: inv.title,
      partner1: inv.partner1,
      partner2: inv.partner2,
      eventDate: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      eventTime: inv.eventTime,
      venueName: inv.venueName,
      venueAddress: inv.venueAddress,
      message: inv.message,
    },
    calendarTitle(inv.partner1 || inv.title, inv.partner2),
    `${origin}/e/${slug}`,
    `${slug}@taklifnoma`
  );
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="taklifnoma-${slug}.ics"`,
    },
  });
}
