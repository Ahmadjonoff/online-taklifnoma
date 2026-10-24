// Mijozlar botiga webhook o'rnatadi (RSVP/tilak xabarlari uchun). Avval @BotFather'da alohida bot
// yarating va tokenini Vercel'ga TELEGRAM_CUSTOMER_BOT_TOKEN qilib qo'shing (va .env.local ga ham).
// Ishlatish: npx tsx scripts/telegram-webhook.ts [https://sayt-manzili]
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
const token = process.env.TELEGRAM_CUSTOMER_BOT_TOKEN;
const site = process.argv[2] ?? "https://online-taklifnoma-neon.vercel.app";
if (!token) throw new Error("TELEGRAM_CUSTOMER_BOT_TOKEN sozlanmagan");

async function main() {
  // src/lib/telegramBot.ts → webhookSecret() bilan bir xil hisob
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${token}:taklifnoma-webhook`));
  const secret = Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 48);
  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: `${site}/api/telegram/webhook`, secret_token: secret, allowed_updates: ["message"] }),
  });
  console.log(await res.json());
}
main();
