/**
 * Akvarel uslubidagi gul dastasi — burchak bezagi.
 * Barchasi SVG: pion gullar, g'unchalar, barglar va ilashuvchi novdalar.
 */

type RoseProps = {
  x: number
  y: number
  r: number
  /** Gul rangi: oq-krem yoki pushti. */
  tone?: 'cream' | 'blush'
  rotate?: number
  id: string
}

/** Bitta gul yaprog'i — pastdan markazga qarab ingichkalashadi. */
const PETAL = 'M0 0C-15-4-21-19-16-32-11-44 0-48 0-48s11 4 16 16c5 13-1 28-16 32Z'

function Rose({ x, y, r, tone = 'cream', rotate = 0, id }: RoseProps) {
  const c =
    tone === 'cream'
      ? { hi: '#fdf8ee', mid: '#f0e6d2', lo: '#dccdb0', line: '#c2ac8c', core: '#e2d3b6' }
      : { hi: '#f9e6e2', mid: '#eec9c3', lo: '#d9a49d', line: '#c08b84', core: '#e6b8b1' }

  const layer = (angles: number[], scale: number, key: string) =>
    angles.map((a) => (
      <path
        key={`${key}-${a}`}
        d={PETAL}
        fill={`url(#${id}-p)`}
        stroke={c.line}
        strokeOpacity="0.32"
        strokeWidth={0.9 / scale}
        transform={`rotate(${a}) scale(${scale})`}
      />
    ))

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${r / 48})`}>
      <defs>
        <radialGradient id={`${id}-p`} cx="50%" cy="88%" r="90%">
          <stop offset="0%" stopColor={c.lo} />
          <stop offset="45%" stopColor={c.mid} />
          <stop offset="100%" stopColor={c.hi} />
        </radialGradient>
      </defs>

      {/* Uch qatlam yaproq — har biri siljitilgan burchakda */}
      {layer([0, 45, 90, 135, 180, 225, 270, 315], 1, 'out')}
      {layer([22, 82, 142, 202, 262, 322], 0.68, 'mid')}
      {layer([50, 122, 194, 266, 338], 0.42, 'in')}

      {/* Markaziy o'ram */}
      <circle cx="0" cy="0" r="7" fill={c.core} />
      <path
        d="M0-5.5a5.5 5.5 0 1 1-5 8"
        fill="none"
        stroke={c.line}
        strokeOpacity="0.75"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </g>
  )
}

type LeafProps = { x: number; y: number; len: number; rotate: number; dark?: boolean }

function Leaf({ x, y, len, rotate, dark = false }: LeafProps) {
  const fill = dark ? '#77906a' : '#93a883'
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${len / 40})`}>
      {/* Uchi o'tkir, chekkasi mayin egilgan barg */}
      <path d="M0 0C9-10 26-13 40-6 28 5 10 9 0 0Z" fill={fill} fillOpacity="0.92" />
      <path d="M1-1C13-3 27-4 38-5" stroke="#5e7454" strokeOpacity="0.5" strokeWidth="1.1" fill="none" />
    </g>
  )
}

/** Novda: egri poya bo'ylab navbatma-navbat joylashgan barglar. */
function Sprig({ x, y, rotate, scale = 1 }: { x: number; y: number; rotate: number; scale?: number }) {
  const leaves: Array<[number, number, number]> = [
    [14, 5, -50],
    [30, 14, -32],
    [46, 27, -14],
    [60, 43, 6],
    [70, 60, 24],
  ]

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path
        d="M0 0C26 7 52 24 74 62"
        fill="none"
        stroke="#7a8f6c"
        strokeOpacity="0.8"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {leaves.map(([lx, ly, rot], i) => (
        <g key={i}>
          <Leaf x={lx} y={ly} len={20} rotate={rot - 52} />
          <Leaf x={lx} y={ly} len={17} rotate={rot + 58} dark />
        </g>
      ))}
      {/* Uchidagi g'uncha */}
      <g transform="translate(76 66)">
        <ellipse cx="0" cy="0" rx="5" ry="7" fill="#eec9c3" transform="rotate(28)" />
        <path d="M-4 5C-7 9-6 13-3 15" stroke="#7a8f6c" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </g>
    </g>
  )
}

type CornerProps = {
  /** Ekranning qaysi burchagida turadi. */
  position: 'tl' | 'tr' | 'bl' | 'br'
  /** Kenglik — vw birligida (mobil uchun qulay). */
  className?: string
  opacity?: number
  id?: string
  /** Chekkadan surish (px) — gullar kesilib qolmasligi uchun. */
  offset?: number
}

/**
 * Burchak uchun gul dastasi. Har bir burchak uchun aylantirib joylashtiriladi.
 */
export function FloralCorner({
  position,
  className = '',
  opacity = 1,
  id = 'fc',
  offset = 0,
}: CornerProps) {
  const flip = {
    tl: '',
    tr: 'scaleX(-1)',
    bl: 'scaleY(-1)',
    br: 'scale(-1,-1)',
  }[position]

  const vertical = position === 'tl' || position === 'tr' ? 'top' : 'bottom'
  const horizontal = position === 'tl' || position === 'bl' ? 'left' : 'right'

  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      style={{ transform: flip, opacity, [vertical]: offset, [horizontal]: 0 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 260 260" className="h-auto w-full">
        {/* Burchakdan tashqariga cho'zilgan novdalar — gullardan uzunroq */}
        <Sprig x={26} y={6} rotate={-4} scale={1.35} />
        <Sprig x={6} y={26} rotate={44} scale={1.3} />
        <Sprig x={54} y={30} rotate={16} scale={1.0} />
        <Sprig x={30} y={54} rotate={62} scale={0.95} />

        {/* Gullar orqasidagi yirik barglar */}
        <Leaf x={98} y={26} len={44} rotate={-30} />
        <Leaf x={26} y={98} len={42} rotate={54} dark />
        <Leaf x={112} y={92} len={36} rotate={26} />
        <Leaf x={56} y={14} len={32} rotate={-12} dark />

        {/* Gullar dastasi — kattadan kichikka */}
        <Rose id={`${id}-a`} x={58} y={60} r={40} tone="cream" rotate={12} />
        <Rose id={`${id}-b`} x={106} y={36} r={26} tone="blush" rotate={-22} />
        <Rose id={`${id}-c`} x={34} y={110} r={28} tone="blush" rotate={32} />
        <Rose id={`${id}-d`} x={94} y={92} r={20} tone="cream" rotate={-8} />
        <Rose id={`${id}-e`} x={134} y={72} r={13} tone="cream" rotate={44} />
        <Rose id={`${id}-f`} x={72} y={134} r={13} tone="cream" rotate={-34} />
      </svg>
    </div>
  )
}

/**
 * Sarlavhalar ostidagi oltin naqsh-ajratgich.
 */
export function Ornament({ className = '', width = 200 }: { className?: string; width?: number }) {
  return (
    <svg
      viewBox="0 0 200 26"
      width={width}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      <path d="M8 13h58M134 13h58" />
      <path d="M66 13c6-8 14-8 18-3s-2 11-8 8-6-11 2-13" />
      <path d="M134 13c-6-8-14-8-18-3s2 11 8 8 6-11-2-13" />
      <path d="M100 7l5.5 6-5.5 6-5.5-6z" fill="currentColor" stroke="none" />
      <circle cx="8" cy="13" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="192" cy="13" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

/**
 * Kichik yurakcha.
 *
 * NEGA SVG: `♥`/`🤍` belgilarini ba'zi tizimlar emoji shriftida chizadi va
 * rangni majburan o'zgartirib qo'yadi (oq yurakcha krem fonda ko'rinmay
 * qoladi). SVG'da rang `currentColor` orqali to'liq boshqariladi.
 */
export function Heart({ className = '', size = 15 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'baseline' }}
    >
      <path d="M12 21s-7.5-4.7-9.3-9.2C1.3 8.1 3.3 4.6 6.8 4.1c2-.3 3.9.7 5.2 2.3 1.3-1.6 3.2-2.6 5.2-2.3 3.5.5 5.5 4 4.1 7.7C19.5 16.3 12 21 12 21Z" />
    </svg>
  )
}

/**
 * Yozma sarlavhaning ikki yonidagi mayda jimjima.
 */
export function Flourish({ side = 'left', className = '' }: { side?: 'left' | 'right'; className?: string }) {
  return (
    <svg
      viewBox="0 0 70 24"
      width="70"
      className={className}
      style={{ transform: side === 'right' ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      <path d="M68 12c-14 0-26 2-36 6" />
      <path d="M32 18c-8 3-16 2-20-2s0-10 5-9 6 8-1 10-14-2-14-8" />
      <path d="M52 12c-4-4-10-5-14-3" />
      <circle cx="66" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  )
}
