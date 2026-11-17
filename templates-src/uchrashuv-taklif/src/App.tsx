import { useMemo, useRef, useState, type CSSProperties } from 'react'
import { config } from '@config'
import { MusicToggle } from '@core/components/MusicToggle'
import { isPreviewContext, submit } from '@core/lib/submit'

/**
 * Uchrashuvga taklif: muhrli konvert → maktub va «Men bilan uchrashuvga
 * chiqasizmi?» → «Ha» → joy va vaqt tanlash → javob taklif qiluvchiga
 * (RSVP sifatida: buyurtma sahifasi va Telegram bot) yuboriladi.
 *
 * «Yo'q» tugmasi qochadi — bu sahifaning asosiy hazili va ulashish sababi.
 */

type Stage = 'envelope' | 'ask' | 'choose' | 'done'

// Buyurtma formasining jonli preview'i joy bo'sh bo'lsa shu namunani qo'yadi
const VENUE_PLACEHOLDER = "To'yxona nomi"

const NO_LABELS = ['Yo‘q', 'Ishonchingiz komilmi?', 'Yana o‘ylab ko‘ring 🥺', 'Iltimos…', 'Baribir «Ha» bo‘ladi 😄']

const cfg = config as typeof config & {
  promo?: { enabled?: boolean; siteUrl?: string }
  guest?: { name?: string }
}

function Hearts({ count = 14 }: { count?: number }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        size: 12 + ((i * 7) % 16),
        dur: 9 + ((i * 5) % 8),
        delay: -((i * 1.7) % 12),
        dx: `${((i % 5) - 2) * 25}px`,
        rot: `${((i % 3) - 1) * 30}deg`,
      })),
    [count],
  )
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {hearts.map((h, i) => (
        <span
          key={i}
          className="ut-heart text-gold/40"
          style={
            {
              left: h.left,
              fontSize: h.size,
              animationDuration: `${h.dur}s`,
              animationDelay: `${h.delay}s`,
              '--dx': h.dx,
              '--rot': h.rot,
            } as CSSProperties
          }
        >
          ♥
        </span>
      ))}
    </div>
  )
}

function Burst() {
  const parts = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2
        const r = 120 + (i % 4) * 45
        return {
          bx: `${Math.cos(a) * r}px`,
          by: `${Math.sin(a) * r}px`,
          rot: `${(i % 2 ? 1 : -1) * (40 + i * 7)}deg`,
          ch: ['♥', '✨', '💗', '♥'][i % 4],
          size: 16 + (i % 3) * 6,
        }
      }),
    [],
  )
  return (
    <div aria-hidden>
      {parts.map((p, i) => (
        <span
          key={i}
          className="ut-burst text-wine"
          style={{ fontSize: p.size, '--bx': p.bx, '--by': p.by, '--rot': p.rot } as CSSProperties}
        >
          {p.ch}
        </span>
      ))}
    </div>
  )
}

export default function App() {
  const from = cfg.couple.groom
  const to = cfg.guest?.name || cfg.couple.bride
  const message = cfg.blessing.text

  const places = useMemo(() => {
    const own = cfg.venue.name && cfg.venue.name !== VENUE_PLACEHOLDER ? cfg.venue.name : ''
    const list = cfg.places.map((p) => `${p.emoji} ${p.label}`)
    return own ? [`📍 ${own}`, ...list] : list
  }, [])

  const times = useMemo(() => {
    const items = cfg.timeline.items.filter((t) => t.label || t.time)
    if (items.length) return items.map((t) => [t.label, t.time].filter(Boolean).join(', '))
    return [`${cfg.event.dateLabel}, ${cfg.event.timeLabel}`]
  }, [])

  const [stage, setStage] = useState<Stage>('envelope')
  const [opening, setOpening] = useState(false)
  const [tries, setTries] = useState(0)
  const [noPos, setNoPos] = useState<{ left: number; top: number } | null>(null)
  const [place, setPlace] = useState('')
  const [time, setTime] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const preview = isPreviewContext()
  const cardRef = useRef<HTMLDivElement>(null)

  function open() {
    if (opening) return
    setOpening(true)
    window.setTimeout(() => setStage('ask'), 1700)
  }

  // «Yo'q» kartaning ichida tasodifiy joyga qochadi
  function dodge() {
    const card = cardRef.current
    if (!card) return
    const w = card.clientWidth
    const h = card.clientHeight
    const bw = 190
    const bh = 48
    let left = 0
    let top = 0
    for (let i = 0; i < 6; i++) {
      left = 12 + Math.random() * Math.max(0, w - bw - 24)
      top = 12 + Math.random() * Math.max(0, h - bh - 24)
      if (!noPos || Math.hypot(left - noPos.left, top - noPos.top) > 90) break
    }
    setNoPos({ left, top })
    setTries((t) => t + 1)
  }

  async function send() {
    if (!place || !time || sending) return
    setError('')
    if (preview || !cfg.rsvp.enabled) {
      setStage('done')
      return
    }
    setSending(true)
    try {
      await submit({
        kind: 'rsvp',
        name: to || 'Mehmon',
        attending: 'keladi',
        guests: 1,
        comment: `Javob: Ha 💗\nJoy: ${place}\nVaqt: ${time}`,
      })
      setStage('done')
    } catch {
      setError('Yuborilmadi. Internetni tekshirib, qayta urinib ko‘ring.')
    } finally {
      setSending(false)
    }
  }

  const promoUrl = cfg.promo?.siteUrl
    ? `${cfg.promo.siteUrl}/shablon/uchrashuv-taklif?utm_source=uchrashuv&utm_medium=invite`
    : ''
  const yesScale = Math.min(1 + tries * 0.12, 1.6)

  return (
    <main className="ut-bg relative min-h-dvh overflow-hidden font-body text-ink">
      <Hearts />
      <MusicToggle autoplay={stage !== 'envelope' || opening} />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-5 py-10">
        {stage === 'envelope' && (
          <div className="ut-in flex flex-col items-center text-center">
            <p className="font-display text-sm uppercase tracking-[0.3em] text-gold">{cfg.event.kicker || 'Uchrashuvga taklif'}</p>
            <h1 className="mt-3 font-script text-5xl leading-tight text-gold-dark">
              {to ? `${to},` : 'Sizga'}
            </h1>
            <p className="mt-1 font-display text-xl text-ink">sizga xat bor 💌</p>

            <div className={`ut-env mt-10 ${opening ? 'ut-open' : ''}`}>
              <div className="ut-env-back" />
              <div className="ut-letter">
                <span className="font-script text-3xl text-wine">♥</span>
              </div>
              <div className="ut-env-front" />
              <div className="ut-env-flap" />
              <button type="button" className="ut-seal" onClick={open} aria-label="Muhrni bosing">
                ♥
              </button>
            </div>

            <p className={`mt-8 font-display text-base text-ink-soft transition-opacity ${opening ? 'opacity-0' : ''}`}>
              Muhrni bosing 👆
            </p>
          </div>
        )}

        {stage === 'ask' && (
          <div ref={cardRef} className="ut-card ut-in relative w-full px-6 pb-8 pt-9 text-center">
            <p className="text-wine">♥</p>
            {message && (
              <blockquote className="mx-auto mt-4 rounded-2xl bg-blush/60 px-5 py-4 font-body text-lg italic leading-relaxed text-ink-soft">
                “{message}”
              </blockquote>
            )}
            <h2 className="mt-7 font-script text-[2.6rem] leading-[1.15] text-gold-dark">
              Men bilan uchrashuvga chiqasizmi?
            </h2>

            <div className="mt-8 flex min-h-[64px] items-center justify-center gap-3">
              <button
                type="button"
                className="ut-btn"
                style={{ transform: `scale(${yesScale})` }}
                onClick={() => setStage('choose')}
              >
                Ha 💗
              </button>
              {!noPos && (
                <button type="button" className="ut-no" onPointerEnter={dodge} onPointerDown={dodge} onClick={dodge}>
                  {NO_LABELS[0]}
                </button>
              )}
            </div>
            {noPos && (
              <button
                type="button"
                className="ut-no absolute z-20 whitespace-nowrap"
                style={{ left: noPos.left, top: noPos.top }}
                onPointerEnter={dodge}
                onPointerDown={dodge}
                onClick={dodge}
              >
                {NO_LABELS[Math.min(tries, NO_LABELS.length - 1)]}
              </button>
            )}

            {from && <p className="mt-10 font-script text-3xl text-gold">— {from}</p>}
          </div>
        )}

        {stage === 'choose' && (
          <div className="ut-card ut-in w-full px-6 pb-8 pt-8 text-center">
            <Burst />
            <h2 className="font-script text-4xl text-gold-dark">Ajoyib! 🎉</h2>

            <p className="mt-6 font-display text-xl text-ink">Qayerga boramiz?</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {places.map((p) => (
                <button key={p} type="button" className="ut-chip" aria-pressed={place === p} onClick={() => setPlace(p)}>
                  {p}
                </button>
              ))}
            </div>

            <p className="mt-7 font-display text-xl text-ink">Qachon?</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {times.map((t) => (
                <button key={t} type="button" className="ut-chip" aria-pressed={time === t} onClick={() => setTime(t)}>
                  🕐 {t}
                </button>
              ))}
            </div>

            <button type="button" className="ut-btn mt-8" disabled={!place || !time || sending} onClick={send}>
              {sending ? 'Yuborilmoqda…' : 'Yuborish 💌'}
            </button>
            {error && <p className="mt-3 font-display text-sm text-wine-dark">{error}</p>}
            {from && <p className="mt-6 font-script text-3xl text-gold">— {from}</p>}
          </div>
        )}

        {stage === 'done' && (
          <div className="ut-card ut-in w-full px-6 pb-9 pt-9 text-center">
            <p className="text-5xl">💌</p>
            <h2 className="mt-4 font-script text-4xl text-gold-dark">Javobingiz yuborildi!</h2>
            <p className="mt-4 font-display text-lg text-ink">
              {from ? `${from} sizni kutadi` : 'Sizni kutishadi'}
            </p>
            <p className="mt-3 inline-block rounded-2xl bg-blush/70 px-5 py-3 font-display text-base text-ink">
              {place}
              <br />
              🕐 {time}
            </p>
            {preview && (
              <p className="mt-4 font-display text-xs text-ink-soft">Bu namuna — javob hech kimga yuborilmadi.</p>
            )}
            <p className="mt-6 font-script text-3xl text-gold">Ko‘rishguncha! ♥</p>
          </div>
        )}

        {cfg.promo?.enabled !== false && promoUrl && (
          <a
            href={promoUrl}
            target="_blank"
            rel="noopener"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 font-display text-sm text-ink-soft shadow-sm backdrop-blur"
          >
            💌 Bunday taklifnomani siz ham yarating →
          </a>
        )}
      </div>
    </main>
  )
}
