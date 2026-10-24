// Bir martalik: bazadagi shablon narxlarini yangi TIER_PRICE ga o'tkazadi.
// Ishlatish: npx tsx scripts/reprice.ts [--apply]
import { loadEnvConfig } from "@next/env";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "../src/generated/prisma/client";

loadEnvConfig(process.cwd());
neonConfig.webSocketConstructor = ws;
const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }) });

// Tartib muhim: avval 149 000 → 79 000, keyin 199 000 → 149 000 (aks holda ikkalasi qo'shilib ketadi)
const MOVES: [number, number][] = [[149_000, 79_000], [199_000, 149_000], [279_000, 249_000]];

async function main() {
  const before = await prisma.template.groupBy({ by: ["price"], _count: true });
  console.log("oldin:", before.map((b) => `${b.price}×${b._count}`).join(", "));
  if (!process.argv.includes("--apply")) return;
  await prisma.$transaction(MOVES.map(([from, to]) => prisma.template.updateMany({ where: { price: from }, data: { price: to } })));
  const after = await prisma.template.groupBy({ by: ["price"], _count: true });
  console.log("keyin:", after.map((b) => `${b.price}×${b._count}`).join(", "));
}
main().finally(() => prisma.$disconnect());
