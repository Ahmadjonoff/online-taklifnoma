import type { ReactNode } from 'react'
import { bgClass, topEdge, type Skin } from '@core/lib/skin'
import { useReveal } from '@core/lib/useReveal'

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/** Katta, tekislangan sarlavha — professional, dekoratsiyasiz. */
export function ScriptTitle({
  children,
  className = '',
}: {
  children: ReactNode
  /** Nomga qaramay bu yerda jimjima chizilmaydi — API mosligi uchun saqlangan. */
  flourish?: boolean
  className?: string
}) {
  return (
    <h2 className={`font-display text-[2rem] font-semibold leading-tight text-ink sm:text-[2.6rem] ${className}`}>
      {children}
    </h2>
  )
}

/** Bo'lim o'rami: nozik chiziqli chegara, qog'oz teksturasi va jimjimasiz. */
export function Section({
  children,
  className = '',
  id,
  skin,
}: {
  children: ReactNode
  className?: string
  id?: string
  skin: Skin
}) {
  const edge = topEdge(skin)
  return (
    <section
      id={id}
      className={`relative overflow-hidden px-6 py-20 sm:py-24 ${bgClass(skin.bg)} ${className}`}
    >
      {edge && <div className="absolute inset-x-0 top-0 border-t border-ink/10" aria-hidden="true" />}
      <div className="relative z-20 mx-auto w-full max-w-lg text-center">{children}</div>
    </section>
  )
}

/** To'g'ri burchakli, qattiq tugma — soya va gradientsiz. */
export function GoldButton({
  children,
  onClick,
  href,
  type = 'button',
  variant = 'solid',
  disabled = false,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  href?: string
  type?: 'button' | 'submit'
  variant?: 'solid' | 'outline'
  disabled?: boolean
  className?: string
}) {
  const base =
    'inline-flex w-full items-center justify-center gap-2.5 px-6 py-3.5 font-body text-[0.95rem] tracking-wider-caps transition-all duration-200 active:scale-[0.98] disabled:opacity-55'
  const style =
    variant === 'solid'
      ? 'bg-ink text-paper hover:bg-gold'
      : 'border border-ink/30 text-ink hover:border-ink'

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${style} ${className}`}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${style} ${className}`}>
      {children}
    </button>
  )
}
