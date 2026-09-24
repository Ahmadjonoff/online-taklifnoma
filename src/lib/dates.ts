/**
 * Tadbir sanasi bilan ishlash.
 *
 * `Invitation.eventDate` — kalendar kuni ("YYYY-MM-DD"), vaqtsiz. Bazaga
 * `new Date("YYYY-MM-DD")` = shu kunning UTC yarim tuni bo'lib yoziladi,
 * shuning uchun qayta o'qishda ham faqat UTC getter'lar ishlatiladi —
 * aks holda server vaqt zonasi UTC bo'lmasa sana bir kunga siljiydi.
 */

const pad = (n: number) => String(n).padStart(2, "0");

/** Bazadagi sana → "YYYY-MM-DD" (server vaqt zonasiga bog'liq emas) */
export function isoDate(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** "YYYY-MM-DD" → "DD.MM.YYYY" */
export function dateLabel(iso: string): string {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}.${m}.${y}` : iso;
}

/**
 * Haqiqatan mavjud kunmi. `new Date("2026-02-31")` xato bermaydi — jimgina
 * 3-martga aylanadi, shuning uchun qaytarib solishtiramiz.
 */
export function isRealDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = new Date(`${iso}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && isoDate(d) === iso;
}

/** Mijozlar O'zbekistonda: "bugun" — Toshkent vaqti bo'yicha (UTC+5) */
export const TIME_ZONE = "Asia/Tashkent";

/** Berilgan paytdagi Toshkent sanasi ("YYYY-MM-DD") */
export function tashkentDate(now = new Date()): string {
  // en-CA formati — aynan YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** "YYYY-MM-DD" ga necha yil qo'shilgan sana (29-fevral → 28-fevral) */
export function addYears(iso: string, years: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y + years, m - 1, d));
  if (t.getUTCMonth() !== m - 1) t.setUTCDate(0);
  return isoDate(t);
}

/** Buyurtma qilish mumkin bo'lgan sanalar oralig'i: bugundan 3 yilgacha */
export function eventDateRange(now = new Date()): { min: string; max: string } {
  const min = tashkentDate(now);
  return { min, max: addYears(min, 3) };
}
