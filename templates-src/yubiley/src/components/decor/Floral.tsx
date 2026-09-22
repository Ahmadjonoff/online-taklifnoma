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
  opacity = 1,
  id = 'fc',
  offset = 0,
}: CornerProps) {
  const flip = {
    tl: 'scale(1, 1)',
    tr: 'scale(-1, 1)',
    bl: 'scale(1, -1)',
    br: 'scale(-1, -1)',
  }[position]

  const vertical = position === 'tl' || position === 'tr' ? 'top' : 'bottom'
  const horizontal = position === 'tl' || position === 'bl' ? 'left' : 'right'

  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      style={{ transform: flip, opacity, [vertical]: offset, [horizontal]: offset }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" className="h-auto w-full">
        <defs>
          <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8cd8a" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#9c7e20" />
          </linearGradient>
        </defs>
        
        {/* Art Deco Corner Fan/Geometric Pattern */}
        <g stroke={`url(#${id}-gold)`} fill="none" strokeWidth="1.5">
          {/* Outer framing lines */}
          <path d="M 10 190 L 10 10 L 190 10" strokeWidth="3" />
          <path d="M 25 190 L 25 25 L 190 25" strokeWidth="1" />
          
          {/* Corner stepped zig-zags */}
          <path d="M 10 70 L 40 70 L 40 40 L 70 40 L 70 10" />
          <path d="M 10 100 L 70 100 L 70 70 L 100 70 L 100 10" />
          
          {/* Radiating lines forming a fan shape from top-left */}
          <path d="M 10 10 L 130 50" />
          <path d="M 10 10 L 100 100" />
          <path d="M 10 10 L 50 130" />
          
          {/* Arcs intersecting the rays */}
          <path d="M 10 60 A 50 50 0 0 0 60 10" />
          <path d="M 10 110 A 100 100 0 0 0 110 10" />
          <path d="M 10 150 A 140 140 0 0 0 150 10" />
          
          {/* Small diamond accents */}
          <path d="M 85 85 L 100 70 L 115 85 L 100 100 Z" fill={`url(#${id}-gold)`} stroke="none" />
          <path d="M 45 45 L 55 35 L 65 45 L 55 55 Z" fill={`url(#${id}-gold)`} stroke="none" />
        </g>
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
      strokeWidth="1.5"
    >
      <path d="M10 13h50M140 13h50" />
      <path d="M65 13 L80 3 L100 13 L80 23 Z" />
      <path d="M100 13 L120 3 L135 13 L120 23 Z" />
      <path d="M85 13 L100 5 L115 13 L100 21 Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function Heart({ className = '', size = 15 }: { className?: string; size?: number }) {
  // Using a geometric diamond instead of a heart for Art Deco feel, but keeping the name Heart for compatibility
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
      <path d="M12 2 L22 12 L12 22 L2 12 Z" />
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
      strokeWidth="1.5"
    >
      {/* Art Deco geometric flourish */}
      <path d="M 70 12 L 20 12" />
      <path d="M 40 4 L 20 12 L 40 20" />
      <path d="M 50 4 L 30 12 L 50 20" />
      <path d="M 10 12 L 0 12" />
      <rect x="12" y="9" width="6" height="6" fill="currentColor" transform="rotate(45 15 12)" />
    </svg>
  )
}
