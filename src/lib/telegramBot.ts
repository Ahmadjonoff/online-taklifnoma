/**
 * Yangi buyurtma kelganda operatorning shaxsiy Telegramiga bot orqali xabar.
 *
 * NEGA SHUNDAY: bot foydalanuvchi nomiga emas, faqat chat ID'ga xabar yubora
 * oladi. TELEGRAM_ADMIN_CHAT_ID bo'sh bo'lsa — jim o'tkazib yuboriladi, order
 * yaratish bu sababli hech qachon to'xtab qolmaydi.
 *
 * MUHIM: chaqiruvchi buni `after()` ichida ishga tushirishi kerak. Oddiy
 * "fire-and-forget" (await'siz) chaqiruvda Vercel javob qaytgach funksiyani
 * muzlatadi — xabar keyingi so'rovgacha osilib qolar yoki umuman yo'qolardi.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;
// Mijozlar ham shu botdan foydalanadi (RSVP/tilak xabarlari, /start <token>) — bot faqat shu sayt
// uchun, webhook'i /api/telegram/webhook ga o'rnatiladi (scripts/telegram-webhook.ts).

/** Webhook kelgan chat — operatorning chatimi */
export const isAdminChat = (chatId: string) => !!ADMIN_CHAT_ID && chatId === ADMIN_CHAT_ID;

const REQUEST_TIMEOUT_MS = 8_000;
const MAX_ATTEMPTS = 3;

export type NewOrderNotice = {
  id: number;
  customerName: string;
  phone: string;
  templateName: string;
  /** Tarif, qo'shimcha xizmatlar va jami — tayyor qatorlar */
  priceLines: string[];
  title: string;
  eventDate: string; // "25.12.2026 18:00"
  venueName: string;
  /** Mijoz qayerdan kelgan (instagram, telegram ...) — bo'sh bo'lishi mumkin */
  source?: string;
  details: string[]; // mijoz tanlagan qo'shimcha sozlamalar (rang, musiqa ...)
  /** Mijozning shaxsiy sahifasi: buyurtma holati, RSVP va tilaklar */
  customerPageUrl: string;
};

async function sendOnce(
  text: string,
  chatId = ADMIN_CHAT_ID,
  token = BOT_TOKEN
): Promise<{ ok: boolean; retryAfterSec?: number; error?: string }> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      description?: string;
      parameters?: { retry_after?: number };
    };
    if (res.ok && data.ok) return { ok: true };
    return {
      ok: false,
      retryAfterSec: data.parameters?.retry_after,
      error: `${res.status} ${data.description ?? ""}`.trim(),
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

async function sendWithRetry(text: string, chatId = ADMIN_CHAT_ID, token = BOT_TOKEN): Promise<boolean> {
  if (!token || !chatId) {
    console.warn("Telegram sozlanmagan (TELEGRAM_BOT_TOKEN / TELEGRAM_ADMIN_CHAT_ID) — xabar yuborilmadi.");
    return false;
  }
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const r = await sendOnce(text, chatId, token);
    if (r.ok) return true;
    console.error(`Telegram xabari yuborilmadi (urinish ${attempt}/${MAX_ATTEMPTS}): ${r.error}`);
    if (attempt < MAX_ATTEMPTS) {
      // 429 bo'lsa Telegram aytgan vaqtcha, aks holda qisqa kutish
      const waitMs = Math.min((r.retryAfterSec ?? attempt) * 1000, 10_000);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
  return false;
}

/**
 * Buyurtma tasdiqlanganda (PAID) — admin mijozga shunchaki forward qilishi
 * uchun tayyor xabar: taklifnoma havolasi va mijozning RSVP sahifasi.
 */
export async function notifyAdminOrderConfirmed(o: {
  id: number;
  customerName: string;
  phone: string;
  invitationUrl: string;
  customerPageUrl: string;
}): Promise<boolean> {
  return sendWithRetry(
    [
      `✅ №${o.id} tasdiqlandi — ${o.customerName}, ${o.phone}`,
      "",
      "Quyidagini mijozga yuboring 👇",
      "",
      `Assalomu alaykum, ${o.customerName}! Taklifnomangiz tayyor 🎉`,
      "",
      "💌 Mehmonlarga yuboriladigan havola:",
      o.invitationUrl,
      "",
      "📋 Mehmonlar javoblari (RSVP) va tilaklar — faqat siz uchun:",
      o.customerPageUrl,
    ].join("\n")
  );
}

export async function notifyAdminNewOrder(order: NewOrderNotice): Promise<boolean> {
  const text = [
    "🆕 Yangi buyurtma!",
    `№${order.id} — ${order.templateName}`,
    ...order.priceLines,
    "",
    `👤 ${order.customerName}`,
    `📞 ${order.phone}`,
    "",
    `🎉 ${order.title}`,
    `📅 ${order.eventDate}`,
    `📍 ${order.venueName}`,
    ...(order.source ? [`🔎 Manba: ${order.source}`] : []),
    ...(order.details.length ? ["", ...order.details] : []),
    "",
    "🔗 Mijoz sahifasi (holat, RSVP va tilaklar) — mijozga yuboring:",
    order.customerPageUrl,
  ].join("\n");

  return sendWithRetry(text);
}

/** Tezkor so'rov (/api/leads): mijoz faqat ism va telefon qoldirdi — operator qo'ng'iroq qilib, taklifnomani o'zi to'ldiradi */
export async function notifyAdminQuickLead(lead: {
  name: string;
  phone: string;
  templateName: string;
  templateUrl: string;
  eventDate?: string;
  note?: string;
  source?: string;
}): Promise<boolean> {
  const text = [
    "⚡ Tezkor so'rov — qo'ng'iroq qiling!",
    `🎨 ${lead.templateName}`,
    lead.templateUrl,
    "",
    `👤 ${lead.name}`,
    `📞 ${lead.phone}`,
    ...(lead.eventDate ? [`📅 ${lead.eventDate}`] : []),
    ...(lead.note ? [`💬 ${lead.note}`] : []),
    ...(lead.source ? [`🔎 Manba: ${lead.source}`] : []),
    "",
    "Mijoz formani to'ldirmagan: ismlar, sana va to'yxonani telefonda so'rab, taklifnomani tayyorlang.",
  ].join("\n");
  return sendWithRetry(text);
}

/** Mijozlar botidan xabar (webhook javoblari) */
export function sendTelegram(chatId: string, text: string): Promise<boolean> {
  return sendWithRetry(text, chatId, BOT_TOKEN);
}

/**
 * Webhook'ning maxfiy kaliti — bot tokenidan hosil qilinadi (alohida sozlama kerak emas).
 * Telegram har so'rovda uni `X-Telegram-Bot-Api-Secret-Token` sarlavhasida yuboradi.
 */
export async function webhookSecret(): Promise<string> {
  const data = new TextEncoder().encode(`${BOT_TOKEN ?? ""}:taklifnoma-webhook`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 48);
}

let botUsername: Promise<string> | null = null;
/** Bot foydalanuvchi nomi (t.me/<bot>?start=... havolasi uchun) — getMe, jarayon davomida keshlanadi */
export function getBotUsername(): Promise<string> {
  if (!BOT_TOKEN) return Promise.resolve("");
  botUsername ??= fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
    .then((r) => r.json())
    .then((d: { result?: { username?: string } }) => d.result?.username ?? "")
    .catch(() => {
      botUsername = null;
      return "";
    });
  return botUsername;
}

/** Mijozga: yangi RSVP yoki tilak (u botga /start bosgan bo'lsa) */
export function notifyCustomerResponse(
  chatId: string,
  r: { invitationTitle: string; kind: "rsvp" | "wish"; name: string; attending?: boolean; guests?: number; text?: string; pageUrl: string }
): Promise<boolean> {
  const head =
    r.kind === "rsvp"
      ? r.attending
        ? `✅ ${r.name} — keladi${r.guests && r.guests > 1 ? ` (${r.guests} kishi)` : ""}`
        : `❌ ${r.name} — kela olmaydi`
      : `💌 Yangi tilak — ${r.name}`;
  return sendWithRetry(
    [head, ...(r.text ? [`«${r.text}»`] : []), "", `🎉 ${r.invitationTitle}`, `📋 Barcha javoblar: ${r.pageUrl}`].join("\n"),
    chatId,
    BOT_TOKEN
  );
}
