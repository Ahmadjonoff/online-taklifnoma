type Props = {
  position: 'top' | 'bottom'
  color: string
  className?: string
}

export function TornEdge({ position, color, className = '' }: Props) {
  // A simple repeating geometric border
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-10 ${
        position === 'top' ? 'top-0' : 'bottom-0'
      } ${className}`}
      style={{ transform: position === 'bottom' ? 'scaleY(-1)' : undefined }}
      aria-hidden="true"
    >
      {/* Base background to cover beneath the edge */}
      <div className="absolute inset-x-0 top-0 h-4" style={{ backgroundColor: color }} />
      
      {/* Repeating Gireh Pattern Band */}
      <svg width="100%" height="24" className="block relative z-10">
        <defs>
          <pattern id="gireh" width="40" height="24" patternUnits="userSpaceOnUse">
            {/* Solid fill so it masks what's below */}
            <rect width="40" height="24" fill={color} />
            <path
              d="M0 12 L10 2 L20 12 L30 2 L40 12 L30 22 L20 12 L10 22 Z"
              fill="none"
              stroke="#daa520"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            <path
              d="M0 24 L10 14 L20 24 L30 14 L40 24"
              fill="none"
              stroke="#daa520"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            <path
              d="M0 0 L10 10 L20 0 L30 10 L40 0"
              fill="none"
              stroke="#daa520"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </pattern>
        </defs>
        <rect width="100%" height="24" fill="url(#gireh)" />
        {/* Subtle drop shadow under the border */}
        <rect width="100%" height="24" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" transform="translate(0, 1)" />
      </svg>
    </div>
  )
}
