import { useEffect, useState } from 'react'
import { config } from '../../config'

type Petal = {
  id: number
  left: string
  animationDuration: string
  animationDelay: string
  drift: string
  spin: string
  type: 'star' | 'crescent'
  size: string
}

export function Petals() {
  const [petals, setPetals] = useState<Petal[]>([])

  useEffect(() => {
    if (!config.petals.enabled) return

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReduced) return

    const generate = () => {
      const { count } = config.petals
      const items: Petal[] = []

      for (let i = 0; i < count; i++) {
        items.push({
          id: i,
          left: `${Math.random() * 100}%`,
          animationDuration: `${10 + Math.random() * 10}s`,
          animationDelay: `-${Math.random() * 15}s`,
          drift: `${(Math.random() - 0.5) * 80}px`,
          spin: `${(Math.random() - 0.5) * 720}deg`,
          type: Math.random() > 0.5 ? 'star' : 'crescent',
          size: `${12 + Math.random() * 14}px`,
        })
      }
      return items
    }

    setPetals(generate())
  }, [])

  if (petals.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 text-gold/60"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animation: `fall ${p.animationDuration} linear ${p.animationDelay} infinite`,
            '--drift': p.drift,
            '--spin': p.spin,
          } as React.CSSProperties}
        >
          {p.type === 'star' ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}
