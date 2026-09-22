/**
 * «Bog'» chekkasi — yirtiq emas, akvarel kabi yumshoq to'lqin.
 *
 * NEGA TO'LQIN: yumshoq mavzularda o'tkir yirtiq chekka dizaynni buzadi,
 * shuning uchun bu bazada bo'limlar bir-biriga suv bo'yoq singari o'tadi.
 */
type Props = {
  position: 'top' | 'bottom'
  color: string
  className?: string
}

// Uch qatlamli yumshoq to'lqin — tabiiy "oqib tushish" effekti
const WAVE =
  'M0 22 C120 4 200 26 320 18 C440 10 520 30 640 20 C760 10 840 28 960 16 L1000 14 L1000 0 L0 0 Z'
const WAVE_SOFT =
  'M0 30 C140 10 220 34 360 24 C500 14 580 36 720 26 C860 16 920 32 1000 22 L1000 0 L0 0 Z'

export function TornEdge({ position, color, className = '' }: Props) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-10 ${
        position === 'top' ? 'top-0' : 'bottom-0'
      } ${className}`}
      style={{
        transform: position === 'bottom' ? 'scaleY(-1)' : undefined,
        filter: 'blur(0.3px)',
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1000 34" preserveAspectRatio="none" className="block h-[30px] w-full">
        <path d={WAVE} fill={color} />
        <path d={WAVE_SOFT} fill={color} fillOpacity="0.45" />
        {/* To'lqin chekkasida ingichka yashil-jigarrang tol */}
        {position === 'top' && (
          <path
            d="M0 23 C120 5 200 27 320 19 C440 11 520 31 640 21 C760 11 840 29 960 17"
            fill="none"
            stroke="var(--color-gold)"
            strokeOpacity="0.22"
            strokeWidth="1.1"
          />
        )}
      </svg>
    </div>
  )
}
