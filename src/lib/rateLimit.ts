/**
 * Oddiy fixed-window rate-limiter (jarayon xotirasida).
 *
 * NEGA SHUNDAY: loyiha bitta kichik instансda ishlaydi (SQLite fayl bazasi
 * ham shuni ko'rsatadi) — tashqi Redis kabi xizmatga hojat yo'q. Maqsad —
 * admin login va buyurtma formasini kalta vaqt ichida ko'p marta urinishdan
 * himoyalash, murakkab hisoblagich emas.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Xotira sekin o'sib ketmasligi uchun vaqti-vaqti bilan eskirgan yozuvlarni tozalaymiz.
function cleanup(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * @returns true — so'rovga ruxsat bor, false — limit oshib ketgan.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (buckets.size > 5000) cleanup(now);

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
