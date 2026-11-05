/**
 * «Noir» chekkasi — yirtiq emas, qo'shni bo'lim rangiga yumshoq singib ketadigan
 * gradient parda.
 *
 * NEGA: qorong'i, gradientli dizaynda o'tkir chekka «yamoq» bo'lib ko'rinadi.
 */
type Props = {
  position: 'top' | 'bottom'
  color: string
  className?: string
}

export function TornEdge({ position, color, className = '' }: Props) {
  const from = position === 'top' ? color : 'transparent'
  const to = position === 'top' ? 'transparent' : color

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-10 ${
        position === 'top' ? 'top-0' : 'bottom-0'
      } ${className}`}
      aria-hidden="true"
    >
      <div
        className="h-16 w-full"
        style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}
      />
      <div
        className="h-px w-full opacity-45"
        style={{
          background: 'linear-gradient(to right, transparent, var(--color-gold), transparent)',
          marginTop: position === 'top' ? '-1px' : '0',
        }}
      />
    </div>
  )
}
