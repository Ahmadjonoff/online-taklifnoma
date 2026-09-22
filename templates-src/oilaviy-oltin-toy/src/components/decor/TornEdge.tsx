/**
 * "Yirtilgan qog'oz" chekkasi — bo'limlar orasidagi chegara.
 * Bo'lim ichiga absolute qilib qo'yiladi va qo'shni bo'lim rangi bilan bo'yaladi.
 */
type Props = {
  /** Bo'limning qaysi chekkasida turadi. */
  position: 'top' | 'bottom'
  /** Yirtiqning rangi — odatda qo'shni bo'limning fon rangi. */
  color: string
  className?: string
}

// Notekis, qo'lda yirtilganday chiziq
const TEAR =
  'M0 0 L40 6 L92 2 L150 11 L206 4 L262 13 L318 5 L372 14 L430 6 L488 15 L548 7 L604 16 L664 8 L720 17 L778 9 L836 18 L894 10 L952 17 L1000 9 L1000 0 Z'

export function TornEdge({ position, color, className = '' }: Props) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-10 ${
        position === 'top' ? 'top-0' : 'bottom-0'
      } ${className}`}
      style={{ transform: position === 'bottom' ? 'scaleY(-1)' : undefined }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1000 20" preserveAspectRatio="none" className="block h-5 w-full">
        <path d={TEAR} fill={color} />
        {/* Yirtiq ostidagi mayin soya — qog'oz qalinligi hissi */}
        <path d={TEAR} fill="none" stroke="#000" strokeOpacity="0.06" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
