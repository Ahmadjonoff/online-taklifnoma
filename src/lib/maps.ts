/**
 * Xarita havolalari.
 *
 * Mijoz Google/Yandex havolasini kiritmasa, u yozgan joy nomi va manzili
 * bo'yicha qidiruv havolasi (taxminiy joylashuv) yasaladi. Mijoz uni
 * formada ochib tekshiradi va tasdiqlaydi (`mapConfirmed`) — yoki o'z
 * havolasini qo'yadi. Tasdiqlanmagan taxminiy havola taklifnomaga qo'yilmaydi.
 */
export function approxMapUrls(
  venueName: string,
  venueAddress: string
): { google: string; yandex: string } | null {
  const q = [venueName, venueAddress]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
  if (!q) return null;
  const e = encodeURIComponent(q);
  return {
    google: `https://www.google.com/maps/search/?api=1&query=${e}`,
    yandex: `https://yandex.uz/maps/?text=${e}`,
  };
}

type MapFields = { googleMapsUrl: string; yandexMapsUrl: string; mapConfirmed: boolean };

/** Mijoz havola bermagan va taxminiy joylashuvni tasdiqlagan bo'lsa — havolalarni to'ldiradi. */
export function withApproxMaps<T extends MapFields>(c: T, venueName: string, venueAddress: string): T {
  if (c.googleMapsUrl || c.yandexMapsUrl || !c.mapConfirmed) return c;
  const u = approxMapUrls(venueName, venueAddress);
  return u ? { ...c, googleMapsUrl: u.google, yandexMapsUrl: u.yandex } : c;
}

/** Havola ham, tasdiq ham yo'q — buyurtma qabul qilinmaydi. */
export function mapsMissing(c: MapFields): boolean {
  return !c.googleMapsUrl && !c.yandexMapsUrl && !c.mapConfirmed;
}
