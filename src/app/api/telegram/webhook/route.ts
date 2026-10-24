import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminChat, sendTelegram, webhookSecret } from "@/lib/telegramBot";

/**
 * Telegram bot webhook'i: mijoz o'z sahifasidagi «Javoblarni Telegram'da olish» tugmasini bossa,
 * bot `/start <buyurtma tokeni>` oladi — shu chat buyurtmaga bog'lanadi va mehmonlar javoblari/tilaklari
 * shu yerga keladi. `/stop` — xabarlarni o'chirish.
 */
type Update = { message?: { chat: { id: number }; text?: string } };

export async function POST(req: Request) {
  if (!process.env.TELEGRAM_BOT_TOKEN || req.headers.get("x-telegram-bot-api-secret-token") !== (await webhookSecret())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const update = (await req.json().catch(() => ({}))) as Update;
  const msg = update.message;
  if (!msg?.text) return NextResponse.json({ ok: true });
  const chatId = String(msg.chat.id);
  const [cmd, arg] = msg.text.trim().split(/\s+/, 2);

  if (cmd === "/start" && arg && /^[a-z0-9]{10,40}$/i.test(arg)) {
    const order = await prisma.order.findUnique({
      where: { accessToken: arg },
      select: { id: true, status: true, invitation: { select: { title: true } } },
    });
    if (!order) {
      await sendTelegram(chatId, "Buyurtma topilmadi. Havolani o'z sahifangizdan qayta bosing.");
    } else {
      await prisma.order.update({ where: { id: order.id }, data: { notifyChatId: chatId } });
      await sendTelegram(
        chatId,
        `✅ Ulandingiz! «${order.invitation?.title ?? "Taklifnoma"}» taklifnomasiga mehmonlar javob yoki tilak qoldirsa — shu yerda darhol ko'rasiz.\n\nO'chirish uchun: /stop`
      );
    }
  } else if (cmd === "/stop") {
    const { count } = await prisma.order.updateMany({ where: { notifyChatId: chatId }, data: { notifyChatId: "" } });
    await sendTelegram(chatId, count ? "🔕 Xabarlar o'chirildi. Qayta yoqish — sahifangizdagi tugma orqali." : "Sizga ulangan taklifnoma yo'q.");
  } else if (cmd === "/start" && isAdminChat(chatId)) {
    await sendTelegram(chatId, "✅ Siz operatorsiz — yangi buyurtmalar shu yerga keladi.\nBoshqaruv: https://online-taklifnoma-neon.vercel.app/boshqaruv");
  } else if (cmd === "/start") {
    await sendTelegram(
      chatId,
      "Assalomu alaykum! Bu — Online taklifnomalar boti.\nMehmonlar javoblarini shu yerda olish uchun taklifnomangiz sahifasidagi «Javoblarni Telegram'da olish» tugmasini bosing.\n\nYangi taklifnoma: https://online-taklifnoma-neon.vercel.app/shablonlar"
    );
  }
  return NextResponse.json({ ok: true });
}
