import fs from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** `<head>` ichiga qo'yiladigan matnlar foydalanuvchi kiritgan bo'lishi mumkin — HTML sifatida tarqalib ketmasligi kerak. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Route Handler ichida `notFound()` (next/navigation) app'ning `not-found.tsx`
 * chegarasini ishga tushirmaydi — bo'sh javob qaytaradi. Shu sababli bu yerda
 * o'zimizning brendga mos 404 HTML'imiz qaytariladi.
 */
function notFoundResponse(): Response {
  const html = `<!doctype html>
<html lang="uz"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Taklifnoma topilmadi</title>
<style>
  html,body{height:100%;margin:0;font-family:ui-serif,Georgia,serif;background:#faf7f2;color:#292524}
  .wrap{min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px}
  h1{font-size:1.6rem;margin:0 0 10px}
  p{margin:0;font-size:0.95rem;color:#78716c;font-family:ui-sans-serif,system-ui,sans-serif;max-width:22rem}
  a{margin-top:20px;display:inline-block;padding:12px 26px;border-radius:999px;background:#1c1917;color:#fff;text-decoration:none;font-size:0.9rem;font-family:ui-sans-serif,system-ui,sans-serif}
</style></head>
<body><div class="wrap">
  <h1>Taklifnoma topilmadi</h1>
  <p>Bu havola noto'g'ri yoki taklifnoma hali tasdiqlanmagan bo'lishi mumkin.</p>
  <a href="/">Bosh sahifaga qaytish</a>
</div></body></html>`;
  return new Response(html, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function buildInvConfig(inv: {
  title: string;
  partner1: string;
  partner2: string;
  eventDate: Date;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  message: string;
  template: {
    theme: string;
    kicker: string;
    timeline: string;
    notes: string;
  };
}) {
  const d = inv.eventDate;
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateISO = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${inv.eventTime || "18:00"}:00`;
  const dateLabel = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;

  // Ism va sarlavha: juftlik bo'lsa "Ism1 & Ism2"
  const groom = inv.partner1 || inv.title;
  const bride = inv.partner2 || "";

  let timeline: Array<{ time: string; label: string }> = [];
  try {
    timeline = JSON.parse(inv.template.timeline || "[]");
  } catch {}

  let notes: Array<{ title: string; text: string }> = [];
  try {
    notes = JSON.parse(inv.template.notes || "[]");
  } catch {}

  return {
    couple: {
      groom,
      bride,
      // Monogram: bosh harflar
      monogram:
        [groom[0], bride[0]].filter(Boolean).join("&").toUpperCase() || "✦",
    },
    event: {
      dateISO,
      dateLabel,
      timeLabel: inv.eventTime || "18:00",
      kicker: inv.template.kicker || "",
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
      googleMapsUrl: "",
      yandexMapsUrl: "",
    },
    notes,
    rsvp: { enabled: true },
    wishes: { enabled: true },
    gift: { enabled: false },
    gallery: { enabled: false, photos: [] },
    petals: { enabled: true, count: 14 },
    music: { enabled: true, src: `/t/${inv.template.theme}/music.mp3` },
    specialOffer: { enabled: false, title: "", text: "", badge: "" },
    speakers: { enabled: false, title: "", people: [] },
    sponsors: { enabled: false, title: "", names: [] },
    dressCode: { enabled: false, title: "", text: "", colors: [] },
    bigNumber: { enabled: false, value: "", title: "", subtitle: "" },
    achievement: { enabled: false, degree: "", institution: "", text: "" },
    footer: {
      title: "Sizni kutamiz!",
      signature: groom + (bride ? ` va ${bride}` : ""),
    },
  };
}

/**
 * Ijtimoiy tarmoqlarning link-preview botlari (Telegram, WhatsApp, Facebook
 * va h.k.) sahifani ochilganda avtomatik so'rov yuboradi — bularni ham
 * "ko'rish" deb hisoblasak, statistika soxtalashadi.
 */
const BOT_UA_RE =
  /bot|crawl|spider|facebookexternalhit|telegrambot|whatsapp|slackbot|twitterbot|linkpreview|skypeuripreview|vkshare|preview|curl|wget|python-requests|headlesschrome/i;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    include: {
      template: true,
      order: { select: { status: true } },
    },
  });

  // Faqat to'langan taklifnomalar ko'rinadi
  if (!invitation || invitation.order.status !== "PAID") return notFoundResponse();

  // Ko'rishlar sonini oshirish — bot/crawler so'rovlarini hisobga olmaymiz
  const userAgent = req.headers.get("user-agent") ?? "";
  if (!BOT_UA_RE.test(userAgent)) {
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { views: { increment: 1 } },
    });
  }

  // Shablonning statik index.html ni o'qib, config inject qilamiz
  const htmlPath = path.join(
    process.cwd(),
    "public",
    "t",
    invitation.template.theme,
    "index.html"
  );
  let html = fs.readFileSync(htmlPath, "utf8");

  const invConfig = buildInvConfig(invitation);

  // Sarlavha va Open Graph teglari — ijtimoiy tarmoqlarda (Telegram/WhatsApp)
  // ulashganda chiroyli preview chiqishi uchun.
  const names = invConfig.couple.bride
    ? `${invConfig.couple.groom} va ${invConfig.couple.bride}`
    : invConfig.couple.groom;
  const pageTitle = escapeHtml(`${names} — Taklifnoma`);
  const pageDescription = escapeHtml(
    `${invConfig.event.dateLabel}${invConfig.venue.name ? ` · ${invConfig.venue.name}` : ""} — sizni tadbirimizga taklif qilamiz!`
  );

  const inject = `<title>${pageTitle}</title>
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/icon.png" type="image/png">
<link rel="apple-touch-icon" href="/apple-icon.png">
<meta name="description" content="${pageDescription}">
<meta property="og:type" content="website">
<meta property="og:title" content="${pageTitle}">
<meta property="og:description" content="${pageDescription}">
<script>window.__INV_CONFIG__=${JSON.stringify(invConfig).replace(/<\/script/gi, "<\\/script")};</script>`;
  html = html.replace("<head>", `<head>${inject}`);

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
