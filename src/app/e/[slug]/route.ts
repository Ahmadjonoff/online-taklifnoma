import fs from "node:fs";
import path from "node:path";
import { after } from "next/server";
import { parseStoredCustomization } from "@/lib/customization";
import { isoDate } from "@/lib/dates";
import { scriptJson } from "@/lib/html";
import { buildInvitationConfig, textOverrides } from "@/lib/invitationConfig";
import { i18nScriptTag } from "@/lib/invitationI18n";
import { paletteStyleTag } from "@/lib/palettes";
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

  const options = parseStoredCustomization(invitation.options);
  const url = new URL(req.url);

  // Shaxsiy mehmon havolasi (?g=<kod>, Luxury): faqat shu taklifnomaning mehmoni
  const code = url.searchParams.get("g");
  const guest =
    code && /^[a-z0-9]{6,16}$/i.test(code)
      ? await prisma.guest.findFirst({ where: { code, invitationId: invitation.id } })
      : null;

  // Ko'rishlar sonini oshirish — bot/crawler so'rovlarini hisobga olmaymiz.
  // after(): mehmon sahifani DB yozuvlarini kutmasdan oladi.
  const userAgent = req.headers.get("user-agent") ?? "";
  if (!BOT_UA_RE.test(userAgent)) {
    after(async () => {
      try {
        await prisma.invitation.update({
          where: { id: invitation.id },
          data: { views: { increment: 1 } },
        });
        if (guest) {
          await prisma.guest.update({
            where: { id: guest.id },
            data: { views: { increment: 1 }, openedAt: guest.openedAt ?? new Date() },
          });
        }
      } catch (e) {
        console.error("Ko'rishlarni hisoblashda xatolik:", e instanceof Error ? e.message : e);
      }
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
  let html: string;
  try {
    html = fs.readFileSync(htmlPath, "utf8");
  } catch {
    // Shablon build qilinmagan (public/t/<theme> yo'q) — deploy xatosi
    console.error(`Shablon fayli topilmadi: public/t/${invitation.template.theme}/index.html`);
    return notFoundResponse();
  }

  const invConfig = buildInvitationConfig(
    {
      ...invitation,
      eventDate: isoDate(invitation.eventDate),
    },
    invitation.template,
    options,
    {
      guestName: guest?.name,
      icsUrl: `${url.origin}/e/${slug}/kalendar.ics`,
      invitationUrl: `${url.origin}/e/${slug}`,
    }
  );

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
<script>window.__INV_CONFIG__=${scriptJson(invConfig)};</script>
${paletteStyleTag(invitation.template.theme, options.palette, options.colors)}
${i18nScriptTag(options.langs, textOverrides(invitation.template, options, invitation.message, guest?.name))}`;
  html = html.replace("<head>", `<head>${inject}`);

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
