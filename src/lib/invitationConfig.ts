import type { Customization } from "./customization";
import { defaultNotes, type NoteItem, type TimelineItem } from "./eventDefaults";
import { INVITATION_PROMO } from "./contact";
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

/** Kalendar uchun: Toshkent vaqti (UTC+5, yozgi vaqt yo'q) → UTC "YYYYMMDDTHHmmssZ" */
function utcStamp(date: string, time: string, addHours = 0): string {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = (time || "18:00").split(":").map(Number);
  const t = new Date(Date.UTC(y, (m || 1) - 1, d || 1, (hh || 0) - 5 + addHours, mm || 0));
  return t.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Google Calendar'ga qo'shish havolasi (tadbir 4 soat deb olinadi) */
export function googleCalendarUrl(inv: InvitationContent, title: string, details: string): string {
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${utcStamp(inv.eventDate, inv.eventTime)}/${utcStamp(inv.eventDate, inv.eventTime, 4)}`,
    details,
    location: [inv.venueName, inv.venueAddress].filter(Boolean).join(", "),
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

/** .ics fayl matni (Apple Calendar, Outlook) */
export function icsContent(inv: InvitationContent, title: string, details: string, uid: string): string {
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Online taklifnomalar//UZ",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART:${utcStamp(inv.eventDate, inv.eventTime)}`,
    `DTEND:${utcStamp(inv.eventDate, inv.eventTime, 4)}`,
    `SUMMARY:${esc(title)}`,
    `LOCATION:${esc([inv.venueName, inv.venueAddress].filter(Boolean).join(", "))}`,
    `DESCRIPTION:${esc(details)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

const GUEST_GREETING: Record<string, (name: string) => string> = {
  uz: (n) => `Hurmatli ${n}!`,
  "uz-cyrl": (n) => `Hurmatli ${n}!`, // kirillga sahifada o'giriladi
  ru: (n) => `${n}, вы приглашены!`,
  en: (n) => `Dear ${n}!`,
};

export type InvitationExtras = {
  /** Shaxsiy mehmon havolasi orqali ochilganda (Luxury) */
  guestName?: string;
  /** .ics yuklab olish manzili (tayyor taklifnomada route, preview'da data: URI) */
  icsUrl?: string;
  /** Taklifnomaning to'liq manzili — kalendar tavsifiga yoziladi */
  invitationUrl?: string;
};

export function buildInvitationConfig(
  inv: InvitationContent,
  template: TemplateDefaults,
  c: Customization,
  extras: InvitationExtras = {}
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
    gallery: c.gallery.length
      ? { enabled: true, title: "Bizning xotiralar", photos: c.gallery }
      : { enabled: false, photos: [] },
    petals: { enabled: c.petals, count: 14 },
    music: { enabled: Boolean(musicSrc), src: musicSrc },
    specialOffer: { enabled: false, title: "", text: "", badge: "" },
    speakers: { enabled: false, title: "", people: [] },
    // Luxe shablonlarning namuna bo'limlari (config-default'da yoqilgan bo'lishi
    // mumkin — masalan Floral'da soxta xonandalar) haqiqiy taklifnomada chiqmasin
    singers: { enabled: false, items: [] },
    events: { enabled: false, items: [] },
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
    promo: INVITATION_PROMO,
    /** Sahifadagi tarjima skripti o'qiydi (src/lib/invitationI18n.ts) */
    lang: c.lang,
    story: c.story.text
      ? { enabled: true, kicker: "", title: c.story.title || "Bizning hikoyamiz", text: c.story.text, photo: c.story.photo }
      : { enabled: false },
    ...(extras.guestName
      ? {
          guest: { name: extras.guestName },
          envelope: { kicker: (GUEST_GREETING[c.lang] ?? GUEST_GREETING.uz)(extras.guestName) },
          dearGuests: { enabled: true, greeting: (GUEST_GREETING[c.lang] ?? GUEST_GREETING.uz)(extras.guestName) },
        }
      : {}),
    addToCalendar: c.calendar
      ? {
          enabled: true,
          googleUrl: googleCalendarUrl(inv, calendarTitle(groom, bride), extras.invitationUrl ?? ""),
          icsUrl: extras.icsUrl ?? "",
        }
      : { enabled: false },
  };
}

export function calendarTitle(groom: string, bride: string): string {
  return bride ? `${groom} va ${bride} — taklifnoma` : `${groom} — taklifnoma`;
}
