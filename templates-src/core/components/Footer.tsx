import { config } from '@config'
import { bgClass, topEdge, type Skin } from '../lib/skin'
import { FloralCorner, Ornament } from '@decor/Floral'
import { TornEdge } from '@decor/TornEdge'
import { Reveal } from '@ui'

/** Yakuniy bo'lim: xayrlashuv so'zi, rasm va imzo. */
export function Footer(skin: Skin) {
  const { title, signature, photo } = config.footer
  const { groom, bride } = config.couple
  const sign = signature || `${groom} va ${bride}`
  const edge = topEdge(skin)

  return (
    <footer className={`paper-grain relative overflow-hidden px-6 pb-16 pt-24 ${bgClass(skin.bg)}`}>
      {edge && <TornEdge position="top" color={edge} />}

      <FloralCorner id="ft-l" position="tl" className="w-[38vw] max-w-[200px]" opacity={0.75} />
      <FloralCorner id="ft-r" position="tr" className="w-[38vw] max-w-[200px]" opacity={0.75} />

      <div className="relative z-20 mx-auto w-full max-w-lg text-center">
        <Reveal>
          <h2 className="font-script text-gilded text-[2.6rem] leading-tight sm:text-5xl">{title}</h2>
          <p className="mt-3 font-display text-2xl text-gold sm:text-3xl">{sign}</p>
        </Reveal>

        {photo && (
          <Reveal delay={200}>
            <img
              src={photo}
              alt={`${groom} va ${bride}`}
              loading="lazy"
              className="mt-9 w-full rounded-lg object-cover shadow-[0_18px_40px_-24px_rgba(90,70,40,0.9)]"
            />
          </Reveal>
        )}

        <Reveal delay={320}>
          <Ornament className="mx-auto mt-12 text-gold/35" width={170} />
          <p className="tracking-wider-caps mt-5 font-body text-xs text-ink-soft/60">
            {config.event.dateLabel}
          </p>
        </Reveal>
      </div>
    </footer>
  )
}
