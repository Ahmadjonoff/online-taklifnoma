// Instagram'dagi mijozga BEPUL NAMUNA: mavjud demo taklifnomani (shablon, sozlamalar, dastur) nusxalab,
// mijozning ismlari bilan yangi tasdiqlangan taklifnoma yaratadi. Narx 0, isDemo=false →
// daromad statistikasiga ham, bosh sahifadagi «Haqiqiy namunalar»ga ham chiqmaydi; operator botiga xabar ketmaydi.
//
//   npx tsx scripts/bepul-namuna.ts <demo-slug> "Kuyov" "Kelin" "instagram_nik" [--sana 2026-12-05] [--vaqt 17:00]
//        [--joy "«...» to'yxonasi"] [--manzil "Shahar, ko'cha"]
//   Natija: /e/<slug> havolasi va /buyurtma/<token> (mijoz sahifasi).
import { randomBytes } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "../src/generated/prisma/client";

loadEnvConfig(process.cwd());
neonConfig.webSocketConstructor = ws;
const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }) });
const SITE = "https://online-taklifnoma-neon.vercel.app";

const args = process.argv.slice(2);
const flag = (name: string) => {
  const i = args.indexOf(`--${name}`);
  if (i < 0) return undefined;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const sana = flag("sana"), vaqt = flag("vaqt"), joy = flag("joy"), manzil = flag("manzil");
const [demoSlug, p1, p2 = "", nik = ""] = args;
if (!demoSlug || !p1) {
  console.error('Ishlatish: npx tsx scripts/bepul-namuna.ts <demo-slug> "Kuyov" "Kelin" "instagram_nik"');
  process.exit(1);
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[ʻʼ'`]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

async function main() {
  const src = await prisma.invitation.findUnique({ where: { slug: demoSlug }, include: { order: true } });
  if (!src) throw new Error(`Demo topilmadi: ${demoSlug}`);

  const opts = JSON.parse(src.options || "{}");
  // Demo «hikoyasi» boshqa juftlik haqida — mijozga yolg'on tarix yozmaslik uchun olib tashlanadi
  delete opts.story;

  const title = p2 ? `${p1} va ${p2}` : p1;
  const slug = `${slugify(title)}-${randomBytes(3).toString("hex").slice(0, 5)}`;
  const order = await prisma.order.create({
    data: {
      customerName: `🎁 Bepul namuna — Instagram ${nik}`.trim(),
      phone: "-",
      templateId: src.templateId,
      status: "PAID",
      price: 0,
      source: "instagram-dm-namuna",
      invitation: {
        create: {
          slug,
          templateId: src.templateId,
          title,
          partner1: p1,
          partner2: p2,
          eventDate: sana ? new Date(sana) : src.eventDate,
          eventTime: vaqt ?? src.eventTime,
          venueName: joy ?? src.venueName,
          venueAddress: manzil ?? src.venueAddress,
          message: src.message,
          options: JSON.stringify(opts),
        },
      },
    },
    include: { invitation: true },
  });
  console.log(`buyurtma #${order.id}`);
  console.log(`taklifnoma: ${SITE}/e/${order.invitation!.slug}`);
  console.log(`mijoz sahifasi: ${SITE}/buyurtma/${order.accessToken}`);
}

main().finally(() => prisma.$disconnect());
