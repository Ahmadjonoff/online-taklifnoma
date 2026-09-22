import fs from "node:fs";
import path from "node:path";

/** Bu route Next.js sahifasi emas (iframe uchun statik HTML) — o'zining 404'ini beradi. */
function notFoundHtml(): string {
  return `<!doctype html>
<html lang="uz"><head><meta charset="UTF-8">
<style>
  html,body{height:100%;margin:0;font-family:ui-serif,Georgia,serif;background:#faf7f2;color:#292524}
  .wrap{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px}
  h1{font-size:1.1rem;margin:0 0 6px}
  p{margin:0;font-size:0.85rem;color:#78716c;font-family:ui-sans-serif,system-ui,sans-serif}
  a{margin-top:16px;display:inline-block;padding:8px 18px;border-radius:999px;background:#1c1917;color:#fff;text-decoration:none;font-size:0.85rem;font-family:ui-sans-serif,system-ui,sans-serif}
</style></head>
<body><div class="wrap">
  <h1>Shablon topilmadi</h1>
  <p>Bu namuna mavjud emas yoki o'chirilgan.</p>
  <a href="/shablonlar">Barcha shablonlar</a>
</div></body></html>`;
}

// Demo uchun namuna ma'lumotlar
const DEMO = {
  couple: {
    groom: "Bekzod",
    bride: "Malika",
    monogram: "B&M",
  },
  event: {
    dateISO: "2026-12-31T18:00:00",
    dateLabel: "31.12.2026",
    timeLabel: "18:00",
    kicker: "Taklifnoma namunasi",
  },
  blessing: {
    lines: ["Sizni tadbirimizda ko'rishdan xursandmiz"],
    text: "Hurmat bilan, oilamiz sizni tadbirimizga taklif qiladi. Kelishingiz biz uchun katta baxt bo'ladi!",
    greeting: "Aziz mehmon!",
  },
  countdown: {
    title: "Tadbirgacha qoldi",
    finishedText: "Bugun katta kun!",
  },
  timeline: {
    title: "Dastur",
    items: [
      { time: "18:00", label: "Mehmonlar kutib olish" },
      { time: "19:00", label: "Marosim boshlanishi" },
      { time: "21:00", label: "Dasturxon" },
    ],
  },
  venue: {
    title: "Manzil",
    name: "«Charx» to'yxonasi",
    address: "Toshkent, Chilonzor",
    googleMapsUrl: "",
    yandexMapsUrl: "",
  },
  notes: [
    { title: "Kiyinish uslubi", text: "Zamonaviy yoki milliy liboslar" },
  ],
  rsvp: { enabled: true },
  wishes: { enabled: true },
  gift: { enabled: false },
  gallery: { enabled: false, photos: [] },
  petals: { enabled: true, count: 14 },
  music: { enabled: false, src: "" },
  specialOffer: { enabled: false, title: "", text: "", badge: "" },
  speakers: { enabled: false, title: "", people: [] },
  sponsors: { enabled: false, title: "", names: [] },
  dressCode: { enabled: false, title: "", text: "", colors: [] },
  bigNumber: { enabled: false, value: "", title: "", subtitle: "" },
  achievement: { enabled: false, degree: "", institution: "", text: "" },
  footer: {
    title: "Sizni kutamiz!",
    signature: "Bekzod va Malika",
  },
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ theme: string }> }
) {
  const { theme } = await params;

  // Xavfsizlik: faqat harf-raqam va tire
  if (!/^[a-z0-9-]+$/.test(theme)) {
    return new Response("Noto'g'ri so'rov", { status: 400 });
  }

  const htmlPath = path.join(process.cwd(), "public", "t", theme, "index.html");
  if (!fs.existsSync(htmlPath)) {
    return new Response(notFoundHtml(), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  let html = fs.readFileSync(htmlPath, "utf8");

  // URL'da ?cfg=... berilsa — uni ishlatamiz (buyurtma formasidagi jonli preview)
  let config = DEMO as Record<string, unknown>;
  const url = new URL(req.url);
  const cfgParam = url.searchParams.get("cfg");
  if (cfgParam) {
    try {
      config = JSON.parse(cfgParam) as Record<string, unknown>;
    } catch {
      // noto'g'ri JSON bo'lsa — demo qoladi
    }
  }

  // `config` ?cfg= query-parametridan kelishi mumkin (foydalanuvchi kiritgan
  // matnlarni o'z ichiga oladi) — `</script` ketma-ketligini escape qilmasak,
  // JSON string ichidan haqiqiy <script> tegini yopib, XSS ochib beradi.
  const inject = `<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/icon.png" type="image/png">
<script>window.__INV_CONFIG__=${JSON.stringify(config).replace(/<\/script/gi, "<\\/script")};</script>`;
  html = html.replace("<head>", `<head>${inject}`);

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
