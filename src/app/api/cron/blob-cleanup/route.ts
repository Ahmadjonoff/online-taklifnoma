import { del, list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { referencedBlobUrls } from "@/lib/blob";
import { parseStoredCustomization } from "@/lib/customization";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Yuklangandan keyin shuncha vaqt ichida buyurtma berilmasa — fayl "yetim" */
const GRACE_MS = 3 * 24 * 60 * 60_000;
const PREFIXES = ["photos/", "music/"];

/**
 * Yetim fayllarni tozalash (Vercel Cron, kuniga bir marta — vercel.json).
 *
 * NEGA KERAK: surat va musiqa buyurtma berilishidan OLDIN yuklanadi (forma
 * jonli preview'da ko'rsatadi) — shuning uchun yuklash tokeni login talab
 * qilmaydi. Mijoz formani tashlab ketsa yoki kimdir shunchaki fayl yuklasa,
 * fayl hech bir taklifnomaga bog'lanmay qoladi. Bu route hech bir
 * `Invitation.options`da ishlatilmagan eski fayllarni o'chiradi.
 *
 * Ruxsat: Vercel Cron `Authorization: Bearer $CRON_SECRET` yuboradi.
 * CRON_SECRET sozlanmagan bo'lsa route umuman ishlamaydi.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Blob sozlanmagan" }, { status: 500 });
  }

  const invitations = await prisma.invitation.findMany({ select: { options: true } });
  const used = referencedBlobUrls(invitations.map((i) => parseStoredCustomization(i.options)));

  const cutoff = Date.now() - GRACE_MS;
  const orphans: string[] = [];
  for (const prefix of PREFIXES) {
    let cursor: string | undefined;
    do {
      const page = await list({ prefix, cursor, limit: 1000 });
      for (const b of page.blobs) {
        if (new Date(b.uploadedAt).getTime() < cutoff && !used.has(b.url)) orphans.push(b.url);
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
  }

  for (let i = 0; i < orphans.length; i += 100) {
    await del(orphans.slice(i, i + 100));
  }

  console.log(`Blob tozalash: ${orphans.length} ta yetim fayl o'chirildi`);
  return NextResponse.json({ deleted: orphans.length });
}
