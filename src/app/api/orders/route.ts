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
  const rand = Math.random().toString(36).slice(2, 7);
  return `${clean || "taklifnoma"}-${rand}`;
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`order:${ip}`, ORDER_LIMIT, ORDER_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const options: unknown = body?.options;
    const {
      templateSlug,
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
    } = body as Record<string, string>;

    if (!templateSlug || !customerName || !phone || !title || !eventDate || !venueName) {
      return NextResponse.json(
        { error: "Majburiy maydonlar to'ldirilmagan" },
        { status: 400 }
      );
    }

    // Telefon: +998 yoki 998 bilan boshlanadigan 9 xonali raqam (bo'shliq/tire bilan ham)
    const phoneDigits = phone.replace(/[\s()-]/g, "");
    if (!/^(\+?998)?\d{9}$/.test(phoneDigits)) {
      return NextResponse.json(
        { error: "Telefon raqami noto'g'ri formatda" },
        { status: 400 }
      );
    }

    // Sana: o'tmishda yoki mazmunsiz uzoq kelajakda bo'lmasin
    const parsedDate = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setFullYear(maxDate.getFullYear() + 3);
    if (Number.isNaN(parsedDate.getTime()) || parsedDate < today || parsedDate > maxDate) {
      return NextResponse.json(
        { error: "Tadbir sanasi noto'g'ri" },
        { status: 400 }
      );
    }

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
    });
    if (!custom.ok) {
      return NextResponse.json({ error: custom.error }, { status: 400 });
    }

    // Narx serverda hisoblanadi (mijoz yuborgan summaga ishonilmaydi)
    const priced = orderPrice(template.price, custom.value);
    const price = priced.total;

    const slug = makeSlug(partner1 && partner2 ? `${partner1}-va-${partner2}` : title);

    const order = await prisma.order.create({
      data: {
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
            eventTime: eventTime || "18:00",
            venueName,
            venueAddress: venueAddress ?? "",
            message: message ?? "",
            options: JSON.stringify(custom.value),
          },
        },
      },
      include: { invitation: true },
    });

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
        eventDate: `${eventDate.split("-").reverse().join(".")} ${eventTime || "18:00"}`,
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
