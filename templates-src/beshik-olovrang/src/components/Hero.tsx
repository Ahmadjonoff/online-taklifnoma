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
      <div
        className="animate-shimmer pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(137,196,232,0.1) 0%, rgba(240,160,184,0.15) 100%)',
        }}
        aria-hidden="true"
      />
      
      <div
        className="pointer-events-none absolute left-1/2 top-[34%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[40px]"
        style={{ background: 'radial-gradient(circle, rgba(197,163,217,0.35), transparent 70%)' }}
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
            {/* Bitta ismli shablon: sayt yagona ismni `groom` ga yozadi (namuna config'da — `bride`) */}
            <span className="font-script text-gilded text-[4rem] sm:text-7xl">{couple.groom || couple.bride}</span>
          </h1>
        </Reveal>

        <Reveal delay={950}>
          <div className="mt-12 flex flex-col items-center gap-1.5">
            <span className="font-script text-2xl text-gold/80">Pastga suring</span>
            <svg
              width="26"
              height="12"
              viewBox="0 0 26 12"
              fill="none"
              className="animate-float text-gold/55"
              aria-hidden="true"
            >
              <path d="M2 2l11 8 11-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
        </Reveal>
      </div>

      <FloralCorner id="hero-l" position="bl" className="w-[60vw] max-w-[300px]" opacity={0.9} offset={0} />
      <FloralCorner id="hero-r" position="tr" className="w-[60vw] max-w-[300px]" opacity={0.9} offset={0} />
    </section>
  )
}
