import { useEffect, useRef } from 'react'

/**
 * Element ekranga kirganda unga `is-visible` sinfini qo'shadi.
 * Bir marta ishlaydi — yuqoriga qaytganda qayta yashirinmaydi.
 *
 * DIQQAT: `threshold` 0 — ataylab. 0.15 bo'lganda ekrandan bir necha barobar
 * baland bloklar (masalan uzun tilaklar ro'yxati) hech qachon shu nisbatga
 * yetmasdi va `opacity: 0` da ko'rinmay qolardi.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // IntersectionObserver bo'lmasa — darrov ko'rsatamiz
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return ref
}
