type Props = {
  label: string
  size?: number
  className?: string
  variant?: 'script' | 'caps'
  id?: string
}

export function WaxSeal({ label, size = 200, className = '', id = 'seal' }: Props) {
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
        <radialGradient id={g('wax')} cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#1e1e32" />
          <stop offset="42%" stopColor="#12122a" />
          <stop offset="80%" stopColor="#0a0a1a" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>

        <radialGradient id={g('inner')} cx="42%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="70%" stopColor="#0f0f22" />
          <stop offset="100%" stopColor="#050511" />
        </radialGradient>

        <linearGradient id={g('gold')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3e5ab" />
          <stop offset="45%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#9c7e20" />
        </linearGradient>

        <radialGradient id={g('shine')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <filter id={g('shadow')} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#000000" floodOpacity="0.8" />
        </filter>
      </defs>

      <path d={blob} fill={`url(#${g('wax')})`} filter={`url(#${g('shadow')})`} />
      <path d={blob} fill="none" stroke="#d4af37" strokeOpacity="0.15" strokeWidth="1.5" />

      <circle cx="100" cy="100" r="66" fill={`url(#${g('inner')})`} />
      <circle cx="100" cy="100" r="66" fill="none" stroke="#000000" strokeOpacity="0.8" strokeWidth="2" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="#d4af37" strokeOpacity="0.4" strokeWidth="1.5" />
      
      {/* Art deco wreath/border inner */}
      <g stroke={`url(#${g('gold')})`} strokeWidth="1.5" fill="none" opacity="0.7">
        <circle cx="100" cy="100" r="54" strokeDasharray="3 4" />
      </g>

      <ellipse cx="76" cy="62" rx="40" ry="26" fill={`url(#${g('shine')})`} transform="rotate(-22 76 62)" />

      <text
        x="100"
        y="112"
        textAnchor="middle"
        fill={`url(#${g('gold')})`}
        style={{ fontFamily: 'var(--font-display)' }}
        fontSize="48"
        fontWeight="bold"
        letterSpacing="2"
      >
        {label}
      </text>
      
      {/* Deco geometric accents */}
      <g stroke={`url(#${g('gold')})`} strokeWidth="1.5" fill="none" opacity="0.9">
        <path d="M70 120 L130 120" />
        <path d="M85 125 L115 125" />
        <path d="M100 130 L100 135" />
        <path d="M100 65 L100 70" />
        <path d="M85 75 L115 75" />
        <path d="M70 80 L130 80" />
      </g>
    </svg>
  )
}
