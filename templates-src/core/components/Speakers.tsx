import { config } from '@config'
import { bgClass, topEdge, type Skin } from '../lib/skin'
import { TornEdge } from '@decor/TornEdge'
import { Reveal, ScriptTitle } from '@ui'

/** Ma'ruzachilar / mehmon spikerlar ro'yxati. */
export function Speakers(skin: Skin) {
  const { enabled, title, people } = config.speakers
  const edge = topEdge(skin)
  if (!enabled || !people.length) return null

  return (
    <section className={`paper-grain relative overflow-hidden px-6 py-20 sm:py-24 ${bgClass(skin.bg)}`}>
      {edge && <TornEdge position="top" color={edge} />}

      <div className="relative z-20 mx-auto w-full max-w-lg text-center">
        <Reveal>
          <ScriptTitle flourish={false}>{title}</ScriptTitle>
        </Reveal>

        {/*
          items-stretch + h-full: ba'zi spikerlarda foto/rol matni bo'lib,
          boshqalarida bo'lmasa, kartalar konteynerdan qisqaroq bo'lib qolib,
          bir qatorda notekis balandlikda ko'rinardi.
        */}
        <div className="mt-10 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2">
          {people.map((p, i) => (
            <Reveal key={p.name} delay={i * 140} className="h-full">
              <div className="flex h-full flex-col items-center gap-3 rounded-xl border border-gold/20 bg-paper-2/60 p-5">
                {p.photo && (
                  <img
                    src={p.photo}
                    alt=""
                    className="h-20 w-20 rounded-full object-cover"
                    loading="lazy"
                  />
                )}
                <div>
                  <p className="font-display text-lg text-ink">{p.name}</p>
                  <p className="mt-0.5 font-body text-[0.95rem] text-ink-soft">{p.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
