import { config } from '@config'
import { bgClass, topEdge, type Skin } from '../lib/skin'
import { TornEdge } from '@decor/TornEdge'
import { Reveal, ScriptTitle } from '@ui'

/** Hamkorlar / homiylar nomlari ro'yxati. */
export function Sponsors(skin: Skin) {
  const { enabled, title, names } = config.sponsors
  const edge = topEdge(skin)
  if (!enabled || !names.length) return null

  return (
    <section className={`paper-grain relative overflow-hidden px-6 py-16 sm:py-20 ${bgClass(skin.bg)}`}>
      {edge && <TornEdge position="top" color={edge} />}

      <div className="relative z-20 mx-auto w-full max-w-lg text-center">
        <Reveal>
          <ScriptTitle flourish={false}>{title}</ScriptTitle>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {names.map((name) => (
              <span key={name} className="font-display text-lg tracking-wide text-ink-soft">
                {name}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
