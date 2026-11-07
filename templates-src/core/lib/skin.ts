/**
 * Bo'limlarning qog'oz ranglari va ular orasidagi "yirtilgan chekka".
 *
 * NEGA SHUNDAY: yirtilgan chekka qo'shni bo'limning rangi bilan bo'yaladi.
 * Avval har bir komponent qo'shnisining rangini o'zida qo'lda yozib qo'ygan edi
 * — natijada `config.ts` da biror bo'lim o'chirilsa, chegara rangi mos kelmay
 * qolardi. Endi tartib va ranglar faqat `App.tsx` da belgilanadi, har bir bo'lim
 * esa o'zining tepasidagi chekkani `prevBg` orqali oladi.
 */

/** `clear` — shaffof: orqadagi scroll sahnasi ko'rinadi (core/motion). */
export type Bg = 'paper' | 'paper-2' | 'paper-3' | 'clear'

/** Har bir bo'lim shu ikki xossani App'dan oladi. */
export type Skin = {
  /** Bo'limning o'z fon rangi. */
  bg: Bg
  /** Yuqoridagi bo'limning rangi. Berilmasa — chekka chizilmaydi. */
  prevBg?: Bg
}

// Tailwind sinflari to'liq matn ko'rinishida bo'lishi shart, shuning uchun map.
const CLASS: Record<Bg, string> = {
  paper: 'bg-paper',
  'paper-2': 'bg-paper-2',
  'paper-3': 'bg-paper-3',
  clear: 'bg-transparent',
}

export const bgClass = (bg: Bg): string => CLASS[bg]

export const bgVar = (bg: Bg): string => `var(--color-${bg})`

/**
 * Bo'lim tepasiga chekka kerakmi? Qo'shnisining rangi bir xil bo'lsa — kerak
 * emas (ko'rinmaydi ham), birinchi bo'limga ham kerak emas.
 */
export function topEdge(skin: Skin): string | null {
  if (!skin.prevBg || skin.prevBg === skin.bg) return null
  return bgVar(skin.prevBg)
}
