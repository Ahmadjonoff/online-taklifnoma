/**
 * `config.scene3d` turlari va standart qiymatlar — three.js'siz.
 *
 * NEGA ALOHIDA FAYL: `CinematicOpening` (asosiy bundle) shu qiymatlarni
 * o'qiydi. Ular avval `kit.ts` da edi, `kit.ts` esa `three` ni import qiladi —
 * natijada butun three.js (≈ 120 KB gzip) dinamik chunk o'rniga asosiy JS ga
 * tushib, poster ham, React ham kechikib chiqardi. Bu faylga `three` yoki
 * three'ga bog'liq modulni import qilmang.
 */

export type HeroKind = 'mehrab' | 'arch' | 'medallion' | 'card' | 'giftbox' | 'envelope' | 'gate' | 'curtain'

export type Scene3D = {
  /** Markaziy obyekt */
  hero: HeroKind
  /** night — qorong'i zal, sham va fonar nuri; day — yorug', havodor */
  mood: 'night' | 'day'
  lanterns?: boolean
  candles?: boolean
  flowers?: 'hydrangea' | 'rose' | 'none'
  /** Osmonda hilol va yulduzlar */
  moon?: boolean
  /** Orqada gullardan yasalgan arka */
  floralArch?: boolean
  /** Orqada butun fonni qoplaydigan gul devori (to'y fotozonasidagi kabi) */
  flowerWall?: boolean
  /** Pol o'rniga atlas mato */
  drape?: boolean
  /** Oldinda marvarid shodalari */
  pearls?: boolean
  /** Medalyondagi arabcha yozuv (masalan, Bismillah) */
  arabic?: string
  /** Kartadagi sarlavha («Save the Date») */
  headline?: string
}

export const DEFAULT_SCENE: Scene3D = {
  hero: 'mehrab',
  mood: 'night',
  lanterns: true,
  candles: true,
  flowers: 'hydrangea',
}
