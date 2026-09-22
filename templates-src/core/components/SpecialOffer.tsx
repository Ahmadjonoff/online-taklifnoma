import { config } from '@config'
import { type Skin } from '../lib/skin'
import { GoldButton, Reveal, Section } from '@ui'

/** Ochilish tantanasi/restoran uchun maxsus taklif bannerini ko'rsatadi. */
export function SpecialOffer(skin: Skin) {
  const { enabled, title, text, badge } = config.specialOffer
  if (!enabled) return null

  return (
    <Section skin={skin}>
      <Reveal>
        {badge && (
          <span className="inline-block rounded-full border border-gold/40 px-4 py-1 font-body text-sm tracking-wider-caps text-gold-dark">
            {badge}
          </span>
        )}
        <p className="mt-5 font-display text-gilded text-3xl leading-snug sm:text-4xl">{title}</p>
        <p className="mx-auto mt-4 max-w-sm font-body text-lg leading-relaxed text-ink-soft sm:text-xl">
          {text}
        </p>
        {config.venue.address && (
          <GoldButton href={config.venue.googleMapsUrl} className="mx-auto mt-7 max-w-xs">
            Manzilni ko'rish
          </GoldButton>
        )}
      </Reveal>
    </Section>
  )
}
