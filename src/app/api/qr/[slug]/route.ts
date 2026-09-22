import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Xavfsizlik
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Noto'g'ri slug" }, { status: 400 });
  }

  const url = new URL(req.url);
  const origin = url.origin;

  const png = await QRCode.toBuffer(`${origin}/e/${slug}`, {
    width: 600,
    margin: 2,
    color: { dark: "#1c1917", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
