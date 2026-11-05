/**
 * 3D sahna teksturalari — hammasi <canvas> da chiziladi.
 *
 * NEGA RASM FAYL EMAS: ismlar, sana va ranglar har bir taklifnomada boshqa.
 * Canvas'da chizilgani uchun mijoz yozgan ism (o‘, g‘, kirill harflari bilan)
 * va tanlagan rangi to'g'ridan-to'g'ri 3D obyektga tushadi, qo'shimcha yuklab
 * olinadigan fayl ham yo'q.
 */

export type Palette = {
  gold: string
  goldLight: string
  goldDark: string
  /** Sahna foni (gradientning qorong'i va yorug' uchi) */
  bg: string
  bg2: string
  /** Shisha rangi */
  glass: string
  petalA: string
  petalB: string
  /** Baxmal karta / lenta rangi */
  wine: string
  /** Atlas mato, quti qog'ozi */
  satin: string
}

export type PlaqueText = {
  kicker: string
  groom: string
  bride: string
  date: string
  time: string
}

export type ArchKind = 'ogee' | 'round'

/* ------------------------------------------------------------------ */
/*  Arka shakli — 3D geometriya ham aynan shu proporsiyada              */
/* ------------------------------------------------------------------ */

/** Plaket o'lchami (3D birliklarda). Canvas ham shu nisbatda (2:3). */
export const PLAQUE = { w: 2, h: 3, arch: 1.05 }

/**
 * Arka yo'li: `ogee` — piyozsimon mehrob, `round` — yarim doira.
 * `y` pastga qarab o'sadi (canvas tizimi). x, y — chap-yuqori burchak.
 */
export function archPath(
  ctx: CanvasRenderingContext2D,
  kind: ArchKind,
  x: number,
  y: number,
  w: number,
  h: number,
  arch: number,
) {
  ctx.moveTo(x, y + h)
  if (kind === 'round') {
    const r = w / 2
    ctx.lineTo(x, y + r)
    ctx.arc(x + r, y + r, r, Math.PI, 0)
  } else {
    ctx.lineTo(x, y + arch)
    ctx.bezierCurveTo(x, y + arch * 0.45, x + w * 0.38, y + arch * 0.32, x + w / 2, y)
    ctx.bezierCurveTo(x + w * 0.62, y + arch * 0.32, x + w, y + arch * 0.45, x + w, y + arch)
  }
  ctx.lineTo(x + w, y + h)
  ctx.closePath()
}

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  return { c, ctx }
}

function goldGradient(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, pal: Palette, deep = false) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1)
  // `deep` — yorug' fonda o'qilishi uchun to'q bronza tusli oltin
  const light = deep ? shade(pal.goldDark, 0.12) : pal.goldLight
  const mid = deep ? shade(pal.goldDark, -0.2) : pal.gold
  const dark = deep ? shade(pal.goldDark, -0.45) : pal.goldDark
  g.addColorStop(0, dark)
  g.addColorStop(0.22, light)
  g.addColorStop(0.42, mid)
  g.addColorStop(0.6, light)
  g.addColorStop(0.8, mid)
  g.addColorStop(1, dark)
  return g
}

/** Hex rangni yorug'lashtirish (+) yoki qoraytirish (−). */
export function shade(hex: string, amt: number) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return hex
  const n = parseInt(m[1], 16)
  const f = (c: number) => Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)
  const r = f((n >> 16) & 255)
  const g = f((n >> 8) & 255)
  const b = f(n & 255)
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

/** Harflar orasini kengaytirib yozish (ctx.letterSpacing hamma joyda yo'q). */
function drawSpaced(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, spacing: number) {
  const chars = [...text]
  const widths = chars.map((ch) => ctx.measureText(ch).width)
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1)
  let x = cx - total / 2
  const align = ctx.textAlign
  ctx.textAlign = 'left'
  chars.forEach((ch, i) => {
    ctx.fillText(ch, x, y)
    x += widths[i] + spacing
  })
  ctx.textAlign = align
}

/** Matnni berilgan kenglikka sig'diradigan shrift o'lchamini topadi. */
function fitFont(ctx: CanvasRenderingContext2D, text: string, family: string, max: number, maxWidth: number) {
  let size = max
  while (size > 20) {
    ctx.font = `${size}px ${family}`
    if (ctx.measureText(text).width <= maxWidth) break
    size -= 4
  }
  return size
}

const SCRIPT = `'Taklif Script', cursive`
const SERIF = `'Playfair Display', Georgia, serif`
const BODY = `'Cormorant Garamond', Georgia, serif`

function embossShadow(ctx: CanvasRenderingContext2D, deep: boolean) {
  // Yorug' fonda soya kerak emas: ingichka harflar atrofidagi har qanday
  // halqa harfning o'zidan katta bo'lib, yozuvni xiralashtiradi
  if (deep) return noShadow(ctx)
  ctx.shadowColor = 'rgba(25,5,45,0.6)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 3
}

function noShadow(ctx: CanvasRenderingContext2D) {
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0
}

/* ------------------------------------------------------------------ */
/*  Bezak elementlari                                                  */
/* ------------------------------------------------------------------ */

/** 8 qirrali islomiy yulduz (girih) rozetkasi. */
function rosette(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save()
  ctx.translate(cx, cy)
  for (const rot of [0, Math.PI / 4]) {
    ctx.save()
    ctx.rotate(rot)
    ctx.strokeRect(-r * 0.7, -r * 0.7, r * 1.4, r * 1.4)
    ctx.restore()
  }
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2)
  ctx.stroke()
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + Math.PI / 8
    ctx.beginPath()
    ctx.arc(Math.cos(a) * r * 0.86, Math.sin(a) * r * 0.86, r * 0.07, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

/** Arka cho'qqisidagi toj (lola/barg shaklidagi bezak). */
function crown(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.beginPath()
  ctx.moveTo(0, -s)
  ctx.bezierCurveTo(s * 0.42, -s * 0.45, s * 0.3, s * 0.1, 0, s * 0.3)
  ctx.bezierCurveTo(-s * 0.3, s * 0.1, -s * 0.42, -s * 0.45, 0, -s)
  ctx.fill()
  for (const d of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(0, s * 0.25)
    ctx.bezierCurveTo(d * s * 0.6, s * 0.2, d * s * 1.1, -s * 0.35, d * s * 0.7, -s * 0.6)
    ctx.bezierCurveTo(d * s * 0.45, -s * 0.75, d * s * 0.3, -s * 0.45, d * s * 0.55, -s * 0.35)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(d * s * 0.2, s * 0.4)
    ctx.quadraticCurveTo(d * s * 1.2, s * 0.6, d * s * 1.7, s * 0.15)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(d * s * 1.75, s * 0.1, s * 0.07, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

/** Gorizontal ajratuvchi: chiziq — romb — chiziq. */
function divider(ctx: CanvasRenderingContext2D, cx: number, cy: number, half: number) {
  ctx.beginPath()
  ctx.moveTo(cx - half, cy)
  ctx.lineTo(cx - 22, cy)
  ctx.moveTo(cx + 22, cy)
  ctx.lineTo(cx + half, cy)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx, cy - 13)
  ctx.lineTo(cx + 13, cy)
  ctx.lineTo(cx, cy + 13)
  ctx.lineTo(cx - 13, cy)
  ctx.closePath()
  ctx.fill()
  for (const d of [-1, 1]) {
    ctx.beginPath()
    ctx.arc(cx + d * (half + 10), cy, 5, 0, Math.PI * 2)
    ctx.fill()
  }
}

/** Burchakdagi o'simliksimon jingalak. */
function cornerFlourish(ctx: CanvasRenderingContext2D, x: number, y: number, dx: 1 | -1, s: number, dy: 1 | -1 = 1) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(dx, dy)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(s * 0.1, -s * 0.6, s * 0.5, -s * 0.9, s, -s * 0.8)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(s * 0.6, -s * 0.1, s * 0.9, -s * 0.5, s * 0.8, -s)
  ctx.stroke()
  const leaf = (lx: number, ly: number, a: number) => {
    ctx.save()
    ctx.translate(lx, ly)
    ctx.rotate(a)
    ctx.beginPath()
    ctx.ellipse(0, 0, s * 0.12, s * 0.045, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  leaf(s * 0.45, -s * 0.72, -0.5)
  leaf(s * 0.72, -s * 0.45, -1.1)
  leaf(s * 0.25, -s * 0.35, -0.8)
  ctx.beginPath()
  ctx.arc(s * 0.12, -s * 0.12, s * 0.06, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

/* ------------------------------------------------------------------ */
/*  Shisha plaket (mehrob / yarim doira arka)                           */
/* ------------------------------------------------------------------ */

export function plaqueFront(text: PlaqueText, pal: Palette, kind: ArchKind, deep: boolean): HTMLCanvasElement {
  const W = 1024
  const H = 1536
  const { c, ctx } = canvas(W, H)
  const arch = kind === 'round' ? W / 2 : (PLAQUE.arch / PLAQUE.h) * H
  const gold = goldGradient(ctx, 0, 0, W, H, pal, deep)

  ctx.strokeStyle = gold
  ctx.fillStyle = gold
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.lineWidth = 9
  ctx.beginPath()
  archPath(ctx, kind, 40, 52, W - 80, H - 92, arch - 18)
  ctx.stroke()
  ctx.lineWidth = 3
  ctx.beginPath()
  archPath(ctx, kind, 66, 96, W - 132, H - 162, arch - 44)
  ctx.stroke()

  for (const x of [53, W - 53]) {
    for (let y = arch + 40; y < H - 120; y += 46) {
      ctx.beginPath()
      ctx.moveTo(x, y - 9)
      ctx.lineTo(x + 6, y)
      ctx.lineTo(x, y + 9)
      ctx.lineTo(x - 6, y)
      ctx.closePath()
      ctx.fill()
    }
  }

  ctx.lineWidth = 4
  crown(ctx, W / 2, kind === 'round' ? 230 : 190, 62)
  ctx.lineWidth = 3
  rosette(ctx, W / 2, 360, 64)

  ctx.lineWidth = 5
  cornerFlourish(ctx, 100, H - 74, 1, 150)
  cornerFlourish(ctx, W - 100, H - 74, -1, 150)

  embossShadow(ctx, deep)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  ctx.font = `600 34px ${SERIF}`
  drawSpaced(ctx, text.kicker.toUpperCase(), W / 2, 520, 9)

  const g = fitFont(ctx, text.groom, SCRIPT, 150, W - 260)
  ctx.font = `${g}px ${SCRIPT}`
  ctx.fillText(text.groom, W / 2, 700)
  ctx.font = `96px ${SCRIPT}`
  ctx.fillText('&', W / 2, 810)
  const b = fitFont(ctx, text.bride, SCRIPT, 150, W - 260)
  ctx.font = `${b}px ${SCRIPT}`
  ctx.fillText(text.bride, W / 2, 960)

  ctx.lineWidth = 3
  divider(ctx, W / 2, 1040, 210)

  ctx.font = `600 64px ${BODY}`
  drawSpaced(ctx, text.date, W / 2, 1140, 6)
  if (text.time) {
    ctx.font = `600 44px ${BODY}`
    drawSpaced(ctx, text.time, W / 2, 1204, 6)
  }
  return c
}

/** Plaketning orqa yuzasi: shisha ichidan ko'rinadigan girih panjara. */
export function plaqueBack(pal: Palette, kind: ArchKind): HTMLCanvasElement {
  const W = 1024
  const H = 1536
  const { c, ctx } = canvas(W, H)
  const arch = kind === 'round' ? W / 2 : (PLAQUE.arch / PLAQUE.h) * H

  ctx.save()
  ctx.beginPath()
  archPath(ctx, kind, 96, 140, W - 192, H - 230, arch - 70)
  ctx.clip()
  ctx.strokeStyle = pal.gold
  ctx.fillStyle = pal.gold
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 2
  const step = 128
  for (let y = 0; y < H + step; y += step) {
    for (let x = (y / step) % 2 ? step / 2 : 0; x < W + step; x += step) rosette(ctx, x, y, step * 0.42)
  }
  ctx.restore()

  ctx.strokeStyle = pal.gold
  ctx.globalAlpha = 0.85
  ctx.lineWidth = 4
  ctx.beginPath()
  archPath(ctx, kind, 96, 140, W - 192, H - 230, arch - 70)
  ctx.stroke()
  return c
}

/* ------------------------------------------------------------------ */
/*  Medalyon: bronza lavha, arabcha yozuv va ismlar                     */
/* ------------------------------------------------------------------ */

export function medallionFace(text: PlaqueText, arabic: string, pal: Palette): HTMLCanvasElement {
  const S = 1024
  const { c, ctx } = canvas(S, S)
  const cx = S / 2
  const R = S / 2

  // Bronza fon — markazi iliqroq
  const bg = ctx.createRadialGradient(cx * 0.8, cx * 0.7, 20, cx, cx, R)
  bg.addColorStop(0, shade(pal.goldDark, -0.15))
  bg.addColorStop(0.65, shade(pal.goldDark, -0.45))
  bg.addColorStop(1, shade(pal.goldDark, -0.65))
  ctx.fillStyle = bg
  ctx.beginPath()
  ctx.arc(cx, cx, R, 0, Math.PI * 2)
  ctx.fill()

  const gold = goldGradient(ctx, 0, 0, S, S, pal)
  ctx.strokeStyle = gold
  ctx.fillStyle = gold
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.arc(cx, cx, R * 0.93, 0, Math.PI * 2)
  ctx.stroke()
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(cx, cx, R * 0.84, 0, Math.PI * 2)
  ctx.stroke()
  // marvarid halqa
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2
    ctx.beginPath()
    ctx.arc(cx + Math.cos(a) * R * 0.885, cx + Math.sin(a) * R * 0.885, 6, 0, Math.PI * 2)
    ctx.fill()
  }

  embossShadow(ctx, false)
  ctx.textAlign = 'center'
  if (arabic) {
    ctx.direction = 'rtl'
    const a = fitFont(ctx, arabic, `'Amiri', serif`, 120, S * 0.66)
    ctx.font = `${a}px 'Amiri', serif`
    ctx.fillText(arabic, cx, S * 0.33)
    ctx.direction = 'ltr'
  } else {
    ctx.font = `600 36px ${SERIF}`
    drawSpaced(ctx, text.kicker.toUpperCase(), cx, S * 0.31, 8)
  }
  noShadow(ctx)
  ctx.lineWidth = 3
  divider(ctx, cx, S * 0.4, 150)

  embossShadow(ctx, false)
  const g = fitFont(ctx, text.groom, SCRIPT, 112, S * 0.62)
  ctx.font = `${g}px ${SCRIPT}`
  ctx.fillText(text.groom, cx, S * 0.54)
  ctx.font = `70px ${SCRIPT}`
  ctx.fillText('&', cx, S * 0.62)
  const b = fitFont(ctx, text.bride, SCRIPT, 112, S * 0.62)
  ctx.font = `${b}px ${SCRIPT}`
  ctx.fillText(text.bride, cx, S * 0.72)

  ctx.font = `600 46px ${BODY}`
  drawSpaced(ctx, text.date, cx, S * 0.82, 6)
  return c
}

/* ------------------------------------------------------------------ */
/*  «Save the Date» baxmal karta (oltin folga)                          */
/* ------------------------------------------------------------------ */

export function cardFace(text: PlaqueText, headline: string, pal: Palette): HTMLCanvasElement {
  const W = 1024
  const H = 1428
  const { c, ctx } = canvas(W, H)
  const gold = goldGradient(ctx, 0, 0, W, H, pal)
  ctx.strokeStyle = gold
  ctx.fillStyle = gold
  ctx.lineCap = 'round'

  // Arkali ichki ramka
  ctx.lineWidth = 6
  ctx.strokeRect(46, 46, W - 92, H - 92)
  ctx.lineWidth = 2.5
  ctx.beginPath()
  archPath(ctx, 'ogee', 92, 92, W - 184, H - 184, 300)
  ctx.stroke()
  ctx.lineWidth = 4
  cornerFlourish(ctx, 72, H - 72, 1, 120)
  cornerFlourish(ctx, W - 72, H - 72, -1, 120)
  ctx.lineWidth = 3.5
  crown(ctx, W / 2, 230, 54)

  embossShadow(ctx, false)
  ctx.textAlign = 'center'

  const words = headline.trim().split(/\s+/)
  const stacked = words.length === 3 && /^the$/i.test(words[1])
  if (stacked) {
    ctx.font = `600 150px ${SERIF}`
    drawSpaced(ctx, words[0].toUpperCase(), W / 2, 470, 12)
    ctx.font = `100px ${SCRIPT}`
    ctx.fillText(words[1].toLowerCase().replace(/^t/, 'T'), W / 2, 565)
    ctx.font = `600 150px ${SERIF}`
    drawSpaced(ctx, words[2].toUpperCase(), W / 2, 715, 12)
  } else {
    const h = fitFont(ctx, headline, SCRIPT, 140, W - 240)
    ctx.font = `${h}px ${SCRIPT}`
    ctx.fillText(headline, W / 2, 560)
  }

  noShadow(ctx)
  ctx.lineWidth = 3
  divider(ctx, W / 2, 800, 190)
  embossShadow(ctx, false)

  const names = `${text.groom} & ${text.bride}`
  const n = fitFont(ctx, names, SCRIPT, 112, W - 230)
  ctx.font = `${n}px ${SCRIPT}`
  ctx.fillText(names, W / 2, 950)

  ctx.font = `600 58px ${BODY}`
  drawSpaced(ctx, text.date, W / 2, 1075, 8)
  if (text.time) {
    ctx.font = `600 40px ${BODY}`
    drawSpaced(ctx, text.time, W / 2, 1140, 8)
  }
  ctx.font = `600 30px ${SERIF}`
  drawSpaced(ctx, text.kicker.toUpperCase(), W / 2, 1230, 8)
  return c
}

/* ------------------------------------------------------------------ */
/*  Sovg'a qutisining old yuzasi                                        */
/* ------------------------------------------------------------------ */

export function boxFace(text: PlaqueText, pal: Palette): HTMLCanvasElement {
  const W = 1024
  const H = 780
  const { c, ctx } = canvas(W, H)
  const gold = goldGradient(ctx, 0, 0, W, H, pal, true)
  ctx.strokeStyle = gold
  ctx.fillStyle = gold
  ctx.lineCap = 'round'
  ctx.lineWidth = 5
  ctx.strokeRect(54, 54, W - 108, H - 108)
  ctx.lineWidth = 2
  ctx.strokeRect(74, 74, W - 148, H - 148)
  ctx.lineWidth = 3.5
  for (const [x, y, dx, dy] of [
    [100, H - 100, 1, 1],
    [W - 100, H - 100, -1, 1],
    [100, 100, 1, -1],
    [W - 100, 100, -1, -1],
  ] as const) {
    cornerFlourish(ctx, x, y, dx, 90, dy)
  }

  embossShadow(ctx, true)
  ctx.textAlign = 'center'
  ctx.font = `600 30px ${SERIF}`
  drawSpaced(ctx, text.kicker.toUpperCase(), W / 2, 210, 9)
  const names = `${text.groom} & ${text.bride}`
  const n = fitFont(ctx, names, SCRIPT, 128, W - 260)
  ctx.font = `${n}px ${SCRIPT}`
  ctx.fillText(names, W / 2, 380)
  noShadow(ctx)
  ctx.lineWidth = 3
  divider(ctx, W / 2, 460, 170)
  embossShadow(ctx, true)
  ctx.font = `600 56px ${BODY}`
  drawSpaced(ctx, text.time ? `${text.date}  ·  ${text.time}` : text.date, W / 2, 570, 5)
  return c
}

/* ------------------------------------------------------------------ */
/*  Fon devori                                                         */
/* ------------------------------------------------------------------ */

export function wall(pal: Palette, day: boolean): HTMLCanvasElement {
  const W = 1024
  const H = 1024
  const { c, ctx } = canvas(W, H)
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, pal.bg)
  bg.addColorStop(0.55, pal.bg2)
  bg.addColorStop(1, pal.bg)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  const arches = [
    { x: 90, w: 230, top: 330 },
    { x: 340, w: 344, top: 150 },
    { x: 704, w: 230, top: 330 },
  ]
  for (const a of arches) {
    const h = H - a.top + 40
    const inner = ctx.createLinearGradient(0, a.top, 0, H)
    if (day) {
      inner.addColorStop(0, 'rgba(255,255,255,0.55)')
      inner.addColorStop(1, 'rgba(255,255,255,0.15)')
    } else {
      inner.addColorStop(0, 'rgba(0,0,0,0.42)')
      inner.addColorStop(1, 'rgba(0,0,0,0.12)')
    }
    ctx.fillStyle = inner
    ctx.beginPath()
    archPath(ctx, 'ogee', a.x, a.top, a.w, h, a.w * 0.5)
    ctx.fill()
    ctx.save()
    ctx.clip()
    ctx.strokeStyle = pal.gold
    ctx.globalAlpha = day ? 0.08 : 0.12
    ctx.lineWidth = 2
    for (let y = a.top; y < H; y += 56) for (let x = a.x; x < a.x + a.w + 56; x += 56) rosette(ctx, x, y, 22)
    ctx.restore()
    ctx.globalAlpha = day ? 0.3 : 0.45
    ctx.strokeStyle = pal.gold
    ctx.lineWidth = 5
    ctx.beginPath()
    archPath(ctx, 'ogee', a.x, a.top, a.w, h, a.w * 0.5)
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  const out = canvas(W, H)
  if ('filter' in out.ctx) out.ctx.filter = 'blur(5px)'
  out.ctx.drawImage(c, 0, 0)
  return out.c
}

/* ------------------------------------------------------------------ */
/*  Gullar — 2.5D billboard                                             */
/* ------------------------------------------------------------------ */

function seeded(seed: number) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

/** Gortenziya to'pi (ko'p mayda 4 bargli gulchalar). */
export function hydrangea(pal: Palette, seed: number, blur = 0): HTMLCanvasElement {
  const S = 512
  const { c, ctx } = canvas(S, S)
  const rnd = seeded(seed)
  const cx = S / 2
  const cy = S / 2
  const R = S * 0.36
  if (blur && 'filter' in ctx) ctx.filter = `blur(${blur}px)`

  const sh = ctx.createRadialGradient(cx, cy + R * 0.3, R * 0.2, cx, cy + R * 0.3, R * 1.1)
  sh.addColorStop(0, 'rgba(20,0,30,0.35)')
  sh.addColorStop(1, 'rgba(20,0,30,0)')
  ctx.fillStyle = sh
  ctx.fillRect(0, 0, S, S)

  for (let i = 0; i < 70; i++) {
    const a = rnd() * Math.PI * 2
    const r = Math.sqrt(rnd()) * R
    const x = cx + Math.cos(a) * r
    const y = cy + Math.sin(a) * r * 0.85
    const light = 0.55 + (1 - (y - (cy - R)) / (2 * R)) * 0.45
    const size = S * (0.045 + rnd() * 0.03)
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rnd() * Math.PI)
    for (let p = 0; p < 4; p++) {
      ctx.rotate(Math.PI / 2)
      const g = ctx.createRadialGradient(0, -size * 0.5, 0, 0, -size * 0.5, size)
      g.addColorStop(0, rnd() > 0.5 ? pal.petalA : pal.petalB)
      g.addColorStop(1, pal.glass)
      ctx.globalAlpha = 0.75 + light * 0.25
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.ellipse(0, -size * 0.55, size * 0.5, size * 0.62, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = light
    ctx.fillStyle = pal.goldLight
    ctx.beginPath()
    ctx.arc(0, 0, size * 0.14, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  ctx.globalCompositeOperation = 'source-atop'
  const hl = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.5, 0, cx, cy, R * 1.2)
  hl.addColorStop(0, 'rgba(255,240,220,0.35)')
  hl.addColorStop(1, 'rgba(40,0,60,0.35)')
  ctx.fillStyle = hl
  ctx.fillRect(0, 0, S, S)
  return c
}

/** Atirgul — markazdan buralib chiqadigan gulbarglar. */
export function rose(pal: Palette, seed: number, blur = 0): HTMLCanvasElement {
  const S = 512
  const { c, ctx } = canvas(S, S)
  const rnd = seeded(seed)
  const cx = S / 2
  const cy = S / 2
  if (blur && 'filter' in ctx) ctx.filter = `blur(${blur}px)`

  // barglar (yashil) — gul ostidan chiqib turadi
  ctx.fillStyle = '#5f7a55'
  for (let i = 0; i < 3; i++) {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(-0.6 + i * 1.9 + rnd() * 0.4)
    ctx.globalAlpha = 0.85
    ctx.beginPath()
    ctx.ellipse(0, S * 0.3, S * 0.08, S * 0.17, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  ctx.globalAlpha = 1

  // gulbarglar: tashqaridan ichkariga, har qatlam to'qroq
  const layers = 6
  for (let l = 0; l < layers; l++) {
    const t = l / (layers - 1)
    const r = S * (0.34 - t * 0.27)
    const n = 6 - Math.floor(t * 2)
    const off = rnd() * Math.PI
    for (let i = 0; i < n; i++) {
      const a = off + (i / n) * Math.PI * 2
      ctx.save()
      ctx.translate(cx + Math.cos(a) * r * 0.35, cy + Math.sin(a) * r * 0.3)
      ctx.rotate(a + Math.PI / 2)
      const g = ctx.createLinearGradient(0, -r, 0, r * 0.4)
      g.addColorStop(0, shade(pal.petalB, 0.25))
      g.addColorStop(0.6, pal.petalA)
      g.addColorStop(1, shade(pal.petalA, -0.35 - t * 0.2))
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.ellipse(0, -r * 0.2, r * 0.62, r * 0.55, 0, Math.PI, 0)
      ctx.quadraticCurveTo(r * 0.3, r * 0.35, 0, r * 0.3)
      ctx.quadraticCurveTo(-r * 0.3, r * 0.35, -r * 0.62, -r * 0.2)
      ctx.fill()
      // gulbarg chekkasi — yorug'
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(0, -r * 0.2, r * 0.62, r * 0.55, 0, Math.PI * 1.1, Math.PI * 1.9)
      ctx.stroke()
      ctx.restore()
    }
  }
  // markazdagi spiral
  ctx.strokeStyle = shade(pal.petalA, -0.45)
  ctx.lineWidth = 3
  ctx.beginPath()
  for (let a = 0; a < Math.PI * 5; a += 0.2) {
    const rr = 3 + a * 3.2
    ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.8)
  }
  ctx.stroke()
  return c
}

/** Bitta gulbarg (tushayotgan gulbarglar uchun). */
export function petal(pal: Palette): HTMLCanvasElement {
  const { c, ctx } = canvas(64, 64)
  const g = ctx.createRadialGradient(28, 22, 2, 32, 32, 30)
  g.addColorStop(0, pal.petalB)
  g.addColorStop(1, pal.petalA)
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.moveTo(32, 4)
  ctx.bezierCurveTo(58, 16, 54, 50, 32, 60)
  ctx.bezierCurveTo(10, 50, 6, 16, 32, 4)
  ctx.fill()
  return c
}

/** Yumaloq yorug'lik (sham alangasi, fonar nuri). */
export function glow(color: string, core = 'rgba(255,250,235,1)'): HTMLCanvasElement {
  const S = 128
  const { c, ctx } = canvas(S, S)
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  g.addColorStop(0, core)
  g.addColorStop(0.18, color)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  return c
}

/** Sham alangasi — cho'zinchoq tomchi. */
export function flame(): HTMLCanvasElement {
  const { c, ctx } = canvas(64, 128)
  const g = ctx.createRadialGradient(32, 84, 2, 32, 76, 46)
  g.addColorStop(0, 'rgba(255,255,240,1)')
  g.addColorStop(0.35, 'rgba(255,200,110,0.95)')
  g.addColorStop(1, 'rgba(255,120,40,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.moveTo(32, 6)
  ctx.bezierCurveTo(52, 50, 54, 92, 32, 118)
  ctx.bezierCurveTo(10, 92, 12, 50, 32, 6)
  ctx.fill()
  return c
}

/** Hilol (yarim oy) — atrofi nurli. */
export function crescent(color: string): HTMLCanvasElement {
  const S = 512
  // Avval hilolning o'zi alohida canvas'da (doiradan siljigan doira kesiladi)
  const moon = canvas(S, S)
  moon.ctx.fillStyle = color
  moon.ctx.beginPath()
  moon.ctx.arc(S / 2, S / 2, S * 0.2, 0, Math.PI * 2)
  moon.ctx.fill()
  moon.ctx.globalCompositeOperation = 'destination-out'
  moon.ctx.beginPath()
  moon.ctx.arc(S / 2 + S * 0.085, S / 2 - S * 0.045, S * 0.175, 0, Math.PI * 2)
  moon.ctx.fill()

  // Keyin nur halqasi va ustidan hilol — nur kesilib qolmasin
  const { c, ctx } = canvas(S, S)
  const g = ctx.createRadialGradient(S * 0.44, S * 0.52, S * 0.05, S / 2, S / 2, S / 2)
  g.addColorStop(0, 'rgba(255,240,200,0.28)')
  g.addColorStop(1, 'rgba(255,240,200,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  ctx.shadowColor = 'rgba(255,236,190,0.9)'
  ctx.shadowBlur = 24
  ctx.drawImage(moon.c, 0, 0)
  return c
}

/** Fonar devori uchun teshikli naqsh (alphaMap: oq = metall, qora = teshik). */
export function lanternPattern(): HTMLCanvasElement {
  const S = 256
  const { c, ctx } = canvas(S, S)
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, S, S)
  ctx.fillStyle = '#000'
  const star = (x: number, y: number, r: number) => {
    ctx.beginPath()
    for (let i = 0; i < 16; i++) {
      const a = (i * Math.PI) / 8
      const rr = i % 2 ? r * 0.5 : r
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr)
    }
    ctx.closePath()
    ctx.fill()
  }
  star(64, 64, 40)
  star(192, 192, 40)
  star(192, 64, 18)
  star(64, 192, 18)
  for (const [x, y] of [[128, 128], [0, 128], [128, 0], [256, 128], [128, 256]] as const) star(x, y, 10)
  return c
}

/** Pol: markazda yorug'roq, chetlarga qorayadigan doira. */
export function radialFloor(pal: Palette, day: boolean): HTMLCanvasElement {
  const S = 512
  const { c, ctx } = canvas(S, S)
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  g.addColorStop(0, day ? '#ffffff' : pal.bg2)
  g.addColorStop(0.6, day ? pal.bg2 : pal.bg)
  g.addColorStop(1, day ? pal.bg : 'rgba(0,0,0,1)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  return c
}

/** Atlas mato — yumshoq burmalar (sinus chiziqlar + yaltirash). */
export function satinFloor(pal: Palette): HTMLCanvasElement {
  const S = 1024
  const { c, ctx } = canvas(S, S)
  ctx.fillStyle = pal.satin
  ctx.fillRect(0, 0, S, S)
  for (let i = 0; i < 26; i++) {
    const x0 = (i / 26) * S + Math.sin(i * 1.7) * 30
    const g = ctx.createLinearGradient(x0 - 40, 0, x0 + 40, 0)
    const hi = i % 3 === 0
    g.addColorStop(0, 'rgba(0,0,0,0)')
    g.addColorStop(0.5, hi ? 'rgba(255,255,255,0.45)' : 'rgba(60,35,15,0.22)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(x0 - 40, 0)
    for (let y = 0; y <= S; y += 32) ctx.lineTo(x0 - 40 + Math.sin(y / 120 + i) * 26, y)
    for (let y = S; y >= 0; y -= 32) ctx.lineTo(x0 + 40 + Math.sin(y / 120 + i) * 26, y)
    ctx.fill()
  }
  // chetlar soyada
  const v = ctx.createRadialGradient(S / 2, S / 2, S * 0.2, S / 2, S / 2, S * 0.72)
  v.addColorStop(0, 'rgba(0,0,0,0)')
  v.addColorStop(1, 'rgba(0,0,0,0.55)')
  ctx.fillStyle = v
  ctx.fillRect(0, 0, S, S)
  return c
}
