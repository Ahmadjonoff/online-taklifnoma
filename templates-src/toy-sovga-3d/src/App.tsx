import { useState } from 'react'
import { Blessing } from '@core/components/Blessing'
import { Countdown } from '@core/components/Countdown'
import { Footer } from '@core/components/Footer'
import { Gallery } from '@core/components/Gallery'
import { Gift } from '@core/components/Gift'
import { MusicToggle } from '@core/components/MusicToggle'
import { Notes } from '@core/components/Notes'
import { Rsvp } from '@core/components/Rsvp'
import { Venue } from '@core/components/Venue'
import { Wishes } from '@core/components/Wishes'
import { Calendar, DearGuests, Details, DressCode, Events, Singers, Story } from '@core/taklif/sections'
import type { Bg, Skin } from '@core/lib/skin'
import { config } from './config'
import { CinematicOpening } from '@core/cinema/CinematicOpening'
import { Envelope } from './components/Envelope'
import { Hero } from './components/Hero'
import { Petals } from './components/decor/Petals'
import { Timeline } from './components/Timeline'

/**
 * Bo'limlar tartibi va ularning qog'oz ranglari — YAGONA MANBA.
 *
 * Ranglar navbatlashib turishi kerak: qo'shni bo'limlar bir xil rangda bo'lsa,
 * ular orasidagi chekka ko'rinmaydi (avtomatik o'tkazib yuboriladi). O'chirilgan
 * bo'limlar ro'yxatga umuman kirmaydi — shu sababli chegara rangi to'g'ri
 * hisoblanadi.
 */
type SectionDef = { key: string; bg: Bg; Comp: (skin: Skin) => React.ReactNode }

/** Ixtiyoriy bo'limlar `config` dagi `enabled` bayrog'i bilan boshqariladi. */
const on = (v: { enabled?: boolean } | undefined) => v?.enabled === true

function sectionList(): SectionDef[] {
  const c = config as typeof config & {
    dearGuests?: { enabled?: boolean }
    calendar?: { enabled?: boolean }
    events?: { enabled?: boolean; items?: unknown[] }
    details?: { enabled?: boolean }
    story?: { enabled?: boolean }
    singers?: { enabled?: boolean; items?: unknown[] }
    dressCode?: { enabled?: boolean }
  }

  const all: Array<SectionDef | false> = [
    { key: 'hero', bg: 'paper', Comp: Hero },
    { key: 'blessing', bg: 'paper-2', Comp: Blessing },
    on(c.dearGuests) && { key: 'dearGuests', bg: 'paper' as Bg, Comp: DearGuests },
    { key: 'countdown', bg: 'paper-3', Comp: Countdown },
    on(c.calendar) && { key: 'calendar', bg: 'paper' as Bg, Comp: Calendar },
    on(c.events) && c.events?.items?.length && { key: 'events', bg: 'paper-2' as Bg, Comp: Events },
    config.timeline.items.length > 0 && { key: 'timeline', bg: 'paper-3' as Bg, Comp: Timeline },
    c.details?.enabled !== false && { key: 'details', bg: 'paper' as Bg, Comp: Details },
    !!config.venue.name && { key: 'venue', bg: 'paper-2' as Bg, Comp: Venue },
    config.gallery.enabled && { key: 'gallery', bg: 'paper' as Bg, Comp: Gallery },
    on(c.story) && { key: 'story', bg: 'paper-3' as Bg, Comp: Story },
    on(c.singers) && c.singers?.items?.length && { key: 'singers', bg: 'paper-2' as Bg, Comp: Singers },
    on(c.dressCode) && { key: 'dressCode', bg: 'paper' as Bg, Comp: DressCode },
    config.notes.length > 0 && { key: 'notes', bg: 'paper-3' as Bg, Comp: Notes },
    config.rsvp.enabled && { key: 'rsvp', bg: 'paper-2' as Bg, Comp: Rsvp },
    config.gift.enabled && { key: 'gift', bg: 'paper' as Bg, Comp: Gift },
    config.wishes.enabled && { key: 'wishes', bg: 'paper-2' as Bg, Comp: Wishes },
    { key: 'footer', bg: 'paper', Comp: Footer },
  ]

  return all.filter((s): s is SectionDef => s !== false)
}

export default function App() {
  const [opened, setOpened] = useState(false)
  const sections = sectionList()

  return (
    <>
      <CinematicOpening
        onOpen={() => setOpened(true)}
        fallback={<Envelope onOpen={() => setOpened(true)} />}
      />

      {/* Konvert ochilgunicha tarkib mayin ko'rinmas turadi */}
      <main
        className="transition-opacity duration-1000"
        style={{ opacity: opened ? 1 : 0 }}
        aria-hidden={!opened}
      >
        {sections.map(({ key, bg, Comp }, i) => (
          <Comp key={key} bg={bg} prevBg={sections[i - 1]?.bg} />
        ))}
      </main>

      {opened && <Petals />}
      <MusicToggle autoplay={opened} />
    </>
  )
}
