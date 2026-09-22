import { config } from '@config'
import { bgClass, topEdge, type Skin } from '../lib/skin'
import { FloralCorner } from '@decor/Floral'
import { TornEdge } from '@decor/TornEdge'
import { Reveal, ScriptTitle } from '@ui'

/** Kiyim uslubi, sovg'a haqida va shunga o'xshash qisqa eslatmalar. */
export function Notes(skin: Skin) {
  const notes: ReadonlyArray<{ title: string; text: string }> = config.notes
  const edge = topEdge(skin)
  if (notes.length === 0) return null

  return (
    <section className={`paper-grain relative overflow-hidden px-6 py-24 ${bgClass(skin.bg)}`}>
      {edge && <TornEdge position="top" color={edge} />}

      <FloralCorner id="nt-r" position="tr" className="w-[46vw] max-w-[240px]" opacity={0.85} />
      <FloralCorner id="nt-l" position="bl" className="w-[46vw] max-w-[240px]" opacity={0.85} />

      <div className="relative z-20 mx-auto w-full max-w-lg space-y-16 text-center">
        {notes.map((note, i) => (
          <Reveal key={note.title} delay={i * 160}>
            <ScriptTitle flourish={false}>{note.title}</ScriptTitle>
            <p className="mx-auto mt-4 max-w-sm font-body text-lg leading-relaxed text-ink sm:text-xl">
              {note.text}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
