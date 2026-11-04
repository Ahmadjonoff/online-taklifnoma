import { config } from '../config'
import type { Palette, PlaqueText } from './textures'

/**
 * Palitra CSS o'zgaruvchilardan o'qiladi — mijoz buyurtmada tanlagan ranglar
 * (`/e/<slug>` sahifasi :root ga yozadi) 3D sahnaga ham avtomatik tushadi.
 */
export function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement)
  const v = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback
  return {
    gold: v('--color-gold', '#d9b56c'),
    goldLight: v('--color-gold-light', '#f6e2b0'),
    goldDark: v('--color-gold-dark', '#9a7438'),
    bg: v('--tpl-grad-a', '#120a22'),
    bg2: v('--tpl-grad-b', '#2c1a4a'),
    glass: v('--color-blush', '#9d7fd6'),
    petalA: v('--tpl-petal-a', '#a98be3'),
    petalB: v('--tpl-petal-b', '#e9d8ff'),
  }
}

/** "21.11.2026" → "21 · 11 · 2026" */
function prettyDate(label: string) {
  const parts = label.split(/[./-]/).filter(Boolean)
  return parts.length === 3 ? parts.join(' · ') : label
}

export function plaqueText(): PlaqueText {
  const { couple, event } = config
  return {
    kicker: event.kicker || '',
    groom: couple.groom,
    bride: couple.bride,
    date: prettyDate(event.dateLabel),
    time: event.timeLabel,
  }
}

/** Canvas'ga chizishdan oldin shriftlar yuklangan bo'lishi shart. */
export async function loadFonts(text: PlaqueText) {
  if (!document.fonts?.load) return
  const sample = `${text.groom}${text.bride}&`
  const all = Promise.all([
    document.fonts.load(`150px 'Taklif Script'`, sample),
    document.fonts.load(`600 34px 'Playfair Display'`, text.kicker || 'A'),
    document.fonts.load(`500 58px 'Cormorant Garamond'`, text.date || '0'),
  ])
  // Shrift kelmasa ham sahna kutib qolmasin
  await Promise.race([all, new Promise((r) => setTimeout(r, 2500))])
}
