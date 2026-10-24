/**
 * Mijoz qayerdan kelgani (birinchi tashrif): `?utm_source=instagram` yoki referrer domeni.
 *
 * NEGA: Instagram'dagi reels/bio havolasidan kelganlar buyurtma beryaptimi — shu orqali bilinadi
 * (admin panel va Telegram xabarida «📍 instagram»). 30 kun eslab qolinadi, keyingi tashriflar
 * ustidan yozmaydi — birinchi tegingan kanal hisoblanadi.
 */
const KEY = "taklif_src";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

const REFERRERS: [RegExp, string][] = [
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)(t\.me|telegram\.org|web\.telegram\.org)$/, "telegram"],
  [/(^|\.)(facebook\.com|fb\.com|m\.facebook\.com)$/, "facebook"],
  [/(^|\.)google\./, "google"],
  [/(^|\.)(yandex\.|ya\.ru)/, "yandex"],
  [/(^|\.)(tiktok\.com)$/, "tiktok"],
  [/(^|\.)(whatsapp\.com|wa\.me)$/, "whatsapp"],
];

export function cleanSource(v: unknown): string {
  return typeof v === "string" ? v.toLowerCase().replace(/[^a-z0-9_.-]/g, "").slice(0, 40) : "";
}

/** Sahifa ochilganda chaqiriladi: manba hali saqlanmagan bo'lsa — saqlaydi */
export function rememberSource(): void {
  try {
    const old = JSON.parse(localStorage.getItem(KEY) || "null") as { s: string; t: number } | null;
    if (old && Date.now() - old.t < TTL_MS) return;
    const url = new URL(location.href);
    let s = cleanSource(url.searchParams.get("utm_source") || url.searchParams.get("ref"));
    if (!s && document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host !== location.hostname) s = REFERRERS.find(([re]) => re.test(host))?.[1] ?? cleanSource(host);
    }
    if (s) localStorage.setItem(KEY, JSON.stringify({ s, t: Date.now() }));
  } catch {
    // localStorage yopiq (inkognito) — manbasiz davom etamiz
  }
}

export function getSource(): string {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "null") as { s: string } | null;
    return cleanSource(v?.s);
  } catch {
    return "";
  }
}
