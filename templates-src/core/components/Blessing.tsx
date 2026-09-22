import { config } from '@config'
import { bgClass, topEdge, type Skin } from '../lib/skin'
import { FloralCorner, Heart } from '@decor/Floral'
import { TornEdge } from '@decor/TornEdge'
import { Reveal } from '@ui'

/** Bismillah, oyat va mehmonlarga murojaat. */
export function Blessing(skin: Skin) {
  const { arabic, lines, source, greeting, text, heart } = config.blessing
  const edge = topEdge(skin)

  return (
    <section className={`paper-grain relative overflow-hidden px-6 py-24 ${bgClass(skin.bg)}`}>
      {edge && <TornEdge position="top" color={edge} />}
      <FloralCorner id="bl-l" position="tl" className="w-[42vw] max-w-[220px]" opacity={0.9} />
      <FloralCorner id="bl-r" position="tr" className="w-[42vw] max-w-[220px]" opacity={0.9} />

      <div className="relative z-20 mx-auto w-full max-w-lg text-center">
        {arabic && (
          <Reveal>
            <p className="font-arabic text-[1.7rem] leading-loose text-gold sm:text-3xl" dir="rtl" lang="ar">
              {arabic}
            </p>
          </Reveal>
        )}

        <div className="mt-8 space-y-1">
          {lines.map((line, i) => (
            <Reveal key={line} delay={150 + i * 180}>
              <p className="font-script text-gilded text-[2.4rem] leading-tight sm:text-[3rem]">{line}</p>
            </Reveal>
          ))}
        </div>

        {source && (
          <Reveal delay={150 + lines.length * 180}>
            <p className="tracking-wider-caps mt-5 font-body text-[0.78rem] text-gold/75">{source}</p>
          </Reveal>
        )}

        <Reveal delay={700}>
          <div className="mt-12 space-y-3">
            <p className="font-body text-xl text-ink sm:text-2xl">{greeting}</p>
            <p className="font-body text-lg leading-relaxed text-ink-soft sm:text-xl">
              {text}
              {heart && <Heart className="ml-1.5 text-gold-light" />}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
