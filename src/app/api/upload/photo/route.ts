import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { PHOTO_MAX_BYTES, PHOTO_TYPES } from "@/lib/blob";
import { clientIp, rateLimit } from "@/lib/rateLimit";

// Bitta IP uchun soatiga ko'pi bilan 40 ta surat (galereya 10 ta + hikoya + qayta urinishlar)
const UPLOAD_LIMIT = 40;
const UPLOAD_WINDOW_MS = 60 * 60_000;
// Barcha foydalanuvchilar uchun jami (soatiga). Yetim fayllarni kunlik cron
// tozalaydi: src/app/api/cron/blob-cleanup/route.ts
const GLOBAL_UPLOAD_LIMIT = 600;

/**
 * Hikoya va galereya suratlari uchun qisqa muddatli yuklash tokeni.
 * Fayl brauzerdan to'g'ridan-to'g'ri Vercel Blob'ga ketadi; cheklovlar
 * tokenga yoziladi: faqat rasm, hajmi chegaralangan, faqat `photos/`.
 */
export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadBody;

  // Token so'rovlarigina cheklanadi (Blob'ning "upload-completed" callback'i emas).
  // IP bo'yicha limitdan tashqari umumiy limit ham bor — ko'p IP'dan
  // kelgan hujum ham store'ni cheksiz to'ldira olmaydi.
  if (
    body.type === "blob.generate-client-token" &&
    (!(await rateLimit(`photo:${clientIp(req)}`, UPLOAD_LIMIT, UPLOAD_WINDOW_MS)) ||
      !(await rateLimit("photo:global", GLOBAL_UPLOAD_LIMIT, UPLOAD_WINDOW_MS)))
  ) {
    return NextResponse.json({ error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." }, { status: 429 });
  }

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!/^photos\/[\w.-]+$/.test(pathname)) throw new Error("Noto'g'ri fayl nomi");
        return {
          allowedContentTypes: PHOTO_TYPES,
          maximumSizeInBytes: PHOTO_MAX_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + 10 * 60_000,
        };
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Yuklashda xatolik" }, { status: 400 });
  }
}
