import { useState } from 'react'
import { Gallery } from '@core/components/Gallery'
import { Story, storyEnabled } from '@core/components/Story'
import { Blessing } from '@core/components/Blessing'
import { Countdown } from '@core/components/Countdown'
import { Envelope } from './components/Envelope'
import { Footer } from '@core/components/Footer'
import { Wishes } from '@core/components/Wishes'
import { Rsvp } from '@core/components/Rsvp'
import { Speakers } from '@core/components/Speakers'
import { Venue } from '@core/components/Venue'
import { Hero } from './components/Hero'
import { MusicToggle } from '@core/components/MusicToggle'
import { Timeline } from './components/Timeline'
import { config } from './config'
import type { Bg, Skin } from '@core/lib/skin'

/**
 * Bo'limlar tartibi va ularning qog'oz ranglari — YAGONA MANBA.
 */
type SectionDef = { key: string; bg: Bg; Comp: (skin: Skin) => React.ReactNode }

/** RSVP/tilaklar — platforma config'idan (shablonning standart config'ida bo'lmasligi mumkin) */
function sectionOn(key: 'rsvp' | 'wishes'): boolean {
  return Boolean((config as unknown as Record<string, { enabled?: boolean } | undefined>)[key]?.enabled)
}

function sectionList(): SectionDef[] {
  const all: Array<SectionDef | false> = [
    { key: 'hero', bg: 'paper', Comp: Hero },
    { key: 'blessing', bg: 'paper-2', Comp: Blessing },
    storyEnabled() && { key: 'story', bg: 'paper-3' as Bg, Comp: Story },
    config.speakers.enabled && { key: 'speakers', bg: 'paper' as Bg, Comp: Speakers },
    { key: 'timeline', bg: 'paper-3', Comp: Timeline },
    { key: 'countdown', bg: 'paper', Comp: Countdown },
    config.gallery?.enabled && { key: 'gallery', bg: 'paper-2' as Bg, Comp: Gallery },
    { key: 'venue', bg: 'paper-2', Comp: Venue },
    config.rsvp.enabled && { key: 'rsvp', bg: 'paper' as Bg, Comp: Rsvp },
    sectionOn('wishes') && { key: 'wishes', bg: 'paper-3' as Bg, Comp: Wishes },
    { key: 'footer', bg: 'paper-2', Comp: Footer },
  ]

  return all.filter((s): s is SectionDef => s !== false)
}

export default function App() {
  const [opened, setOpened] = useState(false)
  const sections = sectionList()

  return (
    <>
      <Envelope onOpen={() => setOpened(true)} />

      <main
        className="transition-opacity duration-1000"
        style={{ opacity: opened ? 1 : 0 }}
        aria-hidden={!opened}
      >
        {sections.map(({ key, bg, Comp }, i) => (
          <Comp key={key} bg={bg} prevBg={sections[i - 1]?.bg} />
        ))}
      </main>

      <MusicToggle autoplay={opened} />
    </>
  )
}
