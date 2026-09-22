import { useMemo } from 'react'
import { config } from '@config'

/**
 * Ekran bo'ylab sekin tushib turadigan gul barglari.
 *
 * Ranglar `index.css` dagi `--tpl-petal-a` / `--tpl-petal-b` o'zgaruvchilaridan
 * olinadi — shu tufayli bir xil kod har bir palitrada boshqacha ko'rinadi.
 */
export function Petals() {
  const petals = useMemo(() => {
    if (!config.petals.enabled) return []
    return Array.from({ length: config.petals.count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 13 + Math.random() * 15,
      duration: 15 + Math.random() * 15,
      delay: -Math.random() * 30,
      drift: (Math.random() - 0.5) * 230,
      spin: 240 + Math.random() * 480,
      tone: Math.random() > 0.5 ? 'a' : 'b',
      tilt: Math.random() * 360,
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
          <svg viewBox="0 0 40 40" style={{ transform: `rotate(${p.tilt}deg)` }}>
            <path
              d="M20 2c9 6 14 14 14 21 0 8-6 15-14 15S6 31 6 23C6 16 11 8 20 2Z"
              fill={`var(--tpl-petal-${p.tone})`}
              opacity="0.88"
            />
            <path
              d="M20 6c0 12 0 20-2 30"
              stroke="var(--color-gold-dark)"
              strokeOpacity="0.28"
              strokeWidth="0.9"
              fill="none"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}
