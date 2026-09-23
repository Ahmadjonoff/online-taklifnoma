import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";

// Next.js va seed bilan bir xil tartibda: .env.local → .env. Avval
// `dotenv/config` faqat .env'ni o'qirdi — .env.local'dagi (vercel env pull)
// bazaga emas, .env'da qolib ketgan eski bazaga migratsiya qilinardi.
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  // MUHIM: bu yerdagi `url` faqat Prisma CLI (migrate/introspect) uchun —
  // ilova ishga tushganda esa `src/lib/prisma.ts` o'zining pooled
  // `DATABASE_URL`'idan foydalanadi (@prisma/config'ning `Datasource` tipida
  // `directUrl` maydoni yo'q). Migratsiyalar uchun to'g'ridan-to'g'ri
  // (pooled bo'lmagan) ulanish kerak — Neon'ning PgBouncer pooler'i
  // transaction rejimida bo'lgani uchun session-level buyruqlarni
  // (masalan, migratsiya paytidagi SET) qo'llab-quvvatlamaydi.
  datasource: {
    url: process.env.DATABASE_URL_UNPOOLED,
  },
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "npx tsx prisma/seed.ts",
  },
});
