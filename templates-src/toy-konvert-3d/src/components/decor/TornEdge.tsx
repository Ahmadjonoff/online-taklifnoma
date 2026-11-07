/**
 * «Luxe» chekka — qo'lda kesilgan qog'oz (deckle edge) + ingichka tilla tol.
 *
 * Bo'lim ichiga absolute qilib qo'yiladi va qo'shni bo'lim rangi bilan
 * bo'yaladi.
 */
type Props = {
  position: 'top' | 'bottom'
  color: string
  className?: string
}

// Notekis, qo'lda kesilganday chiziq — takrorlanmaydigan ritm
const EDGE =
  'M0 0 L38 5 L96 2 L148 9 L210 3 L268 11 L322 4 L378 12 L436 5 L492 13 L552 6 L608 14 L668 7 L724 15 L782 8 L840 16 L898 9 L956 15 L1000 10 L1000 0 Z'

export function TornEdge({ position, color, className = '' }: Props) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-10 ${
        position === 'top' ? 'top-0' : 'bottom-0'
      } ${className}`}
      style={{ transform: position === 'bottom' ? 'scaleY(-1)' : undefined }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1000 20" preserveAspectRatio="none" className="block h-[18px] w-full">
        <path d={EDGE} fill={color} />
        {/* Qog'oz qalinligi */}
        <path d={EDGE} fill="none" stroke="#000" strokeOpacity="0.06" strokeWidth="1.5" />
        {/* Kesim bo'ylab o'tadigan tilla tol — faqat yuqori chekkada */}
        {position === 'top' && (
          <path
            d="M0 3 L38 8 L96 5 L148 12 L210 6 L268 14 L322 7 L378 15 L436 8 L492 16 L552 9 L608 17 L668 10 L724 18 L782 11 L840 19 L898 12 L956 18 L1000 13"
            fill="none"
            stroke="var(--color-gold)"
            strokeOpacity="0.32"
            strokeWidth="0.9"
          />
        )}
      </svg>
    </div>
  )
}
