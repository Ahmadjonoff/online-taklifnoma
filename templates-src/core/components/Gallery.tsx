import { useState } from 'react'
import { config } from '@config'
import { bgClass, topEdge, type Skin } from '../lib/skin'
import { TornEdge } from '@decor/TornEdge'
import { Reveal, ScriptTitle } from '@ui'

/** Rasmlar galereyasi — panjarali ko'rinish, bosilganda to'liq ekranga ochiladi. */
export function Gallery(skin: Skin) {
  const { enabled, title, photos } = config.gallery
  const [open, setOpen] = useState<number | null>(null)
  const edge = topEdge(skin)

  if (!enabled || !photos.length) return null

  return (
    <section className={`paper-grain relative overflow-hidden px-6 py-20 sm:py-24 ${bgClass(skin.bg)}`}>
      {edge && <TornEdge position="top" color={edge} />}

      <div className="relative z-20 mx-auto w-full max-w-lg text-center">
        <Reveal>
          <ScriptTitle flourish={false}>{title}</ScriptTitle>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setOpen(i)}
                className="aspect-square overflow-hidden rounded-sm border border-gold/25 bg-paper-2"
              >
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <img
            src={photos[open]}
            alt=""
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="absolute right-5 top-5 text-3xl leading-none text-paper"
            aria-label="Yopish"
          >
            &times;
          </button>
        </div>
      )}
    </section>
  )
}
