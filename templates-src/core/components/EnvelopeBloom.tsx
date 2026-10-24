import { useEffect, useState } from 'react'
import { config } from '@config'
import { WaxSeal } from '@decor/WaxSeal'
import { lockScroll } from '../lib/scrollLock'

/**
 * Ochilish ekrani — "gullash" mexanikasi: muhrdan chiqqan doira asta kengayib,
 * butun ekranni tilla rangga bo'yaydi, so'ng butun parda so'nadi.
 */
export function EnvelopeBloom({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<'closed' | 'blooming' | 'opening' | 'gone'>('closed')

  useEffect(() => {
    if (phase === 'gone') return
    return lockScroll()
  }, [phase])

  function open() {
    if (phase !== 'closed') return
    setPhase('blooming')
    window.setTimeout(() => {
      setPhase('opening')
      onOpen()
    }, 650)
    window.setTimeout(() => setPhase('gone'), 1650)
  }

  if (phase === 'gone') return null

  const blooming = phase === 'blooming' || phase === 'opening'
  const opening = phase === 'opening'
  const { couple, event } = config
  // Konvertdagi yozuv (mijoz yozgan) yoki shaxsiy havolada «Hurmatli Aziz aka!»
  const envelopeText = (config as unknown as { envelope?: { kicker?: string } }).envelope?.kicker

  return (
    <div
      className="fixed inset-0 z-50 cursor-pointer select-none touch-none overflow-hidden bg-paper transition-opacity duration-700"
      style={{ opacity: opening ? 0 : 1, transitionDelay: opening ? '350ms' : '0ms' }}
      onClick={open}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
      role="button"
      tabIndex={0}
      aria-label="Taklifnomani ochish"
    >
      {/* Gullovchi doira */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ease-[cubic-bezier(0.3,0,0.2,1)]"
        style={{
          width: blooming ? '260vmax' : '10px',
          height: blooming ? '260vmax' : '10px',
          transitionDuration: '1000ms',
          background:
            'radial-gradient(circle, var(--color-gold-light) 0%, var(--color-gold) 55%, var(--color-gold-dark) 100%)',
        }}
        aria-hidden="true"
      />

      <div
        className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center transition-opacity duration-500"
        style={{ opacity: blooming ? 0 : 1 }}
      >
        <p className="tracking-wider-caps font-body text-[0.68rem] text-gold-dark/80">
          {envelopeText || event.kicker || 'Sizga taklifnoma keldi'}
        </p>

        <div className="mt-6 transition-transform duration-500" style={{ transform: blooming ? 'scale(0.4)' : 'scale(1)' }}>
          <div className="animate-pulse-soft">
            <WaxSeal id="bloom-env" label={couple.monogram} size={132} variant="script" />
          </div>
        </div>

        <h1 className="mt-6 flex flex-col items-center leading-[1.05]">
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

        <span className="mt-8 tracking-wider-caps font-body text-[0.75rem] text-gold-dark/85">
          Ochish uchun bosing
        </span>
      </div>
    </div>
  )
}
