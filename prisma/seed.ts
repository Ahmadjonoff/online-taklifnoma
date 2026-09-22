import "dotenv/config";
import path from "node:path";
import fs from "node:fs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const resolved = dbUrl.replace("file:", "");
const absolutePath = path.isAbsolute(resolved)
  ? resolved
  : path.join(process.cwd(), resolved);

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: `file:${absolutePath}` }),
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
    tier?: 'premium' | 'standard';
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

// Plan dagi base dizaynlardan timeline/notes olish uchun generatorning
// defaultTimeline/defaultNotes funksiyalarini takrorlaymiz (seed mustaqil ishlashi uchun)
function defaultTimeline(eventType: string): Array<{ time: string; label: string }> {
  const T: Record<string, Array<{ time: string; label: string }>> = {
    toy: [
      { time: "18:00", label: "Mehmonlar kutib olish" },
      { time: "18:30", label: "Otam-qarashdosh marosimi" },
      { time: "19:00", label: "To'y boshlanishi" },
      { time: "21:00", label: "Dasturxon" },
      { time: "23:00", label: "Yakuniy raqs" },
    ],
    "nikoh-toyi": [
      { time: "17:00", label: "Mehmonlar kutib olish" },
      { time: "17:30", label: "Nikoh o'qilishi" },
      { time: "18:30", label: "Dasturxon" },
      { time: "21:00", label: "Tabriklar" },
    ],
    "fotiha-toyi": [
      { time: "17:00", label: "Mehmonlar kutib olish" },
      { time: "17:30", label: "Fotiha o'qilishi" },
      { time: "18:30", label: "Dasturxon" },
      { time: "20:00", label: "Duolar" },
    ],
    "sunnat-toyi": [
      { time: "16:00", label: "Mehmonlar kutib olish" },
      { time: "17:00", label: "Marosim boshlanishi" },
      { time: "18:00", label: "Dasturxon" },
      { time: "20:00", label: "O'yin-kulgu" },
    ],
    "beshik-toyi": [
      { time: "15:00", label: "Mehmonlar kutib olish" },
      { time: "16:00", label: "Beshik bezatilishi" },
      { time: "17:00", label: "Dasturxon" },
    ],
    "tugilgan-kun": [
      { time: "16:00", label: "Mehmonlar kelishi" },
      { time: "17:00", label: "Tort va sharlar" },
      { time: "18:00", label: "O'yinlar" },
      { time: "20:00", label: "Tabriklar" },
    ],
    yubiley: [
      { time: "18:00", label: "Mehmonlar kutib olish" },
      { time: "19:00", label: "Tabriklar" },
      { time: "20:00", label: "Dasturxon" },
      { time: "22:00", label: "Konsert" },
    ],
    bayramlar: [
      { time: "11:00", label: "Bayram boshlanishi" },
      { time: "13:00", label: "Milliy taomlar" },
      { time: "16:00", label: "Concert va o'yinlar" },
    ],
    biznes: [
      { time: "09:00", label: "Ro'yxatdan o'tish" },
      { time: "10:00", label: "Kongress ochilishi" },
      { time: "12:00", label: "Panel muhokamasi" },
      { time: "14:00", label: "Tannaraf va networking" },
    ],
    oilaviy: [
      { time: "12:00", label: "Yig'ilish" },
      { time: "13:00", label: "Dasturxon" },
      { time: "16:00", label: "Suhbat va esdaliklar" },
    ],
    "qiz-bazmi": [
      { time: "17:00", label: "Mehmonlarni kutib olish" },
      { time: "18:00", label: "Kina marosimi" },
      { time: "19:00", label: "Dasturxon" },
      { time: "20:30", label: "Qo'shiqlar va raqslar" },
    ],
  };
  return T[eventType] ?? T.toy;
}

function defaultNotes(eventType: string): Array<{ title: string; text: string }> {
  const N: Record<string, Array<{ title: string; text: string }>> = {
    toy: [
      { title: "Kiyinish uslubi", text: "Zamonaviy yoki milliy liboslar" },
      { title: "Sovg'a haqida", text: "Ezgu duolaringiz eng qimmatli sovg'a" },
    ],
    "nikoh-toyi": [{ title: "Marosim haqida", text: "Nikoh o'qilishi 17:30 da boshlanadi" }],
    "fotiha-toyi": [{ title: "Eslatma", text: "Marosimdan so'ng dasturxon ochiladi" }],
    "sunnat-toyi": [{ title: "Bolalar uchun", text: "O'yinlar va shirinliklar mavjud" }],
    "beshik-toyi": [{ title: "An'ana", text: "Beshikni opa-singillar bezatadi" }],
    "tugilgan-kun": [{ title: "Joy haqida", text: "Bolalar uchun o'yin maydonchasi bor" }],
    yubiley: [{ title: "Faxrli mehmonlar", text: "Tabrik so'zlari uchun mikrofon bor" }],
    bayramlar: [{ title: "Bayram dasturi", text: "Hamma uchun ochiq" }],
    biznes: [
      { title: "Ishtirok", text: "Ro'yxatdan o'tish shart" },
      { title: "Til", text: "Ma'ruzalar o'zbek va rus tillarida" },
    ],
    oilaviy: [{ title: "Kutamiz", text: "Oilangiz bilan keling" }],
    "qiz-bazmi": [{ title: "An'ana", text: "Kina marosimida milliy liboslar kutiladi" }],
  };
  return N[eventType] ?? N.toy;
}

async function main() {
  console.log("Seed boshlandi...");

  // Shablon papkalarining mavjudligini tekshirish
  for (const t of plan.templates) {
    const dir = path.join(process.cwd(), "public", "t", t.slug);
    if (!fs.existsSync(path.join(dir, "index.html"))) {
      console.warn(`⚠  ${t.slug} build qilinmagan (public/t/${t.slug}/ yo'q)`);
    }
  }

  for (const et of plan.eventTypes) {
    await prisma.eventType.upsert({
      where: { slug: et.slug },
      update: { name: et.name, emoji: et.emoji, order: et.order },
      create: et,
    });
  }

  for (const t of plan.templates) {
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

    await prisma.template.upsert({
      where: { slug: t.slug },
      update: data,
      create: { slug: t.slug, ...data },
    });
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
