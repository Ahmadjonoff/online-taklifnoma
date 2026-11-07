#!/usr/bin/env node
/**
 * Katalog va bosh sahifa uchun shablon rasmlari (thumbnail).
 *
 * NEGA: avval har bir katalog kartasi jonli iframe edi — har biri to'liq
 * React shablonni (JS, shrift, CSS) yuklab ishga tushirardi. 20+ karta
 * telefonni sezilarli sekinlashtirardi. Endi kartalar oddiy rasm, jonli
 * preview faqat shablon sahifasida.
 *
 * Ishlatish (shablon dizayni o'zgarganda qayta ishga tushiring):
 *   npm run templates:build        # public/t/ tayyor bo'lsin
 *   npm run build && npm start     # yoki: npm run dev
 *   npm run thumbs                 # BASE_URL=http://localhost:3000 (standart)
 *
 * Natija: public/thumbs/<theme>.jpg (karta), public/thumbs/<theme>-phone.jpg
 * (telefon ramkasi) va src/lib/thumbs.json (qaysi shablonlarning rasmi bor).
 * Rasmi yo'q shablon uchun sayt avvalgidek jonli iframe ko'rsatadi.
 *
 * Qo'shimcha sozlamalar:
 *   ONLY=slug1,slug2      — faqat shu shablonlar (thumbs.json'dagi qolganlari saqlanadi)
 *   CHROMIUM_PATH=...     — brauzer fayli (masalan, o'rnatilgan Google Chrome)
 *   CHROMIUM_ARGS="..."   — 3D shablonlar uchun GPU kerak, masalan macOS'da
 *                           "--use-angle=metal --ignore-gpu-blocklist"
 *
 * 3D shablonlar (config'da `scene3d`) uchun ochilish sahnasi suratga olinadi:
 * three.js sahnasi tayyor bo'lib «Ochish uchun bosing» chiqquncha kutiladi.
 * Rasmsiz 3D karta katalogda to'liq WebGL sahnani iframe'da ishga tushirardi.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = path.join(ROOT, "public", "thumbs");

const readPlan = (f) => {
  const p = path.join(ROOT, "scripts", f);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")).templates ?? [] : [];
};
// Katalogdagi shablonlar (seed shu rejalardan o'qiydi); theme = slug
const only = process.env.ONLY ? new Set(process.env.ONLY.split(",").map((s) => s.trim())) : null;
const themes = [...readPlan("templates-plan.json"), ...readPlan("templates-plan-taklif.json")]
  .map((t) => t.slug)
  .filter((slug) => !only || only.has(slug))
  .filter((slug) => fs.existsSync(path.join(ROOT, "public", "t", slug, "index.html")));

const is3d = (slug) => {
  const f = path.join(ROOT, "templates-src", slug, "src", "config-default.ts");
  return fs.existsSync(f) && /\bscene3d\s*:/.test(fs.readFileSync(f, "utf8"));
};

// Karta: iframe 238% kenglik × 640px, 0.42 masshtab (TemplateCard bilan bir xil)
const SHOTS = [
  { suffix: "", query: "thumb=1&static=1", viewport: { width: 714, height: 640 }, scale: 1, quality: 78 },
  { suffix: "-phone", query: "static=1", viewport: { width: 320, height: 600 }, scale: 2, quality: 74 },
];

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  args: (process.env.CHROMIUM_ARGS ?? "").split(/\s+/).filter(Boolean),
});
const done = [];
for (const theme of themes) {
  for (const s of SHOTS) {
    const page = await browser.newPage({ viewport: s.viewport, deviceScaleFactor: s.scale });
    await page.goto(`${BASE_URL}/preview/${theme}?${s.query}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    if (is3d(theme)) {
      // 3D sahna: kamera kirish harakati tugab, sahna «tinch» turgan payt
      await page.waitForFunction(
        () =>
          [...document.querySelectorAll("p")].some(
            (p) => p.textContent?.includes("Ochish uchun") && Number(getComputedStyle(p.parentElement).opacity) > 0.9
          ),
        null,
        { timeout: 45000 }
      );
      await page.waitForTimeout(2600);
    } else {
      // Kirish animatsiyalari tugashini kutamiz
      await page.waitForTimeout(1800);
    }
    await page.screenshot({ path: path.join(OUT, `${theme}${s.suffix}.jpg`), type: "jpeg", quality: s.quality });
    await page.close();
  }
  done.push(theme);
  console.log(`✓ ${theme}`);
}
await browser.close();

const listFile = path.join(ROOT, "src", "lib", "thumbs.json");
const kept = only && fs.existsSync(listFile) ? JSON.parse(fs.readFileSync(listFile, "utf8")) : [];
const all = [...new Set([...kept, ...done])].sort();
fs.writeFileSync(listFile, JSON.stringify(all, null, 2) + "\n");
console.log(`\n${done.length} ta shablon rasmi tayyor → public/thumbs/`);
