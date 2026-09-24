import { prisma } from "./prisma";

/**
 * Fixed-window rate-limiter.
 *
 * NEGA SHUNDAY: Vercel'da har bir funksiya instance'ining xotirasi alohida va
 * sovuq startda tozalanadi — xotiradagi hisoblagich amalda limitni N marta
 * bo'shashtirardi (ayniqsa admin login uchun xavfli). Shu sababli hisoblagich
 * Postgres'da (`RateLimit` jadvali) saqlanadi va bitta atomik
 * `INSERT ... ON CONFLICT` bilan oshiriladi — bir vaqtdagi so'rovlarda ham
 * poyga (race) bo'lmaydi.
 *
 * Baza vaqtincha ishlamasa — jarayon xotirasidagi limiterga qaytamiz: sayt
 * to'xtab qolmaydi, himoya esa butunlay yo'qolmaydi.
 */

/**
 * @returns true — so'rovga ruxsat bor, false — limit oshib ketgan.
 */
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  try {
    // `resetAt` — TIMESTAMP (vaqt zonasiz, Prisma uni UTC'da saqlaydi)
    const rows = await prisma.$queryRaw<{ count: number }[]>`
      INSERT INTO "RateLimit" ("key", "count", "resetAt")
      VALUES (${key}, 1, (NOW() AT TIME ZONE 'UTC') + ${windowMs}::double precision * INTERVAL '1 millisecond')
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE WHEN "RateLimit"."resetAt" <= (NOW() AT TIME ZONE 'UTC')
                       THEN 1 ELSE "RateLimit"."count" + 1 END,
        "resetAt" = CASE WHEN "RateLimit"."resetAt" <= (NOW() AT TIME ZONE 'UTC')
                         THEN EXCLUDED."resetAt" ELSE "RateLimit"."resetAt" END
      RETURNING "count"`;

    // Jadval o'sib ketmasligi uchun vaqti-vaqti bilan eskirgan yozuvlarni tozalaymiz
    if (Math.random() < 0.01) {
      await prisma.$executeRaw`DELETE FROM "RateLimit" WHERE "resetAt" < (NOW() AT TIME ZONE 'UTC')`;
    }

    return Number(rows[0]?.count ?? 1) <= limit;
  } catch (e) {
    console.error("Rate-limit bazasi xatosi:", e instanceof Error ? e.message : e);
    return memoryRateLimit(key, limit, windowMs);
  }
}

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Zaxira: jarayon xotirasidagi limiter (faqat baza ishlamaganda). */
export function memoryRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}

/** So'rov IP manzilini headerlardan aniqlashga urinadi (proxy orqasida ham). */
export function clientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
