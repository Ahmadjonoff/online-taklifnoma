import { useEffect, useState } from 'react'
import { config } from '@config'
import { WaxSeal } from '@decor/WaxSeal'
import { lockScroll } from '../lib/scrollLock'

/**
 * Ochilish ekrani — "ko'tarilish" mexanikasi: taklifnoma kartasi pastda
 * biroz og'ib turadi, bosilganda tepaga uchib ketadi.
 */
export function EnvelopeRise({ onOpen }: { onOpen: () => void }) {
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
      className="fixed inset-0 z-50 cursor-pointer select-none overflow-hidden bg-paper-3 transition-opacity duration-700"
      style={{ opacity: opening ? 0 : 1, transitionDelay: opening ? '650ms' : '0ms' }}
      onClick={open}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
      role="button"
      tabIndex={0}
      aria-label="Taklifnomani ochish"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 opacity-60"
        style={{ background: 'linear-gradient(0deg, var(--color-paper-2) 0%, transparent 100%)' }}
        aria-hidden="true"
      />

      <div className="relative flex h-full items-end justify-center pb-[12%]">
        <div
          className="paper-grain flex w-[82%] max-w-sm origin-bottom flex-col items-center rounded-2xl border border-gold/25 bg-paper px-6 py-9 text-center shadow-[0_30px_60px_-25px_rgba(0,0,0,0.35)] transition-all duration-[1100ms] ease-[cubic-bezier(0.5,0,0.25,1)]"
          style={{
            transform: opening
              ? 'translateY(-135vh) rotate(-6deg) scale(0.92)'
              : 'translateY(0) rotate(-1.5deg) scale(1)',
            opacity: opening ? 0 : 1,
          }}
        >
          <p className="tracking-wider-caps font-body text-[0.66rem] text-gold-dark/80">
            {event.kicker || 'Sizga taklifnoma keldi'}
          </p>

          <h1 className="mt-5 flex flex-col items-center leading-[1.05]">
            {couple.groom && (
              <span className="font-display text-gilded text-2xl tracking-[0.05em] sm:text-4xl">
                {couple.groom}
              </span>
            )}
            {couple.groom && couple.bride && (
              <span className="font-script my-1 text-base text-gold-dark/70">&amp;</span>
            )}
            {couple.bride && (
              <span className="font-display text-gilded text-2xl tracking-[0.05em] sm:text-4xl">
                {couple.bride}
              </span>
            )}
          </h1>

          <p className="mt-4 font-body text-[0.85rem] tracking-[0.12em] text-ink-soft">
            {event.dateLabel}
            <span className="mx-2 text-gold-dark/40">•</span>
            {event.timeLabel}
          </p>

          <div className="mt-6 animate-float">
            <WaxSeal id="rise-env" label={couple.monogram} size={82} variant="caps" />
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-[4%] flex flex-col items-center gap-1 transition-opacity duration-500"
        style={{ opacity: opening ? 0 : 1 }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="animate-float text-gold-dark/60" aria-hidden="true">
          <path d="M4 7l5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 9 9)" />
        </svg>
        <span className="tracking-wider-caps font-body text-[0.72rem] text-gold-dark/85">
          Ochish uchun bosing
        </span>
      </div>
    </div>
  )
}
