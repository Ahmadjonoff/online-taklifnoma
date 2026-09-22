/**
 * Yangi buyurtma kelganda operatorning shaxsiy Telegramiga bot orqali xabar.
 *
 * NEGA SHUNDAY: bot foydalanuvchi nomiga emas, faqat chat ID'ga xabar yubora
 * oladi. TELEGRAM_ADMIN_CHAT_ID bo'sh bo'lsa — jim o'tkazib yuboriladi, order
 * yaratish bu sababli hech qachon to'xtab qolmaydi.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

export async function notifyAdminNewOrder(order: {
  id: number;
  customerName: string;
  phone: string;
  templateName: string;
}): Promise<void> {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) return;

  const text = [
    "🆕 Yangi buyurtma!",
    `№${order.id} — ${order.templateName}`,
    `Mijoz: ${order.customerName}`,
    `Tel: ${order.phone}`,
  ].join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text }),
    });
  } catch (e) {
    console.error("Telegram xabari yuborilmadi:", e);
  }
}
