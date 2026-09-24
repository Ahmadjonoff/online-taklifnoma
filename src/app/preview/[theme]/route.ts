import fs from "node:fs";
import path from "node:path";
import { getCatalog } from "@/lib/catalogData";
import { INVITATION_PROMO } from "@/lib/contact";
import { sanitizeCustomization } from "@/lib/customization";
import { buildInvitationConfig, calendarTitle, icsContent, textOverrides } from "@/lib/invitationConfig";
import { i18nScriptTag } from "@/lib/invitationI18n";
import { getPalettes, paletteStyleTag } from "@/lib/palettes";
import { scriptJson } from "@/lib/html";
import { tierOf } from "@/lib/pricing";
import { CONTENT_LIMITS, TIME_RE } from "@/lib/validation";

/** Bu route Next.js sahifasi emas (iframe uchun statik HTML) — o'zining 404'ini beradi. */
function notFoundHtml(): string {
  return `<!doctype html>
<html lang="uz"><head><meta charset="UTF-8">
<style>
  html,body{height:100%;margin:0;font-family:ui-serif,Georgia,serif;background:#faf7f2;color:#292524}
  .wrap{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px}
  h1{font-size:1.1rem;margin:0 0 6px}
  p{margin:0;font-size:0.85rem;color:#78716c;font-family:ui-sans-serif,system-ui,sans-serif}
  a{margin-top:16px;display:inline-block;padding:8px 18px;border-radius:999px;background:#1c1917;color:#fff;text-decoration:none;font-size:0.85rem;font-family:ui-sans-serif,system-ui,sans-serif}
</style></head>
<body><div class="wrap">
  <h1>Shablon topilmadi</h1>
  <p>Bu namuna mavjud emas yoki o'chirilgan.</p>
  <a href="/shablonlar">Barcha shablonlar</a>
</div></body></html>`;
}

// Demo uchun namuna ma'lumotlar
const DEMO = {
  couple: {
    groom: "Bekzod",
    bride: "Malika",
    monogram: "B&M",
  },
  event: {
    dateISO: "2026-12-31T18:00:00",
    dateLabel: "31.12.2026",
    timeLabel: "18:00",
    kicker: "Taklifnoma namunasi",
  },
  blessing: {
    lines: ["Sizni tadbirimizda ko'rishdan xursandmiz"],
    text: "Hurmat bilan, oilamiz sizni tadbirimizga taklif qiladi. Kelishingiz biz uchun katta baxt bo'ladi!",
    greeting: "Aziz mehmon!",
  },
  countdown: {
    title: "Tadbirgacha qoldi",
    finishedText: "Bugun katta kun!",
  },
  timeline: {
    title: "Dastur",
    items: [
      { time: "18:00", label: "Mehmonlar kutib olish" },
      { time: "19:00", label: "Marosim boshlanishi" },
      { time: "21:00", label: "Dasturxon" },
    ],
  },
  venue: {
    title: "Manzil",
    name: "«Charx» to'yxonasi",
    address: "Toshkent, Chilonzor",
    googleMapsUrl: "",
    yandexMapsUrl: "",
  },
  notes: [
    { title: "Kiyinish uslubi", text: "Zamonaviy yoki milliy liboslar" },
  ],
  rsvp: { enabled: true },
  wishes: { enabled: true },
  gift: { enabled: false },
  gallery: { enabled: false, photos: [] },
  petals: { enabled: true, count: 14 },
  music: { enabled: false, src: "" },
  specialOffer: { enabled: false, title: "", text: "", badge: "" },
  speakers: { enabled: false, title: "", people: [] },
  sponsors: { enabled: false, title: "", names: [] },
  dressCode: { enabled: false, title: "", text: "", colors: [] },
  bigNumber: { enabled: false, value: "", title: "", subtitle: "" },
  achievement: { enabled: false, degree: "", institution: "", text: "" },
  footer: {
    title: "Sizni kutamiz!",
    signature: "Bekzod va Malika",
  },
  promo: INVITATION_PROMO,
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ theme: string }> }
) {
  const { theme } = await params;

  // Xavfsizlik: faqat harf-raqam va tire
  if (!/^[a-z0-9-]+$/.test(theme)) {
    return new Response("Noto'g'ri so'rov", { status: 400 });
  }

  const htmlPath = path.join(process.cwd(), "public", "t", theme, "index.html");
  if (!fs.existsSync(htmlPath)) {
    return new Response(notFoundHtml(), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  let html = fs.readFileSync(htmlPath, "utf8");

  // ?draft=... — buyurtma formasidagi jonli preview: mijoz kiritgan
  // ma'lumotlar tayyor taklifnoma bilan bir xil yo'l bilan config'ga
  // aylantiriladi (tekshiruv + buildInvitationConfig).
  let config = DEMO as Record<string, unknown>;
  let paletteStyle = "";
  const url = new URL(req.url);
  const draftParam = url.searchParams.get("draft");
  if (draftParam) {
    const draft = await buildDraft(theme, draftParam);
    if (draft) {
      config = draft.config;
      paletteStyle =
        paletteStyleTag(theme, draft.palette, draft.colors) + i18nScriptTag(draft.langs, draft.overrides);
    }
  } else if (url.searchParams.get("thumb") === "1") {
    // Katalog kartasidagi kichik ko'rinish: gulbarg animatsiyasi o'chiriladi
    // (o'nlab karta bir vaqtda animatsiya qilsa telefon qiynaladi)
    config = { ...DEMO, petals: { enabled: false, count: 0 } };
  }

  // ?static=1 — bosh sahifa va katalogdagi ko'rinish: shablon rasmdek qotib
  // turadi — scroll ham, konvertni ochish ham yo'q. CSS'da, JS'dan oldin
  // qo'yiladi — sahifa yuklanayotgan lahzada ham barmoq hech narsani surmaydi.
  if (url.searchParams.get("static") === "1") {
    paletteStyle += `<style>html,body{overflow:hidden!important;overscroll-behavior:none!important;touch-action:none!important}body *{pointer-events:none!important}</style>`;
  }

  // `config` foydalanuvchi kiritgan matnlarni o'z ichiga olishi mumkin —
  // scriptJson har bir `<` ni escape qiladi (XSS va sahifa buzilishidan himoya).
  const inject = `<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/icon.png" type="image/png">
<script>window.__INV_CONFIG__=${scriptJson(config)};</script>
${paletteStyle}`;
  html = html.replace("<head>", `<head>${inject}`);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Demo preview hamma uchun bir xil — CDN'da (foydalanuvchiga eng yaqin
      // nuqtada) keshlanadi, har karta uchun AQShdagi funksiyaga borilmaydi.
      // ?draft= esa foydalanuvchi kiritgan ma'lumot — keshlanmaydi.
      "Cache-Control": draftParam
        ? "private, no-store"
        : "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}

function text(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

async function buildDraft(theme: string, raw: string) {
  let draft: { content?: Record<string, unknown>; options?: unknown };
  try {
    draft = JSON.parse(raw);
  } catch {
    return null;
  }
  const { templates } = await getCatalog();
  const template = templates.find((t) => t.theme === theme);
  if (!template) return null;

  const c = draft.content ?? {};
  const eventDate = text(c.eventDate, 10);
  const eventTime = text(c.eventTime, 5);
  const partner1 = text(c.partner1, CONTENT_LIMITS.partner);

  // Preview'da qat'iy emas: hali to'liq yozilmagan havola xato bermaydi
  const options = sanitizeCustomization(
    draft.options,
    {
      paletteIds: getPalettes(theme).map((p) => p.id),
      eventTypeSlugs: template.categories.map((e) => e.slug),
      tier: tierOf(template.price),
    },
    false
  );
  if (!options.ok) return null;

  const content = {
      title: text(c.title, CONTENT_LIMITS.title),
      // Bo'sh maydonlar o'rniga namuna — shablon bo'sh ko'rinmasin
      partner1: partner1 || "Ismingiz",
      partner2: text(c.partner2, CONTENT_LIMITS.partner),
      eventDate: /^\d{4}-\d{2}-\d{2}$/.test(eventDate) ? eventDate : "2026-12-31",
      eventTime: TIME_RE.test(eventTime) ? eventTime : "18:00",
      venueName: text(c.venueName, CONTENT_LIMITS.venueName) || "To'yxona nomi",
      venueAddress: text(c.venueAddress, CONTENT_LIMITS.venueAddress),
      message: text(c.message, CONTENT_LIMITS.message) || "Sizni tadbirimizda ko'rishdan baxtiyor bo'lamiz!",
  };
  // Preview'da .ics fayl data: URI sifatida (alohida route shart emas)
  const ics = icsContent(content, calendarTitle(content.partner1, content.partner2), "", "preview@taklifnoma");
  const config = buildInvitationConfig(content, template, options.value, {
    icsUrl: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`,
  });
  return {
    config,
    palette: options.value.palette,
    colors: options.value.colors,
    langs: options.value.langs,
    overrides: textOverrides(template, options.value, content.message),
  };
}
