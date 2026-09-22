type CornerProps = {
  position: 'tl' | 'tr' | 'bl' | 'br'
  className?: string
  opacity?: number
  id?: string
  offset?: number
}

export function FloralCorner({
  position,
  className = '',
  opacity = 0.85,
  offset = 0,
}: CornerProps) {
  const isTop = position.includes('t')
  const isLeft = position.includes('l')

  const top = isTop ? `${offset}px` : 'auto'
  const bottom = !isTop ? `${offset}px` : 'auto'
  const left = isLeft ? `${offset}px` : 'auto'
  const right = !isLeft ? `${offset}px` : 'auto'

  const rotate = isTop && isLeft ? 0 : isTop && !isLeft ? 90 : !isTop && !isLeft ? 180 : 270

  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      style={{ top, bottom, left, right, opacity, transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-wine/40">
        <path d="M0 0 L140 0 L140 140 L0 140 Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M70 0 L140 70 L70 140 L0 70 Z" stroke="var(--color-gold)" strokeWidth="1.5" />
        <circle cx="70" cy="70" r="45" stroke="currentColor" strokeWidth="1" />
        <circle cx="70" cy="70" r="30" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M70 15 L70 125 M15 70 L125 70" stroke="var(--color-gold)" strokeWidth="1.2" />
        <path d="M30 30 L110 110 M30 110 L110 30" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="70" cy="70" r="5" fill="var(--color-gold)" />
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
      strokeWidth="1.2"
      strokeLinecap="round"
    >
      <path d="M10 13h55M135 13h55" stroke="var(--color-gold)" />
      <polygon points="100,5 108,13 100,21 92,13" fill="var(--color-gold)" stroke="none" />
      <circle cx="80" cy="13" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="120" cy="13" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="10" cy="13" r="1.8" fill="var(--color-gold)" stroke="none" />
      <circle cx="190" cy="13" r="1.8" fill="var(--color-gold)" stroke="none" />
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
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 1 12 2z" />
    </svg>
  )
}

export function Flourish({ side = 'left', className = '' }: { side?: 'left' | 'right'; className?: string }) {
  return (
    <svg
      width="50"
      height="20"
      viewBox="0 0 50 20"
      fill="none"
      className={className}
      style={{ transform: side === 'right' ? 'scaleX(-1)' : undefined }}
    >
      <path d="M5 10 C15 10, 22 4, 30 10 C38 16, 44 10, 48 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="30,8 33,10 30,12 27,10" fill="var(--color-gold)" />
    </svg>
  )
}
