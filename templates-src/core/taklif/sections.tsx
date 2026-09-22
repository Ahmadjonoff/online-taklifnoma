import { config } from '@config'
import { bgClass, topEdge, type Skin } from '../lib/skin'
import { TornEdge } from '@decor/TornEdge'
import { FloralCorner, Ornament } from '@decor/Floral'
import { Card, GoldButton, Kicker, OrnamentedTitle, Reveal, ScriptTitle, Section } from './ui'

/**
 * Yangi bo'limlar — taklif-link.uz dagi taklifnomalarda uchraydigan, bizda
 * ilgari bo'lmagan bloklar: oylik kalendar, ko'p tadbirli dastur, kun tartibi,
 * maxsus mehmonlar (xonandalar), sevgi hikoyasi, murojaat va kiyim uslubi.
 *
 * Hammasi umumiy — `config` (config-default.ts + platforma inject'i) dan
 * o'qiydi, ya'ni har bir shablon ularni yoqib/o'chirishi mumkin.
 */

/* ==========================================================================
 *  Oylik kalendar — tadbir kuni ajratib ko'rsatiladi
 * ======================================================================== */

const MONTHS_UZ = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
]
const WEEKDAYS_UZ = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya']

export function Calendar(skin: Skin) {
  const c = config.calendar
  if (!c?.enabled) return null

  const target = new Date(config.event.dateISO)
  const year = target.getFullYear()
  const month = target.getMonth()
  const day = target.getDate()

  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7 // Dushanba = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: Array<number | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <Section skin={skin}>
      <OrnamentedTitle kicker={c.kicker}>{c.title}</OrnamentedTitle>

      <Reveal delay={140}>
        <Card className="mx-auto mt-8 max-w-sm">
          <p className="font-display text-xl tracking-wide text-gold">
            {MONTHS_UZ[month]} {year}
          </p>
          <Ornament className="mx-auto mt-3 text-gold/35" width={130} />

          <div className="mt-5 grid grid-cols-7 gap-y-2">
            {WEEKDAYS_UZ.map((w) => (
              <span key={w} className="tracking-wider-caps font-body text-[0.6rem] text-ink-soft/60">
                {w}
              </span>
            ))}
            {cells.map((d, i) => {
              const isEvent = d === day
              return (
                <span key={i} className="flex justify-center">
                  {d ? (
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-body text-[0.95rem] tabular-nums ${
                        isEvent
                          ? 'animate-pulse-soft bg-gold/90 font-semibold text-paper shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-gold)_22%,transparent)]'
                          : 'text-ink-soft'
                      }`}
                    >
                      {d}
                    </span>
                  ) : null}
                </span>
              )
            })}
          </div>
        </Card>
      </Reveal>
    </Section>
  )
}

/* ==========================================================================
 *  Ko'p tadbirli dastur — «Qizlar bazmi» + «Nikoh to'yi» kabi
 * ======================================================================== */

export function Events(skin: Skin) {
  const c = config.events
  if (!c?.enabled || !c.items?.length) return null

  return (
    <section className={`paper-grain relative overflow-hidden px-6 py-20 sm:py-24 ${bgClass(skin.bg)}`}>
      {topEdge(skin) && <TornEdge position="top" color={topEdge(skin)!} />}
      <FloralCorner id="ev-r" position="tr" className="w-[40vw] max-w-[210px]" opacity={0.75} />

      <div className="relative z-20 mx-auto w-full max-w-lg">
        <OrnamentedTitle kicker={c.kicker}>{c.title}</OrnamentedTitle>

        <div className="mt-9 space-y-5 text-left">
          {c.items.map((ev: EventItem, i: number) => (
            <Reveal key={ev.title} delay={i * 160}>
              <Card>
                {ev.kicker && <Kicker>{ev.kicker}</Kicker>}
                <h3 className="mt-2 font-display text-2xl text-ink sm:text-[1.7rem]">{ev.title}</h3>
                <Ornament className="mt-3 text-gold/40" width={120} />

                <dl className="mt-4 space-y-2.5 font-body text-[1.02rem]">
                  <Row label="Sana" value={ev.dateLabel} />
                  <Row label="Vaqt" value={ev.timeLabel} />
                  <Row label="Manzil" value={ev.venueName} />
                </dl>

                {ev.venueAddress && (
                  <p className="mt-2 font-body text-[0.95rem] leading-relaxed text-ink-soft">
                    {ev.venueAddress}
                  </p>
                )}

                {(ev.googleMapsUrl || ev.yandexMapsUrl) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {ev.googleMapsUrl && (
                      <GoldButton href={ev.googleMapsUrl} variant="outline" className="w-auto px-4 py-2 text-[0.8rem]">
                        Google xarita
                      </GoldButton>
                    )}
                    {ev.yandexMapsUrl && (
                      <GoldButton href={ev.yandexMapsUrl} variant="outline" className="w-auto px-4 py-2 text-[0.8rem]">
                        Yandex xarita
                      </GoldButton>
                    )}
                  </div>
                )}
              </Card>
            </Reveal>
          ))}
        </div>

        {c.note && (
          <Reveal delay={200}>
            <p className="mt-6 font-body text-[0.95rem] italic text-ink-soft/80">{c.note}</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}

type EventItem = {
  kicker?: string
  title: string
  dateLabel: string
  timeLabel: string
  venueName: string
  venueAddress?: string
  googleMapsUrl?: string
  yandexMapsUrl?: string
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex gap-3">
      <dt className="tracking-wider-caps w-20 shrink-0 pt-0.5 font-body text-[0.62rem] text-gold/75">{label}</dt>
      <dd className="flex-1 text-ink">{value}</dd>
    </div>
  )
}

/* ==========================================================================
 *  Kun tartibi (Schedule) — vertikal chiziq, o'rtasida naqsh
 * ======================================================================== */

export function Schedule(skin: Skin, { variant = 'ornate' as const }: { variant?: 'ornate' | 'plain' }) {
  const { title, items } = config.timeline
  if (!items?.length) return null
  const middle = Math.floor(items.length / 2)

  return (
    <section className={`paper-grain relative overflow-hidden px-6 py-20 sm:py-24 ${bgClass(skin.bg)}`}>
      {topEdge(skin) && <TornEdge position="top" color={topEdge(skin)!} />}

      <div className="relative z-20 mx-auto w-full max-w-lg">
        <OrnamentedTitle kicker="Kun tartibi">{title}</OrnamentedTitle>

        <ol className="relative mt-11">
          <div
            className="absolute bottom-3 left-4 top-3 w-px sm:left-1/2"
            style={{
              background:
                'linear-gradient(to bottom, transparent, var(--color-gold) 12%, var(--color-gold) 88%, transparent)',
              opacity: 0.4,
            }}
            aria-hidden="true"
          />

          {items.map((item: { time: string; label: string }, i: number) => (
            <li key={`${item.time}-${i}`} className="relative pb-7 pl-12 text-left sm:pl-0">
              <Reveal delay={i * 110}>
                <div className="sm:grid sm:grid-cols-[1fr_3rem_1fr] sm:items-center sm:gap-2">
                  {/* Vaqt — MUHIM: har ikki holatda ham aniq `order` beriladi.
                      Aks holda faqat belgi (Diamond) o'zining order-2'siga
                      ega bo'lib, vaqt/izoh esa standart order:0'da qoladi —
                      CSS Grid avtomatik joylashtirishda ikkita order:0
                      elementni DOM tartibida oldin qo'yib, order-2 belgini
                      oxiriga suradi (izoh 3rem'lik tor ustunga siqiladi). */}
                  {/* DIQQAT: sm:text-right/sm:text-left shu yerda bittagina
                      manbadan (ternary) kelishi kerak — agar ikkalasi ham
                      bir vaqtda class ro'yxatida bo'lsa, qaysi biri g'olib
                      chiqishi Tailwind CSS chiqishidagi tartibga bog'liq
                      bo'lib qoladi va toq qatorlardagi vaqt markazdan uzoqlashib,
                      ustun chetiga yopishib qoladi. */}
                  <span
                    className={`font-display text-[1.6rem] text-gold sm:text-2xl ${
                      i % 2 ? 'sm:order-3 sm:text-left' : 'sm:order-1 sm:text-right'
                    }`}
                  >
                    {item.time}
                  </span>

                  {/* Belgisi */}
                  <span className="absolute left-0 top-1.5 flex justify-center sm:static sm:order-2">
                    {variant === 'ornate' && i === middle ? (
                      <Diamond size={16} />
                    ) : (
                      <Diamond size={10} />
                    )}
                  </span>

                  {/* Izoh */}
                  <span
                    className={`font-body text-[1.05rem] leading-snug text-ink-soft sm:text-lg ${
                      i % 2 ? 'sm:order-1 sm:text-right' : 'sm:order-3'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Diamond({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" className="text-gold" aria-hidden="true">
      <path d="M6.5 0L13 6.5 6.5 13 0 6.5z" fill="currentColor" />
    </svg>
  )
}

/* ==========================================================================
 *  Maxsus mehmonlar (xonandalar)
 * ======================================================================== */

export function Singers(skin: Skin) {
  const c = config.singers
  if (!c?.enabled || !c.items?.length) return null
  const slider = c.layout === 'slider'

  return (
    <Section skin={skin}>
      <OrnamentedTitle kicker={c.kicker}>{c.title}</OrnamentedTitle>
      {c.text && (
        <Reveal delay={120}>
          <p className="mx-auto mt-4 max-w-sm font-body text-lg leading-relaxed text-ink-soft">{c.text}</p>
        </Reveal>
      )}

      <Reveal delay={180}>
        <div
          className={
            slider
              ? 'mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
              : 'mt-9 space-y-4'
          }
        >
          {c.items.map((s: Singer) => (
            <Card
              key={s.name}
              className={slider ? 'w-[68%] shrink-0 snap-center text-center sm:w-[46%]' : 'text-center'}
            >
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-gold/35 bg-paper-2">
                {s.photo ? (
                  <img src={s.photo} alt={s.name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center font-display text-2xl text-gold">
                    {s.name.charAt(0)}
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-display text-xl text-ink">{s.name}</h3>
              {s.note && <p className="mt-1.5 font-body text-[0.95rem] text-ink-soft">{s.note}</p>}
            </Card>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}

type Singer = { name: string; note?: string; photo?: string }

/* ==========================================================================
 *  Bizning hikoyamiz
 * ======================================================================== */

export function Story(skin: Skin) {
  const c = config.story
  if (!c?.enabled || !c.text) return null

  return (
    <Section skin={skin}>
      <OrnamentedTitle kicker={c.kicker}>{c.title}</OrnamentedTitle>

      {c.photo && (
        <Reveal delay={120}>
          <img
            src={c.photo}
            alt=""
            loading="lazy"
            className="mx-auto mt-8 w-full max-w-sm rounded-2xl border border-gold/25 object-cover shadow-[0_20px_45px_-30px_rgba(60,40,10,0.95)]"
          />
        </Reveal>
      )}

      <Reveal delay={200}>
        <p className="mx-auto mt-7 max-w-md font-body text-lg leading-loose text-ink-soft sm:text-xl">
          {c.text}
        </p>
      </Reveal>
    </Section>
  )
}

/* ==========================================================================
 *  Murojaat — «Aziz mehmonimiz»
 * ======================================================================== */

export function DearGuests(skin: Skin) {
  const c = config.dearGuests
  if (!c?.enabled) return null

  return (
    <Section skin={skin}>
      <Reveal>
        <Kicker>{c.greeting || 'Aziz va qadrli insonimiz!'}</Kicker>
        <Ornament className="mx-auto mt-4 text-gold/45" width={150} />
      </Reveal>

      <Reveal delay={160}>
        <p className="mx-auto mt-6 max-w-md font-body text-lg leading-loose text-ink sm:text-xl">{c.text}</p>
      </Reveal>

      <Reveal delay={300}>
        <p className="mt-6 font-body text-[0.95rem] text-ink-soft">Hurmat bilan,</p>
        <p className="font-script text-gilded mt-1 text-3xl">
          {c.signature || `${config.couple.groom} & ${config.couple.bride}`}
        </p>
      </Reveal>
    </Section>
  )
}

/* ==========================================================================
 *  Kiyim uslubi
 * ======================================================================== */

export function DressCode(skin: Skin) {
  const c = config.dressCode
  if (!c?.enabled || !c.text) return null

  return (
    <Section skin={skin}>
      <Reveal>
        <ScriptTitle flourish={false}>{c.title}</ScriptTitle>
        <p className="mx-auto mt-4 max-w-sm font-body text-lg leading-relaxed text-ink-soft">{c.text}</p>
        {c.palette?.length ? (
          <div className="mt-6 flex items-center justify-center gap-3">
            {c.palette.map((color: string) => (
              <span
                key={color}
                className="h-9 w-9 rounded-full border border-gold/30 shadow-inner"
                style={{ background: color }}
                aria-hidden="true"
              />
            ))}
          </div>
        ) : null}
      </Reveal>
    </Section>
  )
}

/* ==========================================================================
 *  Tadbir tafsilotlari — «Qachon & Qayerda»
 * ======================================================================== */

export function Details(skin: Skin) {
  const { dateLabel, timeLabel } = config.event
  const { name, address } = config.venue

  return (
    <Section skin={skin}>
      <OrnamentedTitle kicker="To'y tafsilotlari">Qachon &amp; Qayerda</OrnamentedTitle>

      {/* items-stretch: matn qisqa bo'lganda ham (masalan manzil satri yo'q
          bo'lganda) ikkala kartochka bir xil balandlikda qolishi uchun. Grid
          o'zi Reveal (grid item)ni cho'zadi, lekin Card ichki blok bo'lgani
          uchun h-full bermasak, uning chegarasi faqat mazmuni balandligida
          qoladi va kartochkalar notekis ko'rinadi. */}
      <div className="mt-9 grid items-stretch gap-4 text-left sm:grid-cols-2">
        <Reveal className="h-full">
          <Card className="h-full">
            <Kicker>Qachon</Kicker>
            <p className="mt-2 font-display text-2xl text-ink">{dateLabel}</p>
            <p className="mt-1 font-body text-[0.95rem] text-ink-soft">Marosim {timeLabel} da boshlanadi</p>
          </Card>
        </Reveal>
        <Reveal delay={150} className="h-full">
          <Card className="h-full">
            <Kicker>Qayerda</Kicker>
            <p className="mt-2 font-display text-2xl text-ink">{name}</p>
            {address && <p className="mt-1 font-body text-[0.95rem] text-ink-soft">{address}</p>}
          </Card>
        </Reveal>
      </div>
    </Section>
  )
}
