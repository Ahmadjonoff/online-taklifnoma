import { config } from '@config'
import { type Skin } from '../lib/skin'
import { Ornament } from '@decor/Floral'
import { Reveal, Section } from '@ui'

/** Katta raqam — yubiley yoshi yoki "1 yosh" kabi markaziy sonlar uchun. */
export function BigNumber(skin: Skin) {
  const { enabled, value, title, subtitle } = config.bigNumber
  if (!enabled) return null

  return (
    <Section skin={skin}>
      <Reveal>
        <p className="font-body text-sm tracking-wider-caps text-gold-dark uppercase">{title}</p>
        <p className="font-display text-gilded mt-2 text-[6.5rem] leading-none sm:text-[8rem]">{value}</p>
        <Ornament className="mx-auto mt-6 text-gold/50" width={170} />
        {subtitle && (
          <p className="mx-auto mt-6 max-w-sm font-body text-lg leading-relaxed text-ink-soft sm:text-xl">
            {subtitle}
          </p>
        )}
      </Reveal>
    </Section>
  )
}
