import { parseStoredCustomization, tierFeatures } from "./customization";
import { resolvedColors } from "./palettes";
import { tierOf } from "./pricing";
import { prisma } from "./prisma";
import type { ShareData } from "./shareImages";

type OrderWithInvitation = NonNullable<Awaited<ReturnType<typeof findByToken>>>;

function findByToken(token: string) {
  return prisma.order.findUnique({ where: { accessToken: token }, include: { template: true, invitation: true } });
}

/** Tayyor rasmlar uchun ma'lumot: faqat tasdiqlangan Luxury buyurtma (token bo'yicha) */
export async function shareDataFor(token: string, origin: string): Promise<ShareData | null> {
  const order = await findByToken(token);
  if (!order || !order.invitation || order.status !== "PAID") return null;
  if (!tierFeatures(tierOf(order.template.price)).shareImages) return null;
  return toShareData(order, origin);
}

/** Havola preview'i (og:image) uchun — har qanday tarif, faqat tasdiqlangan taklifnoma (slug bo'yicha) */
export async function shareDataForSlug(slug: string, origin: string): Promise<ShareData | null> {
  const inv = await prisma.invitation.findUnique({ where: { slug }, select: { order: { select: { accessToken: true } } } });
  const order = inv?.order ? await findByToken(inv.order.accessToken) : null;
  if (!order || !order.invitation || order.status !== "PAID") return null;
  return toShareData(order, origin);
}

function toShareData(order: OrderWithInvitation, origin: string): ShareData {
  const inv = order.invitation!;

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
    lang: c.langs[0],
  };
}
