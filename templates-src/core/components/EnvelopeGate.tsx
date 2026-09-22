import { useEffect, useState } from 'react'
import { config } from '@config'
import { WaxSeal } from '@decor/WaxSeal'
import { lockScroll } from '../lib/scrollLock'

/**
 * Ochilish ekrani — "parda" mexanikasi: ism/sana markazda doim ko'rinib
 * turadi, ikki yon "parda" esa bosilganda tashqariga siljib ochiladi.
 *
 * MUHIM: matn hech qachon eshiklar ORQASIGA yashirilmaydi — faqat dekorativ
 * chekka sifatida ishlaydi. Aks holda foydalanuvchi kim taklif qilinayotganini
 * bosmasdan bila olmaydi (aynan shu — "bo'sh konvert" muammosi edi).
 */
export function EnvelopeGate({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'gone'>('closed')

  useEffect(() => {
    if (phase !== 'closed') return
    return lockScroll()
  }, [phase])

  function open() {
    if (phase !== 'closed') return
    setPhase('opening')
    onOpen()
    window.setTimeout(() => setPhase('gone'), 1500)
  }

  if (phase === 'gone') return null

  const opening = phase === 'opening'
  const { couple, event } = config

  return (
    <div
      className="fixed inset-0 z-50 cursor-pointer select-none overflow-hidden bg-paper-2 transition-opacity duration-700"
      style={{ opacity: opening ? 0 : 1, transitionDelay: opening ? '650ms' : '0ms' }}
      onClick={open}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
      role="button"
      tabIndex={0}
      aria-label="Taklifnomani ochish"
    >
      {/* Markaz — doim ko'rinadi */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-10 text-center">
        <p className="tracking-wider-caps font-body text-[0.68rem] text-gold-dark/80">
          {event.kicker || 'Sizga taklifnoma keldi'}
        </p>

        <h1 className="mt-5 flex flex-col items-center leading-[1.05]">
          {couple.groom && (
            <span className="font-display text-gilded text-3xl tracking-[0.06em] sm:text-5xl">
              {couple.groom}
            </span>
          )}
          {couple.groom && couple.bride && (
            <span className="font-script my-1 text-lg text-gold-dark/70">&amp;</span>
          )}
          {couple.bride && (
            <span className="font-display text-gilded text-3xl tracking-[0.06em] sm:text-5xl">
              {couple.bride}
            </span>
          )}
        </h1>

        <p className="mt-5 font-body text-[0.95rem] tracking-[0.14em] text-ink-soft">
          {event.dateLabel}
          <span className="mx-2.5 text-gold-dark/40">•</span>
          {event.timeLabel}
        </p>

        <div
          className="mt-8 transition-transform duration-[700ms] ease-out"
          style={{ transform: opening ? 'scale(0.65)' : 'scale(1)', opacity: opening ? 0 : 1 }}
        >
          <div className="animate-pulse-soft">
            <WaxSeal id="gate-env" label={couple.monogram} size={92} variant="script" />
          </div>
        </div>

        <span className="mt-7 tracking-wider-caps font-body text-[0.72rem] text-gold-dark/85">
          Ochish uchun bosing
        </span>
      </div>

      {/* Chap parda */}
      <div
        className="paper-grain pointer-events-none absolute inset-y-0 left-0 w-[18%] border-r border-gold/25 bg-paper transition-transform duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{ transform: opening ? 'translateX(-100%)' : 'translateX(0)' }}
      >
        <GateOrnament flip={false} />
      </div>

      {/* O'ng parda */}
      <div
        className="paper-grain pointer-events-none absolute inset-y-0 right-0 w-[18%] border-l border-gold/25 bg-paper transition-transform duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{ transform: opening ? 'translateX(100%)' : 'translateX(0)' }}
      >
        <GateOrnament flip />
      </div>
    </div>
  )
}

function GateOrnament({ flip }: { flip: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-y-10 flex flex-col items-center justify-between opacity-70 ${
        flip ? 'left-4' : 'right-4'
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5.5" stroke="var(--color-gold)" strokeWidth="1" />
      </svg>
      <svg width="2" height="60%" viewBox="0 0 2 100" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <line x1="1" y1="0" x2="1" y2="100" stroke="var(--color-gold)" strokeWidth="1" strokeOpacity="0.3" />
      </svg>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5.5" stroke="var(--color-gold)" strokeWidth="1" />
      </svg>
    </div>
  )
}
