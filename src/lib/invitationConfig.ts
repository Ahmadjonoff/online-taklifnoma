import type { Customization } from "./customization";
import { defaultNotes, type NoteItem, type TimelineItem } from "./eventDefaults";
import { MUSIC_CUSTOM, MUSIC_NONE, musicTrack } from "./music";

/**
 * Shablonga beriladigan `window.__INV_CONFIG__`.
 *
 * Tayyor taklifnoma (`/e/[slug]`) ham, buyurtma formasidagi jonli preview
 * (`/preview/[theme]?draft=`) ham shu funksiyadan foydalanadi — mijoz
 * preview'da ko'rgani bilan tayyor taklifnoma bir xil bo'lishi uchun.
 */
export type InvitationContent = {
  title: string;
  partner1: string;
  partner2: string;
  /** "YYYY-MM-DD" */
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  message: string;
};

export type TemplateDefaults = {
  kicker: string;
  timeline: string; // JSON
  notes: string; // JSON
};

function parseJson<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json || "") as T;
  } catch {
    return fallback;
  }
}

export function buildInvitationConfig(
  inv: InvitationContent,
  template: TemplateDefaults,
  c: Customization
) {
  const [y, m, d] = inv.eventDate.split("-");
  const time = inv.eventTime || "18:00";
  const dateISO = `${inv.eventDate}T${time}:00`;
  const dateLabel = y && m && d ? `${d}.${m}.${y}` : inv.eventDate;

  // Ism va sarlavha: juftlik bo'lsa "Ism1 & Ism2"
  const groom = inv.partner1 || inv.title;
  const bride = inv.partner2 || "";

  const timeline: TimelineItem[] = c.timeline ?? parseJson(template.timeline, []);
  const notes: NoteItem[] = c.eventType
    ? defaultNotes(c.eventType)
    : parseJson(template.notes, []);

  const musicSrc =
    c.music === MUSIC_NONE
      ? ""
      : c.music === MUSIC_CUSTOM
        ? c.customMusicUrl
        : (musicTrack(c.music)?.src ?? "");

  return {
    couple: {
      groom,
      bride,
      // Monogram: bosh harflar
      monogram: [groom[0], bride[0]].filter(Boolean).join("&").toUpperCase() || "✦",
    },
    event: {
      dateISO,
      dateLabel,
      timeLabel: time,
      kicker: c.kicker || template.kicker || "",
    },
    blessing: {
      lines: inv.message ? [inv.message] : [],
      text: inv.message || "",
      greeting: "",
    },
    countdown: {
      title: "Tadbirgacha qoldi",
      finishedText: "Bugun katta kun!",
    },
    timeline: {
      title: "Dastur",
      items: timeline,
    },
    venue: {
      title: "Manzil",
      name: inv.venueName,
      address: inv.venueAddress,
      googleMapsUrl: c.googleMapsUrl,
      yandexMapsUrl: c.yandexMapsUrl,
    },
    notes,
    rsvp: { enabled: c.rsvp },
    wishes: { enabled: c.wishes },
    gift: c.gift.cardNumber
      ? {
          enabled: true,
          title: "To'yona uchun",
          cardNumber: c.gift.cardNumber,
          cardHolder: c.gift.cardHolder,
          copyLabel: "Nusxalash",
          copiedLabel: "Nusxalandi!",
        }
      : { enabled: false },
    gallery: { enabled: false, photos: [] },
    petals: { enabled: c.petals, count: 14 },
    music: { enabled: Boolean(musicSrc), src: musicSrc },
    specialOffer: { enabled: false, title: "", text: "", badge: "" },
    speakers: { enabled: false, title: "", people: [] },
    sponsors: { enabled: false, title: "", names: [] },
    // `colors` — oddiy shablonlar, `palette` — taklif (luxe) shablonlari o'qiydi
    dressCode: c.dressCode.text
      ? {
          enabled: true,
          title: "Kiyinish uslubi",
          text: c.dressCode.text,
          colors: c.dressCode.colors,
          palette: c.dressCode.colors,
        }
      : { enabled: false, title: "", text: "", colors: [], palette: [] },
    bigNumber: { enabled: false, value: "", title: "", subtitle: "" },
    achievement: { enabled: false, degree: "", institution: "", text: "" },
    footer: {
      title: "Sizni kutamiz!",
      signature: groom + (bride ? ` va ${bride}` : ""),
    },
  };
}
