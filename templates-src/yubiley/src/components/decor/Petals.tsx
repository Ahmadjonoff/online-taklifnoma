import { memo, useEffect, useState } from 'react'
import { config } from '../../config'

export const Petals = memo(function Petals() {
  if (!config.petals.enabled) return null

  const [particles, setParticles] = useState<
    Array<{ id: number; left: string; delay: string; duration: string; type: number }>
  >([])

  useEffect(() => {
    const arr = Array.from({ length: config.petals.count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${15 + Math.random() * 15}s`,
      type: Math.floor(Math.random() * 3),
    }))
    setParticles(arr)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <Sparkle key={p.id} {...p} />
      ))}
    </div>
  )
})

function Sparkle({ left, delay, duration, type }: { left: string; delay: string; duration: string; type: number }) {
  const size = type === 0 ? 12 : type === 1 ? 8 : 16
  const opacity = type === 0 ? 0.6 : type === 1 ? 0.8 : 0.4
  
  return (
    <div
      className="absolute top-[-10vh]"
      style={{
        left,
        animation: `fall ${duration} linear ${delay} infinite`,
        opacity,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={{
          animation: `shimmer 3s ease-in-out infinite`,
          animationDelay: delay,
        }}
      >
        {type === 0 ? (
          <path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" fill="#d4af37" />
        ) : type === 1 ? (
          <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="#e8cd8a" />
        ) : (
          <circle cx="12" cy="12" r="8" fill="#9c7e20" />
        )}
      </svg>
    </div>
  )
}
