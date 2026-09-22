import type { ReactNode } from 'react'
import { bgClass, topEdge, type Skin } from '@core/lib/skin'
import { useReveal } from '@core/lib/useReveal'
import { Flourish } from './decor/Floral'
import { TornEdge } from './decor/TornEdge'

/** Scroll'da mayin paydo bo'ladigan o'ram. */
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

/** Yozma, oltin sarlavha — ikki yonida jimjima bilan. */
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
      <h2 className="font-script text-gilded text-[2.6rem] leading-[1.25] sm:text-5xl">{children}</h2>
      {flourish && <Flourish side="right" className="hidden text-gold-light/70 sm:block" />}
    </div>
  )
}

/** Bo'lim uchun standart o'ram: markazlashtirilgan, chekkalarda bo'sh joy. */
export function Section({
  children,
  className = '',
  id,
  skin,
}: {
  children: ReactNode
  className?: string
  id?: string
  /** Fon rangi va yuqoridagi yirtilgan chekka — App.tsx belgilaydi. */
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

/** Oltin to'ldirilgan tugma. */
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
    'inline-flex w-full items-center justify-center gap-2.5 px-6 py-3.5 font-body text-[0.95rem] tracking-wider-caps transition-all duration-300 active:scale-[0.98] disabled:opacity-55'
  const style =
    variant === 'solid'
      ? 'bg-gold text-paper shadow-[0_6px_18px_-8px_rgba(122,95,31,0.85)] hover:bg-gold-dark'
      : 'border border-gold/45 text-gold hover:bg-gold/8'

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
