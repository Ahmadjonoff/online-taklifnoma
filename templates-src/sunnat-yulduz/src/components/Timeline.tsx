import { config } from '../config'
import { Reveal, ScriptTitle, Section } from './ui'
import type { Skin } from '@core/lib/skin'

export function Timeline({ bg, prevBg }: Skin) {
  const { title, items } = config.timeline

  return (
    <Section id="timeline" skin={{ bg, prevBg }}>
      <Reveal>
        <ScriptTitle>{title}</ScriptTitle>
      </Reveal>

      <div className="relative mx-auto mt-14 max-w-md">
        {/* Islomiy yashil o'rta chiziq */}
        <div className="absolute bottom-0 left-[27px] top-2 w-[1px] bg-gradient-to-b from-wine/5 via-wine/20 to-wine/5 sm:left-1/2 sm:-ml-[0.5px]" />

        <div className="flex flex-col gap-10">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 150} className="relative z-10 flex items-center gap-6 sm:justify-between sm:gap-0 sm:even:flex-row-reverse">
              <div className="w-[85px] shrink-0 text-left sm:w-[calc(50%-2rem)] sm:text-right sm:even:text-left">
                <span className="font-display text-2xl text-gold">{item.time}</span>
              </div>
              
              <div className="absolute left-[27px] flex h-5 w-5 -translate-x-1/2 items-center justify-center bg-paper sm:static sm:translate-x-0">
                <div className="h-2.5 w-2.5 rotate-45 bg-wine/80 ring-4 ring-paper" />
              </div>

              <div className="flex-1 pb-1 pt-1 sm:w-[calc(50%-2rem)] sm:flex-none">
                <div className="rounded-xl border border-wine/10 bg-white/40 px-5 py-3 shadow-sm backdrop-blur-sm sm:w-fit sm:even:ml-auto">
                  <span className="font-body text-[1.1rem] leading-snug text-ink">{item.label}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={items.length * 150}>
          <div className="mt-12 flex justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-wine/40">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.5"/>
            </svg>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
