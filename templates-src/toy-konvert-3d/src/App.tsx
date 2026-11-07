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
import { ScrollStory } from '@core/motion/ScrollStory'
import type { MotionConfig } from '@core/motion/types'
import { Timeline } from './components/Timeline'

/**
 * Bo'limlar tartibi — YAGONA MANBA.
 *
 * Bu shablonda bo'limlarning o'z foni yo'q (`clear`): orqada scroll bilan
 * almashadigan sahnalar turadi (core/motion → ScrollStory). Qaysi bo'limdan
 * qaysi sahna boshlanishi va bo'limlarning kirish effektlari `config.motion`da.
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
    { key: 'hero', bg: 'clear' as Bg, Comp: Hero },
    { key: 'blessing', bg: 'clear' as Bg, Comp: Blessing },
    on(c.dearGuests) && { key: 'dearGuests', bg: 'clear' as Bg, Comp: DearGuests },
    { key: 'countdown', bg: 'clear' as Bg, Comp: Countdown },
    on(c.calendar) && { key: 'calendar', bg: 'clear' as Bg, Comp: Calendar },
    on(c.events) && c.events?.items?.length && { key: 'events', bg: 'clear' as Bg, Comp: Events },
    config.timeline.items.length > 0 && { key: 'timeline', bg: 'clear' as Bg, Comp: Timeline },
    c.details?.enabled !== false && { key: 'details', bg: 'clear' as Bg, Comp: Details },
    !!config.venue.name && { key: 'venue', bg: 'clear' as Bg, Comp: Venue },
    config.gallery.enabled && { key: 'gallery', bg: 'clear' as Bg, Comp: Gallery },
    on(c.story) && { key: 'story', bg: 'clear' as Bg, Comp: Story },
    on(c.singers) && c.singers?.items?.length && { key: 'singers', bg: 'clear' as Bg, Comp: Singers },
    on(c.dressCode) && { key: 'dressCode', bg: 'clear' as Bg, Comp: DressCode },
    config.notes.length > 0 && { key: 'notes', bg: 'clear' as Bg, Comp: Notes },
    config.rsvp.enabled && { key: 'rsvp', bg: 'clear' as Bg, Comp: Rsvp },
    config.gift.enabled && { key: 'gift', bg: 'clear' as Bg, Comp: Gift },
    config.wishes.enabled && { key: 'wishes', bg: 'clear' as Bg, Comp: Wishes },
    { key: 'footer', bg: 'clear' as Bg, Comp: Footer },
  ]

  return all.filter((s): s is SectionDef => s !== false)
}

export default function App() {
  const [opened, setOpened] = useState(false)
  // Kontent 3D chunk kelgandan keyin chiqadi (qarang: CinematicOpening → onPrimed)
  const [primed, setPrimed] = useState(false)
  const sections = sectionList()
  const motion = (config as unknown as { motion: MotionConfig }).motion

  return (
    <>
      <CinematicOpening
        onOpen={() => setOpened(true)}
        onPrimed={() => setPrimed(true)}
        fallback={<Envelope onOpen={() => setOpened(true)} />}
      />

      <main
        className="transition-opacity duration-1000"
        style={{ opacity: opened ? 1 : 0 }}
        aria-hidden={!opened}
      >
        {(primed || opened) && (
          <ScrollStory
            motion={motion}
            active={opened}
            items={sections.map(({ key, bg, Comp }, i) => ({
              key,
              node: <Comp bg={bg} prevBg={sections[i - 1]?.bg} />,
            }))}
          />
        )}
      </main>
      <MusicToggle autoplay={opened} />
    </>
  )
}
