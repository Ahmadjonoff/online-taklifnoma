import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { CUSTOM_MUSIC_MAX_BYTES, CUSTOM_MUSIC_TYPES } from "@/lib/music";

// Bitta IP uchun soatiga ko'pi bilan 10 ta yuklash tokeni
const UPLOAD_LIMIT = 10;
const UPLOAD_WINDOW_MS = 60 * 60_000;
// Barcha foydalanuvchilar uchun jami (soatiga). Yetim fayllarni kunlik cron
// tozalaydi: src/app/api/cron/blob-cleanup/route.ts
const GLOBAL_UPLOAD_LIMIT = 100;

/**
 * Mijoz o'z musiqasini to'g'ridan-to'g'ri Vercel Blob'ga yuklashi uchun
 * qisqa muddatli token beradi (fayl bizning funksiya orqali o'tmaydi).
 *
 * Cheklovlar tokenning o'ziga yoziladi: faqat audio, hajmi chegaralangan,
 * faqat `music/` papkasiga — shu sababli token boshqa maqsadda ishlatilmaydi.
 */
export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadBody;

  // Token so'rovlarigina cheklanadi (Blob'ning "upload-completed" callback'i emas).
  // IP bo'yicha limitdan tashqari umumiy limit ham bor — ko'p IP'dan
  // kelgan hujum ham store'ni cheksiz to'ldira olmaydi.
  if (
    body.type === "blob.generate-client-token" &&
    (!(await rateLimit(`upload:${clientIp(req)}`, UPLOAD_LIMIT, UPLOAD_WINDOW_MS)) ||
      !(await rateLimit("upload:global", GLOBAL_UPLOAD_LIMIT, UPLOAD_WINDOW_MS)))
  ) {
    return NextResponse.json({ error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." }, { status: 429 });
  }

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!/^music\/[\w.-]+$/.test(pathname)) throw new Error("Noto'g'ri fayl nomi");
        return {
          allowedContentTypes: CUSTOM_MUSIC_TYPES,
          maximumSizeInBytes: CUSTOM_MUSIC_MAX_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + 10 * 60_000,
        };
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Yuklashda xatolik" },
      { status: 400 }
    );
  }
}
