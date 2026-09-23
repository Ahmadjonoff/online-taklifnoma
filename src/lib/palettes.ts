import data from "./templatePalettes.json";

/**
 * Shablon rang palitralari.
 *
 * Har bir dizayn (theme) uchun shu dizaynda sinalgan palitralar — avval
 * alohida shablon bo'lib turgan "faqat rangi boshqa" variantlardan
 * yig'ilgan. Birinchisi — shablonning o'z (standart) palitrasi.
 *
 * Shablonlar Tailwind v4 `@theme` o'zgaruvchilarini (`--color-*`,
 * `--tpl-*`) ishlatadi, shuning uchun palitrani almashtirish uchun `:root`
 * ga yangi qiymatlarni berish kifoya — qayta build shart emas.
 */
export type Palette = { id: string; name: string; vars: Record<string, string> };

const PALETTES = data as Record<string, Palette[]>;

export function getPalettes(theme: string): Palette[] {
  return PALETTES[theme] ?? [];
}

export function findPalette(theme: string, id: string): Palette | null {
  return getPalettes(theme).find((p) => p.id === id) ?? null;
}

/** Tanlov tugmasi uchun 3 ta asosiy rang: fon, urg'u, ikkinchi urg'u. */
export function paletteSwatch(p: Palette): string[] {
  const v = p.vars;
  return [v["--color-paper"], v["--color-gold"], v["--color-wine"]].filter(Boolean);
}

/**
 * Tanlangan palitra uchun `<style>` tegi. Standart palitra (yoki noma'lum
 * id) bo'lsa — bo'sh satr. Qiymatlar faqat bizning JSON'dan olinadi, mijoz
 * kiritgan matn CSS'ga tushmaydi.
 */
export function paletteStyleTag(theme: string, id: string, accent = ""): string {
  const list = getPalettes(theme);
  const p = list.find((x) => x.id === id);
  const vars: Record<string, string> = p && p !== list[0] ? { ...p.vars } : {};

  // Mijozning o'z urg'u rangi: oltin rang o'rniga, och/to'q tuslari undan
  // hosil qilinadi. Faqat "#rrggbb" (customization.ts tekshiradi) — CSS'ga
  // boshqa narsa tushmaydi.
  if (/^#[0-9a-f]{6}$/i.test(accent)) {
    vars["--color-gold"] = accent;
    vars["--color-gold-light"] = `color-mix(in oklab, ${accent} 55%, white)`;
    vars["--color-gold-dark"] = `color-mix(in oklab, ${accent} 70%, black)`;
    vars["--tpl-accent"] = accent;
  }

  const decl = Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  return decl ? `<style id="tpl-palette">:root,:host{${decl}}</style>` : "";
}
