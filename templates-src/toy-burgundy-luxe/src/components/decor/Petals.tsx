import { useMemo } from 'react'
import { config } from '../../config'

/**
 * Ekran bo'ylab sekin tushib turadigan gul barglari.
 * Har bir bargning yo'li, tezligi va burilishi tasodifiy — takrorlanmaydi.
 */
export function Petals() {
  const petals = useMemo(() => {
    if (!config.petals.enabled) return []
    return Array.from({ length: config.petals.count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 14 + Math.random() * 16,
      duration: 14 + Math.random() * 14,
      delay: -Math.random() * 28,
      drift: (Math.random() - 0.5) * 220,
      spin: 240 + Math.random() * 480,
      tone: Math.random() > 0.55 ? 'blush' : 'cream',
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
            <defs>
              <linearGradient id={`petal-${p.id}`} x1="0" y1="0" x2="1" y2="1">
                {p.tone === 'blush' ? (
                  <>
                    <stop offset="0%" stopColor="#f3ddd9" />
                    <stop offset="100%" stopColor="#dfb3ac" />
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopColor="#fbf3e2" />
                    <stop offset="100%" stopColor="#e6d3ad" />
                  </>
                )}
              </linearGradient>
            </defs>
            {/* Bir dona barg */}
            <path
              d="M20 2c9 6 14 14 14 21 0 8-6 15-14 15S6 31 6 23C6 16 11 8 20 2Z"
              fill={`url(#petal-${p.id})`}
              opacity="0.9"
            />
            <path d="M20 6c0 12 0 20-2 30" stroke="#c9b596" strokeOpacity="0.35" strokeWidth="1" fill="none" />
          </svg>
        </div>
      ))}
    </div>
  )
}
