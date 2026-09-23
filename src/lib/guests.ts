import { randomBytes } from "node:crypto";
import { prisma } from "./prisma";
import { tierFeatures } from "./customization";
import { tierOf } from "./pricing";

export const MAX_GUESTS = 300;
export const MAX_GUEST_NAME = 80;

/** Shaxsiy havola kodi: 10 belgi, kichik harf + raqam (taxmin qilib bo'lmaydi) */
export function newGuestCode(): string {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(10);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

/**
 * Buyurtma tokeni bo'yicha shaxsiy havolalar boshqaruviga ruxsat: faqat
 * tasdiqlangan (PAID) Luxury buyurtma. Aks holda null.
 */
export async function guestOwner(token: string) {
  const order = await prisma.order.findUnique({
    where: { accessToken: token },
    select: { status: true, template: { select: { price: true } }, invitation: { select: { id: true, slug: true } } },
  });
  if (!order?.invitation || order.status !== "PAID") return null;
  if (!tierFeatures(tierOf(order.template.price)).guestLinks) return null;
  return order.invitation;
}

export async function listGuests(invitationId: number) {
  const guests = await prisma.guest.findMany({
    where: { invitationId },
    orderBy: { id: "asc" },
    include: { rsvps: { orderBy: { createdAt: "desc" }, take: 1, select: { attending: true, guestsCount: true } } },
  });
  return guests.map((g) => ({
    id: g.id,
    name: g.name,
    code: g.code,
    opened: Boolean(g.openedAt),
    views: g.views,
    rsvp: g.rsvps[0] ? { attending: g.rsvps[0].attending, count: g.rsvps[0].guestsCount } : null,
  }));
}

export type GuestRow = Awaited<ReturnType<typeof listGuests>>[number];
