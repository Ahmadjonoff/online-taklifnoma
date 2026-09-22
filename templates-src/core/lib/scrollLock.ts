/**
 * Sahifa scroll'ini qulflash.
 *
 * NEGA ALOHIDA FAYL: `body.is-locked` ni bir necha komponent (konvert, RSVP
 * modali) mustaqil qo'yib-olib tursa, biri ikkinchisining qulfini vaqtidan
 * oldin yechib yuborishi mumkin. Shuning uchun ochiq qulflar sanab boriladi va
 * `<body>` dan sinf faqat oxirgi qulf yechilganda olinadi.
 *
 * Ishlatilishi (useEffect ichida):
 *
 *   useEffect(() => {
 *     if (!open) return
 *     return lockScroll()   // cleanup avtomatik yechadi
 *   }, [open])
 */

let openLocks = 0

/** Qulflaydi va qulfni yechadigan funksiyani qaytaradi. */
export function lockScroll(): () => void {
  openLocks += 1
  document.body.classList.add('is-locked')

  let released = false
  return () => {
    // Bir qulf ikki marta yechilsa hisob buzilmasin (React StrictMode, HMR)
    if (released) return
    released = true

    openLocks = Math.max(0, openLocks - 1)
    if (openLocks === 0) document.body.classList.remove('is-locked')
  }
}
