/* eslint-disable @next/next/no-img-element -- next/og (ImageResponse) faqat oddiy <img> ni tushunadi */
import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import type { InvitationLang } from "./customization";

/**
 * Luxury: ulashish uchun tayyor rasmlar — Instagram story (1080×1920) va
 * bosma QR postkart (1800×1200 ≈ 6×4 dyuym, 300 dpi). Shablon ranglarida.
 */
export type ShareData = {
  groom: string;
  bride: string;
  kicker: string;
  dateLabel: string;
  timeLabel: string;
  venueName: string;
  url: string;
  colors: { paper: string; gold: string; ink: string };
  lang: InvitationLang;
};

const SCAN: Record<InvitationLang, string> = {
  uz: "Taklifnomani ochish uchun skanerlang",
  "uz-cyrl": "Таклифномани очиш учун сканерланг",
  ru: "Отсканируйте, чтобы открыть приглашение",
  en: "Scan to open the invitation",
};
const INVITED: Record<InvitationLang, string> = {
  uz: "Sizni taklif qilamiz",
  "uz-cyrl": "Сизни таклиф қиламиз",
  ru: "Приглашаем вас",
  en: "You are invited",
};

// Shriftlar bir marta yuklanib, funksiya instansiyasida saqlanadi
const fontCache = new Map<string, Promise<ArrayBuffer>>();
function googleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const key = `${family}:${weight}`;
  if (!fontCache.has(key)) {
    fontCache.set(
      key,
      (async () => {
        // Brauzer User-Agent'isiz so'rovga Google TTF qaytaradi (Satori woff2'ni o'qimaydi)
        const css = await (
          await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`)
        ).text();
        const src = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
        if (!src) throw new Error(`Shrift topilmadi: ${family}`);
        return (await fetch(src)).arrayBuffer();
      })()
    );
  }
  return fontCache.get(key)!;
}

async function fonts() {
  const [script, serif] = await Promise.all([googleFont("Great Vibes", 400), googleFont("Cormorant Garamond", 600)]);
  return [
    { name: "Script", data: script, weight: 400 as const, style: "normal" as const },
    { name: "Serif", data: serif, weight: 600 as const, style: "normal" as const },
  ];
}

async function qr(url: string, ink: string): Promise<string> {
  return QRCode.toDataURL(url, { margin: 1, width: 720, color: { dark: ink, light: "#ffffff" } });
}

function Names({ d, size }: { d: ShareData; size: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: d.colors.gold, fontFamily: "Script", lineHeight: 1.05 }}>
      <div style={{ fontSize: size }}>{d.groom}</div>
      {d.bride && <div style={{ fontSize: size * 0.45, opacity: 0.8 }}>&amp;</div>}
      {d.bride && <div style={{ fontSize: size }}>{d.bride}</div>}
    </div>
  );
}

export async function storyImage(d: ShareData): Promise<ImageResponse> {
  const code = await qr(d.url, d.colors.ink);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: d.colors.paper, padding: 60, fontFamily: "Serif" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: `3px solid ${d.colors.gold}`,
            borderRadius: 36,
            padding: 70,
            color: d.colors.ink,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 34, letterSpacing: 10, textTransform: "uppercase", color: d.colors.gold }}>{d.kicker || INVITED[d.lang]}</div>
          <div style={{ width: 220, height: 2, background: d.colors.gold, margin: "36px 0 50px", opacity: 0.6 }} />
          <Names d={d} size={170} />
          <div style={{ fontSize: 60, marginTop: 60, letterSpacing: 6 }}>{`${d.dateLabel}  ·  ${d.timeLabel}`}</div>
          <div style={{ fontSize: 44, marginTop: 24, opacity: 0.8, maxWidth: 800 }}>{d.venueName}</div>
          <div style={{ display: "flex", marginTop: 90, padding: 22, background: "#ffffff", borderRadius: 24 }}>
            <img src={code} width={300} height={300} alt="" />
          </div>
          <div style={{ fontSize: 30, marginTop: 26, opacity: 0.75 }}>{SCAN[d.lang]}</div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920, fonts: await fonts() }
  );
}

export async function postcardImage(d: ShareData): Promise<ImageResponse> {
  const code = await qr(d.url, d.colors.ink);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: d.colors.paper, padding: 56, fontFamily: "Serif" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            border: `3px solid ${d.colors.gold}`,
            borderRadius: 28,
            padding: "60px 80px",
            color: d.colors.ink,
          }}
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: 32, letterSpacing: 9, textTransform: "uppercase", color: d.colors.gold }}>{d.kicker || INVITED[d.lang]}</div>
            <div style={{ width: 200, height: 2, background: d.colors.gold, margin: "30px 0 36px", opacity: 0.6 }} />
            <Names d={d} size={150} />
            <div style={{ fontSize: 54, marginTop: 44, letterSpacing: 5 }}>{`${d.dateLabel}  ·  ${d.timeLabel}`}</div>
            <div style={{ fontSize: 38, marginTop: 18, opacity: 0.8, maxWidth: 820 }}>{d.venueName}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: 60 }}>
            <div style={{ display: "flex", padding: 24, background: "#ffffff", borderRadius: 24 }}>
              <img src={code} width={440} height={440} alt="" />
            </div>
            <div style={{ fontSize: 28, marginTop: 22, maxWidth: 470, textAlign: "center", opacity: 0.8 }}>{SCAN[d.lang]}</div>
          </div>
        </div>
      </div>
    ),
    { width: 1800, height: 1200, fonts: await fonts() }
  );
}
