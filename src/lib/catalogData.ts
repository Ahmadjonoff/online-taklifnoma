import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const CATALOG_TAG = "catalog";

/**
 * Faol shablonlar va tadbir turlari — bitta keshlangan so'rov.
 *
 * NEGA KESH: katalog faqat seed orqali o'zgaradi, lekin avval har bir sahifa
 * ochilishida bazaga borilardi (Neon uxlab qolgan bo'lsa — uyg'otish bilan
 * birga). Ma'lumot kichik (bir necha o'nlab qator), shuning uchun hammasini
 * bir marta olib, sahifalar kerakli qismini shu yerdan ajratib oladi.
 *
 * `createdAt` olib tashlanadi: kesh JSON'ga seriyalanadi va Date string'ga
 * aylanib qoladi — sahifalarda baribir ishlatilmaydi.
 */
export const getCatalog = unstable_cache(
  async () => {
    const [eventTypes, templates] = await Promise.all([
      prisma.eventType.findMany({
        orderBy: { order: "asc" },
        // Soni — shu tur ostida katalogda ko'rinadigan shablonlar (kategoriya bo'yicha)
        include: { _count: { select: { categoryTemplates: { where: { isActive: true } } } } },
      }),
      prisma.template.findMany({
        where: { isActive: true },
        include: {
          eventType: true,
          categories: { select: { slug: true, name: true, emoji: true, order: true } },
        },
        orderBy: [{ price: "desc" }, { id: "asc" }],
      }),
    ]);
    return {
      eventTypes: eventTypes.map(({ _count, ...e }) => ({
        ...e,
        _count: { templates: _count.categoryTemplates },
      })),
      templates: templates.map(({ createdAt: _createdAt, categories, ...t }) => ({
        ...t,
        categories: [...categories].sort((a, b) => a.order - b.order),
      })),
    };
  },
  // Kalit versiyasi: ma'lumot shakli yoki tariflar o'zgarganda oshiriladi —
  // unstable_cache deploy'lar orasida saqlanadi, eski kesh aralashmasin.
  // v3: Standart/Premium/Luxury tariflari va yangi kategoriyalar
  // v4: 2026-10 narxlari (79/149/249 ming) — bazadagi Template.price ham ko'chirilgan
  ["catalog-v4"],
  // revalidate: katalog faqat seed orqali o'zgaradi — soatiga bir marta
  // yangilash yetarli (har 5 daqiqada uxlab yotgan Neon'ni uyg'otmaymiz)
  { tags: [CATALOG_TAG], revalidate: 3600 }
);

export type CatalogData = Awaited<ReturnType<typeof getCatalog>>;
export type CatalogTemplateRow = CatalogData["templates"][number];
