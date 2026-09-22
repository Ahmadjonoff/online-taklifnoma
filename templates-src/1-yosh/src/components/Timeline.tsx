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

        <div className="relative mt-12">
          <div
            className="absolute bottom-4 left-1/2 top-4 w-px -translate-x-1/2"
            style={{
              background: 'linear-gradient(to bottom, transparent, var(--color-gold) 12%, var(--color-gold) 88%, transparent)',
              opacity: 0.45,
            }}
            aria-hidden="true"
          />

          <ul className="space-y-7">
            {items.map((item, i) => (
              <li key={item.time}>
                <Reveal delay={i * 130}>
                  <div className="grid grid-cols-[1fr_2.75rem_1fr] items-center gap-2">
                    <span className="text-right font-display text-[1.85rem] text-ink-soft sm:text-3xl">
                      {item.time}
                    </span>

                    <span className="flex justify-center">
                      {i === middle ? <TimelineMoon /> : <Star />}
                    </span>

                    <span className="text-left font-body text-lg leading-snug text-ink sm:text-xl">
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

function Star() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="text-gold/85" aria-hidden="true">
      <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" fill="currentColor" />
    </svg>
  )
}

function TimelineMoon() {
  return (
    <svg width="44" height="44" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id="tl-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5e4ab" />
          <stop offset="100%" stopColor="#e8c96a" />
        </radialGradient>
      </defs>
      <g transform="translate(50 50)">
        <path d="M-10 -20 A 25 25 0 1 0 15 15 A 30 30 0 1 1 -10 -20 Z" fill="url(#tl-moon)" transform="rotate(-15)" />
        <circle cx="20" cy="-15" r="4" fill="#a8d8c8" />
        <circle cx="-25" cy="15" r="3" fill="#f0a0b8" />
        <circle cx="10" cy="30" r="2" fill="#89c4e8" />
      </g>
    </svg>
  )
}
