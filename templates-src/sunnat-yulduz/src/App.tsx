import { useState } from 'react'
import { Blessing } from '@core/components/Blessing'
import { Countdown } from '@core/components/Countdown'
import { Envelope } from './components/Envelope'
import { Footer } from '@core/components/Footer'
import { Gift } from '@core/components/Gift'
import { Hero } from './components/Hero'
import { MusicToggle } from '@core/components/MusicToggle'
import { Notes } from '@core/components/Notes'
import { Petals } from './components/decor/Petals'
import { Rsvp } from '@core/components/Rsvp'
import { Timeline } from './components/Timeline'
import { Venue } from '@core/components/Venue'
import { Wishes } from '@core/components/Wishes'
import { config } from './config'
import type { Bg, Skin } from '@core/lib/skin'

type SectionDef = { key: string; bg: Bg; Comp: (skin: Skin) => React.ReactNode }

function sectionList(): SectionDef[] {
  const all: Array<SectionDef | false> = [
    { key: 'hero', bg: 'paper', Comp: Hero },
    { key: 'blessing', bg: 'paper-2', Comp: Blessing },
    { key: 'countdown', bg: 'paper', Comp: Countdown },
    { key: 'timeline', bg: 'paper-3', Comp: Timeline },
    { key: 'venue', bg: 'paper', Comp: Venue },
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
      <Envelope onOpen={() => setOpened(true)} />
      <main className="transition-opacity duration-1000" style={{ opacity: opened ? 1 : 0 }} aria-hidden={!opened}>
        {sections.map(({ key, bg, Comp }, i) => (
          <Comp key={key} bg={bg} prevBg={sections[i - 1]?.bg} />
        ))}
      </main>
      {opened && <Petals />}
      <MusicToggle autoplay={opened} />
    </>
  )
}
