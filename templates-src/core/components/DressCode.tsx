import { config } from '@config'
import { type Skin } from '../lib/skin'
import { Reveal, ScriptTitle, Section } from '@ui'

/** Kiyinish uslubi (dress-code) — matn + ixtiyoriy rang palitrasi. */
export function DressCode(skin: Skin) {
  const { enabled, title, text, colors } = config.dressCode
  if (!enabled) return null

  return (
    <Section skin={skin}>
      <Reveal>
        <ScriptTitle flourish={false}>{title}</ScriptTitle>
        <p className="mx-auto mt-4 max-w-sm font-body text-lg leading-relaxed text-ink-soft sm:text-xl">
          {text}
        </p>

        {colors.length > 0 && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {colors.map((c) => (
              <span
                key={c}
                className="h-9 w-9 rounded-full border border-ink/15"
                style={{ backgroundColor: c }}
                aria-hidden="true"
              />
            ))}
          </div>
        )}
      </Reveal>
    </Section>
  )
}
