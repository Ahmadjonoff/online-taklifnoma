#!/usr/bin/env node
/**
 * templates-plan.json asosida shablonlarni generatsiya qiladi.
 * Har bir shablon = baza dizayn (App.tsx, komponentlar) + o'z palitrasi
 * (index.css @theme) + o'z kicker/timeline/notes (config-default.ts).
 *
 * Ishlatish: node scripts/generate-templates.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "templates-src");
const plan = JSON.parse(
  fs.readFileSync(path.join(__dirname, "templates-plan.json"), "utf8")
);

// ============================================================
// PREMIUM PALITRALAR — har biri professional dizayn darajasida
// ============================================================
const PALETTES = {
  "royal-gold": {
    paper: "#1a1612", paper2: "#221d17", paper3: "#2b241b",
    gold: "#d4a843", goldLight: "#ecd28a", goldDark: "#8a6d1f",
    ink: "#f0e8d5", inkSoft: "#c9bda0",
    wine: "#b8860b", wineDark: "#8a6d1f",
    grain: "rgba(255,215,130,0.05)", shimmer: "rgba(212,168,67,0.18)",
  },
  "ivory-pearl": {
    paper: "#faf7f0", paper2: "#f3eee2", paper3: "#eae3d1",
    gold: "#b09a5e", goldLight: "#d6c695", goldDark: "#7d6a3c",
    ink: "#3d3729", inkSoft: "#6b6250",
    wine: "#9c7c2c", wineDark: "#7d6a3c",
    grain: "rgba(120,100,60,0.04)", shimmer: "rgba(176,154,94,0.14)",
  },
  "rose-garden": {
    paper: "#fdf4f4", paper2: "#f9e9ea", paper3: "#f2dcde",
    gold: "#c48b8f", goldLight: "#e2b7ba", goldDark: "#8f565a",
    ink: "#4a2c2e", inkSoft: "#7d5558",
    wine: "#a9545e", wineDark: "#8f565a",
    grain: "rgba(160,90,95,0.04)", shimmer: "rgba(196,139,143,0.16)",
  },
  "emerald-night": {
    paper: "#0f1f17", paper2: "#15291e", paper3: "#1c3327",
    gold: "#c9a227", goldLight: "#e5c558", goldDark: "#8a7015",
    ink: "#e8efe6", inkSoft: "#a8bfae",
    wine: "#2e8b57", wineDark: "#1f6b40",
    grain: "rgba(200,255,220,0.03)", shimmer: "rgba(201,162,39,0.15)",
  },
  "burgundy-luxe": {
    paper: "#2a1215", paper2: "#351919", paper3: "#412021",
    gold: "#d4a843", goldLight: "#ecd28a", goldDark: "#9a7524",
    ink: "#f5e6dc", inkSoft: "#cfb2a3",
    wine: "#a03030", wineDark: "#7d2020",
    grain: "rgba(255,220,180,0.04)", shimmer: "rgba(212,168,67,0.16)",
  },
  "sage-mist": {
    paper: "#f4f6f1", paper2: "#eaeee5", paper3: "#dfe5d8",
    gold: "#8a9a5b", goldLight: "#b3c187", goldDark: "#5d6c3a",
    ink: "#33392c", inkSoft: "#5c6550",
    wine: "#6b7c4a", wineDark: "#556339",
    grain: "rgba(100,120,70,0.04)", shimmer: "rgba(138,154,91,0.15)",
  },
  "sunset-amber": {
    paper: "#fdf6ec", paper2: "#f9ecd8", paper3: "#f2dfc2",
    gold: "#d98324", goldLight: "#f0ad6a", goldDark: "#9c5c14",
    ink: "#4a2f18", inkSoft: "#7c583a",
    wine: "#c05c2c", wineDark: "#96431c",
    grain: "rgba(180,100,40,0.04)", shimmer: "rgba(217,131,36,0.16)",
  },
  "sapphire-noir": {
    paper: "#0e1420", paper2: "#131b2a", paper3: "#19233a",
    gold: "#a8b8d8", goldLight: "#ccd8ec", goldDark: "#6d80a8",
    ink: "#eef2fa", inkSoft: "#b8c4dc",
    wine: "#5a7bc0", wineDark: "#3d5a94",
    grain: "rgba(180,200,255,0.04)", shimmer: "rgba(168,184,216,0.16)",
  },
  "night-sky": {
    paper: "#12121f", paper2: "#181828", paper3: "#202033",
    gold: "#f0c75e", goldLight: "#f8dd91", goldDark: "#b8953a",
    ink: "#eef0fa", inkSoft: "#b8bcd4",
    wine: "#7a6ff0", wineDark: "#5a50c8",
    grain: "rgba(240,220,140,0.04)", shimmer: "rgba(240,199,94,0.17)",
  },
  "candy-cloud": {
    paper: "#fdf6fa", paper2: "#f9ecf5", paper3: "#f3e0ee",
    gold: "#c77dbb", goldLight: "#e3a8d8", goldDark: "#94528a",
    ink: "#452a40", inkSoft: "#755170",
    wine: "#a05a94", wineDark: "#7d4273",
    grain: "rgba(180,100,160,0.04)", shimmer: "rgba(199,125,187,0.15)",
  },
  "spring-meadow": {
    paper: "#f6faf2", paper2: "#ecf4e3", paper3: "#dfedd1",
    gold: "#d4a843", goldLight: "#ecd28a", goldDark: "#8a6d1f",
    ink: "#2e3b26", inkSoft: "#56654a",
    wine: "#5a8a3c", wineDark: "#43682c",
    grain: "rgba(110,150,70,0.04)", shimmer: "rgba(212,168,67,0.15)",
  },
  "mocha-cream": {
    paper: "#f7f1ea", paper2: "#efe6db", paper3: "#e4d7c8",
    gold: "#a07850", goldLight: "#c9a578", goldDark: "#6d4f30",
    ink: "#3a2d22", inkSoft: "#68553f",
    wine: "#8a5c34", wineDark: "#6d4626",
    grain: "rgba(120,90,60,0.04)", shimmer: "rgba(160,120,80,0.15)",
  },
};

// ============================================================
// TIPOGRAFIYA kombinatsiyalari
// ============================================================
const TYPOS = {
  classic: {
    script: "'Taklif Script', cursive",
    display: "'Playfair Display', Georgia, serif",
    body: "'Cormorant Garamond', Georgia, serif",
  },
  script: {
    script: "'Taklif Script', cursive",
    display: "'Taklif Script', cursive",
    body: "'Cormorant Garamond', Georgia, serif",
  },
  minimal: {
    script: "'Cormorant Garamond', Georgia, serif",
    display: "'Playfair Display', Georgia, serif",
    body: "'Playfair Display', Georgia, serif",
  },
};

// Premium timeline bo'limlari (har tur uchun moslashadi)
function defaultTimeline(eventType) {
  const T = {
    toy: [
      { time: "18:00", label: "Mehmonlar kutib olish" },
      { time: "18:30", label: "Otam-qarashdosh marosimi" },
      { time: "19:00", label: "To'y boshlanishi" },
      { time: "21:00", label: "Dasturxon" },
      { time: "23:00", label: "Yakuniy raqs" },
    ],
    "nikoh-toyi": [
      { time: "17:00", label: "Mehmonlar kutib olish" },
      { time: "17:30", label: "Nikoh o'qilishi" },
      { time: "18:30", label: "Dasturxon" },
      { time: "21:00", label: "Tabriklar" },
    ],
    "fotiha-toyi": [
      { time: "17:00", label: "Mehmonlar kutib olish" },
      { time: "17:30", label: "Fotiha o'qilishi" },
      { time: "18:30", label: "Dasturxon" },
      { time: "20:00", label: "Duolar" },
    ],
    "sunnat-toyi": [
      { time: "16:00", label: "Mehmonlar kutib olish" },
      { time: "17:00", label: "Marosim boshlanishi" },
      { time: "18:00", label: "Dasturxon" },
      { time: "20:00", label: "O'yin-kulgu" },
    ],
    "beshik-toyi": [
      { time: "15:00", label: "Mehmonlar kutib olish" },
      { time: "16:00", label: "Beshik bezatilishi" },
      { time: "17:00", label: "Dasturxon" },
    ],
    "tugilgan-kun": [
      { time: "16:00", label: "Mehmonlar kelishi" },
      { time: "17:00", label: "Tort va sharlar" },
      { time: "18:00", label: "O'yinlar" },
      { time: "20:00", label: "Tabriklar" },
    ],
    yubiley: [
      { time: "18:00", label: "Mehmonlar kutib olish" },
      { time: "19:00", label: "Tabriklar" },
      { time: "20:00", label: "Dasturxon" },
      { time: "22:00", label: "Konsert" },
    ],
    bayramlar: [
      { time: "11:00", label: "Bayram boshlanishi" },
      { time: "13:00", label: "Milliy taomlar" },
      { time: "16:00", label: "Concert va o'yinlar" },
    ],
    biznes: [
      { time: "09:00", label: "Ro'yxatdan o'tish" },
      { time: "10:00", label: "Kongress ochilishi" },
      { time: "12:00", label: "Panel muhokamasi" },
      { time: "14:00", label: "Tannaraf va networking" },
    ],
    oilaviy: [
      { time: "12:00", label: "Yig'ilish" },
      { time: "13:00", label: "Dasturxon" },
      { time: "16:00", label: "Suhbat va esdaliklar" },
    ],
  };
  return T[eventType] ?? T.toy;
}

function defaultNotes(eventType) {
  const N = {
    toy: [
      { title: "Kiyinish uslubi", text: "Zamonaviy yoki milliy liboslar" },
      { title: "Sovg'a haqida", text: "Ezgu duolaringiz eng qimmatli sovg'a" },
    ],
    "nikoh-toyi": [
      { title: "Marosim haqida", text: "Nikoh o'qilishi 17:30 da boshlanadi" },
    ],
    "fotiha-toyi": [
      { title: "Eslatma", text: "Marosimdan so'ng dasturxon ochiladi" },
    ],
    "sunnat-toyi": [
      { title: "Bolalar uchun", text: "O'yinlar va shirinliklar mavjud" },
    ],
    "beshik-toyi": [
      { title: "An'ana", text: "Beshikni opa-singillar bezatadi" },
    ],
    "tugilgan-kun": [
      { title: "Joy haqida", text: "Bolalar uchun o'yin maydonchasi bor" },
    ],
    yubiley: [
      { title: "Faxrli mehmonlar", text: "Tabrik so'zlari uchun mikrofon bor" },
    ],
    bayramlar: [{ title: "Bayram dasturi", text: "Hamma uchun ochiq" }],
    biznes: [
      { title: "Ishtirok", text: "Ro'yxatdan o'tish shart" },
      { title: "Til", text: "Ma'ruzalar o'zbek va rus tillarida" },
    ],
    oilaviy: [{ title: "Kutamiz", text: "Oilangiz bilan keling" }],
  };
  return N[eventType] ?? N.toy;
}

// ============================================================
// GENERATSIA
// ============================================================
let created = 0;
let skipped = 0;

for (const t of plan.templates) {
  const baseDir = path.join(SRC, t.base);
  const destDir = path.join(SRC, t.slug);

  if (!fs.existsSync(path.join(baseDir, "src", "App.tsx"))) {
    console.warn(`⚠  Baza topilmadi: ${t.base} (${t.slug}) — o'tkazib yuborildi`);
    skipped++;
    continue;
  }

  // 1. Baza fayllarini nusxalash (agar yangi bo'lsa)
  if (!fs.existsSync(destDir)) {
    fs.cpSync(baseDir, destDir, { recursive: true });
  }

  // 2. index.css — palitra + tipografiya bilan yangilash
  const pal = PALETTES[t.palette];
  const typo = TYPOS[t.typo];
  if (!pal) throw new Error(`Palitra topilmadi: ${t.palette}`);

  const css = `@import 'tailwindcss';

/* Umumiy core/ moduli: Tailwind avtomatik skaneri faqat shablon papkasini
   ko'radi, shu sababli umumiy komponentlardagi sinflar (grid, flex, bg-paper-2,
   py-20 ...) generatsiya qilinmay qolardi — natijada bo'limlar buzuq chiqardi. */
@source '../../core';

@import '../../core/fonts.css';

@theme {
  --color-paper: ${pal.paper};
  --color-paper-2: ${pal.paper2};
  --color-paper-3: ${pal.paper3};

  --color-gold: ${pal.gold};
  --color-gold-light: ${pal.goldLight};
  --color-gold-dark: ${pal.goldDark};

  --color-ink: ${pal.ink};
  --color-ink-soft: ${pal.inkSoft};

  --color-wine: ${pal.wine};
  --color-wine-dark: ${pal.wineDark};

  --color-sage: ${pal.goldDark};
  --color-blush: ${pal.paper3};

  --font-script: ${typo.script};
  --font-display: ${typo.display};
  --font-body: ${typo.body};
  --font-arabic: 'Amiri', 'Times New Roman', serif;

  --animate-fall: fall linear infinite;
  --animate-shimmer: shimmer 6s ease-in-out infinite;
  --animate-pulse-soft: pulse-soft 2.6s ease-in-out infinite;
  --animate-float: float 5s ease-in-out infinite;
}

/* Palitra: ${t.palette} · Tipografiya: ${t.typo} · Baza: ${t.base} */

@keyframes fall {
  0% { transform: translate3d(0, -10vh, 0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.85; }
  90% { opacity: 0.85; }
  100% { transform: translate3d(var(--drift, 40px), 110vh, 0) rotate(var(--spin, 360deg)); opacity: 0; }
}

@keyframes shimmer {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.7; }
}

@keyframes pulse-soft {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.045); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.paper-grain { position: relative; }
.paper-grain::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(ellipse at top, ${pal.grain}, transparent 60%);
  mix-blend-mode: overlay;
}

.text-gilded {
  background: linear-gradient(100deg, var(--color-gold-dark) 0%, var(--color-gold-light) 42%, var(--color-gold) 62%, var(--color-gold-dark) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.tracking-wider-caps { letter-spacing: 0.28em; text-transform: uppercase; }

.reveal {
  opacity: 0; transform: translateY(28px);
  transition: opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}
.reveal.is-visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { opacity: 1; transform: none; transition: none; }
  *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
}

@keyframes reveal-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}
`;

  fs.writeFileSync(path.join(destDir, "src", "index.css"), css);

  // 3. config-default.ts — kicker, timeline, notes, shimmer ranglari
  const cfgPath = path.join(destDir, "src", "config-default.ts");
  if (fs.existsSync(cfgPath)) {
    let cfg = fs.readFileSync(cfgPath, "utf8");
    // kicker yangilash
    cfg = cfg.replace(/kicker: '[^']*'/, `kicker: '${t.kicker}'`);
    // timeline items yangilash
    const tl = JSON.stringify(defaultTimeline(t.eventType), null, 6)
      .replace(/\[/, "[")
      .split("\n")
      .join("\n    ");
    cfg = cfg.replace(
      /items:\s*\[[\s\S]*?\n\s*\]/,
      `items: [\n      ${tl.slice(1, -1)}\n    ]`
    );
    // notes yangilash
    const nt = JSON.stringify(defaultNotes(t.eventType), null, 6);
    const notesRe = new RegExp("notes:\\s*\\[[\\s\\S]*?\\n\\s*\\],\\r?\\n");
    cfg = cfg.replace(notesRe, `notes: ${nt.replace(/\n/g, "\n  ")},\n`);
    // config export nomini saqlash
    fs.writeFileSync(cfgPath, cfg);
  }

  // 4. index.html yaratish (agar yo'q bo'lsa)
  const htmlPath = path.join(destDir, "index.html");
  if (!fs.existsSync(htmlPath)) {
    fs.writeFileSync(
      htmlPath,
      `<!doctype html>
<html lang="uz">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./src/main.tsx"></script>
  </body>
</html>
`
    );
  }

  created++;
  console.log(`✓ ${t.slug} (${t.base} ← ${t.palette}/${t.typo})`);
}

console.log(`\nTayyor: ${created} yaratildi, ${skipped} o'tkazildi.`);
