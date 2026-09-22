import type { ReactNode } from 'react'
import { bgClass, topEdge, type Skin } from '../lib/skin'
import { useReveal } from '../lib/useReveal'
import { Flourish, Ornament } from '@decor/Floral'
import { TornEdge } from '@decor/TornEdge'

/**
 * Yangi (taklif-link uslubidagi) shablonlar uchun umumiy UI primitivlari.
 *
 * NEGA UMUMIY: har bir baza o'z `components/ui.tsx` faylida shu modulni
 * re-export qiladi, `@ui` alias esa o'sha faylga ishora qiladi. Shu tufayli
 * `core/` dagi bo'limlar (Blessing, Rsvp, Wishes...) uchun bitta implementatsiya
 * yetarli, bazalar esa faqat o'z palitrasi va chekka uslubini beradi.
 */

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
      <h2 className="font-script text-gilded text-[2.5rem] leading-[1.25] sm:text-5xl">{children}</h2>
      {flourish && <Flourish side="right" className="hidden text-gold-light/70 sm:block" />}
    </div>
  )
}

/** Bo'lim ustidagi kichik harfli yorliq (masalan «02-bob», «Sana va vaqt»). */
export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`tracking-wider-caps font-body text-[0.72rem] text-gold/80 ${className}`}>
      {children}
    </p>
  )
}

/** Sarlavha + jimjima ajratgich — bo'lim boshida ishlatiladi. */
export function OrnamentedTitle({
  children,
  kicker,
}: {
  children: ReactNode
  kicker?: ReactNode
}) {
  return (
    <Reveal>
      {kicker && <Kicker className="mb-3">{kicker}</Kicker>}
      <ScriptTitle flourish={false}>{children}</ScriptTitle>
      <Ornament className="mx-auto mt-4 text-gold/45" width={170} />
    </Reveal>
  )
}

/** Bo'lim uchun standart o'ram: fon rangi va qo'shni bo'limdan olingan chekka. */
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

/** Shisha-oq kartochka — yangi bo'limlar (kalendar, xonandalar) uchun. */
export function Card({
  children,
  className = '',
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li'
}) {
  const Tag = as
  return (
    <Tag
      className={`rounded-2xl border border-gold/22 bg-paper/65 p-5 backdrop-blur-sm shadow-[0_10px_30px_-24px_rgba(60,40,10,0.9)] ${className}`}
    >
      {children}
    </Tag>
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
  variant?: 'solid' | 'outline' | 'ghost'
  disabled?: boolean
  className?: string
}) {
  const base =
    'inline-flex w-full items-center justify-center gap-2.5 px-6 py-3.5 font-body text-[0.95rem] tracking-wider-caps transition-all duration-300 active:scale-[0.98] disabled:opacity-55 rounded-full'
  const style =
    variant === 'solid'
      ? 'bg-gold text-paper shadow-[0_6px_18px_-8px_rgba(122,95,31,0.85)] hover:bg-gold-dark'
      : variant === 'outline'
        ? 'border border-gold/45 text-gold hover:bg-gold/10'
        : 'text-gold hover:text-gold-dark'

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
