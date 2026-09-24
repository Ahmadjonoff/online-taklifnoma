/**
 * Vercel Blob'dagi mijoz fayllari (musiqa, suratlar).
 *
 * Faqat serverda chaqiriladi: store ID `BLOB_READ_WRITE_TOKEN` dan olinadi
 * (vercel_blob_rw_<storeId>_<secret>), token brauzerga chiqmaydi.
 */

/** Havola haqiqatan bizning store'dagi `prefix` papkasidanmi (masalan "/music/") */
export function isOwnBlobUrl(url: string, prefix: string): boolean {
  const storeId = process.env.BLOB_READ_WRITE_TOKEN?.split("_")[3]?.toLowerCase();
  if (!storeId) return false;
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      u.hostname === `${storeId}.public.blob.vercel-storage.com` &&
      u.pathname.startsWith(prefix)
    );
  } catch {
    return false;
  }
}

// Mijoz suratlari (hikoya, galereya): brauzer yuklashdan oldin kichraytiradi
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const PHOTO_MAX_BYTES = 8 * 1024 * 1024;

/** Taklifnomalarda ishlatilayotgan barcha Blob fayllar (hikoya surati, galereya, mijoz musiqasi). */
export function referencedBlobUrls(
  items: { story: { photo: string }; gallery: string[]; customMusicUrl: string }[]
): Set<string> {
  const urls = new Set<string>();
  for (const c of items) {
    if (c.story.photo) urls.add(c.story.photo);
    for (const u of c.gallery) urls.add(u);
    if (c.customMusicUrl) urls.add(c.customMusicUrl);
  }
  return urls;
}
