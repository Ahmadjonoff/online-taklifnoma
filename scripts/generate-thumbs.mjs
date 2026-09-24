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
const themes = [...readPlan("templates-plan.json"), ...readPlan("templates-plan-taklif.json")]
  .map((t) => t.slug)
  .filter((slug) => fs.existsSync(path.join(ROOT, "public", "t", slug, "index.html")));

// Karta: iframe 238% kenglik × 640px, 0.42 masshtab (TemplateCard bilan bir xil)
const SHOTS = [
  { suffix: "", query: "thumb=1&static=1", viewport: { width: 714, height: 640 }, scale: 1, quality: 78 },
  { suffix: "-phone", query: "static=1", viewport: { width: 320, height: 600 }, scale: 2, quality: 74 },
];

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
);
const done = [];
for (const theme of themes) {
  for (const s of SHOTS) {
    const page = await browser.newPage({ viewport: s.viewport, deviceScaleFactor: s.scale });
    await page.goto(`${BASE_URL}/preview/${theme}?${s.query}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Kirish animatsiyalari tugashini kutamiz
    await page.waitForTimeout(1800);
    await page.screenshot({ path: path.join(OUT, `${theme}${s.suffix}.jpg`), type: "jpeg", quality: s.quality });
    await page.close();
  }
  done.push(theme);
  console.log(`✓ ${theme}`);
}
await browser.close();

fs.writeFileSync(path.join(ROOT, "src", "lib", "thumbs.json"), JSON.stringify(done.sort(), null, 2) + "\n");
console.log(`\n${done.length} ta shablon rasmi tayyor → public/thumbs/`);
