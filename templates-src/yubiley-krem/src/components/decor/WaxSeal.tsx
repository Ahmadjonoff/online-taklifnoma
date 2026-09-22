type Props = {
  label: string
  size?: number
  className?: string
  variant?: 'script' | 'caps'
  id?: string
}

export function WaxSeal({ label, size = 200, className = '', variant = 'script', id = 'seal' }: Props) {
  const g = (n: string) => `${id}-${n}`

  const blob =
    'M100 8c14 0 21 10 33 13s24-5 34 3 4 22 10 33 17 15 17 29-11 19-13 31 5 24-3 34-22 4-33 10-15 17-29 17-19-11-31-13-24 5-34-3-4-22-10-33S8 114 8 100s11-19 13-31S16 45 24 35s22-4 33-10S86 8 100 8Z'

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={label}
    >
      <defs>
        {/* Crimson red wax gradients */}
        <radialGradient id={g('wax')} cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#d32f2f" />
          <stop offset="42%" stopColor="#b71c1c" />
          <stop offset="80%" stopColor="#8e1a1a" />
          <stop offset="100%" stopColor="#5c0e0e" />
        </radialGradient>

        <radialGradient id={g('inner')} cx="42%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#b71c1c" />
          <stop offset="70%" stopColor="#8e1a1a" />
          <stop offset="100%" stopColor="#5c0e0e" />
        </radialGradient>

        <linearGradient id={g('gold')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffeb3b" />
          <stop offset="45%" stopColor="#ffc107" />
          <stop offset="100%" stopColor="#ffa000" />
        </linearGradient>

        <radialGradient id={g('shine')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <filter id={g('shadow')} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#5c0e0e" floodOpacity="0.5" />
        </filter>
      </defs>

      <path d={blob} fill={`url(#${g('wax')})`} filter={`url(#${g('shadow')})`} />
      <path d={blob} fill="none" stroke="#ef5350" strokeOpacity="0.3" strokeWidth="1.5" />

      <circle cx="100" cy="100" r="66" fill={`url(#${g('inner')})`} />
      <circle cx="100" cy="100" r="66" fill="none" stroke="#5c0e0e" strokeOpacity="0.5" strokeWidth="2" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="#ef5350" strokeOpacity="0.25" strokeWidth="1" />

      {/* Background motif: Tulip (Lola) silhouette */}
      <g transform="translate(100 100) scale(1.6) translate(-12 -12)" opacity="0.15" fill={`url(#${g('gold')})`}>
         <path d="M12 2C8 6 6 12 6 18C10 18 12 12 12 12C12 12 14 18 18 18C18 12 16 6 12 2Z" />
      </g>

      <ellipse cx="76" cy="62" rx="40" ry="26" fill={`url(#${g('shine')})`} transform="rotate(-22 76 62)" />

      {variant === 'script' ? (
        <text
          x="100"
          y="116"
          textAnchor="middle"
          fill={`url(#${g('gold')})`}
          style={{ fontFamily: 'var(--font-script)' }}
          fontSize="42"
        >
          {label}
        </text>
      ) : (
        <>
          <text
            x="100"
            y="103"
            textAnchor="middle"
            fill={`url(#${g('gold')})`}
            style={{ fontFamily: 'var(--font-display)' }}
            fontSize="30"
            letterSpacing="3"
          >
            {label}
          </text>
          <g stroke={`url(#${g('gold')})`} strokeWidth="1.2" fill="none" opacity="0.85">
            <path d="M74 116h18M108 116h18" />
            <path d="M100 112.5l4 3.5-4 3.5-4-3.5z" fill={`url(#${g('gold')})`} stroke="none" />
          </g>
        </>
      )}
    </svg>
  )
}
