import { config } from '../config'
import { bgClass, topEdge, type Skin } from '@core/lib/skin'
import { Reveal, ScriptTitle } from './ui'

/** Tadbir dasturi — vaqt jadvali, nozik chiziqli, dekoratsiyasiz. */
export function Timeline(skin: Skin) {
  const { title, items } = config.timeline
  const edge = topEdge(skin)

  return (
    <section className={`relative overflow-hidden px-6 py-20 sm:py-24 ${bgClass(skin.bg)}`}>
      {edge && <div className="absolute inset-x-0 top-0 border-t border-ink/10" aria-hidden="true" />}
      <div className="relative z-20 mx-auto w-full max-w-lg">
        <Reveal>
          <ScriptTitle>{title}</ScriptTitle>
        </Reveal>

        <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
          {items.map((item, i) => (
            <li key={item.time}>
              <Reveal delay={i * 100}>
                <div className="flex items-baseline justify-between gap-4 py-4">
                  <span className="font-display text-lg tabular-nums text-gold-dark sm:text-xl">
                    {item.time}
                  </span>
                  <span className="flex-1 text-right font-body text-lg text-ink sm:text-xl">
                    {item.label}
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
