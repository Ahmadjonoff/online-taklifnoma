import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { config } from '@config'
import { MusicToggle } from '@core/components/MusicToggle'
import { isPreviewContext, submit } from '@core/lib/submit'

/**
 * «Oqshom» — uchrashuvga taklif (sayt uslubida: siyoh, fil suyagi, tilla folga).
 *
 * Konvert (bordo muhr, monogramma) → letterpress maktub va savol → «Ha» →
 * menyu kartasidek joy va vaqt tanlash → chipta: javob taklif qiluvchiga RSVP
 * sifatida (buyurtma sahifasi va Telegram bot) yuboriladi.
 */

type Stage = 'envelope' | 'ask' | 'choose' | 'done'
type IconName = 'cafe' | 'dinner' | 'cinema' | 'walk' | 'pin' | 'clock' | 'pen'

// Buyurtma formasining jonli preview'i joy bo'sh bo'lsa shu namunani qo'yadi
const VENUE_PLACEHOLDER = "To'yxona nomi"
const NO_LABELS = ['Yo‘q', 'Rostdanmi?', 'Yana bir o‘ylab ko‘ring', 'Iltimos…', 'Baribir «ha» bo‘ladi']

const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
const WEEKDAYS = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/
const pad = (n: number) => String(n).padStart(2, '0')
const isoOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
function dayParts(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return { week: WEEKDAYS[dt.getDay()], date: `${d}-${MONTHS[m - 1]}` }
}
// Uchrashuv turiga qarab joy maydonining namunasi
const PLACE_HINT: Record<string, string> = {
  cafe: 'Kafe nomi yoki manzili',
  dinner: 'Restoran nomi',
  cinema: 'Kinoteatr nomi',
  walk: 'Qayerda sayr qilamiz? (park, ko‘cha…)',
}
const ROMAN = ['I', 'II', 'III', 'IV']

const cfg = config as typeof config & {
  promo?: { enabled?: boolean; siteUrl?: string }
  guest?: { name?: string }
}

/* --------------------------------------------------------------- ikonlar */
const ICON_PATHS: Record<IconName, ReactNode> = {
  cafe: (
    <>
      <path d="M4 10h12v3.5A5.5 5.5 0 0 1 10.5 19h-1A5.5 5.5 0 0 1 4 13.5V10Z" />
      <path d="M16 11h1.6a2.4 2.4 0 0 1 0 4.8H15.6" />
      <path d="M8 3.5c0 1 1 1.4 1 2.5S8 7.5 8 7.5M12 3.5c0 1 1 1.4 1 2.5s-1 1.5-1 1.5" />
    </>
  ),
  dinner: (
    <>
      <path d="M6 3v5.5a2 2 0 0 0 4 0V3M8 3v18" />
      <path d="M17 21V3c-2.2 1.3-3 4.6-3 8h3" />
    </>
  ),
  cinema: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="1.5" />
      <path d="M7.5 5v14M16.5 5v14M3.5 9.5h4M3.5 14.5h4M16.5 9.5h4M16.5 14.5h4" />
    </>
  ),
  walk: (
    <>
      <path d="M17.5 4.5a6 6 0 1 0 2 8.5 5 5 0 0 1-2-8.5Z" />
      <path d="M5 4.5v2M4 5.5h2M8.5 2.5v1.4M7.8 3.2h1.4" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.8-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.2 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.3" />
    </>
  ),
  pen: (
    <>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="M13.5 6.5l4 4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICON_PATHS[name]}
    </svg>
  )
}

/* --------------------------------------------------------------- bezak */
function Corner({ style }: { style: CSSProperties }) {
  return (
    <svg className="oq-corner" style={style} viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
      <path d="M1 33V12C1 6 6 1 12 1h21" />
      <path d="M6 33V15c0-5 4-9 9-9h18" opacity=".55" />
      <path d="M12 12l2.5-2.5L17 12l-2.5 2.5z" fill="currentColor" stroke="none" />
    </svg>
  )
}

function Corners() {
  return (
    <>
      <Corner style={{ left: 22, top: 22 }} />
      <Corner style={{ right: 22, top: 22, transform: 'scaleX(-1)' }} />
      <Corner style={{ left: 22, bottom: 22, transform: 'scaleY(-1)' }} />
      <Corner style={{ right: 22, bottom: 22, transform: 'scale(-1)' }} />
    </>
  )
}

function Diamond() {
  return (
    <div className="oq-rule my-5 justify-center" aria-hidden>
      <svg width="9" height="9" viewBox="0 0 10 10">
        <path d="M5 0l5 5-5 5-5-5z" fill="currentColor" />
      </svg>
    </div>
  )
}

/** Bordo sur'g'uch muhr; o'rtasida tilla monogramma */
function Seal({ letter, size = 86 }: { letter: string; size?: number }) {
  const blob =
    'M100 8c14 0 21 10 33 13s24-5 34 3 4 22 10 33 17 15 17 29-11 19-13 31 5 24-3 34-22 4-33 10-15 17-29 17-19-11-31-13-24 5-34-3-4-22-10-33S8 114 8 100s11-19 13-31S16 45 24 35s22-4 33-10S86 8 100 8Z'
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden>
      <defs>
        <radialGradient id="oq-wax" cx="36%" cy="30%" r="80%">
          <stop offset="0%" style={{ stopColor: 'color-mix(in oklab, var(--color-wine) 60%, #fff)' }} />
          <stop offset="45%" style={{ stopColor: 'var(--color-wine)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-wine-dark)' }} />
        </radialGradient>
        <linearGradient id="oq-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--color-gold-light)' }} />
          <stop offset="55%" style={{ stopColor: 'var(--color-gold)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-gold-dark)' }} />
        </linearGradient>
      </defs>
      <path d={blob} fill="url(#oq-wax)" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="rgba(0,0,0,.28)" strokeWidth="6" />
      <circle cx="100" cy="100" r="58" fill="none" stroke="url(#oq-gold)" strokeWidth="1.6" opacity=".9" />
      <circle cx="100" cy="100" r="50" fill="none" stroke="url(#oq-gold)" strokeWidth=".8" strokeDasharray="2 4" opacity=".75" />
      <text x="100" y="104" textAnchor="middle" dominantBaseline="middle" fontFamily="Playfair Display, Georgia, serif" fontSize="64" fill="url(#oq-gold)">
        {letter}
      </text>
    </svg>
  )
}

function Dust({ count = 18 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 53) % 100}%`,
        bottom: `${(i * 29) % 40}%`,
        size: 1.5 + (i % 3),
        dur: 10 + ((i * 7) % 9),
        delay: -((i * 1.9) % 14),
        dx: `${((i % 5) - 2) * 18}px`,
      })),
    [count],
  )
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="oq-dust"
          style={{ left: d.left, bottom: d.bottom, width: d.size, height: d.size, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s`, '--dx': d.dx } as CSSProperties}
        />
      ))}
    </div>
  )
}

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="mt-7">
      <p className="mb-3 flex items-baseline gap-2">
        <span className="font-display text-[0.95rem] text-gold-dark">{ROMAN[n]}.</span>
        <span className="oq-caps text-[var(--tpl-card-soft)]">{title}</span>
      </p>
      {children}
    </section>
  )
}

function Check() {
  return (
    <span className="oq-check">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2.5 6.5l2.2 2.2 4.8-5" />
      </svg>
    </span>
  )
}

function TicketField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="oq-caps !text-[0.58rem] text-[var(--tpl-card-soft)]">{label}</p>
      <p className="mt-1 break-words font-display text-[1.08rem] leading-snug">{value}</p>
    </div>
  )
}

/* ---------------------------------------------------------------- sahifa */
export default function App() {
  const from = cfg.couple.groom
  const to = cfg.guest?.name || cfg.couple.bride
  const message = cfg.blessing.text
  const initial = (from || '✦').trim().charAt(0).toUpperCase()

  /* --- taklif qiluvchining tavsiyalari va mehmon tanlovi --- */
  const kinds = cfg.places.map((p) => ({ icon: p.icon as IconName, label: p.label }))
  const ownVenue =
    cfg.venue.name && cfg.venue.name !== VENUE_PLACEHOLDER
      ? { name: cfg.venue.name, address: cfg.venue.address, map: cfg.venue.googleMapsUrl || cfg.venue.yandexMapsUrl }
      : null

  const today = useMemo(() => isoOf(new Date()), [])
  const dates = useMemo(() => {
    const out: { iso: string; tag: string }[] = []
    const add = (iso: string, tag: string) => {
      if (iso >= today && !out.some((d) => d.iso === iso)) out.push({ iso, tag })
    }
    add(cfg.event.dateISO.slice(0, 10), 'Taklif qilingan')
    const d = new Date()
    d.setDate(d.getDate() + 1)
    add(isoOf(d), 'Ertaga')
    for (let i = 0; i < 8 && out.length < 4; i++) {
      d.setDate(d.getDate() + 1)
      if (d.getDay() === 6 || d.getDay() === 0) add(isoOf(d), 'Dam olish kuni')
    }
    return out.slice(0, 4)
  }, [today])

  const times = useMemo(() => {
    const list = [cfg.event.timeLabel, ...cfg.timeline.items.map((t) => t.time), '18:00', '19:00', '20:00', '21:00']
    return [...new Set(list.filter((t) => TIME_RE.test(t || '')))].slice(0, 4)
  }, [])

  const [stage, setStage] = useState<Stage>('envelope')
  const [opening, setOpening] = useState(false)
  const [tries, setTries] = useState(0)
  const [noPos, setNoPos] = useState<{ left: number; top: number } | null>(null)
  const [kind, setKind] = useState(-1)
  const [placeMode, setPlaceMode] = useState<'own' | 'custom' | ''>(ownVenue ? '' : 'custom')
  const [customPlace, setCustomPlace] = useState('')
  const [date, setDate] = useState('')
  const [dateCustom, setDateCustom] = useState(false)
  const [time, setTime] = useState('')
  const [timeCustom, setTimeCustom] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const preview = isPreviewContext()
  const cardRef = useRef<HTMLDivElement>(null)
  const lastDodge = useRef(0)

  // Har bosqich sahifaning boshidan ko'rinsin (uzun tanlov kartasidan keyin chipta pastda qolmasin)
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [stage])

  const kindLabel = kind >= 0 ? kinds[kind].label : ''
  const placeLabel = placeMode === 'own' && ownVenue ? ownVenue.name : placeMode === 'custom' ? customPlace.trim() : ''
  const dateLabel = date ? (({ week, date: dd }) => `${week}, ${dd}`)(dayParts(date)) : ''
  const timeLabel = TIME_RE.test(time) ? time : ''
  const ready = Boolean(kindLabel && placeLabel && dateLabel && timeLabel)

  function open() {
    if (opening) return
    setOpening(true)
    window.setTimeout(() => setStage('ask'), 1900)
  }

  // «Yo'q» kartaning ichida boshqa joyga sirpanib o'tadi
  function dodge() {
    const now = performance.now()
    if (now - lastDodge.current < 250) return // bitta bosish = bitta qochish
    lastDodge.current = now
    const card = cardRef.current
    if (!card) return
    const w = card.clientWidth
    const h = card.clientHeight
    let left = 0
    let top = 0
    for (let i = 0; i < 8; i++) {
      left = 30 + Math.random() * Math.max(0, w - 260)
      top = 40 + Math.random() * Math.max(0, h - 120)
      if (!noPos || Math.hypot(left - noPos.left, top - noPos.top) > 110) break
    }
    setNoPos({ left, top })
    setTries((t) => t + 1)
  }

  async function send() {
    if (!ready || sending) return
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
        comment: `Uchrashuv: ${kindLabel}\nJoy: ${placeLabel}\nSana: ${dateLabel}\nVaqt: ${timeLabel}`,
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

  return (
    <main className="oq-scene oq-grain relative min-h-dvh overflow-hidden font-body text-ink">
      <Dust />
      <MusicToggle autoplay={stage !== 'envelope' || opening} />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[440px] flex-col items-center justify-center px-5 py-12">
        {/* ------------------------------------------------ 1. konvert */}
        {stage === 'envelope' && (
          <div className="oq-stagger flex flex-col items-center text-center">
            <p className="oq-caps oq-rule text-gold">{cfg.event.kicker || 'Shaxsiy taklif'}</p>
            <h1 className="mt-6 font-display text-[2.9rem] leading-[1.05]">
              <span className="oq-foil">{to || 'Sizga'}</span>
            </h1>
            <p className="mt-3 font-body text-xl italic text-ink-soft">siz uchun bir maktub bor</p>

            <div className={`oq-env mt-12 ${opening ? 'oq-open' : ''}`}>
              <div className="oq-env-back" />
              <div className="oq-env-card" />
              <div className="oq-env-pocket" />
              <div className="oq-env-flap-edge" />
              <div className="oq-env-flap" />
              <button type="button" className="oq-seal" onClick={open} aria-label="Muhrni oching">
                <Seal letter={initial} />
              </button>
            </div>

            <p className={`oq-caps mt-12 text-gold transition-opacity duration-500 ${opening ? 'opacity-0' : ''}`}>
              Muhrni oching
            </p>
          </div>
        )}

        {/* ------------------------------------------------ 2. maktub */}
        {stage === 'ask' && (
          <div ref={cardRef} className="oq-card oq-in relative w-full px-9 pb-12 pt-14 text-center">
            <Corners />
            <div className="oq-stagger relative">
              <p className="oq-caps text-gold-dark">Shaxsiy taklif</p>
              <h2 className="mt-5 font-display text-[1.9rem] leading-tight">Aziz {to || 'do‘stim'},</h2>
              {message && <p className="mx-auto mt-4 max-w-[30ch] font-body text-[1.22rem] italic leading-relaxed text-[var(--tpl-card-soft)]">{message}</p>}
              <Diamond />
              <h3 className="font-display text-[1.75rem] leading-[1.25]">
                <span className="oq-foil">Men bilan bir oqshomni o‘tkazasizmi?</span>
              </h3>
              <div className="mt-9 flex min-h-[60px] items-center justify-center gap-5">
                <button
                  type="button"
                  className="oq-yes"
                  style={{ transform: `scale(${Math.min(1 + tries * 0.07, 1.35)})` }}
                  onClick={() => setStage('choose')}
                >
                  Ha, albatta
                </button>
                {!noPos && (
                  <button type="button" className="oq-no" onPointerEnter={dodge} onPointerDown={dodge} onClick={dodge}>
                    {NO_LABELS[0]}
                  </button>
                )}
              </div>
              {from && <p className="mt-10 font-display text-lg text-[var(--tpl-card-soft)]">— {from}</p>}
            </div>
            {noPos && (
              <button
                type="button"
                className="oq-no oq-no-float absolute z-20 whitespace-nowrap"
                style={{ left: noPos.left, top: noPos.top }}
                onPointerEnter={dodge}
                onPointerDown={dodge}
                onClick={dodge}
              >
                {NO_LABELS[Math.min(tries, NO_LABELS.length - 1)]}
              </button>
            )}
          </div>
        )}

        {/* ------------------------------------------------ 3. tanlov */}
        {stage === 'choose' && (
          <div className="oq-card oq-in relative w-full px-7 pb-11 pt-12">
            <Corners />
            <div className="oq-stagger relative">
              <p className="oq-caps text-center text-gold-dark">Ajoyib</p>
              <h2 className="mt-3 text-center font-display text-[1.7rem] leading-tight">
                <span className="oq-foil">Oqshomni birga rejalaymiz</span>
              </h2>

              <Section n={0} title="Qanday uchrashuv?">
                <div className="grid grid-cols-2 gap-2">
                  {kinds.map((k, i) => (
                    <button key={k.label} type="button" className="oq-opt !gap-2.5" aria-pressed={kind === i} onClick={() => setKind(i)}>
                      <span className="oq-ico !h-8 !w-8">
                        <Icon name={k.icon} size={18} />
                      </span>
                      <span className="font-display text-[0.98rem] leading-tight">{k.label}</span>
                    </button>
                  ))}
                </div>
              </Section>

              <Section n={1} title="Qayerda?">
                <div className="grid gap-2">
                  {ownVenue && (
                    <button type="button" className="oq-opt" aria-pressed={placeMode === 'own'} onClick={() => setPlaceMode('own')}>
                      <span className="oq-ico">
                        <Icon name="pin" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-display text-[1.02rem]">{ownVenue.name}</span>
                        <span className="block truncate font-body text-[0.92rem] italic leading-tight text-[var(--tpl-card-soft)]">
                          {ownVenue.address || `${from || 'U'} tanlagan joy`}
                        </span>
                      </span>
                      <Check />
                    </button>
                  )}
                  {ownVenue && (
                    <button type="button" className="oq-opt" aria-pressed={placeMode === 'custom'} onClick={() => setPlaceMode('custom')}>
                      <span className="oq-ico">
                        <Icon name="pen" />
                      </span>
                      <span className="font-display text-[1.02rem]">Boshqa joy taklif qilaman</span>
                      <Check />
                    </button>
                  )}
                  {placeMode === 'custom' && (
                    <input
                      className="oq-input"
                      value={customPlace}
                      maxLength={80}
                      autoFocus={Boolean(ownVenue)}
                      onChange={(e) => setCustomPlace(e.target.value)}
                      placeholder={PLACE_HINT[kinds[kind]?.icon] ?? 'Joy nomi yoki manzili'}
                    />
                  )}
                </div>
              </Section>

              <Section n={2} title="Qaysi kuni?">
                <div className="grid grid-cols-2 gap-2">
                  {dates.map((d) => {
                    const p = dayParts(d.iso)
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        className="oq-opt flex-col !items-start !gap-0.5"
                        aria-pressed={!dateCustom && date === d.iso}
                        onClick={() => {
                          setDateCustom(false)
                          setDate(d.iso)
                        }}
                      >
                        <span className="oq-caps !text-[0.56rem] !tracking-[0.22em] text-[var(--tpl-card-soft)]">{d.tag}</span>
                        <span className="font-display text-[1.1rem] leading-tight">{p.date}</span>
                        <span className="font-body text-[0.92rem] italic leading-none text-[var(--tpl-card-soft)]">{p.week}</span>
                      </button>
                    )
                  })}
                  <button
                    type="button"
                    className="oq-opt col-span-2 justify-center"
                    aria-pressed={dateCustom}
                    onClick={() => {
                      setDateCustom(true)
                      setDate('')
                    }}
                  >
                    <span className="font-display text-[0.98rem]">Boshqa kun</span>
                  </button>
                  {dateCustom && (
                    <input type="date" className="oq-input col-span-2" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
                  )}
                </div>
              </Section>

              <Section n={3} title="Soat nechada?">
                <div className="grid grid-cols-4 gap-2">
                  {times.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="oq-opt justify-center !px-1"
                      aria-pressed={!timeCustom && time === t}
                      onClick={() => {
                        setTimeCustom(false)
                        setTime(t)
                      }}
                    >
                      <span className="font-display text-[1.05rem]">{t}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    className="oq-opt col-span-4 justify-center"
                    aria-pressed={timeCustom}
                    onClick={() => {
                      setTimeCustom(true)
                      setTime('')
                    }}
                  >
                    <span className="font-display text-[0.98rem]">Boshqa vaqt</span>
                  </button>
                  {timeCustom && <input type="time" className="oq-input col-span-4" value={time} onChange={(e) => setTime(e.target.value)} />}
                </div>
              </Section>

              <div className="mt-8 text-center">
                <button type="button" className="oq-yes" disabled={!ready || sending} onClick={send}>
                  {sending ? 'Yuborilmoqda…' : 'Javobni yuborish'}
                </button>
                {!ready && (
                  <p className="mt-3 font-body text-[0.98rem] italic text-[var(--tpl-card-soft)]">Turi, joy, kun va vaqtni tanlang</p>
                )}
                {error && <p className="mt-3 font-body text-base italic text-wine">{error}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------ 4. chipta */}
        {stage === 'done' && (
          <div className="oq-in w-full">
            <div className="oq-tk-top px-8 pb-8 pt-10 text-center">
              <p className="oq-caps oq-rule justify-center text-gold-dark">Uchrashuv</p>
              <h2 className="mt-5 font-display text-[2.1rem] leading-tight">
                <span className="oq-foil">
                  {from}
                  {from && to ? ' & ' : ''}
                  {to}
                </span>
              </h2>
              <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5 text-left">
                <TicketField label="Uchrashuv" value={kindLabel} />
                <TicketField label="Joy" value={placeLabel} />
                <TicketField label="Sana" value={dateLabel} />
                <TicketField label="Vaqt" value={timeLabel} />
              </div>
              {placeMode === 'own' && ownVenue?.map && (
                <a href={ownVenue.map} target="_blank" rel="noopener" className="oq-caps mt-6 inline-block text-gold-dark underline-offset-4 hover:underline">
                  Xaritada ochish →
                </a>
              )}
            </div>
            <div className="oq-tk-stub flex items-center gap-4 px-8 py-6">
              <Seal letter={initial} size={58} />
              <div className="text-left">
                <p className="font-display text-[1.05rem]">Javobingiz yuborildi</p>
                <p className="font-body text-[1rem] italic text-[var(--tpl-card-soft)]">
                  {preview ? 'Bu namuna — javob hech kimga yuborilmadi' : `${from || 'U'} sizni kutadi. Chiptani saqlab qo‘ying.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {cfg.promo?.enabled !== false && promoUrl && (
          <a href={promoUrl} target="_blank" rel="noopener" className="oq-caps mt-10 text-gold/80 transition-colors hover:text-gold">
            Online taklifnoma · o‘zingiz ham yarating
          </a>
        )}
      </div>
    </main>
  )
}
