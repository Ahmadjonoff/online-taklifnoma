/**
 * Bordo sur'g'uch muhr (wax seal).
 * Butunlay SVG — hech qanday rasm fayli kerak emas.
 *
 * `core/components/Rsvp.tsx` shu komponentni `@decor/WaxSeal` orqali oladi,
 * shuning uchun har bir yangi baza o'z `decor/WaxSeal.tsx` faylida shu modulni
 * re-export qiladi.
 */
type Props = {
  /** Muhr ustidagi yozuv: monogramma yoki "RSVP". */
  label: string
  /** Piksel o'lchami. */
  size?: number
  className?: string
  /** Yozma shrift (monogramma) yoki oddiy bosh harflar (RSVP). */
  variant?: 'script' | 'caps'
  id?: string
}

export function WaxSeal({ label, size = 200, className = '', variant = 'script', id = 'seal' }: Props) {
  const g = (n: string) => `${id}-${n}`

  // Muhrning notekis, oqib qotgan chekkasi
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
        {/* Sur'g'uchning hajmli yaltirashi */}
        <radialGradient id={g('wax')} cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#a83544" />
          <stop offset="42%" stopColor="#7d1f28" />
          <stop offset="80%" stopColor="#5c141c" />
          <stop offset="100%" stopColor="#3d0b11" />
        </radialGradient>

        {/* Botiq markaziy disk */}
        <radialGradient id={g('inner')} cx="42%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#8e2532" />
          <stop offset="70%" stopColor="#6d1a23" />
          <stop offset="100%" stopColor="#4a0f16" />
        </radialGradient>

        <linearGradient id={g('gold')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8cd8a" />
          <stop offset="45%" stopColor="#c9a961" />
          <stop offset="100%" stopColor="#9c7c2c" />
        </linearGradient>

        {/* Yuqoridan tushayotgan yorug'lik dog'i */}
        <radialGradient id={g('shine')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <filter id={g('shadow')} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#3d0b11" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Muhr gavdasi */}
      <path d={blob} fill={`url(#${g('wax')})`} filter={`url(#${g('shadow')})`} />
      <path d={blob} fill="none" stroke="#c9505f" strokeOpacity="0.35" strokeWidth="1.5" />

      {/* Botiq markaz */}
      <circle cx="100" cy="100" r="66" fill={`url(#${g('inner')})`} />
      <circle cx="100" cy="100" r="66" fill="none" stroke="#3d0b11" strokeOpacity="0.5" strokeWidth="2" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="#c9505f" strokeOpacity="0.28" strokeWidth="1" />

      {/* Yorug'lik dog'i */}
      <ellipse cx="76" cy="62" rx="40" ry="26" fill={`url(#${g('shine')})`} transform="rotate(-22 76 62)" />

      {/* Yozuv */}
      {variant === 'script' ? (
        <text
          x="100"
          y="116"
          textAnchor="middle"
          fill={`url(#${g('gold')})`}
          /* SVG atributi var() ni qo'llamaydi, shuning uchun style orqali —
             shrift almashsa shu yer ham o'zi yangilanadi */
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
