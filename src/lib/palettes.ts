import data from "./templatePalettes.json";

/**
 * Shablon rang palitralari.
 *
 * Har bir dizayn (theme) uchun shu dizaynda sinalgan palitralar — avval
 * alohida shablon bo'lib turgan "faqat rangi boshqa" variantlardan
 * yig'ilgan. Birinchisi — shablonning o'z (standart) palitrasi.
 *
 * Shablonlar Tailwind v4 `@theme` o'zgaruvchilarini (`--color-*`,
 * `--tpl-*`) ishlatadi, shuning uchun ranglarni almashtirish uchun `:root`
 * ga yangi qiymatlarni berish kifoya — qayta build shart emas.
 */
export type Palette = { id: string; name: string; vars: Record<string, string> };

/** Mijoz tanlaydigan 3 ta asosiy rang; qolgan tuslar shulardan hisoblanadi. */
export type ColorRole = "paper" | "gold" | "wine";
export type MainColors = Record<ColorRole, string>;

export const ROLE_VAR: Record<ColorRole, string> = {
  paper: "--color-paper",
  gold: "--color-gold",
  wine: "--color-wine",
};

const PALETTES = data as Record<string, Palette[]>;
const HEX = /^#[0-9a-f]{6}$/i;

// Namunalar: dizaynning o'z palitralaridagi ranglardan keyin qo'shiladi
// (bitta palitrali dizaynlarda ham tanlov bo'lishi uchun)
const EXTRA_SWATCHES: MainColors[] = [
  { paper: "#ffffff", gold: "#c9a96e", wine: "#7a1f2b" },
  { paper: "#fbf5ec", gold: "#d4af37", wine: "#5a1432" },
  { paper: "#f6ecee", gold: "#b76e79", wine: "#1b2f63" },
  { paper: "#eef3ec", gold: "#7e8c55", wine: "#2f5d50" },
  { paper: "#eaf0f7", gold: "#a8a9ad", wine: "#6b4f9e" },
  { paper: "#16120f", gold: "#2e5c8a", wine: "#b76e79" },
  { paper: "#0f1b2d", gold: "#e0c172", wine: "#9b2335" },
  { paper: "#1d2b22", gold: "#caa472", wine: "#3c6e71" },
];

export function getPalettes(theme: string): Palette[] {
  return PALETTES[theme] ?? [];
}

export function findPalette(theme: string, id: string): Palette | null {
  return getPalettes(theme).find((p) => p.id === id) ?? null;
}

function basePalette(theme: string, id: string): Palette | null {
  const list = getPalettes(theme);
  return list.find((p) => p.id === id) ?? list[0] ?? null;
}

/** Palitraning 3 ta asosiy rangi (formadagi boshlang'ich qiymatlar uchun). */
export function mainColors(p: Palette): MainColors {
  // Kichik harf: namunalar bilan solishtirish uchun (JSON'da "#FFFEFB" ham bor)
  return {
    paper: (p.vars[ROLE_VAR.paper] ?? "").toLowerCase(),
    gold: (p.vars[ROLE_VAR.gold] ?? "").toLowerCase(),
    wine: (p.vars[ROLE_VAR.wine] ?? "").toLowerCase(),
  };
}

/** Ikki rang ko'zga deyarli bir xil ko'rinadimi (RGB masofa) */
function nearlySame(a: string, b: string): boolean {
  const d = [1, 3, 5].reduce((sum, i) => {
    const x = parseInt(a.slice(i, i + 2), 16) - parseInt(b.slice(i, i + 2), 16);
    return sum + x * x;
  }, 0);
  return Math.sqrt(d) < 18;
}

/**
 * Har bir rang uchun namunalar: avval dizaynning o'z ranglari (ko'pi bilan
 * `ownMax` ta), keyin umumiy namunalar — jami `max` ta. Deyarli bir xil
 * tuslar bitta bo'lib ko'rsatiladi.
 */
export function roleSwatches(theme: string, max = 12, ownMax = 6): Record<ColorRole, string[]> {
  const out = {} as Record<ColorRole, string[]>;
  for (const role of Object.keys(ROLE_VAR) as ColorRole[]) {
    const list: string[] = [];
    const add = (c: string | undefined, limit: number) => {
      const v = (c ?? "").toLowerCase();
      if (list.length >= limit || !HEX.test(v) || list.some((x) => nearlySame(x, v))) return;
      list.push(v);
    };
    for (const p of getPalettes(theme)) add(p.vars[ROLE_VAR[role]], ownMax);
    for (const e of EXTRA_SWATCHES) add(e[role], max);
    out[role] = list;
  }
  return out;
}

/** Nisbiy yorqinlik (WCAG), 0 — qora, 1 — oq */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Tanlangan palitra va mijozning 3 ta rangi uchun `<style>` tegi.
 *
 * Faqat standart palitradan farq qiladigan qiymatlar yoziladi; hech narsa
 * o'zgarmagan bo'lsa — bo'sh satr. Mijozdan faqat "#rrggbb" qabul qilinadi
 * (customization.ts tekshiradi), boshqa narsa CSS'ga tushmaydi.
 */
export function paletteStyleTag(theme: string, paletteId: string, colors?: Partial<MainColors>): string {
  const list = getPalettes(theme);
  const base = basePalette(theme, paletteId);
  if (!base) return "";

  const vars: Record<string, string> = base !== list[0] ? { ...base.vars } : {};
  const baseVar = (k: string) => vars[k] ?? base.vars[k] ?? "";

  const paper = colors?.paper && HEX.test(colors.paper) ? colors.paper.toLowerCase() : "";
  const gold = colors?.gold && HEX.test(colors.gold) ? colors.gold.toLowerCase() : "";
  const wine = colors?.wine && HEX.test(colors.wine) ? colors.wine.toLowerCase() : "";

  if (paper && paper !== baseVar(ROLE_VAR.paper).toLowerCase()) {
    // Matn fonda o'qilishi uchun: fon to'q, matn ham to'q bo'lsa (yoki
    // aksincha) — matn rangini almashtiramiz
    const ink = baseVar("--color-ink");
    const darkPaper = luminance(paper) < 0.3;
    if (HEX.test(ink) && darkPaper === luminance(ink) < 0.3) {
      vars["--color-ink"] = darkPaper ? "#f5efe6" : "#1f1a17";
      vars["--color-ink-soft"] = darkPaper ? "#d6cabb" : "#4a413a";
    }
    const inkVar = "var(--color-ink)";
    vars["--color-paper"] = paper;
    vars["--color-paper-2"] = `color-mix(in oklab, ${paper} 94%, ${inkVar})`;
    vars["--color-paper-3"] = `color-mix(in oklab, ${paper} 86%, ${inkVar})`;
    vars["--color-blush"] = `color-mix(in oklab, ${paper} 85%, var(--color-gold))`;
    vars["--tpl-grad-a"] = paper;
    vars["--tpl-grad-b"] = `color-mix(in oklab, ${paper} 86%, ${inkVar})`;
  }

  if (gold && gold !== baseVar(ROLE_VAR.gold).toLowerCase()) {
    vars["--color-gold"] = gold;
    vars["--color-gold-light"] = `color-mix(in oklab, ${gold} 55%, white)`;
    vars["--color-gold-dark"] = `color-mix(in oklab, ${gold} 70%, black)`;
    vars["--tpl-accent"] = gold;
    vars["--tpl-petal-a"] = `color-mix(in oklab, ${gold} 60%, white)`;
  }

  if (wine && wine !== baseVar(ROLE_VAR.wine).toLowerCase()) {
    vars["--color-wine"] = wine;
    vars["--color-wine-dark"] = `color-mix(in oklab, ${wine} 75%, black)`;
  }

  const decl = Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  return decl ? `<style id="tpl-palette">:root,:host{${decl}}</style>` : "";
}

/**
 * Tayyor rasmlar (story, postkart) uchun: taklifnomaning haqiqiy fon, urg'u
 * va matn ranglari (hex). Mijoz foni tanlagan bo'lsa, matn rangi taklifnomadagi
 * kabi kontrastga qarab tanlanadi.
 */
export function resolvedColors(theme: string, paletteId: string, colors?: Partial<MainColors>) {
  const base = basePalette(theme, paletteId);
  const v = base?.vars ?? {};
  const pick = (c: string | undefined, fallback: string) => (c && HEX.test(c) ? c.toLowerCase() : fallback);
  const paper = pick(colors?.paper, pick(v["--color-paper"], "#fbf8f2"));
  const gold = pick(colors?.gold, pick(v["--color-gold"], "#b08d3c"));
  let ink = pick(v["--color-ink"], "#1f1a17");
  if ((luminance(paper) < 0.3) === (luminance(ink) < 0.3)) ink = luminance(paper) < 0.3 ? "#f5efe6" : "#1f1a17";
  return { paper, gold, ink };
}
