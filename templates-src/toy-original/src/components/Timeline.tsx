import { config } from '../config'
import { bgClass, topEdge, type Skin } from '@core/lib/skin'
import { TornEdge } from './decor/TornEdge'
import { Reveal, ScriptTitle } from './ui'

/** Kechaning tartibi — vertikal chiziq, o'rtasida atirgul. */
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
          {/* Markaziy chiziq */}
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
                      {i === middle ? <TimelineRose /> : <Diamond />}
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

function Diamond() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" className="text-gold/75" aria-hidden="true">
      <path d="M6.5 0L13 6.5 6.5 13 0 6.5z" fill="currentColor" />
    </svg>
  )
}

/** Chiziq o'rtasidagi bezakli atirgul. */
function TimelineRose() {
  return (
    <svg width="52" height="52" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id="tl-rose" cx="42%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#f3dcd7" />
          <stop offset="60%" stopColor="#e4b9b3" />
          <stop offset="100%" stopColor="#cf9a94" />
        </radialGradient>
      </defs>
      <g transform="translate(50 50)">
        {[0, 51, 102, 153, 204, 255, 306].map((a) => (
          <ellipse
            key={a}
            cx="0"
            cy="-27"
            rx="21"
            ry="18"
            fill="url(#tl-rose)"
            stroke="#bd8880"
            strokeOpacity="0.3"
            transform={`rotate(${a})`}
          />
        ))}
        <circle cx="0" cy="0" r="12" fill="#e4b9b3" />
        <path
          d="M0-8a8 8 0 1 1-7 11.5"
          fill="none"
          stroke="#bd8880"
          strokeOpacity="0.75"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
