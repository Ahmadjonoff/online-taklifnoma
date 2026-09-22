import { useMemo } from 'react'
import { config } from '../../config'

export function Petals() {
  const petals = useMemo(() => {
    if (!config.petals.enabled) return []
    return Array.from({ length: config.petals.count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 20 + Math.random() * 30,
      duration: 20 + Math.random() * 20,
      delay: -Math.random() * 30,
      drift: (Math.random() - 0.5) * 150,
      spin: 100 + Math.random() * 200,
      type: Math.random() > 0.6 ? 'star' : 'cloud',
      tone: Math.random() > 0.5 ? 'blue' : 'pink',
    }))
  }, [])

  if (petals.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="animate-fall absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ['--drift' as string]: `${p.drift}px`,
            ['--spin' as string]: `${p.spin}deg`,
          }}
        >
          <svg viewBox="0 0 40 40">
            {p.type === 'star' ? (
              <path
                d="M 20 5 L 23 15 L 33 18 L 23 21 L 20 31 L 17 21 L 7 18 L 17 15 Z"
                fill={p.tone === 'blue' ? '#89c4e8' : '#e8c96a'}
                opacity="0.8"
              />
            ) : (
              <path
                d="M 10 25 Q 10 15 20 15 Q 25 5 30 15 Q 40 15 35 25 Z"
                fill={p.tone === 'blue' ? '#a8d8c8' : '#f0a0b8'}
                opacity="0.7"
              />
            )}
          </svg>
        </div>
      ))}
    </div>
  )
}
