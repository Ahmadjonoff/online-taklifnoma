import type { TimelineItem } from "./eventDefaults";
import { isOwnMusicUrl, MUSIC_CUSTOM, MUSIC_NONE, MUSIC_TRACKS } from "./music";

/**
 * Mijoz buyurtmada tanlaydigan sozlamalar (`Invitation.options` JSON).
 *
 * Bitta joyda: tur, standart qiymatlar va serverdagi tekshiruv. Forma, API,
 * jonli preview va tayyor taklifnoma (`/e/[slug]`) shu moduldan foydalanadi.
 */
export type Customization = {
  /** Palitra id'si (`src/lib/palettes.ts`); "" — shablonning o'z ranglari */
  palette: string;
  /** Mijozning o'z urg'u rangi ("#rrggbb") — palitraning oltin rangi o'rniga; "" — yo'q */
  accent: string;
  /** Tadbir turi slug'i — standart eslatmalar shu bo'yicha olinadi */
  eventType: string;
  /** Ismlar ustidagi kichik yozuv ("Nikoh to'yi", "Kelin salom" ...) */
  kicker: string;
  /** null — shablonning standart kun tartibi; [] — kun tartibi ko'rsatilmaydi */
  timeline: TimelineItem[] | null;
  googleMapsUrl: string;
  yandexMapsUrl: string;
  /** Musiqa id'si, "none" yoki "custom" (mijoz yuklagan — `customMusicUrl`) */
  music: string;
  customMusicUrl: string;
  dressCode: { text: string; colors: string[] };
  gift: { cardNumber: string; cardHolder: string };
  rsvp: boolean;
  wishes: boolean;
  petals: boolean;
};

export const DEFAULT_CUSTOMIZATION: Customization = {
  palette: "",
  accent: "",
  eventType: "",
  kicker: "",
  timeline: null,
  googleMapsUrl: "",
  yandexMapsUrl: "",
  music: MUSIC_TRACKS[0].id,
  customMusicUrl: "",
  dressCode: { text: "", colors: [] },
  gift: { cardNumber: "", cardHolder: "" },
  rsvp: true,
  wishes: true,
  petals: true,
};

export const LIMITS = {
  kicker: 60,
  timelineItems: 12,
  timelineLabel: 80,
  dressCodeText: 200,
  dressCodeColors: 6,
  cardHolder: 60,
} as const;

// Xarita havolalari: faqat Google / Yandex domenlari (ixtiyoriy saytga
// yo'naltiruvchi havolani taklifnomaga qo'yib bo'lmasin)
const GOOGLE_HOST = /(^|\.)(google\.[a-z.]+|goo\.gl|g\.co)$/i;
const YANDEX_HOST = /(^|\.)(yandex\.[a-z.]+|ya\.ru)$/i;

type Ctx = { paletteIds: string[]; eventTypeSlugs: string[] };
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
  const accent = str(o.accent, 7).toLowerCase();

  const dc = (o.dressCode ?? {}) as Record<string, unknown>;
  const colors = (Array.isArray(dc.colors) ? dc.colors : [])
    .map((c) => str(c, 7).toLowerCase())
    .filter((c) => /^#[0-9a-f]{6}$/.test(c))
    .slice(0, LIMITS.dressCodeColors);

  const gift = (o.gift ?? {}) as Record<string, unknown>;
  const cardDigits = str(gift.cardNumber, 40).replace(/\D/g, "");
  if (strict && cardDigits && cardDigits.length !== 16) {
    return { ok: false, error: "Karta raqami 16 ta raqamdan iborat bo'lishi kerak" };
  }

  return {
    ok: true,
    value: {
      palette: ctx.paletteIds.includes(palette) ? palette : "",
      accent: /^#[0-9a-f]{6}$/.test(accent) ? accent : "",
      eventType: ctx.eventTypeSlugs.includes(eventType) ? eventType : "",
      kicker: str(o.kicker, LIMITS.kicker),
      timeline: timeline(o.timeline),
      googleMapsUrl: google ?? "",
      yandexMapsUrl: yandex ?? "",
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
    },
  };
}

/** Bazadagi JSON'ni o'qiydi. Eski buyurtmalarda `{}` — standart qiymatlar. */
export function parseStoredCustomization(json: string | null | undefined): Customization {
  let raw: unknown = {};
  try {
    raw = JSON.parse(json || "{}");
  } catch {}
  const o = (raw && typeof raw === "object" ? raw : {}) as Partial<Customization>;
  const d = DEFAULT_CUSTOMIZATION;
  return {
    ...d,
    ...o,
    timeline: Array.isArray(o.timeline) ? o.timeline : null,
    dressCode: { ...d.dressCode, ...(o.dressCode ?? {}) },
    gift: { ...d.gift, ...(o.gift ?? {}) },
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
  if (c.accent) lines.push(`🖌 O'z rangi: ${c.accent}`);
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
  if (maps.length) lines.push(`🗺 Xarita: ${maps.join(", ")}`);
  if (c.dressCode.text) lines.push(`👗 Dress-kod: ${c.dressCode.text}`);
  if (c.gift.cardNumber) lines.push(`💳 Sovg'a kartasi: bor`);
  const off = [!c.rsvp && "RSVP", !c.wishes && "tilaklar", !c.petals && "gulbarglar"].filter(Boolean);
  if (off.length) lines.push(`⛔ O'chirilgan: ${off.join(", ")}`);
  return lines;
}
