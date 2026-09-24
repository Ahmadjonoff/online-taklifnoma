import { useEffect, useState } from 'react'
import { config } from '../config'
import { lockScroll } from '@core/lib/scrollLock'
import { FloralCorner, Ornament } from './decor/Floral'
import { WaxSeal } from './decor/WaxSeal'

/**
 * Ochilish ekrani: qorong'i gradient, muhr o'rniga tilla monogramma halqasi va
 * «Boshlash uchun bosing» tugmasi.
 */
export function Envelope({ onOpen }: { onOpen: () => void }) {
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
  const kicker = (config as { envelope?: { kicker?: string } }).envelope?.kicker

  return (
    <div
      className="fixed inset-0 z-50 cursor-pointer select-none touch-none overflow-hidden transition-opacity duration-700"
      style={{ opacity: opening ? 0 : 1, transitionDelay: opening ? '700ms' : '0ms' }}
      onClick={open}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
      role="button"
      tabIndex={0}
      aria-label="Taklifnomani ochish"
    >
      {/* Fon */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(165deg, var(--tpl-grad-a) 0%, var(--color-paper) 48%, var(--tpl-grad-b) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="animate-shimmer pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: 'var(--tpl-accent)', opacity: 0.18 }}
        aria-hidden="true"
      />
      <FloralCorner id="ng-env-br" position="br" className="w-[60vw] max-w-[320px]" opacity={0.7} offset={-40} />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8">
        <div
          className="flex w-full max-w-sm flex-col items-center text-center transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: opening ? 'scale(1.05)' : 'scale(1)',
            opacity: opening ? 0 : 1,
          }}
        >
          <p className="tracking-wider-caps font-body text-[0.68rem] text-gold/80">
            {kicker || 'Sizga taklifnoma keldi'}
          </p>

          <Ornament className="mt-5 text-gold/45" width={170} />

          <h1 className="mt-8 flex flex-col items-center leading-[1.05]">
            <span className="font-display text-gilded text-3xl tracking-[0.08em] sm:text-5xl">
              {couple.groom}
            </span>
            <span className="font-script my-1 text-lg text-gold/60">&amp;</span>
            {couple.bride && (
              <span className="font-display text-gilded text-3xl tracking-[0.08em] sm:text-5xl">
                {couple.bride}
              </span>
            )}
          </h1>

          <p className="mt-6 font-body text-[1rem] tracking-[0.16em] text-gold/90">
            {event.dateLabel}
            <span className="mx-2.5 text-gold/35">•</span>
            {event.timeLabel}
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              open()
            }}
            className="group mt-10 flex flex-col items-center gap-3 active:scale-95"
            aria-label="Muhrni bosib ochish"
          >
            <span
              className="block transition-all duration-[900ms] ease-out"
              style={{
                transform: opening ? 'scale(1.4) rotate(10deg)' : 'none',
                opacity: opening ? 0 : 1,
              }}
            >
              <span className="animate-pulse-soft block">
                <WaxSeal id="ng-env-seal" label={couple.monogram} size={150} variant="caps" />
              </span>
            </span>
          </button>

          <p
            className="mt-3 font-display text-sm tracking-[0.2em] text-gold/85 transition-opacity duration-500"
            style={{ opacity: opening ? 0 : 1 }}
          >
            BOSHLASH UCHUN BOSING
          </p>
        </div>
      </div>
    </div>
  )
}
