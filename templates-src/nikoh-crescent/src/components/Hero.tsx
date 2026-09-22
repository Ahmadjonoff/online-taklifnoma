import { config } from '../config'
import { bgClass, type Skin } from '@core/lib/skin'
import { FloralCorner } from './decor/Floral'
import { Reveal } from './ui'

export function Hero({ bg }: Skin) {
  const { couple, event } = config

  return (
    <section className={`paper-grain relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-16 ${bgClass(bg)}`}>
      <div
        className="animate-shimmer pointer-events-none absolute inset-0"
        style={{
          background: 'conic-gradient(from 200deg at 50% 42%, transparent 0deg, rgba(200,230,200,0.4) 18deg, transparent 44deg, transparent 316deg, rgba(200,230,200,0.4) 342deg, transparent 360deg)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[34%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{ background: 'radial-gradient(circle,rgba(26,107,44,0.15),transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-20 w-full max-w-lg text-center">
        <Reveal delay={200}>
          <p className="font-script text-gilded text-3xl sm:text-4xl">{event.kicker}</p>
        </Reveal>

        <Reveal delay={400}>
          <p className="mt-1 font-display text-2xl tracking-[0.12em] text-gold sm:text-3xl">
            {event.dateLabel}
            <span className="mx-3 font-light text-gold/45">|</span>
            {event.timeLabel}
          </p>
        </Reveal>

        <Reveal delay={650}>
          <h1 className="mt-8 flex flex-col items-center leading-[0.95]">
            <span className="font-script text-gilded text-[3.6rem] sm:text-7xl">{couple.groom}</span>
            {couple.bride && (
              <>
                <span className="font-script my-1 text-3xl text-gold/70 sm:text-4xl">&</span>
                <span className="font-script text-gilded text-[3.6rem] sm:text-7xl">{couple.bride}</span>
              </>
            )}
          </h1>
        </Reveal>

        <Reveal delay={950}>
          <div className="mt-12 flex flex-col items-center gap-1.5">
            <span className="font-script text-2xl text-gold/80">Pastga suring</span>
            <svg width="26" height="12" viewBox="0 0 26 12" fill="none" className="animate-float text-gold/55" aria-hidden="true">
              <path d="M2 2l11 8 11-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
        </Reveal>
      </div>

      <FloralCorner id="hero-l" position="bl" className="w-[52vw] max-w-[280px]" opacity={0.95} offset={14} />
      <FloralCorner id="hero-r" position="br" className="w-[52vw] max-w-[280px]" opacity={0.95} offset={14} />
    </section>
  )
}
