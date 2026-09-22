import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Admin sessiyasi.
 *
 * NEGA SHUNDAY: avval cookie'ga to'g'ridan-to'g'ri parol yozilardi — u oqib
 * ketsa, tajovuzkor bevosita admin parolini olardi. Endi cookie faqat
 * `issuedAt.nonce.hmac` ko'rinishidagi imzolangan tokenni saqlaydi; token
 * parolni o'zida tashimaydi va faqat parolni bilgan server uni tekshira oladi.
 */

export const COOKIE_NAME = "taklifnoma_admin";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // 2 hafta

export function getAdminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (pw) return pw;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ADMIN_PASSWORD environment o'zgaruvchisi sozlanmagan. Production muhitida bu majburiy."
    );
  }
  return "admin123"; // faqat lokal development uchun fallback
}

export function checkPassword(candidate: string): boolean {
  return safeStringEqual(candidate, getAdminPassword());
}

function sign(payload: string): string {
  return createHmac("sha256", getAdminPassword()).update(payload).digest("hex");
}

function safeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function createSessionToken(): string {
  const issuedAt = Date.now().toString();
  const nonce = randomBytes(8).toString("hex");
  const payload = `${issuedAt}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [issuedAt, nonce, signature] = parts;
  const payload = `${issuedAt}.${nonce}`;

  let expected: string;
  try {
    expected = sign(payload);
  } catch {
    return false;
  }
  if (!safeStringEqual(expected, signature)) return false;

  const issuedMs = Number(issuedAt);
  if (!Number.isFinite(issuedMs)) return false;
  if (Date.now() - issuedMs > SESSION_MAX_AGE_SECONDS * 1000) return false;

  return true;
}
