import { uz, type Dictionary } from "./dictionaries/uz";
import { ru } from "./dictionaries/ru";
import { en } from "./dictionaries/en";
import { deepToCyrillicUz } from "./cyrillic";
import type { Locale } from "./locales";

export type { Dictionary };
export { t } from "./format";

let cachedUzc: Dictionary | null = null;

/** `uzc` (kirill) faqat birinchi so'rovda `uz`dan hosil qilinadi va keshlanadi. */
function getUzcDictionary(): Dictionary {
  if (!cachedUzc) cachedUzc = deepToCyrillicUz(uz);
  return cachedUzc;
}

export function getDictionary(locale: Locale): Dictionary {
  switch (locale) {
    case "ru":
      return ru;
    case "en":
      return en;
    case "uzc":
      return getUzcDictionary();
    case "uz":
    default:
      return uz;
  }
}
