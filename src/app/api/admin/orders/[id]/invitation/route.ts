import { NextResponse } from "next/server";
import { parseStoredCustomization, sanitizeCustomization, type Customization } from "@/lib/customization";
import { approxMapUrls, mapsMissing, withApproxMaps } from "@/lib/maps";
import { getPalettes } from "@/lib/palettes";
import { tierOf } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";
import { cleanText, validateOrderContent } from "@/lib/validation";

/** Admin tahrirlay oladigan sozlamalar — qolganlari (ranglar, musiqa, tillar ...) o'zgarmaydi */
const EDITABLE = ["kicker", "timeline", "googleMapsUrl", "yandexMapsUrl", "mapConfirmed", "rsvp", "wishes", "petals"] as const;

/**
 * Buyurtma va taklifnoma matnini tahrirlash (admin). Ruxsat — src/proxy.ts
 * (/api/admin/* faqat admin sessiyasi bilan). Taklifnoma havolasi (slug)
 * o'zgarmaydi — u mehmonlarga allaqachon yuborilgan bo'lishi mumkin.
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const orderId = Number((await params).id);
    if (!Number.isInteger(orderId)) {
      return NextResponse.json({ error: "Noto'g'ri ID" }, { status: 400 });
    }
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        invitation: true,
        template: { include: { categories: { select: { slug: true } } } },
      },
    });
    if (!order?.invitation) {
      return NextResponse.json({ error: "Buyurtma topilmadi" }, { status: 404 });
    }
    const inv = order.invitation;

    const body = (await req.json().catch(() => null)) as { content?: Record<string, unknown>; options?: Record<string, unknown> } | null;
    const c = body?.content ?? {};
    const partner1 = cleanText(c.partner1);
    const partner2 = cleanText(c.partner2);
    // Sarlavha buyurtma formasidagidek ismlardan yig'iladi
    const content = validateOrderContent(
      { ...c, title: partner2 ? `${partner1} & ${partner2}` : partner1 },
      new Date(),
      { allowPastDate: true }
    );
    if (!content.ok) {
      return NextResponse.json({ error: content.error }, { status: 400 });
    }
    const v = content.value;

    // Saqlangan sozlamalar ustiga faqat tahrirlanadigan maydonlar yoziladi
    const stored = parseStoredCustomization(inv.options);
    const patch = body?.options ?? {};
    const merged: Record<string, unknown> = { ...stored };
    for (const k of EDITABLE) if (k in patch) merged[k] = patch[k];

    // Avvalgi taxminiy havolalar joy/manzil o'zgarsa yangilanadi
    const oldApprox = approxMapUrls(inv.venueName, inv.venueAddress);
    if (
      merged.mapConfirmed === true &&
      oldApprox &&
      merged.googleMapsUrl === oldApprox.google &&
      merged.yandexMapsUrl === oldApprox.yandex
    ) {
      merged.googleMapsUrl = "";
      merged.yandexMapsUrl = "";
    }

    const custom = sanitizeCustomization(merged, {
      paletteIds: getPalettes(order.template.theme).map((p) => p.id),
      eventTypeSlugs: order.template.categories.map((e) => e.slug),
      tier: tierOf(order.template.price),
    });
    if (!custom.ok) {
      return NextResponse.json({ error: custom.error }, { status: 400 });
    }
    if (mapsMissing(custom.value)) {
      return NextResponse.json(
        { error: "Xarita havolasini kiriting yoki taxminiy joylashuvni tasdiqlang" },
        { status: 400 }
      );
    }
    const options: Customization = withApproxMaps(custom.value, v.venueName, v.venueAddress);

    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { customerName: v.customerName, phone: v.phone },
      }),
      prisma.invitation.update({
        where: { id: inv.id },
        data: {
          title: v.title,
          partner1: v.partner1,
          partner2: v.partner2,
          eventDate: new Date(v.eventDate),
          eventTime: v.eventTime,
          venueName: v.venueName,
          venueAddress: v.venueAddress,
          message: v.message,
          options: JSON.stringify(options),
        },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Taklifnomani tahrirlashda xatolik:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
