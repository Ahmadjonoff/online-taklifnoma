type CornerProps = {
  position: 'tl' | 'tr' | 'bl' | 'br'
  className?: string
  opacity?: number
  id?: string
  offset?: number
}

function Balloon({ x, y, rotate, colorId, scale = 1 }: { x: number, y: number, rotate: number, colorId: string, scale?: number }) {
  const colors: Record<string, { main: string, highlight: string }> = {
    primary: { main: 'var(--color-primary)', highlight: 'rgba(255,255,255,0.4)' },
    secondary: { main: 'var(--color-secondary)', highlight: 'rgba(255,255,255,0.4)' },
    accent1: { main: 'var(--color-accent1)', highlight: 'rgba(255,255,255,0.6)' },
    accent2: { main: 'var(--color-accent2)', highlight: 'rgba(255,255,255,0.4)' },
    purple: { main: 'var(--color-deco-purple)', highlight: 'rgba(255,255,255,0.4)' },
  }
  const c = colors[colorId]

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 45 Q-15 45 -15 25 C-15 5 0 -15 0 -15 C0 -15 15 5 15 25 Q15 45 0 45 Z" fill={c.main} />
      <path d="M-3 45 L3 45 L5 50 L-5 50 Z" fill={c.main} />
      <path d="M0 50 Q 5 60 -5 70 T 5 90 T -5 110" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
      <ellipse cx="-5" cy="5" rx="3" ry="12" fill={c.highlight} transform="rotate(-15 -5 5)" />
    </g>
  )
}

function Streamer({ x, y, rotate, scale = 1, color }: { x: number, y: number, rotate: number, scale?: number, color: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 0 Q 20 10 10 30 T 20 60 T 10 90 T 20 120" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </g>
  )
}

function ConfettiPiece({ x, y, rotate, color, type }: { x: number, y: number, rotate: number, color: string, type: 'circle' | 'square' | 'triangle' }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {type === 'circle' && <circle cx="0" cy="0" r="4" fill={color} />}
      {type === 'square' && <rect x="-4" y="-4" width="8" height="8" fill={color} />}
      {type === 'triangle' && <polygon points="0,-5 5,4 -5,4" fill={color} />}
    </g>
  )
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
      <svg viewBox="0 0 260 260" className="h-auto w-full">
        {/* Streamers */}
        <Streamer x={20} y={10} rotate={-20} scale={1.2} color="var(--color-deco-orange)" />
        <Streamer x={90} y={-10} rotate={30} scale={0.9} color="var(--color-primary)" />
        <Streamer x={-10} y={70} rotate={-60} scale={1.1} color="var(--color-accent2)" />

        {/* Confetti */}
        <ConfettiPiece x={120} y={30} rotate={20} color="var(--color-accent1)" type="triangle" />
        <ConfettiPiece x={150} y={80} rotate={45} color="var(--color-secondary)" type="square" />
        <ConfettiPiece x={110} y={120} rotate={70} color="var(--color-deco-purple)" type="circle" />
        <ConfettiPiece x={40} y={140} rotate={10} color="var(--color-primary)" type="square" />
        <ConfettiPiece x={80} y={160} rotate={80} color="var(--color-accent2)" type="triangle" />

        {/* Balloons */}
        <Balloon x={30} y={70} rotate={-15} colorId="primary" scale={1.2} />
        <Balloon x={75} y={40} rotate={10} colorId="accent1" scale={0.9} />
        <Balloon x={85} y={95} rotate={25} colorId="secondary" scale={1.0} />
        <Balloon x={45} y={120} rotate={-5} colorId="purple" scale={0.8} />
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
      stroke="var(--color-primary)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="1 6"
    >
      <path d="M10 13 h180" />
      <circle cx="10" cy="13" r="3" fill="var(--color-accent1)" stroke="none" />
      <circle cx="190" cy="13" r="3" fill="var(--color-accent1)" stroke="none" />
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
      <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
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
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M30 12 Q40 0 50 12 T70 12" />
      <circle cx="66" cy="12" r="3" fill="currentColor" stroke="none" />
    </svg>
  )
}
