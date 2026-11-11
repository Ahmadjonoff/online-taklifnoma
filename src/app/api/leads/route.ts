import { NextResponse } from "next/server";
import { cleanSource } from "@/lib/attribution";
import { isRealDate } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { notifyAdminQuickLead } from "@/lib/telegramBot";
import { isValidPhone } from "@/lib/validation";

/**
 * Tezkor so'rov: mijoz 6 qadamli formani to'ldirmay, faqat ism va telefon qoldiradi —
 * operator qo'ng'iroq qilib, taklifnomani o'zi to'ldiradi.
 *
 * NEGA BAZASIZ: so'rov operatorning Telegramiga darhol boradi (u yerda qo'ng'iroq
 * qilinadi), alohida jadval/migratsiya shart emas. Xabar yetib bormasa mijozga xato
 * qaytariladi (u Telegram/Instagram tugmasidan yozadi) va so'rov server logiga yoziladi —
 * hech biri jim yo'qolmaydi.
 */
const LIMIT = 5;
const WINDOW_MS = 60_000;

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : "";

export async function POST(req: Request) {
  if (!(await rateLimit(`lead:${clientIp(req)}`, LIMIT, WINDOW_MS))) {
    return NextResponse.json({ error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." }, { status: 429 });
  }
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const name = clean(body?.name, 80);
  const phone = clean(body?.phone, 30);
  const note = clean(body?.note, 300);
  const rawDate = clean(body?.eventDate, 10);
  const eventDate = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) && isRealDate(rawDate) ? rawDate : "";
  const templateSlug = clean(body?.templateSlug, 80);

  if (!name || !phone) {
    return NextResponse.json({ error: "Ism va telefon raqamini kiriting" }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Telefon raqami noto'g'ri formatda" }, { status: 400 });
  }

  const template = templateSlug
    ? await prisma.template.findUnique({ where: { slug: templateSlug }, select: { name: true, isActive: true } })
    : null;
  const origin = new URL(req.url).origin;
  const lead = {
    name,
    phone,
    templateName: template?.isActive ? template.name : "Shablon tanlanmagan",
    templateUrl: template?.isActive ? `${origin}/shablon/${templateSlug}` : `${origin}/shablonlar`,
    eventDate: eventDate ? eventDate.split("-").reverse().join(".") : undefined,
    note: note || undefined,
    source: cleanSource(body?.source) || undefined,
  };
  // Zaxira: Telegram ishlamay qolsa ham so'rov Vercel loglarida qoladi
  console.log("Tezkor so'rov:", JSON.stringify(lead));

  const sent = await notifyAdminQuickLead(lead);
  if (!sent) {
    return NextResponse.json(
      { error: "So'rov yuborilmadi. Iltimos, Telegram yoki Instagram orqali yozing." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}
