import { config } from '../config'
import { bgClass, type Skin } from '@core/lib/skin'
import { Reveal } from './ui'

/** Minimal, grid asosidagi birinchi ekran — dekoratsiyasiz, katta tipografiya. */
export function Hero({ bg }: Skin) {
  const { couple, event } = config

  return (
    <section
      className={`relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-16 ${bgClass(bg)}`}
    >
      <div className="relative z-20 w-full max-w-lg text-center">
        <Reveal delay={150}>
          <p className="font-body text-sm tracking-wider-caps text-gold-dark">{event.kicker}</p>
        </Reveal>

        <Reveal delay={350}>
          <h1 className="mt-6 font-display text-[2.8rem] font-semibold leading-[1.05] text-ink sm:text-6xl">
            {couple.groom}
          </h1>
        </Reveal>

        <Reveal delay={550}>
          <p className="mt-6 font-body text-lg tracking-[0.08em] text-ink-soft sm:text-xl">
            {event.dateLabel}
            <span className="mx-3 font-light text-ink-soft/50">|</span>
            {event.timeLabel}
          </p>
        </Reveal>

        <Reveal delay={800}>
          <div className="mt-14 flex flex-col items-center gap-1.5">
            <svg
              width="26"
              height="12"
              viewBox="0 0 26 12"
              fill="none"
              className="animate-float text-ink-soft/50"
              aria-hidden="true"
            >
              <path d="M2 2l11 8 11-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
