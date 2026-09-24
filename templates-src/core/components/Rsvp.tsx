import { useState } from 'react'
import { config } from '@config'
import type { Skin } from '../lib/skin'
import { isPreviewContext, submit } from '../lib/submit'
import { WaxSeal } from '@decor/WaxSeal'
import { GoldButton, Reveal, ScriptTitle, Section } from '@ui'

type Status = 'idle' | 'sending' | 'done' | 'error'

type RsvpConfig = {
  enabled?: boolean
  title?: string
  text?: string
  sealText?: string
  successText?: string
}

/**
 * Ishtirokni tasdiqlash — forma sahifada doim ochiq turadi (muhrni bosib
 * ochish shart emas). Ranglar shablon mavzusidan olinadi: qog'oz (`paper`),
 * oltin (`gold`), matn (`ink`) — shu sababli har bir shablonda o'z
 * dizayniga mos ko'rinadi.
 *
 * Ko'p shablonlarning `config-default.ts` faylida RSVP matnlari yo'q (server
 * faqat `enabled` yuboradi) — shuning uchun matnlarning standart qiymati shu
 * yerda.
 */
export function Rsvp(skin: Skin) {
  const rsvp = ((config as unknown as { rsvp?: RsvpConfig }).rsvp ?? {}) as RsvpConfig
  const [status, setStatus] = useState<Status>('idle')

  // Shaxsiy mehmon havolasida ism oldindan to'ldiriladi (Luxury)
  const [name, setName] = useState(
    () => (config as unknown as { guest?: { name?: string } }).guest?.name ?? ''
  )
  const [nameError, setNameError] = useState(false)
  const [attending, setAttending] = useState<'keladi' | 'kelolmaydi'>('keladi')
  const [guests, setGuests] = useState(1)
  const [comment, setComment] = useState('')
  const preview = isPreviewContext()

  if (rsvp.enabled === false) return null

  const title = rsvp.title || 'Ishtirokni tasdiqlang'
  const text =
    rsvp.text || 'Dasturxonni to‘g‘ri tayyorlashimiz uchun, iltimos, kelishingizni oldindan bildiring.'
  const successText = rsvp.successText || 'Rahmat! Javobingiz qabul qilindi.'

  // Karta bo'lim fonidan ajralib tursin: bo'lim `paper` bo'lsa karta `paper-2`
  const card = skin.bg === 'paper' ? 'bg-paper-2' : 'bg-paper'
  const field = skin.bg === 'paper' ? 'bg-paper' : 'bg-paper-2'
  const inputClass = `w-full rounded-xl border border-gold/25 ${field} px-4 py-3 font-body text-lg text-ink placeholder:text-ink-soft/50 outline-none transition-colors focus:border-gold`

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (preview) return
    if (!name.trim()) {
      setNameError(true)
      return
    }
    if (status === 'sending') return

    setStatus('sending')
    try {
      await submit({ kind: 'rsvp', name: name.trim(), attending, guests, comment: comment.trim() })
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Section skin={skin} id="rsvp">
      <Reveal>
        <ScriptTitle flourish={false}>{title}</ScriptTitle>
        <p className="mx-auto mt-4 max-w-sm font-body text-lg leading-relaxed text-ink-soft sm:text-xl">
          {text}
        </p>
      </Reveal>

      <Reveal delay={150}>
        <div
          className={`paper-grain relative mx-auto mt-14 w-full max-w-md rounded-2xl border border-gold/30 ${card} px-6 pb-7 pt-12 text-left shadow-[0_24px_60px_-36px_rgba(0,0,0,0.55)] sm:px-8`}
        >
          {/* Bezak: kartaning tepasidagi muhr (bosiladigan tugma emas) */}
          <span className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
            <WaxSeal id="rsvp" label={rsvp.sealText || 'RSVP'} size={76} variant="caps" />
          </span>

          {status === 'done' ? (
            <div className="py-8 text-center" role="status">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className="text-gold">
                  <path d="M6 13.5l4.5 4.5L20 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <p className="mt-5 font-script text-gilded text-3xl">{successText}</p>
            </div>
          ) : (
            <form onSubmit={send} className="space-y-5" aria-label={title}>
              <Field label="Ismingiz">
                <input
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (nameError) setNameError(false)
                  }}
                  maxLength={80}
                  autoComplete="name"
                  placeholder="Ism familiyangiz"
                  className={`${inputClass} ${nameError ? 'border-wine' : ''}`}
                />
                {nameError && (
                  <span className="mt-1.5 block font-body text-sm text-wine">Ismingizni kiriting</span>
                )}
              </Field>

              <fieldset>
                <legend className="mb-1.5 block font-body text-[0.95rem] text-ink-soft">Kela olasizmi?</legend>
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
                      aria-pressed={attending === value}
                      onClick={() => setAttending(value)}
                      className={`rounded-xl border px-3 py-3 font-body text-[0.95rem] transition-all ${
                        attending === value
                          ? 'border-gold bg-gold text-paper'
                          : `border-gold/25 ${field} text-ink-soft hover:border-gold/50`
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>

              {attending === 'keladi' && (
                <fieldset>
                  <legend className="mb-1.5 block font-body text-[0.95rem] text-ink-soft">Necha kishi bilan?</legend>
                  <div className="flex items-center gap-4">
                    <Stepper onClick={() => setGuests((g) => Math.max(1, g - 1))} label="−" aria="Kamaytirish" />
                    <span className="min-w-10 text-center font-display text-2xl text-gold tabular-nums" aria-live="polite">
                      {guests}
                    </span>
                    <Stepper onClick={() => setGuests((g) => Math.min(20, g + 1))} label="+" aria="Ko'paytirish" />
                  </div>
                </fieldset>
              )}

              <Field label="Izoh (ixtiyoriy)">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Qo‘shimcha yozmoqchi bo‘lsangiz..."
                  className={`${inputClass} resize-none`}
                />
              </Field>

              {status === 'error' && (
                <p className="text-center font-body text-[0.95rem] text-wine">
                  Yuborishda xatolik. Iltimos, qaytadan urinib ko‘ring.
                </p>
              )}

              {preview ? (
                <p className="rounded-xl border border-gold/25 px-4 py-3 text-center font-body text-sm text-ink-soft">
                  Bu — namuna. RSVP faqat haqiqiy (sotib olingan) taklifnomada ishlaydi.
                </p>
              ) : (
                <GoldButton type="submit" disabled={status === 'sending'} className="rounded-full">
                  {status === 'sending' ? 'Yuborilmoqda...' : 'Javobni yuborish'}
                </GoldButton>
              )}
            </form>
          )}
        </div>
      </Reveal>
    </Section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-body text-[0.95rem] text-ink-soft">{label}</span>
      {children}
    </label>
  )
}

function Stepper({ onClick, label, aria }: { onClick: () => void; label: string; aria: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={aria}
      className="h-11 w-11 rounded-full border border-gold/35 font-display text-xl text-gold transition-colors active:bg-gold/10"
    >
      {label}
    </button>
  )
}
