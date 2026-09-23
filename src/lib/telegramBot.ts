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
  details: string[]; // mijoz tanlagan qo'shimcha sozlamalar (rang, musiqa ...)
};

async function sendOnce(text: string): Promise<{ ok: boolean; retryAfterSec?: number; error?: string }> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text, disable_web_page_preview: true }),
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

export async function notifyAdminNewOrder(order: NewOrderNotice): Promise<boolean> {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    console.warn("Telegram sozlanmagan (TELEGRAM_BOT_TOKEN / TELEGRAM_ADMIN_CHAT_ID) — xabar yuborilmadi.");
    return false;
  }

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
    ...(order.details.length ? ["", ...order.details] : []),
  ].join("\n");

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const r = await sendOnce(text);
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
