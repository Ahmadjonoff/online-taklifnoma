/**
 * «Noir» muhri — mum o'rniga ingichka tilla halqa va monogramma.
 * API bir xil (`core/components/Rsvp.tsx` shuni ishlatadi).
 */
type Props = {
  label: string
  size?: number
  className?: string
  variant?: 'script' | 'caps'
  id?: string
}

export function WaxSeal({ label, size = 160, className = '', variant = 'script', id = 'seal' }: Props) {
  const g = (n: string) => `${id}-${n}`

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
        <linearGradient id={g('gold')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-gold-light)" />
          <stop offset="55%" stopColor="var(--color-gold)" />
          <stop offset="100%" stopColor="var(--color-gold-dark)" />
        </linearGradient>
        <radialGradient id={g('glow')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="96" fill={`url(#${g('glow')})`} />
      <circle cx="100" cy="100" r="78" fill="none" stroke={`url(#${g('gold')})`} strokeWidth="1.6" />
      <circle cx="100" cy="100" r="70" fill="none" stroke={`url(#${g('gold')})`} strokeOpacity="0.45" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="86" fill="none" stroke={`url(#${g('gold')})`} strokeOpacity="0.25" strokeWidth="0.7" />

      {/* Doiraviy yozuv o'rniga to'rtta kichik nuqta */}
      {[0, 90, 180, 270].map((a) => (
        <circle
          key={a}
          cx={100 + 78 * Math.cos((a * Math.PI) / 180)}
          cy={100 + 78 * Math.sin((a * Math.PI) / 180)}
          r="2.4"
          fill="var(--color-gold)"
        />
      ))}

      <text
        x="100"
        y={variant === 'script' ? 115 : 106}
        textAnchor="middle"
        fill={`url(#${g('gold')})`}
        style={{ fontFamily: variant === 'script' ? 'var(--font-script)' : 'var(--font-display)' }}
        fontSize={variant === 'script' ? 42 : 32}
        letterSpacing={variant === 'script' ? 0 : 4}
      >
        {label}
      </text>
    </svg>
  )
}
