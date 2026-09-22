import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { config } from '@config'
import { lockScroll } from '../lib/scrollLock'
import type { Skin } from '../lib/skin'
import { isPreviewContext, submit } from '../lib/submit'
import { WaxSeal } from '@decor/WaxSeal'
import { GoldButton, Reveal, ScriptTitle, Section } from '@ui'

type Status = 'idle' | 'sending' | 'done' | 'error'

/** Ishtirokni tasdiqlash: muhr bosiladi → forma ochiladi. */
export function Rsvp(skin: Skin) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')

  const [name, setName] = useState('')
  const [nameError, setNameError] = useState(false)
  const [attending, setAttending] = useState<'keladi' | 'kelolmaydi'>('keladi')
  const [guests, setGuests] = useState(1)
  const [comment, setComment] = useState('')
  const preview = isPreviewContext()

  // Modal ochiq bo'lganda orqa fon aylanmasin + Esc bilan yopilsin
  useEffect(() => {
    if (!open) return
    const unlock = lockScroll()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      unlock()
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!config.rsvp.enabled) return null

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setNameError(true)
      return
    }
    if (status === 'sending') return

    setStatus('sending')
    try {
      await submit({ kind: 'rsvp', name: name.trim(), attending, guests, comment: comment.trim() })
      setStatus('done')
      window.setTimeout(() => setOpen(false), 2200)
    } catch {
      setStatus('error')
    }
  }

  return (
    <Section skin={skin} id="rsvp">
      <Reveal>
        <ScriptTitle flourish={false}>{config.rsvp.title}</ScriptTitle>
        <p className="mx-auto mt-4 max-w-sm font-body text-lg leading-relaxed text-ink-soft sm:text-xl">
          {config.rsvp.text}
        </p>
      </Reveal>

      <Reveal delay={200}>
        {preview ? (
          <div className="mt-10 flex w-full flex-col items-center gap-2 opacity-80">
            <WaxSeal id="rsvp" label={config.rsvp.sealText} size={150} variant="caps" />
            <span className="mt-2 max-w-xs text-center font-body text-sm text-ink-soft">
              Bu — namuna. RSVP faqat haqiqiy (sotib olingan) taklifnomada ishlaydi.
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group mt-10 flex w-full flex-col items-center gap-2"
            aria-haspopup="dialog"
          >
            <span className="animate-pulse-soft transition-transform duration-300 group-active:scale-95">
              <WaxSeal id="rsvp" label={config.rsvp.sealText} size={150} variant="caps" />
            </span>
            <svg width="24" height="11" viewBox="0 0 26 12" fill="none" className="mt-1 text-gold/60">
              <path d="M2 10L13 2l11 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <span className="font-script text-2xl text-gold/85">{config.rsvp.openHint}</span>
          </button>
        )}
      </Reveal>

      {/* Modal <body> ichiga portal qilinadi — aks holda bo'lim stacking
          context'i uni boshqa bo'limlar ostida qoldiradi. */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 px-4 py-6 backdrop-blur-[3px] sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-label={config.rsvp.title}
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <div className="paper-grain relative max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-gold/25 bg-paper p-7 text-left shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-ink-soft/70 transition-colors hover:text-ink"
              aria-label="Yopish"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {status === 'done' ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40">
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className="text-gold">
                    <path d="M6 13.5l4.5 4.5L20 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="mt-5 font-script text-gilded text-3xl">{config.rsvp.successText}</p>
              </div>
            ) : (
              <form onSubmit={send} className="space-y-5">
                <h3 className="text-center font-script text-gilded text-4xl">{config.rsvp.title}</h3>

                <Field label="Ismingiz">
                  <input
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (nameError) setNameError(false)
                    }}
                    placeholder="Ism familiyangiz"
                    className={`${inputClass} ${nameError ? 'border-wine' : ''}`}
                  />
                  {nameError && (
                    <span className="mt-1.5 block font-body text-sm text-wine">Ismingizni kiriting</span>
                  )}
                </Field>

                <Field label="Kela olasizmi?">
                  <div className="grid grid-cols-2 gap-2.5">
                    {(
                      [
                        ['keladi', 'Albatta kelaman'],
                        ['kelolmaydi', 'Kela olmayman'],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAttending(value)}
                        className={`rounded-xl border px-3 py-3 font-body text-[0.95rem] transition-all ${
                          attending === value
                            ? 'border-gold bg-gold text-paper'
                            : 'border-gold/25 bg-paper-2 text-ink-soft hover:border-gold/50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </Field>

                {attending === 'keladi' && (
                  <Field label="Necha kishi bilan?">
                    <div className="flex items-center gap-4">
                      <Stepper onClick={() => setGuests((g) => Math.max(1, g - 1))} label="−" />
                      <span className="min-w-10 text-center font-display text-2xl text-gold tabular-nums">
                        {guests}
                      </span>
                      <Stepper onClick={() => setGuests((g) => Math.min(20, g + 1))} label="+" />
                    </div>
                  </Field>
                )}

                <Field label="Izoh (ixtiyoriy)">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Qo‘shimcha yozmoqchi bo‘lsangiz..."
                    className={`${inputClass} resize-none`}
                  />
                </Field>

                {status === 'error' && (
                  <p className="text-center font-body text-[0.95rem] text-wine">
                    Yuborishda xatolik. Iltimos, qaytadan urinib ko‘ring.
                  </p>
                )}

                <GoldButton type="submit" disabled={status === 'sending'} className="rounded-full">
                  {status === 'sending' ? 'Yuborilmoqda...' : 'Javobni yuborish'}
                </GoldButton>
              </form>
            )}
            </div>
          </div>,
          document.body,
        )}
    </Section>
  )
}

const inputClass =
  'w-full rounded-xl border border-gold/25 bg-paper-2 px-4 py-3 font-body text-lg text-ink placeholder:text-ink-soft/50 outline-none transition-colors focus:border-gold'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-body text-[0.95rem] text-ink-soft">{label}</span>
      {children}
    </label>
  )
}

function Stepper({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-11 w-11 rounded-full border border-gold/35 font-display text-xl text-gold transition-colors active:bg-gold/10"
    >
      {label}
    </button>
  )
}
