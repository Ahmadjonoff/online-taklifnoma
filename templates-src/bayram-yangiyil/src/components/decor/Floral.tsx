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
      <svg viewBox="0 0 300 300" className="h-auto w-full">
        {/* Soft clouds */}
        <path d="M 20 180 Q 20 140 60 140 Q 80 90 130 100 Q 180 80 200 130 Q 240 140 230 180 Z" fill="#ffffff" opacity="0.8" />
        <path d="M -20 220 Q -20 160 30 160 Q 60 90 120 110 Q 180 80 210 140 Q 270 160 250 220 Z" fill="#f7f5fa" opacity="0.9" />
        <path d="M -40 280 Q -40 200 20 200 Q 60 120 140 140 Q 220 100 260 180 Q 340 200 320 280 Z" fill="#f0edf5" opacity="1" />
        
        {/* Tiny stars */}
        <path d="M 80 40 L 85 55 L 100 60 L 85 65 L 80 80 L 75 65 L 60 60 L 75 55 Z" fill="#e8c96a" />
        <path d="M 180 30 L 183 40 L 193 43 L 183 46 L 180 56 L 177 46 L 167 43 L 177 40 Z" fill="#f0a0b8" />
        <path d="M 240 90 L 242 98 L 250 100 L 242 102 L 240 110 L 238 102 L 230 100 L 238 98 Z" fill="#89c4e8" />
        
        {/* Crescent Moon */}
        <path d="M 150 20 A 30 30 0 1 0 190 60 A 35 35 0 1 1 150 20 Z" fill="#f5e4ab" transform="rotate(20 150 20)" />
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
      <path d="M100 8 L103 13 L100 18 L97 13 Z" fill="currentColor" stroke="none" />
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
