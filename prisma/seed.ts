import path from "node:path";
import fs from "node:fs";
import { loadEnvConfig } from "@next/env";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";
import { defaultNotes, defaultTimeline } from "../src/lib/eventDefaults";
import ws from "ws";

// Next.js bilan bir xil tartibda: .env.local → .env (mavjud process.env
// qiymatlari, masalan Vercel build'dagilar, ustun turadi).
loadEnvConfig(process.cwd());
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment o'zgaruvchisi sozlanmagan.");
}
const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

type Plan = {
  eventTypes: { slug: string; name: string; emoji: string; order: number }[];
  templates: {
    slug: string;
    name: string;
    base: string;
    eventType: string;
    palette: string;
    typo: string;
    desc: string;
    price: number;
    emoji: string;
    kicker: string;
    tier?: 'standard' | 'premium' | 'luxury';
    // Katalogda ko'rinadigan tadbir turlari (birinchisi — asosiy `eventType`)
    categories?: string[];
  }[];
};

function readPlan(file: string): Plan | null {
  const p = path.join(process.cwd(), "scripts", file);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8")) as Plan;
}

/**
 * Ikkita plan birlashtiriladi:
 *  - templates-plan.json        — 60 ta asosiy shablon (generator bilan)
 *  - templates-plan-taklif.json — 17 ta taklif-link uslubidagi shablon
 *
 * NEGA ALOHIDA FAYL: taklif shablonlari boshqa generator
 * (`generate-taklif-templates.mjs`) bilan yasaladi va eski generator ularning
 * palitrasini bilmaydi. Shu sababli ro'yxatlar ajratildi.
 */
const plan: Plan = {
  eventTypes: [
    ...(readPlan("templates-plan.json")?.eventTypes ?? []),
    ...(readPlan("templates-plan-taklif.json")?.eventTypes ?? []),
  ],
  templates: [
    ...(readPlan("templates-plan.json")?.templates ?? []),
    ...(readPlan("templates-plan-taklif.json")?.templates ?? []),
  ],
};

async function main() {
  // Vercel build'da `SEED_IF_EMPTY=1` bilan chaqiriladi. Baza allaqachon
  // to'ldirilgan bo'lsa, mavjud yozuvlarga TEGMAYMIZ — aks holda har deploy
  // admin paneldan o'zgartirilgan narx/nomlarni plan qiymatlariga qaytarib
  // yuboradi. Faqat bazada hali yo'q tadbir turlari va shablonlar qo'shiladi
  // (yangi shablon chiqqanda katalogda o'zi paydo bo'lishi uchun).
  const addMissingOnly =
    process.env.SEED_IF_EMPTY === "1" && (await prisma.eventType.count()) > 0;

  console.log(addMissingOnly ? "Seed: faqat yo'q yozuvlar qo'shiladi..." : "Seed boshlandi...");

  // Shablon papkalarining mavjudligini tekshirish
  for (const t of plan.templates) {
    const dir = path.join(process.cwd(), "public", "t", t.slug);
    if (!fs.existsSync(path.join(dir, "index.html"))) {
      console.warn(`⚠  ${t.slug} build qilinmagan (public/t/${t.slug}/ yo'q)`);
    }
  }

  for (const et of plan.eventTypes) {
    if (addMissingOnly) {
      if (!(await prisma.eventType.findUnique({ where: { slug: et.slug } }))) {
        await prisma.eventType.create({ data: et });
        console.log(`  + tadbir turi qo'shildi: ${et.slug}`);
      }
      continue;
    }
    await prisma.eventType.upsert({
      where: { slug: et.slug },
      update: { name: et.name, emoji: et.emoji, order: et.order },
      create: et,
    });
  }

  for (const t of plan.templates) {
    if (addMissingOnly && (await prisma.template.findUnique({ where: { slug: t.slug } }))) continue;

    const eventType = await prisma.eventType.findUnique({
      where: { slug: t.eventType },
    });
    if (!eventType) throw new Error(`EventType topilmadi: ${t.eventType}`);

    const data = {
      name: t.name,
      description: t.desc,
      price: t.price,
      theme: t.slug, // theme = shablon papka nomi (public/t/<theme>)
      previewEmoji: t.emoji,
      kicker: t.kicker,
      timeline: JSON.stringify(defaultTimeline(t.eventType)),
      notes: JSON.stringify(defaultNotes(t.eventType)),
      eventTypeId: eventType.id,
      isActive: true,
    };

    const categorySlugs = t.categories?.length ? t.categories : [t.eventType];
    const categories = await prisma.eventType.findMany({
      where: { slug: { in: categorySlugs } },
      select: { id: true },
    });

    await prisma.template.upsert({
      where: { slug: t.slug },
      update: { ...data, categories: { set: categories } },
      create: { slug: t.slug, ...data, categories: { connect: categories } },
    });
    if (addMissingOnly) console.log(`  + shablon qo'shildi: ${t.slug}`);
  }

  // Mavjud bazada eski shablonlarni o'chirish/faolsizlantirish o'tkazib yuboriladi
  if (addMissingOnly) {
    console.log("Seed tugadi: mavjud yozuvlar o'zgartirilmadi.");
    return;
  }

  // Eski Templates (theme qadimiy bo'lgan) — plan'da yo'qlarini o'chirish.
  //
  // DIQQAT: agar shablon bo'yicha allaqachon Order/Invitation mavjud bo'lsa,
  // `delete` FK cheklovi (foreign key constraint) tufayli xato bilan
  // to'xtaydi — schema'da bu relatsiyalar uchun cascade delete yo'q (va
  // ataylab yo'q: eski buyurtmalarni "yetim" holga keltirib bo'lmaydi).
  // Shu sababli avval bog'liq yozuvlar borligini tekshiramiz: bo'lsa —
  // shablonni butunlay o'chirish o'rniga faqat `isActive: false` qilib,
  // yangi buyurtmalar uchun yopamiz; bo'lmasa — xavfsiz o'chiramiz.
  const planSlugs = new Set(plan.templates.map((t) => t.slug));
  const all = await prisma.template.findMany();
  for (const tpl of all) {
    if (planSlugs.has(tpl.slug)) continue;

    const [orderCount, invitationCount] = await Promise.all([
      prisma.order.count({ where: { templateId: tpl.id } }),
      prisma.invitation.count({ where: { templateId: tpl.id } }),
    ]);

    if (orderCount > 0 || invitationCount > 0) {
      if (tpl.isActive) {
        await prisma.template.update({ where: { id: tpl.id }, data: { isActive: false } });
        console.log(
          `  🔒 ${tpl.slug} o'chirilmadi (${orderCount} buyurtma bog'liq) — o'rniga faol emas qilib qo'yildi.`
        );
      }
      continue;
    }

    await prisma.template.delete({ where: { id: tpl.id } });
    console.log(`  🗑  Eskirgan shablon o'chirildi: ${tpl.slug}`);
  }

  console.log(
    `Seed tugadi: ${plan.eventTypes.length} tadbir turi, ${plan.templates.length} shablon.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
