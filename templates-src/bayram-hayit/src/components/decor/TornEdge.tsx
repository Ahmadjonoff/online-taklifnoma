type Props = {
  position: 'top' | 'bottom'
  color: string
  className?: string
}

// Islomiy ogee arch shakli
const ARCH = 'M0 20 L250 20 C350 20 450 0 500 0 C550 0 650 20 750 20 L1000 20 L1000 40 L0 40 Z'

export function TornEdge({ position, color, className = '' }: Props) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-10 ${
        position === 'top' ? 'top-[-10px]' : 'bottom-[-10px]'
      } ${className}`}
      style={{ transform: position === 'bottom' ? 'scaleY(-1)' : undefined }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="block h-10 w-full">
        <path d={ARCH} fill={color} />
        <path d={ARCH} fill="none" stroke="var(--color-gold)" strokeOpacity="0.3" strokeWidth="2" />
      </svg>
    </div>
  )
}
