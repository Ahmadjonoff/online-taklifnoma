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
      {/* Background warm golden-red glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
        style={{ background: 'radial-gradient(circle at 50% 40%, rgba(184,134,11,0.2), rgba(142,26,26,0.15) 70%, transparent 100%)' }}
        aria-hidden="true"
      />
      
      {/* Subtle suzane pattern watermark */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5C45 5 55 15 55 30C55 45 45 55 30 55C15 55 5 45 5 30C5 15 15 5 30 5Z' fill='none' stroke='%238e1a1a' stroke-width='1'/%3E%3Ccircle cx='30' cy='30' r='5' fill='none' stroke='%23b8860b' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }}
      />

      <div className="relative z-20 w-full max-w-lg text-center">
        <Reveal delay={200}>
          <p className="font-script text-wine text-3xl sm:text-4xl">{event.kicker}</p>
        </Reveal>

        <Reveal delay={400}>
          <p className="mt-1 font-display text-2xl tracking-[0.12em] text-wine sm:text-3xl">
            {event.dateLabel}
            <span className="mx-3 font-light text-wine/45">|</span>
            {event.timeLabel}
          </p>
        </Reveal>

        <Reveal delay={650}>
          <h1 className="mt-8 flex flex-col items-center leading-[0.95]">
            <span className="font-script text-gilded text-[3.6rem] sm:text-7xl">{couple.groom}</span>
            {/* Juftlik bo'lsa ikkinchi ism ham (avval faqat birinchisi chiqardi) */}
            {couple.bride && (
              <>
                <span className="my-2 font-display text-2xl text-gold/80">&amp;</span>
                <span className="font-script text-gilded text-[3.6rem] sm:text-7xl">{couple.bride}</span>
              </>
            )}
          </h1>
        </Reveal>

        <Reveal delay={950}>
          <div className="mt-12 flex flex-col items-center gap-1.5">
            <span className="font-script text-2xl text-wine/80">Pastga suring</span>
            <svg
              width="26"
              height="12"
              viewBox="0 0 26 12"
              fill="none"
              className="animate-float text-wine/55"
              aria-hidden="true"
            >
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
