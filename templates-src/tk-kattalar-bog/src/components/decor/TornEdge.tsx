import { memo } from 'react'

type Props = {
  position: 'top' | 'bottom'
  color: string
}

export const TornEdge = memo(function TornEdge({ position, color }: Props) {
  const isTop = position === 'top'
  
  return (
    <div
      className={`absolute left-0 right-0 z-10 h-8 w-full ${isTop ? 'top-[-1px]' : 'bottom-[-1px]'}`}
      style={{
        color,
        transform: isTop ? 'none' : 'rotate(180deg)',
      }}
      aria-hidden="true"
    >
      {/* Art Deco geometric edge instead of torn paper */}
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="h-full w-full"
        fill="currentColor"
      >
        <path d="M 0 0 L 1200 0 L 1200 10 L 0 10 Z" />
        <path d="M 0 10 
                 L 20 10 L 20 20 L 40 20 L 40 30 L 60 30 L 60 40 L 80 40 L 80 30 L 100 30 L 100 20 L 120 20 L 120 10 
                 L 140 10 L 140 20 L 160 20 L 160 30 L 180 30 L 180 40 L 200 40 L 200 30 L 220 30 L 220 20 L 240 20 L 240 10
                 L 260 10 L 260 20 L 280 20 L 280 30 L 300 30 L 300 40 L 320 40 L 320 30 L 340 30 L 340 20 L 360 20 L 360 10
                 L 380 10 L 380 20 L 400 20 L 400 30 L 420 30 L 420 40 L 440 40 L 440 30 L 460 30 L 460 20 L 480 20 L 480 10
                 L 500 10 L 500 20 L 520 20 L 520 30 L 540 30 L 540 40 L 560 40 L 560 30 L 580 30 L 580 20 L 600 20 L 600 10
                 L 620 10 L 620 20 L 640 20 L 640 30 L 660 30 L 660 40 L 680 40 L 680 30 L 700 30 L 700 20 L 720 20 L 720 10
                 L 740 10 L 740 20 L 760 20 L 760 30 L 780 30 L 780 40 L 800 40 L 800 30 L 820 30 L 820 20 L 840 20 L 840 10
                 L 860 10 L 860 20 L 880 20 L 880 30 L 900 30 L 900 40 L 920 40 L 920 30 L 940 30 L 940 20 L 960 20 L 960 10
                 L 980 10 L 980 20 L 1000 20 L 1000 30 L 1020 30 L 1020 40 L 1040 40 L 1040 30 L 1060 30 L 1060 20 L 1080 20 L 1080 10
                 L 1100 10 L 1100 20 L 1120 20 L 1120 30 L 1140 30 L 1140 40 L 1160 40 L 1160 30 L 1180 30 L 1180 20 L 1200 20 L 1200 10 Z" />
        
        {/* Subtle gold line accent along the edge */}
        <path d="M 0 15 
                 L 20 15 L 20 25 L 40 25 L 40 35 L 60 35 L 60 45 L 80 45 L 80 35 L 100 35 L 100 25 L 120 25 L 120 15 
                 L 140 15 L 140 25 L 160 25 L 160 35 L 180 35 L 180 45 L 200 45 L 200 35 L 220 35 L 220 25 L 240 25 L 240 15
                 L 260 15 L 260 25 L 280 25 L 280 35 L 300 35 L 300 45 L 320 45 L 320 35 L 340 35 L 340 25 L 360 25 L 360 15
                 L 380 15 L 380 25 L 400 25 L 400 35 L 420 35 L 420 45 L 440 45 L 440 35 L 460 35 L 460 25 L 480 25 L 480 15
                 L 500 15 L 500 25 L 520 25 L 520 35 L 540 35 L 540 45 L 560 45 L 560 35 L 580 35 L 580 25 L 600 25 L 600 15
                 L 620 15 L 620 25 L 640 25 L 640 35 L 660 35 L 660 45 L 680 45 L 680 35 L 700 35 L 700 25 L 720 25 L 720 15
                 L 740 15 L 740 25 L 760 25 L 760 35 L 780 35 L 780 45 L 800 45 L 800 35 L 820 35 L 820 25 L 840 25 L 840 15
                 L 860 15 L 860 25 L 880 25 L 880 35 L 900 35 L 900 45 L 920 45 L 920 35 L 940 35 L 940 25 L 960 25 L 960 15
                 L 980 15 L 980 25 L 1000 25 L 1000 35 L 1020 35 L 1020 45 L 1040 45 L 1040 35 L 1060 35 L 1060 25 L 1080 25 L 1080 15
                 L 1100 15 L 1100 25 L 1120 25 L 1120 35 L 1140 35 L 1140 45 L 1160 45 L 1160 35 L 1180 35 L 1180 25 L 1200 25 L 1200 15" 
              fill="none" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.3" />
      </svg>
    </div>
  )
})
