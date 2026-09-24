import type { TimelineItem } from "./eventDefaults";
import { isOwnMusicUrl, MUSIC_CUSTOM, MUSIC_NONE, MUSIC_TRACKS } from "./music";
import { isOwnBlobUrl } from "./blob";
import type { MainColors } from "./palettes";
import type { Tier } from "./pricing";

/** Taklifnoma tili (Premium/Luxury): lotin, kirill, rus, ingliz */
export const INVITATION_LANGS = ["uz", "uz-cyrl", "ru", "en"] as const;
export type InvitationLang = (typeof INVITATION_LANGS)[number];
/** Mijoz matnini qo'lda tarjima qiladigan tillar (kirill — transliteratsiya) */
export const TRANSLATED_LANGS = ["ru", "en"] as const;
export type TranslatedLang = (typeof TRANSLATED_LANGS)[number];
export type TextTranslation = { kicker: string; message: string; storyTitle: string; storyText: string };

/** Buyurtma formasidagi tanlov uchun nomlar (har biri o'z tilida) */
export const LANG_LABEL: Record<InvitationLang, string> = {
  uz: "O'zbekcha (lotin)",
  "uz-cyrl": "Ўзбекча (кирилл)",
  ru: "Русский",
  en: "English",
};

/** Qaysi tarifda qaysi imkoniyat bor — forma ham, server ham shundan foydalanadi */
export function tierFeatures(tier: Tier) {
  const premiumPlus = tier === "premium" || tier === "luxury";
  return {
    story: premiumPlus,
    languages: premiumPlus,
    gallery: tier === "luxury",
    calendar: tier === "luxury",
    guestLinks: tier === "luxury",
    shareImages: tier === "luxury",
  };
}

/**
 * Mijoz buyurtmada tanlaydigan sozlamalar (`Invitation.options` JSON).
 *
 * Bitta joyda: tur, standart qiymatlar va serverdagi tekshiruv. Forma, API,
 * jonli preview va tayyor taklifnoma (`/e/[slug]`) shu moduldan foydalanadi.
 */
export type Customization = {
  /** Palitra id'si (`src/lib/palettes.ts`); "" — shablonning o'z ranglari */
  palette: string;
  /**
   * Mijoz tanlagan 3 ta asosiy rang ("#rrggbb"): fon, asosiy va qo'shimcha
   * urg'u. "" — palitraning o'z rangi. Qolgan tuslar shulardan hisoblanadi.
   */
  colors: MainColors;
  /** Tadbir turi slug'i — standart eslatmalar shu bo'yicha olinadi */
  eventType: string;
  /** Ismlar ustidagi kichik yozuv ("Nikoh to'yi", "Kelin salom" ...) */
  kicker: string;
  /** null — shablonning standart kun tartibi; [] — kun tartibi ko'rsatilmaydi */
  timeline: TimelineItem[] | null;
  googleMapsUrl: string;
  yandexMapsUrl: string;
  /**
   * Mijoz xarita havolasi bermay, manzil bo'yicha taxminiy joylashuvni
   * tasdiqlagan (src/lib/maps.ts). Buyurtmada havolalar shundan yasaladi.
   */
  mapConfirmed: boolean;
  /** Musiqa id'si, "none" yoki "custom" (mijoz yuklagan — `customMusicUrl`) */
  music: string;
  customMusicUrl: string;
  dressCode: { text: string; colors: string[] };
  gift: { cardNumber: string; cardHolder: string };
  rsvp: boolean;
  wishes: boolean;
  petals: boolean;
  /**
   * Premium/Luxury: taklifnoma tillari — mehmon taklifnomada ular orasida
   * almashtiradi. Birinchisi — ochilgandagi (standart) til.
   */
  langs: InvitationLang[];
  /**
   * Mijozning o'z matni boshqa tillarda (kirill avtomatik — shart emas).
   * Bo'sh qolsa, o'sha tilda asl (o'zbekcha) matn ko'rinadi.
   */
  translations: Partial<Record<TranslatedLang, TextTranslation>>;
  /** Premium/Luxury: «Bizning hikoyamiz» */
  story: { title: string; text: string; photo: string };
  /** Luxury: galereya suratlari (bizning Blob'dagi photos/) */
  gallery: string[];
  /** Luxury: «Kalendarga qo'shish» tugmalari */
  calendar: boolean;
};

export const DEFAULT_CUSTOMIZATION: Customization = {
  palette: "",
  colors: { paper: "", gold: "", wine: "" },
  eventType: "",
  kicker: "",
  timeline: null,
  googleMapsUrl: "",
  yandexMapsUrl: "",
  mapConfirmed: false,
  music: MUSIC_TRACKS[0].id,
  customMusicUrl: "",
  dressCode: { text: "", colors: [] },
  gift: { cardNumber: "", cardHolder: "" },
  rsvp: true,
  wishes: true,
  petals: true,
  langs: ["uz"],
  translations: {},
  story: { title: "", text: "", photo: "" },
  gallery: [],
  calendar: true,
};

export const LIMITS = {
  kicker: 60,
  timelineItems: 12,
  timelineLabel: 80,
  dressCodeText: 200,
  dressCodeColors: 6,
  cardHolder: 60,
  storyTitle: 60,
  storyText: 1200,
  galleryPhotos: 10,
} as const;

// Xarita havolalari: faqat Google / Yandex domenlari (ixtiyoriy saytga
// yo'naltiruvchi havolani taklifnomaga qo'yib bo'lmasin)
const GOOGLE_HOST = /(^|\.)(google\.[a-z.]+|goo\.gl|g\.co)$/i;
const YANDEX_HOST = /(^|\.)(yandex\.[a-z.]+|ya\.ru)$/i;

type Ctx = { paletteIds: string[]; eventTypeSlugs: string[]; tier: Tier };
type Result = { ok: true; value: Customization } | { ok: false; error: string };

function str(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  // Boshqaruv belgilarini olib tashlaymiz (qator ko'chirish ham kerak emas)
  return v.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
}

function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function mapUrl(v: unknown, host: RegExp): string | null {
  const s = str(v, 2000);
  if (!s) return "";
  try {
    const u = new URL(s);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    if (!host.test(u.hostname)) return null;
    u.protocol = "https:";
    return u.toString();
  } catch {
    return null;
  }
}

function timeline(v: unknown): TimelineItem[] | null {
  if (v === null || v === undefined) return null;
  if (!Array.isArray(v)) return null;
  return v
    .slice(0, LIMITS.timelineItems)
    .map((row) => {
      const r = (row ?? {}) as Record<string, unknown>;
      const time = str(r.time, 5);
      return {
        time: /^([01]\d|2[0-3]):[0-5]\d$/.test(time) ? time : "",
        label: str(r.label, LIMITS.timelineLabel),
      };
    })
    .filter((r) => r.label);
}

/**
 * Kelgan sozlamalarni tekshiradi va tozalaydi.
 *
 * `strict: false` — jonli preview uchun: noto'g'ri qiymatlar xato bermaydi,
 * shunchaki tashlab yuboriladi (mijoz hali yozib bo'lmagan havola va h.k.).
 */
export function sanitizeCustomization(input: unknown, ctx: Ctx, strict = true): Result {
  const o = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const d = DEFAULT_CUSTOMIZATION;

  const palette = str(o.palette, 60);
  const eventType = str(o.eventType, 60);

  const google = mapUrl(o.googleMapsUrl, GOOGLE_HOST);
  const yandex = mapUrl(o.yandexMapsUrl, YANDEX_HOST);
  if (strict && google === null) return { ok: false, error: "Google Maps havolasi noto'g'ri" };
  if (strict && yandex === null) return { ok: false, error: "Yandex Maps havolasi noto'g'ri" };

  let music = str(o.music, 40);
  const customMusicUrl = str(o.customMusicUrl, 500);
  if (music === MUSIC_CUSTOM && !isOwnMusicUrl(customMusicUrl)) {
    if (strict) return { ok: false, error: "Yuklangan musiqa topilmadi — qaytadan yuklang" };
    music = d.music;
  }
  const rawColors = (o.colors ?? {}) as Record<string, unknown>;
  const hex = (v: unknown) => {
    const c = str(v, 7).toLowerCase();
    return /^#[0-9a-f]{6}$/.test(c) ? c : "";
  };
  const mainColors: MainColors = {
    paper: hex(rawColors.paper),
    // `accent` — oldingi versiyadagi yagona urg'u rangi
    gold: hex(rawColors.gold) || hex(o.accent),
    wine: hex(rawColors.wine),
  };

  const dc = (o.dressCode ?? {}) as Record<string, unknown>;
  const colors = (Array.isArray(dc.colors) ? dc.colors : [])
    .map((c) => str(c, 7).toLowerCase())
    .filter((c) => /^#[0-9a-f]{6}$/.test(c))
    .slice(0, LIMITS.dressCodeColors);

  // Tarifga kirmaydigan imkoniyatlar jimgina o'chiriladi (forma ularni
  // ko'rsatmaydi; bu — qo'lda yuborilgan so'rovlardan himoya)
  const f = tierFeatures(ctx.tier);
  // Tillar: takrorlanmas, ruxsat etilganlari; eski buyurtmalarda yagona `lang`
  const rawLangs = Array.isArray(o.langs) ? o.langs : typeof o.lang === "string" ? [o.lang] : [];
  const langs = [...new Set(rawLangs.map((l) => str(l, 10)))].filter((l): l is InvitationLang =>
    (INVITATION_LANGS as readonly string[]).includes(l)
  );
  const rawTr = (o.translations ?? {}) as Record<string, Record<string, unknown>>;
  const translations: Customization["translations"] = {};
  for (const l of TRANSLATED_LANGS) {
    const t = rawTr[l];
    if (!t || !langs.includes(l)) continue;
    translations[l] = {
      kicker: str(t.kicker, LIMITS.kicker),
      message: typeof t.message === "string" ? t.message.replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ").trim().slice(0, 1000) : "",
      storyTitle: str(t.storyTitle, LIMITS.storyTitle),
      storyText: typeof t.storyText === "string" ? t.storyText.replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ").trim().slice(0, LIMITS.storyText) : "",
    };
  }
  const st = (o.story ?? {}) as Record<string, unknown>;
  const storyPhoto = str(st.photo, 500);
  const gallery = (Array.isArray(o.gallery) ? o.gallery : [])
    .map((u) => str(u, 500))
    .filter((u) => isOwnBlobUrl(u, "/photos/"))
    .slice(0, LIMITS.galleryPhotos);

  const gift = (o.gift ?? {}) as Record<string, unknown>;
  const cardDigits = str(gift.cardNumber, 40).replace(/\D/g, "");
  if (strict && cardDigits && cardDigits.length !== 16) {
    return { ok: false, error: "Karta raqami 16 ta raqamdan iborat bo'lishi kerak" };
  }

  return {
    ok: true,
    value: {
      palette: ctx.paletteIds.includes(palette) ? palette : "",
      colors: mainColors,
      eventType: ctx.eventTypeSlugs.includes(eventType) ? eventType : "",
      kicker: str(o.kicker, LIMITS.kicker),
      timeline: timeline(o.timeline),
      googleMapsUrl: google ?? "",
      yandexMapsUrl: yandex ?? "",
      mapConfirmed: bool(o.mapConfirmed, false),
      music:
        music === MUSIC_NONE || music === MUSIC_CUSTOM || MUSIC_TRACKS.some((t) => t.id === music)
          ? music
          : d.music,
      customMusicUrl: music === MUSIC_CUSTOM ? customMusicUrl : "",
      dressCode: { text: str(dc.text, LIMITS.dressCodeText), colors },
      gift: {
        cardNumber: cardDigits.length === 16 ? cardDigits.replace(/(\d{4})(?=\d)/g, "$1 ") : "",
        cardHolder: cardDigits.length === 16 ? str(gift.cardHolder, LIMITS.cardHolder) : "",
      },
      rsvp: bool(o.rsvp, d.rsvp),
      wishes: bool(o.wishes, d.wishes),
      petals: bool(o.petals, d.petals),
      langs: f.languages && langs.length ? langs : ["uz"],
      translations: f.languages ? translations : {},
      story: f.story
        ? {
            title: str(st.title, LIMITS.storyTitle),
            // Hikoya matnida qator ko'chirish saqlanadi
            text: typeof st.text === "string" ? st.text.replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ").trim().slice(0, LIMITS.storyText) : "",
            photo: isOwnBlobUrl(storyPhoto, "/photos/") ? storyPhoto : "",
          }
        : d.story,
      gallery: f.gallery ? gallery : [],
      calendar: f.calendar ? bool(o.calendar, d.calendar) : false,
    },
  };
}

/** Bazadagi JSON'ni o'qiydi. Eski buyurtmalarda `{}` — standart qiymatlar. */
export function parseStoredCustomization(json: string | null | undefined): Customization {
  let raw: unknown = {};
  try {
    raw = JSON.parse(json || "{}");
  } catch {}
  const o = (raw && typeof raw === "object" ? raw : {}) as Partial<Customization> & {
    accent?: string;
    lang?: InvitationLang;
  };
  const d = DEFAULT_CUSTOMIZATION;
  return {
    ...d,
    ...o,
    colors: { ...d.colors, ...(o.accent ? { gold: o.accent } : {}), ...(o.colors ?? {}) },
    timeline: Array.isArray(o.timeline) ? o.timeline : null,
    dressCode: { ...d.dressCode, ...(o.dressCode ?? {}) },
    gift: { ...d.gift, ...(o.gift ?? {}) },
    story: { ...d.story, ...(o.story ?? {}) },
    // Eski buyurtmalar: yagona `lang` maydoni
    langs: Array.isArray(o.langs) && o.langs.length ? o.langs : o.lang ? [o.lang] : ["uz"],
    translations: o.translations ?? {},
    gallery: Array.isArray(o.gallery) ? o.gallery : [],
    // Eski buyurtmalarda maydon yo'q — kalendar faqat yangi Luxury buyurtmalarda
    calendar: typeof o.calendar === "boolean" ? o.calendar : false,
  };
}

/** Operator uchun qisqa ro'yxat (Telegram xabari, admin panel). */
export function customizationSummary(
  c: Customization,
  names: { palette?: string; eventType?: string; music?: string }
): string[] {
  const lines: string[] = [];
  if (names.eventType) lines.push(`🏷 Tadbir: ${names.eventType}`);
  if (names.palette) lines.push(`🎨 Rang: ${names.palette}`);
  const picked = [
    c.colors.paper && `fon ${c.colors.paper}`,
    c.colors.gold && `asosiy ${c.colors.gold}`,
    c.colors.wine && `qo'shimcha ${c.colors.wine}`,
  ].filter(Boolean);
  if (picked.length) lines.push(`🖌 Ranglar: ${picked.join(", ")}`);
  lines.push(
    `🎵 Musiqa: ${
      c.music === MUSIC_NONE
        ? "yo'q"
        : c.music === MUSIC_CUSTOM
          ? `mijozniki — ${c.customMusicUrl}`
          : (names.music ?? c.music)
    }`
  );
  if (c.timeline) lines.push(`🗓 Kun tartibi: ${c.timeline.length ? `${c.timeline.length} ta band` : "ko'rsatilmaydi"}`);
  const maps = [c.googleMapsUrl && "Google", c.yandexMapsUrl && "Yandex"].filter(Boolean);
  if (maps.length) lines.push(`🗺 Xarita: ${maps.join(", ")}${c.mapConfirmed ? " (taxminiy, manzil bo'yicha — mijoz tasdiqlagan)" : ""}`);
  if (c.dressCode.text) lines.push(`👗 Dress-kod: ${c.dressCode.text}`);
  if (c.gift.cardNumber) lines.push(`💳 Sovg'a kartasi: bor`);
  const LN = { uz: "o'zbek", "uz-cyrl": "kirill", ru: "rus", en: "ingliz" } as const;
  if (c.langs.join() !== "uz") lines.push(`🌐 Tillar: ${c.langs.map((l) => LN[l]).join(", ")}`);
  if (c.story.text) lines.push(`📖 Hikoya: bor${c.story.photo ? " (surat bilan)" : ""}`);
  if (c.gallery.length) lines.push(`🖼 Galereya: ${c.gallery.length} ta surat`);
  const off = [!c.rsvp && "RSVP", !c.wishes && "tilaklar", !c.petals && "gulbarglar"].filter(Boolean);
  if (off.length) lines.push(`⛔ O'chirilgan: ${off.join(", ")}`);
  return lines;
}
