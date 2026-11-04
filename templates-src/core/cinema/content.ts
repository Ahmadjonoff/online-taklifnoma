import { config } from '@config'
import { DEFAULT_SCENE, type Scene3D } from './kit'
import type { Palette, PlaqueText } from './textures'

/** Shablonning sahna sozlamasi (`config.scene3d`) standart qiymatlar ustiga. */
export function sceneConfig(): Scene3D {
  const own = (config as { scene3d?: Partial<Scene3D> }).scene3d
  return { ...DEFAULT_SCENE, ...own }
}

/**
 * CSS o'zgaruvchini aniq hex rangga aylantiradi.
 *
 * NEGA ODDIY getPropertyValue EMAS: mijoz o'z rangini tanlasa, server ba'zi
 * o'zgaruvchilarga `color-mix(in oklab, …, var(--color-ink))` yozadi
 * (src/lib/palettes.ts). getPropertyValue uni hisoblamasdan qaytaradi —
 * three.js esa bunday satrni tushunmaydi. Shuning uchun rang brauzerning
 * o'zida hisoblanadi: element rangiga qo'yiladi, 1×1 canvas'ga chiziladi va
 * piksel o'qiladi.
 */
function makeResolver() {
  const probe = document.createElement('span')
  probe.style.display = 'none'
  document.body.appendChild(probe)
  const c = document.createElement('canvas')
  c.width = c.height = 1
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return {
    get(names: string[], fallback: string) {
      const chain = names.reduceRight((acc, n) => `var(${n}, ${acc})`, fallback)
      probe.style.color = ''
      probe.style.color = chain
      const computed = getComputedStyle(probe).color || fallback
      ctx.clearRect(0, 0, 1, 1)
      ctx.fillStyle = fallback
      ctx.fillStyle = computed
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    },
    done() {
      probe.remove()
    },
  }
}

/**
 * Palitra CSS o'zgaruvchilardan o'qiladi — mijoz buyurtmada tanlagan ranglar
 * (`/e/<slug>` sahifasi :root ga yozadi) 3D sahnaga ham avtomatik tushadi.
 *
 * `--tpl-scene-*` va `--tpl-glass` — faqat 3D sahna uchun. Mijoz fon rangini
 * o'zgartirsa server `--tpl-grad-*` ni qayta yozadi; sahna foni esa shablon
 * dizaynidagidek qolishi kerak (masalan, oq kontentli shablonda qorong'i zal).
 */
export function readPalette(scene: Scene3D): Palette {
  const day = scene.mood === 'day'
  const r = makeResolver()
  try {
    return {
      gold: r.get(['--color-gold'], '#d9b56c'),
      goldLight: r.get(['--color-gold-light'], '#f6e2b0'),
      goldDark: r.get(['--color-gold-dark'], '#9a7438'),
      bg: r.get(['--tpl-scene-a', '--tpl-grad-a'], day ? '#f7ece6' : '#120a22'),
      bg2: r.get(['--tpl-scene-b', '--tpl-grad-b'], day ? '#fff8f3' : '#2c1a4a'),
      glass: r.get(['--tpl-glass', '--color-blush'], '#9d7fd6'),
      petalA: r.get(['--tpl-petal-a'], '#a98be3'),
      petalB: r.get(['--tpl-petal-b'], '#e9d8ff'),
      wine: r.get(['--color-wine'], '#6b1f2e'),
      satin: r.get(['--tpl-satin'], day ? '#fbf3ea' : '#efe3d0'),
    }
  } finally {
    r.done()
  }
}

/** "21.11.2026" → "21 · 11 · 2026" */
function prettyDate(label: string) {
  const parts = label.split(/[./-]/).filter(Boolean)
  return parts.length === 3 ? parts.join(' · ') : label
}

export function plaqueText(): PlaqueText {
  const { couple, event } = config as unknown as {
    couple: { groom: string; bride: string }
    event: { kicker?: string; dateLabel: string; timeLabel: string }
  }
  return {
    kicker: event.kicker || '',
    groom: couple.groom,
    bride: couple.bride,
    date: prettyDate(event.dateLabel),
    time: event.timeLabel,
  }
}

/** Canvas'ga chizishdan oldin shriftlar yuklangan bo'lishi shart. */
export async function loadFonts(text: PlaqueText, scene: Scene3D) {
  if (!document.fonts?.load) return
  const sample = `${text.groom}${text.bride}&${scene.headline ?? ''}`
  const jobs = [
    document.fonts.load(`150px 'Taklif Script'`, sample),
    document.fonts.load(`600 34px 'Playfair Display'`, `${text.kicker}SAVEDATE`),
    document.fonts.load(`600 58px 'Cormorant Garamond'`, text.date || '0'),
  ]
  if (scene.arabic) jobs.push(document.fonts.load(`120px 'Amiri'`, scene.arabic))
  // Shrift kelmasa ham sahna kutib qolmasin
  await Promise.race([Promise.all(jobs), new Promise((r) => setTimeout(r, 2500))])
}
