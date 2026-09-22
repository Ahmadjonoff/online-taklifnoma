import { useMemo } from 'react'
import { config } from '../../config'

export function Petals() {
  const petals = useMemo(() => {
    if (!config.petals.enabled) return []
    return Array.from({ length: config.petals.count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 16 + Math.random() * 18,
      duration: 16 + Math.random() * 16,
      delay: -Math.random() * 32,
      drift: (Math.random() - 0.5) * 180,
      spin: 180 + Math.random() * 360,
      type: Math.random() > 0.6 ? 'buta' : Math.random() > 0.5 ? 'leaf' : 'pome',
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
            {p.type === 'buta' && (
              <g transform="translate(20 20) scale(0.6)">
                <path d="M0 20 C20 20 30 0 30 -20 C30 -40 10 -50 0 -60 C-10 -50 -30 -40 -30 -20 C-30 0 -20 20 0 20 Z" fill="#8e1a1a" opacity="0.8" />
                <path d="M0 0 C5 0 10 -10 10 -20 C10 -25 5 -30 0 -40 C-5 -30 -10 -25 -10 -20 C-10 -10 -5 0 0 0 Z" fill="#daa520" />
              </g>
            )}
            {p.type === 'leaf' && (
              <g transform="translate(20 20) scale(0.8)">
                <path d="M0 15 C15 5 20 -10 0 -20 C-20 -10 -15 5 0 15 Z" fill="#5e8c5a" opacity="0.8" />
                <path d="M0 15 L0 -20" stroke="#fdf5e6" strokeWidth="1.5" />
              </g>
            )}
            {p.type === 'pome' && (
              <g transform="translate(20 20) scale(0.4)">
                <circle cx="0" cy="0" r="22" fill="#c62828" opacity="0.9" />
                <path d="M-10-21L-15-30L-5-26L0-32L5-26L15-30L10-21Z" fill="#c62828" opacity="0.9" />
                <circle cx="0" cy="0" r="8" fill="#daa520" />
              </g>
            )}
          </svg>
        </div>
      ))}
    </div>
  )
}
