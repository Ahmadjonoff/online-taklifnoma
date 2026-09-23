/**
 * Aloqa kanali — Telegram.
 *
 * NEGA SHUNDAY: buyurtma jarayonida onlayn to'lov yo'q. Mijoz formani
 * to'ldiradi, operator Telegram orqali bog'lanadi va to'lov kelishiladi. Shu
 * sababli saytning bir necha joyida (bosh sahifa, shablon, buyurtma sahifasi)
 * aynan shu kanalga havola kerak bo'ladi — manzil bitta joyda turishi kerak.
 */

/** Operatorning Telegram manzili (foydalanuvchi nomisiz, `@` siz). */
export const TELEGRAM_USERNAME = "Abdurauf_Ahmadjonov";

/** Ko'rsatish uchun `@...` ko'rinishi. */
export const TELEGRAM_LABEL = `@${TELEGRAM_USERNAME}`;

/** Kanalsiz, oddiy chat havolasi. */
export const TELEGRAM_URL = `https://t.me/${TELEGRAM_USERNAME}`;

/** Sayt manzili — taklifnomalardagi reklama blokida ko'rsatiladi. */
export const SITE_URL = "https://online-taklifnoma-neon.vercel.app";

export const INSTAGRAM_URL = "https://www.instagram.com/abdurauf.dev/";

/**
 * Har bir taklifnoma oxiridagi reklama bloki (shablonlardagi Footer
 * ko'rsatadi): mehmonlar ham shunday taklifnoma buyurtma qilishi uchun.
 */
export const INVITATION_PROMO = {
  enabled: true,
  title: "Sizga ham shunday taklifnoma kerakmi?",
  text: "Online taklifnomalar — bir necha daqiqada buyurtma bering",
  siteUrl: SITE_URL,
  siteLabel: "Sayt",
  telegramUrl: TELEGRAM_URL,
  instagramUrl: INSTAGRAM_URL,
};

/**
 * Telegram havolasi. `text` berilganda chatda tayyor xabar ochiladi — mijoz
 * nima haqida yozayotganini o'zi tushuntirib o'tirmaydi.
 */
export function telegramUrl(text?: string): string {
  return text ? `${TELEGRAM_URL}?text=${encodeURIComponent(text)}` : TELEGRAM_URL;
}
