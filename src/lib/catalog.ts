/**
 * Katalog uchun yordamchi funksiyalar.
 *
 * Daraja (tier) narxdan kelib chiqib aniqlanadi — chegaralar va narxlar
 * `@/lib/pricing` da. Bu yerda — faqat ko'rinish (badge uslubi).
 */
import { tierOf, type Tier } from "./pricing";

export { formatPrice, tierOf, type Tier } from "./pricing";

export const TIER_STYLE: Record<Tier, string> = {
  luxury:
    "border-amber-300/80 bg-gradient-to-r from-amber-50 to-amber-100/80 text-amber-900",
  premium: "border-rose-200/80 bg-rose-50/90 text-rose-800",
  standard: "border-stone-300/80 bg-white/85 text-stone-700",
};

// DIQQAT: daraja nomi va narx matni @/lib/i18n/dictionary orqali til bo'yicha
// beriladi (dict.common.tierStandard/tierPremium/tierLuxury, priceShort).

/** Daraja nomi joriy tilda (dict.common yoki dict.catalog). */
export function tierLabel(
  tier: Tier,
  labels: { tierStandard: string; tierPremium: string; tierLuxury: string }
): string {
  return tier === "luxury" ? labels.tierLuxury : tier === "premium" ? labels.tierPremium : labels.tierStandard;
}

/**
 * Darajalarni aralashtirish: Standart → Premium → Luxury → Standart … (har
 * daraja ichidagi tartib saqlanadi). Reklama «79 000 so'mdan» deydi — birinchi
 * ekranda faqat 249 000 lik kartalar tursa, odam «aldashdi» deb chiqib ketadi.
 */
export function mixTiers<T extends { price: number }>(list: T[]): T[] {
  const order: Tier[] = ["standard", "premium", "luxury"];
  const buckets = order.map((tier) => list.filter((x) => tierOf(x.price) === tier));
  const out: T[] = [];
  for (let i = 0; out.length < list.length; i++) {
    for (const b of buckets) if (i < b.length) out.push(b[i]);
  }
  return out;
}
