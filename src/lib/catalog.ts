/**
 * Katalog uchun yordamchi funksiyalar.
 *
 * Daraja (tier) narxdan kelib chiqib aniqlanadi — sxemani o'zgartirmasdan
 * «Premium» va «Standart» shablonlarni ajratish uchun. Generator ham xuddi shu
 * chegarani ishlatadi (scripts/generate-taklif-templates.mjs).
 */

/** Shu narxdan boshlab shablon «Premium» hisoblanadi (so'mda). */
export const PREMIUM_FROM = 99_000

export type Tier = "premium" | "standard"

export function tierOf(price: number): Tier {
  return price >= PREMIUM_FROM ? "premium" : "standard"
}

export const TIER_STYLE: Record<Tier, string> = {
  premium:
    "border-amber-300/70 bg-gradient-to-r from-amber-50 to-amber-100/70 text-amber-800",
  standard: "border-stone-300/80 bg-white/85 text-stone-600",
}

// DIQQAT: daraja nomi ("Premium"/"Standart") va narx matni endi
// @/lib/i18n/dictionary (dict.common.tierPremium/tierStandard/priceShort/
// priceNote) orqali til bo'yicha beriladi — bu yerda emas.

/** Admin panel uchun: summani o'qishga qulay ko'rinishda chiqaradi. */
export function formatPrice(price: number): string {
  return price.toLocaleString("uz-UZ")
}
