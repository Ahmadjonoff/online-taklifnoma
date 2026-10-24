import { shareDataForSlug } from "@/lib/shareData";
import { ogImage } from "@/lib/shareImages";

export const dynamic = "force-dynamic";

/** Taklifnoma havolasi ulashilganda chiqadigan rasm (og:image) — ismlar, sana va joy */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const data = await shareDataForSlug((await params).slug, new URL(req.url).origin);
  if (!data) return new Response("Topilmadi", { status: 404 });
  const img = await ogImage(data);
  // Telegram/WhatsApp rasmni o'zi keshlaydi; bizda — 1 soat (taklifnoma tahrirlansa yangilanadi)
  img.headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
  return img;
}
