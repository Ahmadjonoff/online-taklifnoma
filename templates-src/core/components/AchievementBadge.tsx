import { config } from '@config'
import { type Skin } from '../lib/skin'
import { Reveal, Section } from '@ui'

/** Bitiruvchi haqida — daraja, universitet va yutuq matni. */
export function AchievementBadge(skin: Skin) {
  const { enabled, degree, institution, text } = config.achievement
  if (!enabled) return null

  return (
    <Section skin={skin}>
      <Reveal>
        <span className="inline-block rounded-full border border-gold/40 px-4 py-1 font-body text-sm tracking-wider-caps text-gold-dark">
          {degree}
        </span>
        <p className="mt-5 font-display text-gilded text-3xl leading-snug sm:text-4xl">{institution}</p>
        {text && (
          <p className="mx-auto mt-4 max-w-sm font-body text-lg leading-relaxed text-ink-soft sm:text-xl">
            {text}
          </p>
        )}
      </Reveal>
    </Section>
  )
}
