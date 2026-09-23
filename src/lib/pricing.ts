import type { Customization } from "./customization";
import { MUSIC_CUSTOM } from "./music";

/**
 * Narxlar — bitta joyda.
 *
 * Shablon narxi `Template.price` da (seed rejadan yozadi), daraja shu narxdan
 * aniqlanadi (`tierOf`). Bu yerda — daraja narxlari (bosh sahifadagi
 * to'plamlar) va qo'shimcha xizmatlar.
 *
 * Mo'ljal (2026-09): Taklifnomachi.uz Standart 199 000 (musiqasiz),
 * Premium 349 000; Momento 200 000. Bizda musiqa, taymer, tilaklar va rang
 * tanlash barcha darajalarga kiradi — daraja faqat dizayn murakkabligiga
 * (qilinadigan ish hajmiga) qarab farq qiladi.
 */
export type Tier = "light" | "standard" | "premium";

export const TIER_PRICE: Record<Tier, number> = {
  light: 149_000,
  standard: 199_000,
  premium: 279_000,
};

/** Mijoz o'z musiqasini yuklasa: operator faylni tekshiradi, qirqadi, ovozini tekislaydi */
export const CUSTOM_MUSIC_PRICE = 29_000;

export function tierOf(price: number): Tier {
  if (price >= TIER_PRICE.premium) return "premium";
  if (price >= TIER_PRICE.standard) return "standard";
  return "light";
}

export type PriceLine = { key: "template" | "customMusic"; amount: number };

/** Buyurtma summasi: shablon + tanlangan qo'shimcha xizmatlar. */
export function orderPrice(templatePrice: number, c: Pick<Customization, "music">) {
  const lines: PriceLine[] = [{ key: "template", amount: templatePrice }];
  if (c.music === MUSIC_CUSTOM) lines.push({ key: "customMusic", amount: CUSTOM_MUSIC_PRICE });
  return { lines, total: lines.reduce((s, l) => s + l.amount, 0) };
}

/** 199000 → "199 000" (bo'shliq bilan — barcha tillarda bir xil ko'rinadi) */
export function formatPrice(price: number): string {
  return String(price).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
