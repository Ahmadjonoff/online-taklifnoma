import { config } from '../config'
import { bgClass, topEdge, type Skin } from '@core/lib/skin'
import { TornEdge } from './decor/TornEdge'
import { Reveal, ScriptTitle } from './ui'

export function Timeline(skin: Skin) {
  const { title, items } = config.timeline
  const middle = Math.floor(items.length / 2)
  const edge = topEdge(skin)

  return (
    <section className={`paper-grain relative overflow-hidden px-6 py-24 ${bgClass(skin.bg)}`}>
      {edge && <TornEdge position="top" color={edge} />}
      <div className="relative z-20 mx-auto w-full max-w-lg">
        <Reveal>
          <ScriptTitle>{title}</ScriptTitle>
        </Reveal>

        <div className="relative mt-16">
          <div
            className="absolute bottom-4 left-1/2 top-4 w-px -translate-x-1/2"
            style={{
              background:
                'linear-gradient(to bottom, transparent, var(--color-gold) 12%, var(--color-gold) 88%, transparent)',
              opacity: 0.35,
            }}
            aria-hidden="true"
          />

          <ul className="space-y-10">
            {items.map((item, i) => (
              <li key={item.time}>
                <Reveal delay={i * 130}>
                  <div className="grid grid-cols-[1fr_3.5rem_1fr] items-center gap-2">
                    <span className="text-right font-display text-[1.85rem] text-gold-light sm:text-3xl">
                      {item.time}
                    </span>

                    <span className="flex justify-center items-center">
                      {i === middle ? <TimelineDeco /> : <Diamond />}
                    </span>

                    <span className="text-left font-display text-lg uppercase tracking-wider text-ink sm:text-xl">
                      {item.label}
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Diamond() {
  return (
    <div className="relative flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 18 18" className="text-gold" aria-hidden="true">
        <path d="M9 0 L18 9 L9 18 L0 9 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 4 L14 9 L9 14 L4 9 Z" fill="currentColor" opacity="0.8" />
      </svg>
    </div>
  )
}

function TimelineDeco() {
  return (
    <div className="relative z-10 bg-paper-3 p-1">
      <svg width="48" height="48" viewBox="0 0 100 100" aria-hidden="true" className="text-gold">
        <defs>
          <linearGradient id="tl-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8cd8a" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#9c7e20" />
          </linearGradient>
        </defs>
        
        {/* Art Deco geometric crown/wreath */}
        <g stroke="url(#tl-gold)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Outer diamond */}
          <path d="M50 5 L95 50 L50 95 L5 50 Z" strokeWidth="1.5" strokeOpacity="0.5" />
          
          {/* Inner geometry */}
          <path d="M50 20 L80 50 L50 80 L20 50 Z" />
          
          {/* Vertical and horizontal lines */}
          <path d="M50 10 L50 90" />
          <path d="M10 50 L90 50" />
          
          {/* Corner steps */}
          <path d="M35 35 L50 25 L65 35 L75 50 L65 65 L50 75 L35 65 L25 50 Z" />
          
          {/* Center piece */}
          <circle cx="50" cy="50" r="10" fill="url(#tl-gold)" stroke="none" />
        </g>
      </svg>
    </div>
  )
}
