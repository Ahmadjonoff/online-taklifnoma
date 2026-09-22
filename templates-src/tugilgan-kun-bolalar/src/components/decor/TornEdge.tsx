export function TornEdge({
  position,
  color,
}: {
  position: 'top' | 'bottom'
  color: string
}) {
  const isTop = position === 'top'
  const style = isTop ? { top: -1 } : { bottom: -1, transform: 'rotate(180deg)' }

  return (
    <div
      className="absolute inset-x-0 z-30 overflow-hidden"
      style={{ ...style, height: '32px' }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 32"
        preserveAspectRatio="none"
        className="h-full w-full"
        fill={color}
      >
        <path d="M0,0 L0,32 L30,0 L60,32 L90,0 L120,32 L150,0 L180,32 L210,0 L240,32 L270,0 L300,32 L330,0 L360,32 L390,0 L420,32 L450,0 L480,32 L510,0 L540,32 L570,0 L600,32 L630,0 L660,32 L690,0 L720,32 L750,0 L780,32 L810,0 L840,32 L870,0 L900,32 L930,0 L960,32 L990,0 L1020,32 L1050,0 L1080,32 L1110,0 L1140,32 L1170,0 L1200,32 L1200,0 Z" />
      </svg>
      {/* Decorative dots to look like bunting */}
      <div className="absolute top-0 w-full flex justify-around opacity-50" style={{ height: '32px' }}>
        {Array.from({ length: 40 }).map((_, i) => (
           <div key={i} className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-secondary)' }} />
        ))}
      </div>
    </div>
  )
}
