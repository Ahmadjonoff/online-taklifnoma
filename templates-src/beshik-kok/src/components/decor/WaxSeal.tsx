export function WaxSeal({
  id,
  label,
  size = 140,
  variant = 'script',
}: {
  id: string
  label: string
  size?: number
  variant?: 'script' | 'display' | 'caps'
}) {
  return (
    <div
      className="relative flex items-center justify-center transition-transform hover:scale-105"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full drop-shadow-xl" aria-hidden="true">
        <defs>
          <linearGradient id={`seal-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent1)" />
            <stop offset="50%" stopColor="var(--color-primary-light)" />
            <stop offset="100%" stopColor="var(--color-seal)" />
          </linearGradient>
          <radialGradient id={`seal-inner-${id}`} cx="45%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Seal Base (scalloped circle for a festive look) */}
        <path
          d="M 50 2 C 58 2, 62 8, 70 8 C 78 8, 82 14, 88 18 C 94 22, 96 30, 98 38 C 100 46, 96 52, 96 60 C 96 68, 100 74, 98 82 C 96 90, 90 94, 82 98 C 74 102, 68 96, 60 96 C 52 96, 46 102, 38 98 C 30 94, 24 90, 22 82 C 20 74, 24 68, 24 60 C 24 52, 20 46, 22 38 C 24 30, 30 22, 38 18 C 46 14, 52 8, 60 8 C 68 8, 72 2, 80 2 Z"
          fill={`url(#seal-grad-${id})`}
          transform="translate(-15, -5) scale(1.15)"
        />
        <circle cx="50" cy="50" r="42" fill={`url(#seal-inner-${id})`} />

        {/* Inner rim */}
        <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeDasharray="3 3" />
        
        {/* Party Hat Icon */}
        <g transform="translate(35, 25) scale(0.6)">
           <path d="M 25 5 L 45 45 L 5 45 Z" fill="rgba(255,255,255,0.9)" />
           <circle cx="25" cy="5" r="5" fill="var(--color-accent1)" />
           <path d="M 5 45 Q 25 55 45 45" fill="none" stroke="var(--color-accent1)" strokeWidth="3" />
           <path d="M 15 25 Q 25 35 35 25" fill="none" stroke="var(--color-secondary)" strokeWidth="3" />
        </g>
      </svg>

      <span
        className="relative z-10 text-white drop-shadow-md pt-5"
        style={{
          fontFamily: variant === 'script' ? 'var(--font-script)' : 'var(--font-display)',
          fontSize: size * 0.32,
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </div>
  )
}
