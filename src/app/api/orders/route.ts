import { randomBytes } from "node:crypto";
import { after, NextResponse } from "next/server";
import { customizationSummary, sanitizeCustomization } from "@/lib/customization";
import { musicTrack } from "@/lib/music";
import { findPalette, getPalettes } from "@/lib/palettes";
import { tierLabel } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatPrice, orderPrice, tierOf } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";
import { notifyAdminNewOrder } from "@/lib/telegramBot";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { validateOrderContent } from "@/lib/validation";

// Spamdan himoya: bitta IP uchun 1 daqiqada ko'pi bilan 5 buyurtma.
const ORDER_LIMIT = 5;
const ORDER_WINDOW_MS = 60_000;

function transliterate(text: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
    ч: "ch", ш: "sh", щ: "sh", ъ: "", ь: "", э: "e", ю: "yu", я: "ya",
    ў: "o", қ: "q", ғ: "g", ҳ: "h",
  };
  return text
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("");
}

function makeSlug(base: string): string {
  const clean = transliterate(base)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const rand = randomBytes(4).toString("hex").slice(0, 6);
  return `${clean || "taklifnoma"}-${rand}`;
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!(await rateLimit(`order:${ip}`, ORDER_LIMIT, ORDER_WINDOW_MS))) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." },
      { status: 429 }
    );
  }

  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const options: unknown = body?.options;
    const templateSlug = typeof body?.templateSlug === "string" ? body.templateSlug : "";
    const content = validateOrderContent(body);
    if (!content.ok) {
      return NextResponse.json({ error: content.error }, { status: 400 });
    }
    if (!templateSlug) {
      return NextResponse.json({ error: "Majburiy maydonlar to'ldirilmagan" }, { status: 400 });
    }
    const {
      customerName,
      phone,
      title,
      partner1,
      partner2,
      eventDate,
      eventTime,
      venueName,
      venueAddress,
      message,
    } = content.value;

    const template = await prisma.template.findUnique({
      where: { slug: templateSlug },
      include: { categories: { select: { slug: true, name: true } } },
    });
    if (!template || !template.isActive) {
      return NextResponse.json({ error: "Shablon topilmadi" }, { status: 404 });
    }

    const custom = sanitizeCustomization(options, {
      paletteIds: getPalettes(template.theme).map((p) => p.id),
      eventTypeSlugs: template.categories.map((e) => e.slug),
      tier: tierOf(template.price),
    });
    if (!custom.ok) {
      return NextResponse.json({ error: custom.error }, { status: 400 });
    }

    // Narx serverda hisoblanadi (mijoz yuborgan summaga ishonilmaydi)
    const priced = orderPrice(template.price, custom.value);
    const price = priced.total;

    const slugBase = partner1 && partner2 ? `${partner1}-va-${partner2}` : title;
    const orderData = (slug: string) => ({
      customerName,
      phone,
      templateId: template.id,
      status: "PENDING",
      price,
      invitation: {
        create: {
          slug,
          templateId: template.id,
          title,
          partner1,
          partner2,
          eventDate: new Date(eventDate),
          eventTime,
          venueName,
          venueAddress,
          message,
          options: JSON.stringify(custom.value),
        },
      },
    });

    // Slug oxiridagi tasodifiy qo'shimcha kamdan-kam bo'lsa ham takrorlanishi
    // mumkin (@unique) — shunda yangi qo'shimcha bilan qayta urinamiz.
    let order;
    for (let attempt = 1; ; attempt++) {
      try {
        order = await prisma.order.create({
          data: orderData(makeSlug(slugBase)),
          include: { invitation: true },
        });
        break;
      } catch (e) {
        const unique = (e as { code?: string })?.code === "P2002";
        if (!unique || attempt >= 3) throw e;
      }
    }

    // after(): Vercel javobni qaytargach ham funksiya xabar yuborilguncha
    // yashaydi (waitUntil). Avval await'siz chaqirilardi — funksiya muzlab,
    // xabar kechikar yoki umuman kelmasdi.
    const c = custom.value;
    after(() =>
      notifyAdminNewOrder({
        id: order.id,
        customerName: order.customerName,
        phone: order.phone,
        templateName: template.name,
        // Operator uchun: qaysi tarif, qo'shimchalar va jami summa
        priceLines: [
          `💎 Tarif: ${tierLabel(tierOf(template.price), getDictionary("uz").common)} — ${formatPrice(template.price)} so'm`,
          ...priced.lines
            .filter((l) => l.key === "customMusic")
            .map((l) => `➕ O'z musiqasi — ${formatPrice(l.amount)} so'm`),
          `💰 Jami: ${formatPrice(price)} so'm`,
        ],
        title,
        eventDate: `${eventDate.split("-").reverse().join(".")} ${eventTime}`,
        venueName,
        // So'rov kelgan domen (preview deploy'larda ham to'g'ri havola bo'lsin)
        customerPageUrl: `${new URL(req.url).origin}/buyurtma/${order.accessToken}`,
        details: customizationSummary(c, {
          eventType: template.categories.find((e) => e.slug === c.eventType)?.name,
          palette: c.palette ? findPalette(template.theme, c.palette)?.name : undefined,
          music: musicTrack(c.music)?.name,
        }),
      })
    );

    // DIQQAT: mijozga ketma-ket `order.id` emas, tasodifiy `accessToken`
    // qaytariladi — status sahifasi shu token bo'yicha qidiradi. Aks holda
    // ID'ni sanab, boshqa mijozlarning buyurtmasini/taklifnoma havolasini
    // har kim ko'ra olardi (IDOR).
    return NextResponse.json({ orderToken: order.accessToken, slug: order.invitation?.slug });
  } catch (e) {
    console.error("Buyurtma yaratishda xatolik:", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { error: "Serverda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
