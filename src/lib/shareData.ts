import { parseStoredCustomization, tierFeatures } from "./customization";
import { resolvedColors } from "./palettes";
import { tierOf } from "./pricing";
import { prisma } from "./prisma";
import type { ShareData } from "./shareImages";

/** Tayyor rasmlar uchun ma'lumot: faqat tasdiqlangan Luxury buyurtma (token bo'yicha) */
export async function shareDataFor(token: string, origin: string): Promise<ShareData | null> {
  const order = await prisma.order.findUnique({
    where: { accessToken: token },
    include: { template: true, invitation: true },
  });
  const inv = order?.invitation;
  if (!order || !inv || order.status !== "PAID") return null;
  if (!tierFeatures(tierOf(order.template.price)).shareImages) return null;

  const c = parseStoredCustomization(inv.options);
  const d = inv.eventDate;
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    groom: inv.partner1 || inv.title,
    bride: inv.partner2,
    kicker: c.kicker || order.template.kicker,
    dateLabel: `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`,
    timeLabel: inv.eventTime || "18:00",
    venueName: inv.venueName,
    url: `${origin}/e/${inv.slug}`,
    colors: resolvedColors(order.template.theme, c.palette, c.colors),
    lang: c.lang,
  };
}
