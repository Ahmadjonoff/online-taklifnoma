import { config } from '../config'
import { bgClass, type Skin } from '@core/lib/skin'
import { FloralCorner, Ornament } from './decor/Floral'
import { Reveal } from './ui'

/**
 * Birinchi ekran: tilla hoshiya ichida sana, ismlar va portret.
 *
 * NEGA HOSHIYA: «premium» hissi asosan ramka va nafas oladigan bo'sh joydan
 * keladi — shuning uchun ikki qatlamli ingichka tilla chiziq va keng padding.
 */
export function Hero({ bg }: Skin) {
  const { couple, event } = config
  const photo = (couple as { photo?: string }).photo

  return (
    <section
      className={`paper-grain relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-16 ${bgClass(bg)}`}
    >
      {/* Ikki qatlamli tilla hoshiya */}
      <div className="pointer-events-none absolute inset-3 border border-gold/25 sm:inset-6" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-5 border border-gold/12 sm:inset-8" aria-hidden="true" />

      {/* Mayin oltin nur */}
      <div
        className="animate-shimmer pointer-events-none absolute left-1/2 top-[38%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-gold) 0%, transparent 68%)', opacity: 0.16 }}
        aria-hidden="true"
      />

      <div className="relative z-20 flex w-full max-w-md flex-col items-center text-center">
        <Reveal delay={150}>
          <p className="tracking-wider-caps font-body text-[0.72rem] text-gold/85">{event.kicker}</p>
        </Reveal>

        <Reveal delay={320}>
          <Ornament className="mt-4 text-gold/50" width={180} />
        </Reveal>

        {photo && (
          <Reveal delay={420}>
            <div className="mt-7 h-44 w-36 overflow-hidden rounded-t-full border border-gold/35 shadow-[0_24px_50px_-32px_rgba(60,40,10,0.95)]">
              <img src={photo} alt="" className="h-full w-full object-cover" />
            </div>
          </Reveal>
        )}

        <Reveal delay={520}>
          <h1 className="mt-6 flex flex-col items-center leading-[0.95]">
            <span className="font-script text-gilded text-[3.4rem] sm:text-7xl">{couple.groom}</span>
            {couple.bride && (
              <>
                <span className="font-script my-0.5 text-2xl text-gold/65 sm:text-3xl">&amp;</span>
                <span className="font-script text-gilded text-[3.4rem] sm:text-7xl">{couple.bride}</span>
              </>
            )}
          </h1>
        </Reveal>

        <Reveal delay={780}>
          <div className="mt-7 flex items-center justify-center gap-3 font-display text-xl tracking-[0.16em] text-gold sm:text-2xl">
            <span>{event.dateLabel}</span>
            <span className="text-gold/40">|</span>
            <span>{event.timeLabel}</span>
          </div>
        </Reveal>

        <Reveal delay={1000}>
          <div className="mt-12 flex flex-col items-center gap-1.5">
            <span className="font-script text-xl text-gold/75">Pastga suring</span>
            <svg width="24" height="11" viewBox="0 0 26 12" fill="none" className="animate-float text-gold/55" aria-hidden="true">
              <path d="M2 2l11 8 11-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
        </Reveal>
      </div>

      <FloralCorner id="hero-l" position="bl" className="w-[46vw] max-w-[240px]" opacity={0.9} offset={10} />
      <FloralCorner id="hero-r" position="br" className="w-[46vw] max-w-[240px]" opacity={0.9} offset={10} />
    </section>
  )
}
