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
  // Shaxsiy mehmon havolasida: "Hurmatli Aziz aka!" (Luxury)
  const personal = (config as unknown as { envelope?: { kicker?: string } }).envelope?.kicker

  return (
    <div
      className="fixed inset-0 z-50 cursor-pointer select-none touch-none overflow-hidden bg-paper-3 transition-opacity duration-700"
      style={{ opacity: opening ? 0 : 1, transitionDelay: opening ? '650ms' : '0ms' }}
      onClick={open}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
      role="button"
      tabIndex={0}
      aria-label="Taklifnomani ochish"
    >
      {/* Orqa fon: karta ortidan taraladigan yumshoq oltin nur + chetlarda soya */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 45% at 50% 48%, color-mix(in oklab, var(--color-gold) 22%, transparent) 0%, transparent 70%),' +
            'radial-gradient(120% 90% at 50% 50%, transparent 55%, color-mix(in oklab, var(--color-ink) 18%, transparent) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Karta ekran markazida (avval pastda turardi) */}
      <div className="relative flex h-full items-center justify-center px-6 pb-14">
        <div
          className="paper-grain relative w-full max-w-[21rem] origin-bottom rounded-[1.25rem] bg-paper p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55),0_0_0_1px_color-mix(in_oklab,var(--color-gold)_35%,transparent)] transition-all duration-[1100ms] ease-[cubic-bezier(0.5,0,0.25,1)]"
          style={{
            transform: opening
              ? 'translateY(-135vh) rotate(-6deg) scale(0.92)'
              : 'translateY(0) rotate(0deg) scale(1)',
            opacity: opening ? 0 : 1,
          }}
        >
          {/* Ichki oltin ramka + burchak naqshlari */}
          <div className="relative flex flex-col items-center rounded-[0.9rem] border border-gold/45 px-7 pb-10 pt-11 text-center">
            {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
              <CornerFlourish key={c} corner={c} />
            ))}

            <p className="tracking-wider-caps font-body text-[0.64rem] text-gold-dark/85">
              {personal || event.kicker || 'Sizga taklifnoma keldi'}
            </p>
            <Divider />

            <h1 className="mt-6 flex flex-col items-center leading-[1.02]">
              {couple.groom && (
                <span className="font-script text-gilded text-[2.6rem] sm:text-5xl">{couple.groom}</span>
              )}
              {couple.groom && couple.bride && (
                <span className="font-display my-1 text-sm italic tracking-[0.3em] text-gold-dark/70">&amp;</span>
              )}
              {couple.bride && (
                <span className="font-script text-gilded text-[2.6rem] sm:text-5xl">{couple.bride}</span>
              )}
            </h1>

            <p className="mt-6 font-display text-[0.95rem] tracking-[0.22em] text-ink">
              {event.dateLabel}
              <span className="mx-2.5 text-gold/60">|</span>
              {event.timeLabel}
            </p>

            <div className="mt-8 animate-float">
              <WaxSeal id="rise-env" label={couple.monogram} size={86} variant="caps" />
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-[5%] flex flex-col items-center gap-1 transition-opacity duration-500"
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

/** Sarlavha ostidagi nozik chiziq va olmos */
function Divider() {
  return (
    <div className="mt-3 flex items-center gap-2 text-gold/70" aria-hidden="true">
      <span className="h-px w-10 bg-current" />
      <span className="h-1.5 w-1.5 rotate-45 bg-current" />
      <span className="h-px w-10 bg-current" />
    </div>
  )
}

/** Ramka burchagidagi oltin naqsh */
function CornerFlourish({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const pos = {
    tl: 'left-1.5 top-1.5',
    tr: 'right-1.5 top-1.5 -scale-x-100',
    bl: 'left-1.5 bottom-1.5 -scale-y-100',
    br: 'right-1.5 bottom-1.5 -scale-100',
  }[corner]
  return (
    <svg
      className={`pointer-events-none absolute h-9 w-9 text-gold/70 ${pos}`}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 20V6a4 4 0 0 1 4-4h14" stroke="currentColor" strokeWidth="1" />
      <path d="M7 16V9a2 2 0 0 1 2-2h7" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
      <circle cx="6" cy="6" r="1.6" fill="currentColor" />
      <path d="M13 2c1.5 2 1.5 4 0 5M2 13c2 1.5 4 1.5 5 0" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  )
}
