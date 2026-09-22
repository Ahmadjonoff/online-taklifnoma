type CornerProps = {
  position: 'tl' | 'tr' | 'bl' | 'br'
  className?: string
  opacity?: number
  id?: string
  offset?: number
}

function SuzaneMotifs({ id }: { id: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-pome`} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#c62828" />
          <stop offset="100%" stopColor="#8e1a1a" />
        </radialGradient>
        <linearGradient id={`${id}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#daa520" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
      </defs>

      {/* Main curved vine */}
      <path d="M0 260 Q100 200 130 130 T260 0" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="4" strokeLinecap="round" />
      <path d="M40 260 Q90 220 100 160" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M0 220 Q60 180 100 100" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="2.5" strokeLinecap="round" />

      {/* Pomegranate Motif 1 */}
      <g transform="translate(130 130) rotate(-45)">
        <circle cx="0" cy="0" r="35" fill={`url(#${id}-pome)`} />
        <path d="M-15-33 L-20-50 L-5-42 L0-55 L5-42 L20-50 L15-33 Z" fill={`url(#${id}-pome)`} />
        <circle cx="-10" cy="-10" r="4" fill="#fdf5e6" />
        <circle cx="10" cy="-10" r="4" fill="#fdf5e6" />
        <circle cx="0" cy="10" r="4" fill="#fdf5e6" />
        <circle cx="-10" cy="10" r="2" fill="#daa520" />
        <circle cx="10" cy="10" r="2" fill="#daa520" />
        <circle cx="0" cy="-10" r="2" fill="#daa520" />
      </g>

      {/* Pomegranate Motif 2 */}
      <g transform="translate(60 210) rotate(-15) scale(0.6)">
        <circle cx="0" cy="0" r="35" fill={`url(#${id}-pome)`} />
        <path d="M-15-33 L-20-50 L-5-42 L0-55 L5-42 L20-50 L15-33 Z" fill={`url(#${id}-pome)`} />
        <circle cx="-10" cy="-10" r="4" fill="#fdf5e6" />
        <circle cx="10" cy="-10" r="4" fill="#fdf5e6" />
        <circle cx="0" cy="10" r="4" fill="#fdf5e6" />
      </g>

      {/* Paisley / Buta Motif */}
      <g transform="translate(190 70) rotate(-60)">
        <path d="M0 20 C20 20 30 0 30 -20 C30 -40 10 -50 0 -60 C-10 -50 -30 -40 -30 -20 C-30 0 -20 20 0 20 Z" fill={`url(#${id}-pome)`} />
        <path d="M0 10 C10 10 20 0 20 -20 C20 -30 10 -40 0 -50 C-10 -40 -20 -30 -20 -20 C-20 0 -10 10 0 10 Z" fill="#fdf5e6" />
        <path d="M0 0 C5 0 10 -10 10 -20 C10 -25 5 -30 0 -40 C-5 -30 -10 -25 -10 -20 C-10 -10 -5 0 0 0 Z" fill={`url(#${id}-gold)`} />
      </g>

      {/* Stylized Leaves */}
      <g fill="#5e8c5a">
        <path d="M80 180 Q100 190 120 170 Q100 160 80 180 Z" />
        <path d="M150 160 Q170 170 180 150 Q160 140 150 160 Z" />
        <path d="M100 100 Q120 90 110 70 Q90 80 100 100 Z" />
        <path d="M210 30 Q220 50 240 40 Q230 20 210 30 Z" />
      </g>
    </g>
  )
}

export function FloralCorner({
  position,
  className = '',
  opacity = 1,
  id = 'fc',
  offset = 0,
}: CornerProps) {
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
        <SuzaneMotifs id={id} />
      </svg>
    </div>
  )
}

export function Ornament({ className = '', width = 200 }: { className?: string; width?: number }) {
  return (
    <svg
      viewBox="0 0 200 26"
      width={width}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      <path d="M8 13h58M134 13h58" />
      <path d="M66 13c6-8 14-8 18-3s-2 11-8 8-6-11 2-13" />
      <path d="M134 13c-6-8-14-8-18-3s2 11 8 8 6-11-2-13" />
      <path d="M100 7l5.5 6-5.5 6-5.5-6z" fill="currentColor" stroke="none" />
      <circle cx="8" cy="13" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="192" cy="13" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

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

export function Flourish({ side = 'left', className = '' }: { side?: 'left' | 'right'; className?: string }) {
  return (
    <svg
      viewBox="0 0 70 24"
      width="70"
      className={className}
      style={{ transform: side === 'right' ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      <path d="M68 12c-14 0-26 2-36 6" />
      <path d="M32 18c-8 3-16 2-20-2s0-10 5-9 6 8-1 10-14-2-14-8" />
      <path d="M52 12c-4-4-10-5-14-3" />
      <circle cx="66" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  )
}
