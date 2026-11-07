/**
 * Qurilma imkoniyatiga qarab 3D sahna sifatini tanlash.
 *
 * NEGA KERAK: mehmonlarning ko'pchiligi taklifnomani Telegram ichidagi
 * brauzerda, o'rta darajadagi Android telefonda ochadi. Og'ir effektlar
 * (shisha refraksiyasi, bloom) u yerda kadrlarni tushirib yuboradi —
 * «wow» o'rniga qotish chiqadi. Shuning uchun:
 *
 *   high   — bloom (nur porlashi) + to‘liq zarrachalar
 *   medium — bloom yo‘q, zarrachalar kamroq, piksel zichligi pastroq
 *   off    — WebGL yo'q yoki «kamroq harakat» tanlangan → CSS konvert
 *
 * Sahna ishga tushgach FPS o'lchanadi va kerak bo'lsa `high` → `medium`
 * ga tushiriladi (qarang: scene.ts → degrade).
 */
export type Quality = 'high' | 'medium' | 'off'

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function detectQuality(): Quality {
  // `?q=high|medium|off` — sinov va screenshot uchun qo'lda tanlash
  const forced = new URLSearchParams(location.search).get('q')
  if (forced === 'high' || forced === 'medium' || forced === 'off') return forced

  if (prefersReducedMotion() || !hasWebGL()) return 'off'

  const nav = navigator as Navigator & { deviceMemory?: number }
  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory ?? 4
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)

  // iPhone'lar GPU jihatdan kuchli, lekin deviceMemory bermaydi
  const iOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  if (iOS) return 'high'

  // Android: bloom + MSAA (HalfFloat) faqat haqiqatan kuchli telefonda.
  // 6 GB / 8 yadroli o'rta telefonlar ham bloom bilan 30 FPS dan tushib ketadi,
  // avtomatik `degrade` esa faqat ~2 soniyadan keyin ishlaydi — shu vaqtgacha
  // intro qotib ko'rinadi. Chrome deviceMemory'ni 8 dan yuqori bermaydi.
  if (mobile && (cores < 8 || memory < 8)) return 'medium'
  if (cores <= 2) return 'medium'
  return 'high'
}
