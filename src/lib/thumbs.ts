import THUMBS from "./thumbs.json";

/**
 * Oldindan tayyorlangan shablon rasmlari (scripts/generate-thumbs.mjs).
 * Katalog kartalari va bosh sahifa jonli iframe o'rniga shu rasmlarni
 * ko'rsatadi — sahifa ancha tez ochiladi. Rasmi yo'q shablon uchun null.
 */
const AVAILABLE = new Set<string>(THUMBS);

export function thumbUrl(theme: string, kind: "card" | "phone" = "card"): string | null {
  if (!AVAILABLE.has(theme)) return null;
  return `/thumbs/${theme}${kind === "phone" ? "-phone" : ""}.jpg`;
}
