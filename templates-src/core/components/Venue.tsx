import { config } from '@config'
import type { Skin } from '../lib/skin'
import { Ornament } from '@decor/Floral'
import { GoldButton, Reveal, ScriptTitle, Section } from '@ui'

/** To'yxona manzili va xarita havolalari. */
export function Venue(skin: Skin) {
  const { title, name, address, googleMapsUrl, yandexMapsUrl } = config.venue

  return (
    <Section skin={skin}>
      <Reveal>
        <ScriptTitle flourish={false}>{title}</ScriptTitle>
        <Ornament className="mx-auto mt-3 text-gold/50" width={190} />
      </Reveal>

      <Reveal delay={180}>
        <p className="mt-9 font-display text-2xl leading-snug text-ink sm:text-3xl">{name}</p>
        {/* Manzil kiritilmagan bo'lsa — bo'sh qator qoldirmaymiz */}
        {address && (
          <p className="mx-auto mt-3 max-w-sm font-body text-lg leading-relaxed text-ink-soft sm:text-xl">
            {address}
          </p>
        )}
      </Reveal>

      <Reveal delay={340}>
        <Ornament className="mx-auto mt-10 text-gold/40" width={160} />

        <div className="mt-6 space-y-3">
          <GoldButton href={googleMapsUrl}>
            <PinIcon /> Google Maps
          </GoldButton>
          <GoldButton href={yandexMapsUrl} variant="outline">
            <PinIcon /> Yandex xarita
          </GoldButton>
        </div>

        <Ornament className="mx-auto mt-6 text-gold/40" width={160} />
      </Reveal>

      <AddToCalendar />
    </Section>
  )
}

type CalendarConfig = { enabled?: boolean; googleUrl?: string; icsUrl?: string }

/** «Kalendarga qo'shish» — Google Calendar va Apple/Outlook (.ics). Luxury. */
function AddToCalendar() {
  const c = (config as unknown as { addToCalendar?: CalendarConfig }).addToCalendar
  if (!c?.enabled) return null
  return (
    <Reveal delay={420}>
      <p className="tracking-wider-caps mt-10 font-body text-xs text-gold-dark/80">Kalendarga qo'shish</p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {c.googleUrl && (
          <a
            href={c.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-4 py-2 font-body text-sm text-gold transition hover:bg-gold hover:text-paper"
          >
            <CalendarIcon /> Google Calendar
          </a>
        )}
        {c.icsUrl && (
          <a
            href={c.icsUrl}
            download="taklifnoma.ics"
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-4 py-2 font-body text-sm text-gold transition hover:bg-gold hover:text-paper"
          >
            <CalendarIcon /> Apple / Outlook
          </a>
        )}
      </div>
    </Reveal>
  )
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5c2.5 0 4.5 2 4.5 4.5 0 3.2-4.5 8.5-4.5 8.5S3.5 9.2 3.5 6c0-2.5 2-4.5 4.5-4.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="6" r="1.7" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}
