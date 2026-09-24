import { useEffect, useState } from 'react'
import { config } from '../config'
import { lockScroll } from '@core/lib/scrollLock'
import { FloralCorner, Ornament } from './decor/Floral'
import { WaxSeal } from './decor/WaxSeal'

/**
 * Ochilish ekrani: tilla hoshiyali taklifnoma kartasi + mum muhr.
 *
 * Muhr bosilganda karta kattalashib so'nadi, muhr esa «sinadi» (kattalashib
 * burilib yo'qoladi) — keyin taklifnoma ko'rinadi.
 */
export function Envelope({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'gone'>('closed')

  // Konvert yopiq turganda sahifa aylanmasin.
  //
  // DIQQAT: pastdagi `return null` komponentni unmount QILMAYDI — App uni doim
  // render qiladi. Shuning uchun bog'liqlik `[phase]` bo'lishi shart.
  useEffect(() => {
    if (phase !== 'closed') return
    return lockScroll()
  }, [phase])

  function open() {
    if (phase !== 'closed') return
    setPhase('opening')
    onOpen() // musiqani foydalanuvchi harakatidan keyin yoqamiz
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
      {/* Fon: qog'oz + bo'rtma naqsh */}
      <div className="paper-grain absolute inset-0 bg-paper-2">
        <EmbossedPattern />
      </div>

      {/* Ikki qatlamli tilla hoshiya */}
      <div className="pointer-events-none absolute inset-3 border border-gold/25 sm:inset-6" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-5 border border-gold/12 sm:inset-8" aria-hidden="true" />

      <FloralCorner id="env-tl" position="tl" className="w-[44vw] max-w-[240px]" opacity={0.85} offset={6} />
      <FloralCorner id="env-br" position="br" className="w-[44vw] max-w-[240px]" opacity={0.85} offset={6} />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8">
        <div
          className="flex w-full max-w-sm flex-col items-center text-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: opening ? 'scale(1.06)' : 'scale(1)' }}
        >
          <p className="tracking-wider-caps font-body text-[0.7rem] text-gold/85">
            {kicker || 'Sizga taklifnoma keldi'}
          </p>

          <Ornament className="mt-4 text-gold/50" width={170} />

          {/* Monogramma — ikki halqali oval */}
          <div className="mt-7 flex h-24 w-24 items-center justify-center rounded-full border border-gold/40">
            <div className="flex h-[5.25rem] w-[5.25rem] items-center justify-center rounded-full border border-gold/25">
              <span className="font-script text-gilded text-2xl">{couple.monogram}</span>
            </div>
          </div>

          <h1 className="mt-6 flex flex-col items-center leading-tight">
            <span className="font-script text-gilded text-4xl">{couple.groom}</span>
            {couple.bride && (
              <>
                <span className="font-script my-0.5 text-lg text-gold/60">&amp;</span>
                <span className="font-script text-gilded text-4xl">{couple.bride}</span>
              </>
            )}
          </h1>

          <p className="mt-5 font-display text-lg tracking-[0.16em] text-gold">
            {event.dateLabel}
            <span className="mx-2 text-gold/40">•</span>
            {event.timeLabel}
          </p>

          <Ornament className="mt-5 text-gold/40" width={150} />

          {/* Muhr — bosiladigan tugma */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              open()
            }}
            className="mt-6 rounded-full transition-transform duration-300 active:scale-95"
            aria-label="Muhrni bosib ochish"
          >
            <span
              className="block transition-all duration-[900ms] ease-out"
              style={{
                transform: opening ? 'translateY(-6px) scale(1.55) rotate(16deg)' : 'none',
                opacity: opening ? 0 : 1,
              }}
            >
              <span className="animate-pulse-soft block">
                <WaxSeal id="env-seal" label={couple.monogram} size={128} variant="script" />
              </span>
            </span>
          </button>

          <p
            className="mt-2 font-body text-[0.82rem] tracking-wide text-gold/80 transition-opacity duration-500"
            style={{ opacity: opening ? 0 : 1 }}
          >
            Ochish uchun muhrga bosing
          </p>
        </div>
      </div>
    </div>
  )
}

/** Konvert qog'ozidagi ko'zga zo'rg'a tashlanadigan bo'rtma gul naqshi. */
function EmbossedPattern() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.5]" aria-hidden="true">
      <defs>
        <pattern id="luxe-emboss" width="76" height="96" patternUnits="userSpaceOnUse" patternTransform="rotate(-8) scale(0.95)">
          <g fill="none" stroke="var(--color-gold-dark)" strokeOpacity="0.18" strokeWidth="0.8" strokeLinecap="round">
            <Sprig />
            <g transform="translate(40 48) rotate(6)">
              <Sprig />
            </g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#luxe-emboss)" />
    </svg>
  )
}

/** Naqshning bir dona novdasi: poya, to'rt barg va uchida kichkina gul. */
function Sprig() {
  return (
    <g transform="scale(0.42)">
      <path d="M30 145C30 110 34 80 46 52" />
      <path d="M31 128c-9-3-13-10-11-16 7-1 12 5 11 16Z" fill="var(--color-gold-dark)" fillOpacity="0.12" />
      <path d="M33 112c9-4 13-11 10-17-7 0-12 6-10 17Z" fill="var(--color-gold-dark)" fillOpacity="0.12" />
      <path d="M36 94c-9-3-13-10-11-16 7-1 12 5 11 16Z" fill="var(--color-gold-dark)" fillOpacity="0.12" />
      <path d="M40 76c9-4 13-11 10-17-7 0-12 6-10 17Z" fill="var(--color-gold-dark)" fillOpacity="0.12" />
      <g transform="translate(48 44)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="-8" rx="5.5" ry="7.5" fill="var(--color-gold-dark)" fillOpacity="0.1" transform={`rotate(${a})`} />
        ))}
        <circle cx="0" cy="0" r="2.6" fill="var(--color-gold-dark)" fillOpacity="0.16" />
      </g>
    </g>
  )
}
