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
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label={label}>
      <defs>
        <radialGradient id={g('wax')} cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#89c4e8" />
          <stop offset="42%" stopColor="#6baed6" />
          <stop offset="80%" stopColor="#4a87b0" />
          <stop offset="100%" stopColor="#2c5c7a" />
        </radialGradient>

        <radialGradient id={g('inner')} cx="42%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#6baed6" />
          <stop offset="70%" stopColor="#4a87b0" />
          <stop offset="100%" stopColor="#2c5c7a" />
        </radialGradient>

        <linearGradient id={g('gold')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff8e7" />
          <stop offset="45%" stopColor="#f5e4ab" />
          <stop offset="100%" stopColor="#e8c96a" />
        </linearGradient>

        <radialGradient id={g('shine')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <filter id={g('shadow')} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#2c5c7a" floodOpacity="0.3" />
        </filter>
      </defs>

      <path d={blob} fill={`url(#${g('wax')})`} filter={`url(#${g('shadow')})`} />
      <path d={blob} fill="none" stroke="#a8d8c8" strokeOpacity="0.35" strokeWidth="1.5" />

      <circle cx="100" cy="100" r="66" fill={`url(#${g('inner')})`} />
      <circle cx="100" cy="100" r="66" fill="none" stroke="#2c5c7a" strokeOpacity="0.5" strokeWidth="2" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="#89c4e8" strokeOpacity="0.4" strokeWidth="1" />

      <ellipse cx="76" cy="62" rx="40" ry="26" fill={`url(#${g('shine')})`} transform="rotate(-22 76 62)" />

      {/* Baby Cradle Silhouette */}
      <g transform="translate(65, 75) scale(0.7)" fill={`url(#${g('gold')})`}>
        <path d="M 20 60 C 20 80, 80 80, 80 60 L 90 60 C 90 90, 10 90, 10 60 Z" />
        <path d="M 15 60 L 25 30 L 75 30 L 85 60 Z" opacity="0.8" />
        <circle cx="20" cy="20" r="8" />
        <circle cx="80" cy="20" r="8" />
        <path d="M 15 20 C 15 5, 85 5, 85 20 C 85 5, 15 5, 15 20" stroke={`url(#${g('gold')})`} strokeWidth="4" fill="none" />
      </g>
    </svg>
  )
}
