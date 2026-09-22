import type { ReactNode } from 'react'
import { bgClass, topEdge, type Skin } from '@core/lib/skin'
import { useReveal } from '@core/lib/useReveal'
import { Flourish } from './decor/Floral'
import { TornEdge } from './decor/TornEdge'

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

export function ScriptTitle({
  children,
  flourish = true,
  className = '',
}: {
  children: ReactNode
  flourish?: boolean
  className?: string
}) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {flourish && <Flourish side="left" className="hidden text-gold-light/70 sm:block" />}
      <h2 className="font-display text-gilded text-[2.2rem] font-bold tracking-wide leading-[1.25] sm:text-4xl uppercase">{children}</h2>
      {flourish && <Flourish side="right" className="hidden text-gold-light/70 sm:block" />}
    </div>
  )
}

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
      className={`paper-grain relative overflow-hidden px-6 py-20 sm:py-24 ${bgClass(skin.bg)} ${className}`}
    >
      {edge && <TornEdge position="top" color={edge} />}
      <div className="relative z-20 mx-auto w-full max-w-lg text-center">{children}</div>
    </section>
  )
}

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
    'inline-flex w-full items-center justify-center gap-2.5 px-6 py-3.5 font-body font-bold text-[0.95rem] tracking-wider-caps transition-all duration-300 active:scale-[0.98] disabled:opacity-55 border-2 border-gold uppercase'
  const style =
    variant === 'solid'
      ? 'bg-transparent text-gold-light hover:bg-gold hover:text-paper shadow-[0_4px_16px_-6px_rgba(212,175,55,0.4)]'
      : 'bg-transparent border-gold/45 text-gold hover:bg-gold/10'

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
