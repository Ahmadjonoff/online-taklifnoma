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
          background:
            'conic-gradient(from 200deg at 50% 42%, transparent 0deg, rgba(212,175,55,0.15) 18deg, transparent 44deg, transparent 316deg, rgba(212,175,55,0.15) 342deg, transparent 360deg)',
        }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute left-1/2 top-[34%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle,rgba(212,175,55,0.15),transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-20 w-full max-w-lg text-center">
        <Reveal delay={200}>
          <p className="font-display tracking-widest uppercase text-gold-light text-sm sm:text-base mb-6 border-y border-gold/30 py-2 mx-auto w-max px-4">{event.kicker}</p>
        </Reveal>

        <Reveal delay={400}>
          <p className="mt-1 font-display text-xl tracking-[0.2em] text-gold sm:text-2xl">
            {event.dateLabel}
            <span className="mx-3 font-light text-gold/45">|</span>
            {event.timeLabel}
          </p>
        </Reveal>

        <Reveal delay={650}>
          <h1 className="mt-12 flex flex-col items-center leading-[0.95]">
            <span className="font-display uppercase text-gilded text-[3.8rem] sm:text-7xl tracking-widest">{couple.groom}</span>
            {/* Juftlik bo'lsa ikkinchi ism ham (avval faqat birinchisi chiqardi) */}
            {couple.bride && (
              <>
                <span className="my-2 font-display text-2xl text-gold/80">&amp;</span>
                <span className="font-display uppercase text-gilded text-[3.8rem] sm:text-7xl tracking-widest">{couple.bride}</span>
              </>
            )}
          </h1>
        </Reveal>

        <Reveal delay={950}>
          <div className="mt-20 flex flex-col items-center gap-2">
            <span className="font-display uppercase tracking-widest text-[0.75rem] text-gold/80">Pastga suring</span>
            <svg
              width="26"
              height="12"
              viewBox="0 0 26 12"
              fill="none"
              className="animate-float text-gold/60"
              aria-hidden="true"
            >
              <path d="M2 2l11 8 11-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
        </Reveal>
      </div>

      <FloralCorner id="hero-l" position="bl" className="w-[50vw] max-w-[240px]" opacity={1} offset={14} />
      <FloralCorner id="hero-r" position="br" className="w-[50vw] max-w-[240px]" opacity={1} offset={14} />
      <FloralCorner id="hero-tl" position="tl" className="w-[50vw] max-w-[240px]" opacity={1} offset={14} />
      <FloralCorner id="hero-tr" position="tr" className="w-[50vw] max-w-[240px]" opacity={1} offset={14} />
    </section>
  )
}
