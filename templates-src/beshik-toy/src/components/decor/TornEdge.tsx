type Props = {
  position: 'top' | 'bottom'
  color: string
  className?: string
}

export function TornEdge({ position, color, className = '' }: Props) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-10 ${
        position === 'top' ? 'top-0' : 'bottom-0'
      } ${className}`}
      style={{ transform: position === 'bottom' ? 'scaleY(-1)' : undefined }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="block h-10 w-full">
        {/* Soft wave / cloud edge */}
        <path d="M0 40 L0 10 Q 50 25 100 10 T 200 10 T 300 10 T 400 10 T 500 10 T 600 10 T 700 10 T 800 10 T 900 10 T 1000 10 L1000 40 Z" fill={color} />
        <path d="M0 10 Q 50 25 100 10 T 200 10 T 300 10 T 400 10 T 500 10 T 600 10 T 700 10 T 800 10 T 900 10 T 1000 10" fill="none" stroke="#000" strokeOpacity="0.04" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
