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
          {/* Dashed colorful line */}
          <div
            className="absolute bottom-4 left-1/2 top-4 w-1 -translate-x-1/2"
            style={{
              backgroundImage: 'linear-gradient(to bottom, var(--color-primary) 50%, transparent 50%)',
              backgroundSize: '100% 20px',
              opacity: 0.6,
              borderRadius: '2px'
            }}
            aria-hidden="true"
          />

          <ul className="space-y-7">
            {items.map((item, i) => (
              <li key={item.time}>
                <Reveal delay={i * 130}>
                  <div className="grid grid-cols-[1fr_3.5rem_1fr] items-center gap-2">
                    <span className="text-right font-display text-[1.85rem] font-bold text-primary sm:text-3xl">
                      {item.time}
                    </span>

                    <span className="flex justify-center z-10 bg-[var(--color-paper-3)] rounded-full py-1">
                      {i === middle ? <TimelineCake /> : <TimelineBalloon i={i} />}
                    </span>

                    <span className="text-left font-body text-lg leading-snug font-bold text-ink sm:text-xl">
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

function TimelineBalloon({ i }: { i: number }) {
  const colors = ['var(--color-secondary)', 'var(--color-accent1)', 'var(--color-primary)', 'var(--color-deco-purple)', 'var(--color-accent2)']
  const color = colors[i % colors.length]
  return (
    <svg width="24" height="32" viewBox="0 0 24 32" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 8 12 16 12 16s12-8 12-16C24 5.373 18.627 0 12 0z" fill={color} />
      <path d="M10 28h4l2 4H8l2-4z" fill={color} />
      <ellipse cx="6" cy="8" rx="2" ry="4" fill="white" opacity="0.3" transform="rotate(-30 6 8)" />
    </svg>
  )
}

function TimelineCake() {
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" aria-hidden="true">
      <rect x="20" y="55" width="60" height="30" rx="4" fill="var(--color-primary)" />
      <rect x="30" y="35" width="40" height="20" rx="3" fill="var(--color-secondary)" />
      <path d="M15 85 h70 v5 h-70 z" fill="#ddd" />
      <circle cx="50" cy="55" r="5" fill="var(--color-accent1)" />
      <circle cx="35" cy="55" r="5" fill="var(--color-accent1)" />
      <circle cx="65" cy="55" r="5" fill="var(--color-accent1)" />
      <rect x="48" y="15" width="4" height="20" fill="#f4a261" />
      <path d="M50 5 Q 45 10 50 15 Q 55 10 50 5 Z" fill="var(--color-deco-orange)" />
    </svg>
  )
}
