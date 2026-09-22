import { useEffect, useState } from 'react'
import { config } from '../../config'

type ConfettiDef = {
  id: number
  left: string
  delay: string
  duration: string
  drift: string
  spin: string
  color: string
  type: 'circle' | 'square' | 'triangle'
  scale: number
}

export function Petals() {
  const [particles, setParticles] = useState<ConfettiDef[]>([])
  const { enabled, count } = config.petals

  useEffect(() => {
    if (!enabled) return

    const colors = [
      'var(--color-primary)',
      'var(--color-secondary)',
      'var(--color-accent1)',
      'var(--color-accent2)',
      'var(--color-deco-purple)',
      'var(--color-deco-orange)'
    ]
    const types: Array<'circle' | 'square' | 'triangle'> = ['circle', 'square', 'triangle']

    const p: ConfettiDef[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${4 + Math.random() * 3}s`,
      drift: `${(Math.random() - 0.5) * 200}px`,
      spin: `${(Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 720)}deg`,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: types[Math.floor(Math.random() * types.length)],
      scale: 0.6 + Math.random() * 0.8,
    }))
    setParticles(p)
  }, [enabled, count])

  if (!enabled || particles.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {particles.map((c) => (
        <div
          key={c.id}
          className="absolute -top-[10%] animate-bounce-fall"
          style={{
            left: c.left,
            animationDelay: c.delay,
            animationDuration: c.duration,
            '--drift': c.drift,
            '--spin': c.spin,
          } as React.CSSProperties}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            style={{ transform: `scale(${c.scale})` }}
          >
            {c.type === 'circle' && <circle cx="8" cy="8" r="6" fill={c.color} />}
            {c.type === 'square' && <rect x="3" y="3" width="10" height="10" fill={c.color} />}
            {c.type === 'triangle' && <polygon points="8,2 14,12 2,12" fill={c.color} />}
          </svg>
        </div>
      ))}
    </div>
  )
}
