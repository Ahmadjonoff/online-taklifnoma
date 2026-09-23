import { config } from '@config'
import type { Skin } from '../lib/skin'
import { Ornament } from '@decor/Floral'
import { Reveal, ScriptTitle, Section } from '@ui'

type StoryConfig = { enabled?: boolean; kicker?: string; title?: string; text?: string; photo?: string }

function story(): StoryConfig | undefined {
  return (config as unknown as { story?: StoryConfig }).story
}

/** Bo'limlar ro'yxatida shart sifatida ishlatiladi (config'da bo'lmasa ham xato bermaydi) */
export function storyEnabled(): boolean {
  const c = story()
  return Boolean(c?.enabled && c.text)
}

/** «Bizning hikoyamiz» — juftlik tarixi va (ixtiyoriy) surat. Premium/Luxury. */
export function Story(skin: Skin) {
  const c = story()
  if (!c?.enabled || !c.text) return null

  return (
    <Section skin={skin}>
      <Reveal>
        {c.kicker && (
          <p className="tracking-wider-caps font-body text-xs text-gold-dark/80">{c.kicker}</p>
        )}
        <ScriptTitle flourish={false}>{c.title || 'Bizning hikoyamiz'}</ScriptTitle>
        <Ornament className="mx-auto mt-3 text-gold/50" width={190} />
      </Reveal>

      {c.photo && (
        <Reveal delay={180}>
          <div className="mx-auto mt-9 max-w-sm overflow-hidden rounded-2xl border border-gold/30 p-1.5 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.6)]">
            <img src={c.photo} alt="" loading="lazy" className="aspect-[4/5] w-full rounded-xl object-cover" />
          </div>
        </Reveal>
      )}

      <Reveal delay={320}>
        <p className="mx-auto mt-8 max-w-md whitespace-pre-line font-body text-lg leading-loose text-ink-soft sm:text-xl">
          {c.text}
        </p>
      </Reveal>
    </Section>
  )
}
