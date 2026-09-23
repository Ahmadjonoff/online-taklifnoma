import { shareDataFor } from "@/lib/shareData";
import { postcardImage } from "@/lib/shareImages";

export const dynamic = "force-dynamic";

/** Luxury: bosma QR postkart (1800×1200) — faqat buyurtma tokeni bilan */
export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const data = await shareDataFor((await params).token, new URL(req.url).origin);
  if (!data) return new Response("Topilmadi", { status: 404 });
  const img = await postcardImage(data);
  img.headers.set("Content-Disposition", `attachment; filename="taklifnoma-postcard.png"`);
  img.headers.set("Cache-Control", "private, no-store");
  return img;
}
