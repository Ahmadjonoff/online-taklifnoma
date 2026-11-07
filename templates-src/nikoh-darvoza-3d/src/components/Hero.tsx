import { config } from '../config'
import { bgClass, type Skin } from '@core/lib/skin'
import { FloralCorner, Ornament } from './decor/Floral'
import { Reveal } from './ui'

/**
 * Birinchi ekran: qorong'i gradient, katta displey shrifti va tilla chiziq.
 *
 * NEGA KATTA SHRIFT: bu bazada «kinematografik» kayfiyat kerak — yozma shrift
 * o'rniga katta serif harflar va keng harf oraliqlari ishlatiladi.
 */
export function Hero({ bg }: Skin) {
  const { couple, event } = config
  const photo = (couple as { photo?: string }).photo

  return (
    <section
      className={`relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-16 ${bgClass(bg)}`}
    >
      {/* Gradient fon + yorug'lik sharlari */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(160deg, var(--tpl-grad-a) 0%, var(--color-paper) 45%, var(--tpl-grad-b) 100%)`,
        }}
        aria-hidden="true"
      />
      <div
        className="animate-shimmer pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full blur-3xl"
        style={{ background: 'var(--color-gold)', opacity: 0.12 }}
        aria-hidden="true"
      />
      <div
        className="animate-shimmer pointer-events-none absolute -right-16 bottom-16 h-80 w-80 rounded-full blur-3xl"
        style={{ background: 'var(--tpl-accent)', opacity: 0.16 }}
        aria-hidden="true"
      />

      <FloralCorner id="ng-hero-tl" position="tl" className="w-[60vw] max-w-[320px]" opacity={0.75} offset={-60} />

      <div className="relative z-20 flex w-full max-w-md flex-col items-center text-center">
        <Reveal delay={120}>
          <p className="tracking-wider-caps font-body text-[0.68rem] text-gold/85">{event.kicker}</p>
        </Reveal>

        {photo && (
          <Reveal delay={260}>
            <div className="relative mt-7 h-52 w-full max-w-xs overflow-hidden rounded-3xl border border-gold/20">
              <img src={photo} alt="" className="h-full w-full object-cover" />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, var(--color-paper), transparent 65%)' }}
              />
            </div>
          </Reveal>
        )}

        <Reveal delay={420}>
          <h1 className="mt-8 flex flex-col items-center leading-[1.02]">
            <span className="font-display text-gilded text-4xl tracking-[0.06em] sm:text-6xl">
              {couple.groom}
            </span>
            {couple.bride && (
              <>
                <span className="font-script my-1 text-xl text-gold/60 sm:text-2xl">and</span>
                <span className="font-display text-gilded text-4xl tracking-[0.06em] sm:text-6xl">
                  {couple.bride}
                </span>
              </>
            )}
          </h1>
        </Reveal>

        <Reveal delay={680}>
          <Ornament className="mt-8 text-gold/45" width={180} />
        </Reveal>

        <Reveal delay={820}>
          <p className="mt-6 inline-flex items-center gap-3 rounded-full border border-gold/25 px-5 py-2 font-body text-[0.95rem] tracking-[0.12em] text-gold">
            {event.dateLabel}
            <span className="h-1 w-1 rounded-full bg-gold/50" />
            {event.timeLabel}
          </p>
        </Reveal>

        <Reveal delay={1000}>
          <div className="mt-12 flex flex-col items-center gap-2">
            <span className="tracking-wider-caps font-body text-[0.62rem] text-gold/70">Pastga suring</span>
            <span className="animate-float block h-8 w-px bg-gold/40" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
