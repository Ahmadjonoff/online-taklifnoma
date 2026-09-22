import { config } from '../config'
import { bgClass, type Skin } from '@core/lib/skin'
import { FloralCorner, Ornament } from './decor/Floral'
import { Reveal } from './ui'

/**
 * Birinchi ekran: akvarel yuvish fonida yozma ismlar.
 *
 * Fon bir nechta `radial-gradient` qatlamidan yig'iladi — rasm fayli kerak
 * emas, rang esa palitradan (`--tpl-accent`) olinadi.
 */
export function Hero({ bg }: Skin) {
  const { couple, event } = config
  const photo = (couple as { photo?: string }).photo

  return (
    <section
      className={`paper-grain relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-16 ${bgClass(bg)}`}
    >
      {/* Akvarel yuvish */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'radial-gradient(52% 40% at 16% 12%, color-mix(in srgb, var(--tpl-accent) 16%, transparent), transparent 70%)',
            'radial-gradient(45% 38% at 88% 26%, var(--color-blush) 0%, transparent 68%)',
            'radial-gradient(60% 45% at 62% 88%, color-mix(in srgb, var(--color-sage) 14%, transparent), transparent 72%)',
          ].join(','),
        }}
        aria-hidden="true"
      />

      <FloralCorner id="wg-hero-tl" position="tl" className="w-[52vw] max-w-[260px]" opacity={0.9} offset={4} />

      <div className="relative z-20 flex w-full max-w-md flex-col items-center text-center">
        <Reveal delay={150}>
          <p className="font-script text-gilded text-2xl sm:text-3xl">{event.kicker}</p>
        </Reveal>

        {photo && (
          <Reveal delay={300}>
            <div className="mt-6 h-40 w-32 overflow-hidden rounded-t-full border border-gold/25 shadow-[0_20px_45px_-32px_rgba(40,60,30,0.9)]">
              <img src={photo} alt="" className="h-full w-full object-cover" />
            </div>
          </Reveal>
        )}

        <Reveal delay={450}>
          <h1 className="mt-7 flex flex-col items-center leading-[0.95]">
            <span className="font-script text-gilded text-[3.2rem] sm:text-7xl">{couple.groom}</span>
            {couple.bride && (
              <>
                <span className="font-script my-0.5 text-2xl text-gold/60">&amp;</span>
                <span className="font-script text-gilded text-[3.2rem] sm:text-7xl">{couple.bride}</span>
              </>
            )}
          </h1>
        </Reveal>

        <Reveal delay={700}>
          <Ornament className="mt-7 text-gold/45" width={180} />
        </Reveal>

        <Reveal delay={850}>
          <p className="mt-5 font-display text-xl tracking-[0.16em] text-gold sm:text-2xl">
            {event.dateLabel}
            <span className="mx-2.5 text-gold/35">•</span>
            {event.timeLabel}
          </p>
        </Reveal>

        <Reveal delay={1000}>
          <div className="mt-11 flex flex-col items-center gap-1.5">
            <span className="font-script text-xl text-gold/75">Pastga suring</span>
            <svg width="24" height="11" viewBox="0 0 26 12" fill="none" className="animate-float text-gold/55" aria-hidden="true">
              <path d="M2 2l11 8 11-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
        </Reveal>
      </div>

      <FloralCorner id="wg-hero-br" position="br" className="w-[52vw] max-w-[260px]" opacity={0.9} offset={4} />
    </section>
  )
}
