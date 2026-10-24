// Instagram uchun yaratilgan demo buyurtmalarni «Demo» deb belgilaydi (statistikaga kirmaydi,
// bosh sahifadagi «Haqiqiy namunalar»da ko'rinadi). Ishlatish: npx tsx scripts/mark-demo.ts 11 12 ...
import { loadEnvConfig } from "@next/env";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "../src/generated/prisma/client";

loadEnvConfig(process.cwd());
neonConfig.webSocketConstructor = ws;
const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }) });

const ids = process.argv.slice(2).map(Number).filter(Boolean);
prisma.order
  .updateMany({ where: { id: { in: ids } }, data: { isDemo: true } })
  .then((r) => console.log("demo deb belgilandi:", r.count))
  .finally(() => prisma.$disconnect());
