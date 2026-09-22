/**
 * Aloqa kanali — Telegram.
 *
 * NEGA SHUNDAY: buyurtma jarayonida onlayn to'lov yo'q. Mijoz formani
 * to'ldiradi, operator Telegram orqali bog'lanadi va narx kelishiladi. Shu
 * sababli saytning bir necha joyida (bosh sahifa, shablon, buyurtma sahifasi)
 * aynan shu kanalga havola kerak bo'ladi — manzil bitta joyda turishi kerak.
 */

/** Operatorning Telegram manzili (foydalanuvchi nomisiz, `@` siz). */
export const TELEGRAM_USERNAME = "Abdurauf_Ahmadjonov";

/** Ko'rsatish uchun `@...` ko'rinishi. */
export const TELEGRAM_LABEL = `@${TELEGRAM_USERNAME}`;

/** Kanalsiz, oddiy chat havolasi. */
export const TELEGRAM_URL = `https://t.me/${TELEGRAM_USERNAME}`;

/**
 * Telegram havolasi. `text` berilganda chatda tayyor xabar ochiladi — mijoz
 * nima haqida yozayotganini o'zi tushuntirib o'tirmaydi.
 */
export function telegramUrl(text?: string): string {
  return text ? `${TELEGRAM_URL}?text=${encodeURIComponent(text)}` : TELEGRAM_URL;
}
