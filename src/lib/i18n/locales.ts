/**
 * Qo'llab-quvvatlanadigan tillar.
 *
 * `uz`  — o'zbek (lotin, standart)
 * `uzc` — o'zbek (kirill) — `uz` lug'atidan avtomatik transliteratsiya
 *         qilinadi (@/lib/i18n/cyrillic), alohida qo'lda tarjima qilinmaydi.
 * `ru`  — rus
 * `en`  — ingliz
 */
export const LOCALES = ["uz", "uzc", "ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "uz";

export const LOCALE_COOKIE = "taklifnoma_locale";

/** Til tugmalarida ko'rsatiladigan qisqa nom. */
export const LOCALE_LABEL: Record<Locale, string> = {
  uz: "O'zbekcha",
  uzc: "Ўзбекча",
  ru: "Русский",
  en: "English",
};

/** `<html lang>` uchun. */
export const LOCALE_HTML_LANG: Record<Locale, string> = {
  uz: "uz-Latn",
  uzc: "uz-Cyrl",
  ru: "ru",
  en: "en",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
