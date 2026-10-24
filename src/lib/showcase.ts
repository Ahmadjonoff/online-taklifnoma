import { unstable_cache } from "next/cache";
import { parseStoredCustomization } from "./customization";
import { tierOf, type Tier } from "./pricing";
import { prisma } from "./prisma";

export type ShowcaseItem = { slug: string; names: string; kicker: string; templateName: string; tier: Tier; city: string };

/**
 * Bosh sahifadagi «Haqiqiy namunalar» — admin panelda «Demo» deb belgilangan va tasdiqlangan
 * taklifnomalar (turli marosim, ism va shaharlar bilan saytda yaratilgan). Yangisini qo'shish uchun —
 * saytda buyurtma berib, adminda tasdiqlab, «Demo» tugmasini bosish kifoya.
 */
export const getShowcase = unstable_cache(
  async (): Promise<ShowcaseItem[]> => {
    const rows = await prisma.invitation.findMany({
      where: { order: { isDemo: true, status: "PAID" } },
      select: {
        slug: true, title: true, partner1: true, partner2: true, venueAddress: true, options: true,
        template: { select: { name: true, price: true, kicker: true } },
      },
      orderBy: { id: "asc" },
      take: 12,
    });
    return rows.map((r) => {
      const c = parseStoredCustomization(r.options);
      return {
        slug: r.slug,
        names: r.partner2 ? `${r.partner1} & ${r.partner2}` : r.partner1 || r.title,
        kicker: c.kicker || r.template.kicker,
        templateName: r.template.name,
        tier: tierOf(r.template.price),
        city: r.venueAddress.split(",")[0].trim(),
      };
    });
  },
  ["showcase-v1"],
  { tags: ["showcase"], revalidate: 600 }
);
