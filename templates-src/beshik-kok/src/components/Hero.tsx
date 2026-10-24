import { config } from '../config'
import { bgClass, type Skin } from '@core/lib/skin'
import { FloralCorner } from './decor/Floral'
import { Reveal } from './ui'

export function Hero({ bg }: Skin) {
  const { couple, event } = config

  return (
    <section
      className={`paper-grain relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-16 ${bgClass(bg)}`}
    >
      {/* Fun dotted background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(var(--color-primary) 2px, transparent 2px), radial-gradient(var(--color-secondary) 2px, transparent 2px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px'
        }}
        aria-hidden="true"
      />

      {/* Colorful center glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-[40%] h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle, var(--color-accent1), var(--color-primary) 50%, transparent 80%)' }}
        aria-hidden="true"
      />

      <div className="relative z-20 w-full max-w-lg text-center">
        <Reveal delay={200}>
          <p className="font-script text-gilded text-3xl sm:text-4xl">{event.kicker}</p>
        </Reveal>

        <Reveal delay={400}>
          <p className="mt-2 font-display text-2xl font-bold tracking-widest text-secondary sm:text-3xl">
            {event.dateLabel}
            <span className="mx-3 font-light text-primary/50">|</span>
            {event.timeLabel}
          </p>
        </Reveal>

        <Reveal delay={650}>
          <h1 className="mt-8 flex flex-col items-center leading-[0.95]">
            <span className="font-script text-gilded text-[4.5rem] sm:text-8xl animate-pulse-fun">{couple.groom}</span>
            {couple.bride && (
              <>
                {couple.bride && (
                  <>
                    <span className="font-script my-2 text-3xl text-secondary sm:text-4xl">&</span>
                    <span className="font-script text-gilded text-[4.5rem] sm:text-8xl animate-pulse-fun">{couple.bride}</span>
                  </>
                )}
              </>
            )}
          </h1>
        </Reveal>

        <Reveal delay={950}>
          <div className="mt-16 flex flex-col items-center gap-2">
            <span className="font-display font-bold uppercase tracking-wider text-sm text-primary">Pastga suring</span>
            <svg
              width="26"
              height="12"
              viewBox="0 0 26 12"
              fill="none"
              className="animate-float-fast text-primary"
              aria-hidden="true"
            >
              <path d="M2 2l11 8 11-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Reveal>
      </div>

      <FloralCorner id="hero-l" position="bl" className="w-[55vw] max-w-[280px]" opacity={1} offset={0} />
      <FloralCorner id="hero-r" position="br" className="w-[55vw] max-w-[280px]" opacity={1} offset={0} />
    </section>
  )
}
