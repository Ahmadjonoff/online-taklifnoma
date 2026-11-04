import { useEffect, useState } from 'react'
import { config } from '../config'
import { lockScroll } from '@core/lib/scrollLock'
import { FloralCorner, Ornament } from './decor/Floral'
import { WaxSeal } from './decor/WaxSeal'

/**
 * Ochilish ekrani: konvert va undan ko'tariladigan xat.
 *
 * NEGA BOSHQA KO'RINISH: bu bazada muhr «yopiq turgan» konvertning o'rtasida
 * turadi, bosilganda tepa qanot ochilib, xat yuqoriga ko'tariladi.
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
    window.setTimeout(() => setPhase('gone'), 1600)
  }

  if (phase === 'gone') return null

  const opening = phase === 'opening'
  const { couple, event } = config
  const kicker = (config as { envelope?: { kicker?: string } }).envelope?.kicker

  return (
    <div
      className="fixed inset-0 z-50 cursor-pointer select-none touch-none overflow-hidden transition-opacity duration-700"
      style={{ opacity: opening ? 0 : 1, transitionDelay: opening ? '800ms' : '0ms' }}
      onClick={open}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
      role="button"
      tabIndex={0}
      aria-label="Taklifnomani ochish"
    >
      {/* Fon: akvarel yuvish */}
      <div className="paper-grain absolute inset-0 bg-paper-2">
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(48% 36% at 14% 8%, color-mix(in srgb, var(--color-sage) 16%, transparent), transparent 70%)',
              'radial-gradient(42% 34% at 90% 18%, var(--color-blush) 0%, transparent 68%)',
              'radial-gradient(58% 42% at 70% 96%, color-mix(in srgb, var(--tpl-accent) 13%, transparent), transparent 72%)',
            ].join(','),
          }}
          aria-hidden="true"
        />
      </div>

      <FloralCorner id="wg-env-tl" position="tl" className="w-[48vw] max-w-[250px]" opacity={0.9} offset={2} />
      <FloralCorner id="wg-env-br" position="br" className="w-[48vw] max-w-[250px]" opacity={0.9} offset={2} />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <p className="tracking-wider-caps font-body text-[0.7rem] text-gold/85">
          {kicker || 'Sizga taklifnoma keldi'}
        </p>
        <Ornament className="mt-4 text-gold/50" width={170} />

        {/* Konvert sahnasi */}
        <div className="relative mx-auto mt-[9rem] h-[13.5rem] w-full max-w-sm">
          {/* Orqa tomon */}
          <div className="absolute inset-0 rounded-2xl border border-gold/20 bg-paper-3" aria-hidden="true" />

          {/* Xat — konvert ichidan ko'tariladi */}
          <div
            className="absolute inset-x-[7%] bottom-4 z-20 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: opening ? 'translateY(-62%)' : 'translateY(0)' }}
          >
            <div className="paper-grain relative rounded-xl border border-gold/25 bg-paper px-6 py-6 text-center shadow-[0_18px_40px_-28px_rgba(40,60,30,0.85)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/35">
                <span className="font-script text-gilded text-lg">{couple.monogram}</span>
              </div>
              <p className="mt-4 font-script text-gilded text-3xl">{couple.groom}</p>
              {couple.bride && (
                <>
                  <span className="font-script block text-base text-gold/60">&amp;</span>
                  <p className="font-script text-gilded text-3xl">{couple.bride}</p>
                </>
              )}
              <p className="mt-3 font-display text-sm tracking-[0.18em] text-gold">
                {event.dateLabel}
                <span className="mx-2 text-gold/35">•</span>
                {event.timeLabel}
              </p>
            </div>
          </div>

          {/* Old tomoni (cho'ntak) */}
          <div
            className="absolute inset-0 z-30 rounded-2xl"
            style={{
              clipPath: 'polygon(0 100%, 0 0, 50% 54%, 100% 0, 100% 100%)',
              background: 'linear-gradient(180deg, var(--color-paper-2) 0%, var(--color-paper-3) 100%)',
              boxShadow: '0 -14px 30px -22px rgba(40,60,30,0.7)',
            }}
            aria-hidden="true"
          />

          {/* Muhr — cho'ntak uchida */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              open()
            }}
            className="absolute left-1/2 top-[52%] z-40 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-300 active:scale-95"
            aria-label="Muhrni bosib ochish"
          >
            <span
              className="block transition-all duration-[900ms] ease-out"
              style={{
                transform: opening ? 'translateY(-14px) scale(1.5) rotate(-16deg)' : 'none',
                opacity: opening ? 0 : 1,
              }}
            >
              <span className="animate-pulse-soft block">
                <WaxSeal id="wg-env-seal" label={couple.monogram} size={116} variant="script" />
              </span>
            </span>
          </button>
        </div>

        <p
          className="mt-6 font-body text-[0.82rem] tracking-wide text-gold/80 transition-opacity duration-500"
          style={{ opacity: opening ? 0 : 1 }}
        >
          Ochish uchun muhrga bosing
        </p>
      </div>
    </div>
  )
}
