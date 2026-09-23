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
  // v2: kategoriyalar qo'shildi — eski keshdagi shakl bilan aralashmasin
  ["catalog-v2"],
  // revalidate: seed qo'lda qayta ishga tushirilsa ham 5 daqiqada yangilanadi
  { tags: [CATALOG_TAG], revalidate: 300 }
);

export type CatalogData = Awaited<ReturnType<typeof getCatalog>>;
export type CatalogTemplateRow = CatalogData["templates"][number];
