/**
 * Katalog uchun yordamchi funksiyalar.
 *
 * Daraja (tier) narxdan kelib chiqib aniqlanadi — chegaralar va narxlar
 * `@/lib/pricing` da. Bu yerda — faqat ko'rinish (badge uslubi).
 */
import type { Tier } from "./pricing";

export { formatPrice, tierOf, type Tier } from "./pricing";

export const TIER_STYLE: Record<Tier, string> = {
  premium:
    "border-amber-300/70 bg-gradient-to-r from-amber-50 to-amber-100/70 text-amber-800",
  standard: "border-stone-300/80 bg-white/85 text-stone-700",
  light: "border-sky-200/80 bg-sky-50/85 text-sky-800",
};

// DIQQAT: daraja nomi va narx matni @/lib/i18n/dictionary orqali til bo'yicha
// beriladi (dict.common.tierLight/tierStandard/tierPremium, priceShort).

/** Daraja nomi joriy tilda (dict.common yoki dict.catalog). */
export function tierLabel(
  tier: Tier,
  labels: { tierPremium: string; tierStandard: string; tierLight: string }
): string {
  return tier === "premium" ? labels.tierPremium : tier === "light" ? labels.tierLight : labels.tierStandard;
}
