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
              background:
                'linear-gradient(to bottom, transparent, var(--color-gold) 12%, var(--color-gold) 88%, transparent)',
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
                      {i === middle ? <Pomegranate /> : <Tulip />}
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

function Tulip() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-wine/80" aria-hidden="true">
      <path d="M12 2C8 6 6 12 6 18C10 18 12 12 12 12C12 12 14 18 18 18C18 12 16 6 12 2Z" fill="currentColor" />
    </svg>
  )
}

function Pomegranate() {
  return (
    <svg width="52" height="52" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id="tl-pome" cx="42%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#c62828" />
          <stop offset="60%" stopColor="#8e1a1a" />
          <stop offset="100%" stopColor="#5c0e0e" />
        </radialGradient>
      </defs>
      <g transform="translate(50 50)">
        <circle cx="0" cy="0" r="22" fill="url(#tl-pome)" />
        {/* Crown of pomegranate */}
        <path d="M-10-21L-15-30L-5-26L0-32L5-26L15-30L10-21Z" fill="url(#tl-pome)" />
        {/* Decorative inner seeds */}
        <circle cx="-6" cy="-4" r="2.5" fill="#daa520" />
        <circle cx="6" cy="-4" r="2.5" fill="#daa520" />
        <circle cx="0" cy="6" r="2.5" fill="#daa520" />
      </g>
    </svg>
  )
}
