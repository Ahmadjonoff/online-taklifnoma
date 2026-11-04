/**
 * «Noir» bezagi — gul o'rniga ingichka chiziq va geometrik naqsh.
 *
 * NEGA BOSHQA: zamonaviy/qorong'i mavzularda akvarel gul ortiqcha bo'lib
 * qoladi, shuning uchun bu bazada faqat tilla chiziqlar va nozik yoy qoladi.
 * API bir xil — `core/` bo'limlari hech narsa sezmaydi.
 */

type CornerProps = {
  position: 'tl' | 'tr' | 'bl' | 'br'
  className?: string
  opacity?: number
  id?: string
  offset?: number
}

/** Burchak uchun konsentrik yoylar — minimal, «yorug'lik» effekti. */
export function FloralCorner({ position, className = '', opacity = 1, offset = 0 }: CornerProps) {
  const flip = {
    tl: '',
    tr: 'scaleX(-1)',
    bl: 'scaleY(-1)',
    br: 'scale(-1,-1)',
  }[position]

  const vertical = position === 'tl' || position === 'tr' ? 'top' : 'bottom'
  const horizontal = position === 'tl' || position === 'bl' ? 'left' : 'right'

  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      style={{ transform: flip, opacity, [vertical]: offset, [horizontal]: 0 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 260 260" className="h-auto w-full">
        <g fill="none" stroke="var(--color-gold)" strokeLinecap="round">
          <circle cx="0" cy="0" r="150" strokeOpacity="0.2" strokeWidth="0.9" />
          <circle cx="0" cy="0" r="196" strokeOpacity="0.13" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="242" strokeOpacity="0.08" strokeWidth="0.7" />
          <path d="M0 120 L0 260 M120 0 L260 0" strokeOpacity="0.14" strokeWidth="0.8" />
          <path d="M14 14 L78 78" strokeOpacity="0.22" strokeWidth="1" />
          <circle cx="78" cy="78" r="3.2" fill="var(--color-gold)" stroke="none" fillOpacity="0.55" />
          <circle cx="130" cy="130" r="2" fill="var(--color-gold)" stroke="none" fillOpacity="0.35" />
        </g>
      </svg>
    </div>
  )
}

/** Sarlavhalar ostidagi minimal chiziq-ajratgich. */
export function Ornament({ className = '', width = 200 }: { className?: string; width?: number }) {
  return (
    <svg
      viewBox="0 0 200 20"
      width={width}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <path d="M6 10h74M120 10h74" />
      <path d="M100 3.5l4.5 6.5-4.5 6.5-4.5-6.5z" fill="currentColor" stroke="none" />
      <circle cx="6" cy="10" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="194" cy="10" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Kichik yurakcha (matn oxirida). */
export function Heart({ className = '', size = 15 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'baseline' }}
    >
      <path d="M12 21s-7.5-4.7-9.3-9.2C1.3 8.1 3.3 4.6 6.8 4.1c2-.3 3.9.7 5.2 2.3 1.3-1.6 3.2-2.6 5.2-2.3 3.5.5 5.5 4 4.1 7.7C19.5 16.3 12 21 12 21Z" />
    </svg>
  )
}

/** Yozma sarlavha yonidagi nozik yoy. */
export function Flourish({ side = 'left', className = '' }: { side?: 'left' | 'right'; className?: string }) {
  return (
    <svg
      viewBox="0 0 60 16"
      width="60"
      className={className}
      style={{ transform: side === 'right' ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <path d="M58 8H26" />
      <path d="M26 8c-8 0-14-4-14-6s6-3 9 0 1 9-8 11" />
      <circle cx="56" cy="8" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  )
}
