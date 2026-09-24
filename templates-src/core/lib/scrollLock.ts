/**
 * Sahifa scroll'ini qulflash.
 *
 * NEGA ALOHIDA FAYL: `body.is-locked` ni bir necha komponent (konvert, RSVP
 * modali) mustaqil qo'yib-olib tursa, biri ikkinchisining qulfini vaqtidan
 * oldin yechib yuborishi mumkin. Shuning uchun ochiq qulflar sanab boriladi va
 * `<body>` dan sinf faqat oxirgi qulf yechilganda olinadi.
 *
 * NEGA INLINE STIL HAM: `body.is-locked` qoidasi hamma shablonning CSS'ida
 * yo'q edi — o'shalarda konvert yopiq turganda ham sahifa scroll bo'lardi.
 * Telefonda (iOS Safari) faqat `body` ga `overflow: hidden` yetmaydi, `<html>`
 * ham qulflanishi kerak. Shu sababli qulf shablon CSS'iga bog'liq emas.
 *
 * Ishlatilishi (useEffect ichida):
 *
 *   useEffect(() => {
 *     if (!open) return
 *     return lockScroll()   // cleanup avtomatik yechadi
 *   }, [open])
 */

let openLocks = 0

function applyLock(locked: boolean) {
  for (const el of [document.documentElement, document.body]) {
    el.style.overflow = locked ? 'hidden' : ''
    el.style.overscrollBehavior = locked ? 'none' : ''
  }
  document.body.classList.toggle('is-locked', locked)
}

/** Qulflaydi va qulfni yechadigan funksiyani qaytaradi. */
export function lockScroll(): () => void {
  openLocks += 1
  applyLock(true)

  let released = false
  return () => {
    // Bir qulf ikki marta yechilsa hisob buzilmasin (React StrictMode, HMR)
    if (released) return
    released = true

    openLocks = Math.max(0, openLocks - 1)
    if (openLocks === 0) applyLock(false)
  }
}
