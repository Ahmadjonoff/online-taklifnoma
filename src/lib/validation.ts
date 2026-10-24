import { eventDateRange, isRealDate } from "./dates";

/**
 * Buyurtma va mehmon formalari (RSVP, tilak) uchun server tekshiruvi.
 *
 * Bitta joyda: API route'lar, jonli preview va buyurtma formasi (`maxLength`)
 * shu chegaralardan foydalanadi. Mijoz tomonidagi cheklov faqat qulaylik —
 * haqiqiy himoya shu yerda (qo'lda yuborilgan so'rovlar uchun).
 */

/** Taklifnoma matn maydonlari uchun maksimal uzunlik (belgi) */
export const CONTENT_LIMITS = {
  customerName: 80,
  partner: 80,
  // Forma sarlavhani "<ism1> & <ism2>" qilib yig'adi
  title: 170,
  venueName: 120,
  venueAddress: 200,
  message: 1000,
} as const;

/** RSVP: bitta javobda ko'pi bilan necha kishi (shablondagi tanlagich ham 20 gacha) */
export const MAX_RSVP_GUESTS = 20;
export const MAX_GUEST_NAME = 80;
export const MAX_GUEST_TEXT = 500;

const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;
// Qator ko'chirish (\n) saqlanadigan matnlar uchun
const CONTROL_CHARS_KEEP_NL = /[\u0000-\u0009\u000b-\u001f\u007f]/g;

/** Satr bo'lmasa — "". Boshqaruv belgilari olib tashlanadi, chetlari kesiladi. */
export function cleanText(v: unknown, opts: { multiline?: boolean } = {}): string {
  if (typeof v !== "string") return "";
  return v.replace(opts.multiline ? CONTROL_CHARS_KEEP_NL : CONTROL_CHARS, " ").trim();
}

export const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export type OrderContent = {
  customerName: string;
  phone: string;
  title: string;
  partner1: string;
  partner2: string;
  eventDate: string; // YYYY-MM-DD
  eventTime: string; // HH:MM
  venueName: string;
  venueAddress: string;
  message: string;
};

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

/**
 * Buyurtma formasidagi asosiy maydonlar.
 * @param now — sinov uchun; sana (Toshkent vaqti bo'yicha) o'tmishda yoki 3 yildan uzoqda bo'lmasin
 */
export function validateOrderContent(
  input: unknown,
  now = new Date(),
  /** Admin tahriri: tadbir o'tib ketgan bo'lishi mumkin — o'tmishdagi sana ham qabul qilinadi */
  opts: { allowPastDate?: boolean } = {}
): Result<OrderContent> {
  const o = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const v: OrderContent = {
    customerName: cleanText(o.customerName),
    phone: cleanText(o.phone),
    title: cleanText(o.title),
    partner1: cleanText(o.partner1),
    partner2: cleanText(o.partner2),
    eventDate: cleanText(o.eventDate),
    eventTime: cleanText(o.eventTime) || "18:00",
    venueName: cleanText(o.venueName),
    venueAddress: cleanText(o.venueAddress),
    message: cleanText(o.message, { multiline: true }),
  };

  if (!v.customerName || !v.phone || !v.title || !v.eventDate || !v.venueName) {
    return { ok: false, error: "Majburiy maydonlar to'ldirilmagan" };
  }

  const L = CONTENT_LIMITS;
  if (
    v.customerName.length > L.customerName ||
    v.partner1.length > L.partner ||
    v.partner2.length > L.partner ||
    v.title.length > L.title ||
    v.venueName.length > L.venueName ||
    v.venueAddress.length > L.venueAddress ||
    v.message.length > L.message
  ) {
    return { ok: false, error: "Matn juda uzun" };
  }

  // Telefon: O'zbekiston (+998 / 998 / 9 xonali) yoki chet el raqami xalqaro formatda (+7…, +90…;
  // E.164 — 8–15 raqam). Chet eldagi qarindoshlar ham buyurtma bera olsin.
  const phoneDigits = v.phone.replace(/[\s()-]/g, "");
  if (!/^(\+?998)?\d{9}$/.test(phoneDigits) && !/^\+[1-9]\d{7,14}$/.test(phoneDigits)) {
    return { ok: false, error: "Telefon raqami noto'g'ri formatda" };
  }

  if (!TIME_RE.test(v.eventTime)) {
    return { ok: false, error: "Tadbir vaqti noto'g'ri" };
  }

  // Sana: haqiqiy kun (31-fevral emas), o'tmishda yoki mazmunsiz uzoq
  // kelajakda emas. ISO satrlarni solishtirish sana tartibiga mos keladi.
  const range = eventDateRange(now);
  if (
    !isRealDate(v.eventDate) ||
    (!opts.allowPastDate && v.eventDate < range.min) ||
    v.eventDate > range.max
  ) {
    return { ok: false, error: "Tadbir sanasi noto'g'ri" };
  }

  return { ok: true, value: v };
}

export type GuestSubmission =
  | { kind: "rsvp"; name: string; attending: boolean; guestsCount: number; comment: string; guest: string | null }
  | { kind: "wish"; name: string; message: string };

/** Taklifnomadagi RSVP / tilak formasi. */
export function validateGuestSubmission(input: unknown): Result<GuestSubmission> {
  const o = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const name = cleanText(o.name);
  if (!name || (o.kind !== "rsvp" && o.kind !== "wish")) {
    return { ok: false, error: "Ma'lumotlar to'liq emas" };
  }
  if (name.length > MAX_GUEST_NAME) return { ok: false, error: "Matn juda uzun" };

  if (o.kind === "wish") {
    const message = cleanText(o.message, { multiline: true });
    if (!message) return { ok: false, error: "Tilak yozilmagan" };
    if (message.length > MAX_GUEST_TEXT) return { ok: false, error: "Matn juda uzun" };
    return { ok: true, value: { kind: "wish", name, message } };
  }

  if (o.attending !== "keladi" && o.attending !== "kelolmaydi") {
    return { ok: false, error: "Javob noto'g'ri" };
  }
  const attending = o.attending === "keladi";
  const comment = cleanText(o.comment, { multiline: true });
  if (comment.length > MAX_GUEST_TEXT) return { ok: false, error: "Matn juda uzun" };

  let guestsCount = 0;
  if (attending) {
    const n = o.guests ?? 1;
    if (typeof n !== "number" || !Number.isInteger(n) || n < 1 || n > MAX_RSVP_GUESTS) {
      return { ok: false, error: `Mehmonlar soni 1 dan ${MAX_RSVP_GUESTS} gacha bo'lishi kerak` };
    }
    guestsCount = n;
  }

  // Shaxsiy mehmon havolasi kodi (?g=) — format mos kelmasa, e'tiborsiz qoldiriladi
  const guest = typeof o.guest === "string" && /^[a-z0-9]{6,16}$/i.test(o.guest) ? o.guest : null;

  return { ok: true, value: { kind: "rsvp", name, attending, guestsCount, comment, guest } };
}
