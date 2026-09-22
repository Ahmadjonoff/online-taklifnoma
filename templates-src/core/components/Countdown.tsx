import { useEffect, useState } from 'react'
import { config } from '@config'
import { bgClass, topEdge, type Skin } from '../lib/skin'
import { TornEdge } from '@decor/TornEdge'
import { Reveal, ScriptTitle } from '@ui'

type Left = { days: number; hours: number; minutes: number; seconds: number } | null

function timeLeft(target: number): Left {
  const diff = target - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  }
}

/** To'yga qolgan vaqtni sekundma-sekund sanaydi. */
export function Countdown(skin: Skin) {
  const edge = topEdge(skin)
  const target = new Date(config.event.dateISO).getTime()
  const [left, setLeft] = useState<Left>(() => timeLeft(target))

  useEffect(() => {
    const id = window.setInterval(() => setLeft(timeLeft(target)), 1000)
    return () => window.clearInterval(id)
  }, [target])

  const units: Array<[number, string]> = left
    ? [
        [left.days, 'Kun'],
        [left.hours, 'Soat'],
        [left.minutes, 'Daqiqa'],
        [left.seconds, 'Soniya'],
      ]
    : []

  return (
    <section className={`paper-grain relative overflow-hidden px-6 py-24 ${bgClass(skin.bg)}`}>
      {edge && <TornEdge position="top" color={edge} />}

      <div className="relative z-20 mx-auto w-full max-w-lg text-center">
        <Reveal>
          <ScriptTitle flourish={false}>{config.countdown.title}</ScriptTitle>
        </Reveal>

        <Reveal delay={200}>
          {left ? (
            <div className="mt-10 flex items-start justify-center">
              {units.map(([value, label], i) => (
                <div key={label} className="flex items-start">
                  <div className="w-[4.6rem] sm:w-24">
                    <div className="font-display text-[2.6rem] leading-none text-gold tabular-nums sm:text-5xl">
                      {String(value).padStart(2, '0')}
                    </div>
                    <div className="mt-2 font-body text-sm text-ink-soft sm:text-base">{label}</div>
                  </div>
                  {i < units.length - 1 && (
                    <span className="mt-1 font-display text-3xl text-gold/35 sm:text-4xl" aria-hidden="true">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-10 font-script text-gilded text-4xl">{config.countdown.finishedText}</p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
