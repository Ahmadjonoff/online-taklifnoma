/**
 * Sahna teksturalari — hammasi <canvas> da chiziladi.
 *
 * NEGA RASM FAYL EMAS: ismlar, sana va ranglar har bir taklifnomada boshqa.
 * Canvas'da chizilgani uchun mijoz yozgan ism (o‘, g‘, kirill harflari bilan)
 * va tanlagan rangi to'g'ridan-to'g'ri 3D plaketga tushadi, qo'shimcha yuklab
 * olinadigan fayl ham yo'q.
 */

export type Palette = {
  gold: string
  goldLight: string
  goldDark: string
  bg: string
  bg2: string
  glass: string
  petalA: string
  petalB: string
}

export type PlaqueText = {
  kicker: string
  groom: string
  bride: string
  date: string
  time: string
}

/* ------------------------------------------------------------------ */
/*  Mehrob (arka) shakli — 3D geometriya ham aynan shu proporsiyada     */
/* ------------------------------------------------------------------ */

/** Plaket o'lchami (3D birliklarda). Canvas ham shu nisbatda (2:3). */
export const PLAQUE = { w: 2, h: 3, arch: 1.05 }

/**
 * Ogee (piyozsimon) mehrob yo'li. `y` pastga qarab o'sadi (canvas tizimi).
 * x, y — chap-yuqori burchak; arch — arka qismining balandligi.
 */
export function mehrabPath(
  ctx: CanvasRenderingContext2D | Path2D,
  x: number,
  y: number,
  w: number,
  h: number,
  arch: number,
) {
  const p = ctx as CanvasRenderingContext2D
  p.moveTo(x, y + h)
  p.lineTo(x, y + arch)
  p.bezierCurveTo(x, y + arch * 0.45, x + w * 0.38, y + arch * 0.32, x + w / 2, y)
  p.bezierCurveTo(x + w * 0.62, y + arch * 0.32, x + w, y + arch * 0.45, x + w, y + arch)
  p.lineTo(x + w, y + h)
  p.closePath()
}

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  return { c, ctx }
}

function goldGradient(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, pal: Palette) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1)
  g.addColorStop(0, pal.goldDark)
  g.addColorStop(0.22, pal.goldLight)
  g.addColorStop(0.42, pal.gold)
  g.addColorStop(0.6, pal.goldLight)
  g.addColorStop(0.8, pal.gold)
  g.addColorStop(1, pal.goldDark)
  return g
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
  while (size > 24) {
    ctx.font = `${size}px ${family}`
    if (ctx.measureText(text).width <= maxWidth) break
    size -= 4
  }
  return size
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
  // markaziy tomchi
  ctx.beginPath()
  ctx.moveTo(0, -s)
  ctx.bezierCurveTo(s * 0.42, -s * 0.45, s * 0.3, s * 0.1, 0, s * 0.3)
  ctx.bezierCurveTo(-s * 0.3, s * 0.1, -s * 0.42, -s * 0.45, 0, -s)
  ctx.fill()
  // yon jingalaklar
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

/** Pastki burchaklardagi o'simliksimon jingalak. */
function cornerFlourish(ctx: CanvasRenderingContext2D, x: number, y: number, dir: 1 | -1, s: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(dir, 1)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(s * 0.1, -s * 0.6, s * 0.5, -s * 0.9, s, -s * 0.8)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(s * 0.6, -s * 0.1, s * 0.9, -s * 0.5, s * 0.8, -s)
  ctx.stroke()
  // barglar
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
/*  Plaketning old yuzasi: hoshiya + ismlar                            */
/* ------------------------------------------------------------------ */

export function plaqueFront(text: PlaqueText, pal: Palette): HTMLCanvasElement {
  const W = 1024
  const H = 1536
  const { c, ctx } = canvas(W, H)
  const arch = (PLAQUE.arch / PLAQUE.h) * H
  const gold = goldGradient(ctx, 0, 0, W, H, pal)

  ctx.strokeStyle = gold
  ctx.fillStyle = gold
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // Ikki qatlamli hoshiya
  ctx.lineWidth = 9
  ctx.beginPath()
  mehrabPath(ctx, 40, 52, W - 80, H - 92, arch - 18)
  ctx.stroke()
  ctx.lineWidth = 3
  ctx.beginPath()
  mehrabPath(ctx, 66, 96, W - 132, H - 162, arch - 44)
  ctx.stroke()

  // Yon tomonlardagi romb zanjiri
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
  crown(ctx, W / 2, 190, 62)
  ctx.lineWidth = 3
  rosette(ctx, W / 2, 360, 64)

  ctx.lineWidth = 5
  cornerFlourish(ctx, 100, H - 74, 1, 150)
  cornerFlourish(ctx, W - 100, H - 74, -1, 150)

  // Matnlar — yengil «bo'rtma» soya bilan
  ctx.shadowColor = 'rgba(25,5,45,0.6)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 3
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  ctx.font = `600 34px 'Playfair Display', Georgia, serif`
  drawSpaced(ctx, text.kicker.toUpperCase(), W / 2, 520, 9)

  const script = `'Taklif Script', cursive`
  const g = fitFont(ctx, text.groom, script, 150, W - 260)
  ctx.font = `${g}px ${script}`
  ctx.fillText(text.groom, W / 2, 700)

  ctx.font = `96px ${script}`
  ctx.fillText('&', W / 2, 810)

  const b = fitFont(ctx, text.bride, script, 150, W - 260)
  ctx.font = `${b}px ${script}`
  ctx.fillText(text.bride, W / 2, 960)

  ctx.lineWidth = 3
  divider(ctx, W / 2, 1040, 210)

  ctx.font = `600 64px 'Cormorant Garamond', Georgia, serif`
  drawSpaced(ctx, text.date, W / 2, 1140, 6)
  if (text.time) {
    ctx.font = `600 44px 'Cormorant Garamond', Georgia, serif`
    drawSpaced(ctx, text.time, W / 2, 1204, 6)
  }

  return c
}

/* ------------------------------------------------------------------ */
/*  Plaketning orqa yuzasi: shisha ichidan ko'rinadigan girih panjara   */
/* ------------------------------------------------------------------ */

export function plaqueBack(pal: Palette): HTMLCanvasElement {
  const W = 1024
  const H = 1536
  const { c, ctx } = canvas(W, H)
  const arch = (PLAQUE.arch / PLAQUE.h) * H

  ctx.save()
  ctx.beginPath()
  mehrabPath(ctx, 96, 140, W - 192, H - 230, arch - 70)
  ctx.clip()

  ctx.strokeStyle = pal.gold
  ctx.fillStyle = pal.gold
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 2
  const step = 128
  for (let y = 0; y < H + step; y += step) {
    for (let x = (y / step) % 2 ? step / 2 : 0; x < W + step; x += step) {
      rosette(ctx, x, y, step * 0.42)
    }
  }
  ctx.restore()

  // ichki arka chizig'i
  ctx.strokeStyle = pal.gold
  ctx.globalAlpha = 0.85
  ctx.lineWidth = 4
  ctx.beginPath()
  mehrabPath(ctx, 96, 140, W - 192, H - 230, arch - 70)
  ctx.stroke()
  return c
}

/* ------------------------------------------------------------------ */
/*  Orqa devor: saroy arkalari, xira (chuqurlik hissi uchun)            */
/* ------------------------------------------------------------------ */

export function wall(pal: Palette): HTMLCanvasElement {
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
    // ichki chuqurlik
    const inner = ctx.createLinearGradient(0, a.top, 0, H)
    inner.addColorStop(0, 'rgba(0,0,0,0.42)')
    inner.addColorStop(1, 'rgba(0,0,0,0.12)')
    ctx.fillStyle = inner
    ctx.beginPath()
    mehrabPath(ctx, a.x, a.top, a.w, h, a.w * 0.5)
    ctx.fill()
    // panjara
    ctx.save()
    ctx.clip()
    ctx.strokeStyle = pal.gold
    ctx.globalAlpha = 0.12
    ctx.lineWidth = 2
    for (let y = a.top; y < H; y += 56) for (let x = a.x; x < a.x + a.w + 56; x += 56) rosette(ctx, x, y, 22)
    ctx.restore()
    // tilla hoshiya
    ctx.globalAlpha = 0.45
    ctx.strokeStyle = pal.gold
    ctx.lineWidth = 5
    ctx.beginPath()
    mehrabPath(ctx, a.x, a.top, a.w, h, a.w * 0.5)
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  // Xiralashtirish (ctx.filter qo'llab-quvvatlansa) — fokusdan tashqari devor
  const out = canvas(W, H)
  if ('filter' in out.ctx) out.ctx.filter = 'blur(5px)'
  out.ctx.drawImage(c, 0, 0)
  return out.c
}

/* ------------------------------------------------------------------ */
/*  Gul (gortenziya to'pi) — 2.5D billboard                             */
/* ------------------------------------------------------------------ */

export function hydrangea(pal: Palette, seed: number, blur = 0): HTMLCanvasElement {
  const S = 512
  const { c, ctx } = canvas(S, S)
  let s = seed
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)

  const cx = S / 2
  const cy = S / 2
  const R = S * 0.36
  if (blur && 'filter' in ctx) ctx.filter = `blur(${blur}px)`

  // Yumshoq soya — to'p hajmli ko'rinsin
  const sh = ctx.createRadialGradient(cx, cy + R * 0.3, R * 0.2, cx, cy + R * 0.3, R * 1.1)
  sh.addColorStop(0, 'rgba(20,0,30,0.35)')
  sh.addColorStop(1, 'rgba(20,0,30,0)')
  ctx.fillStyle = sh
  ctx.fillRect(0, 0, S, S)

  const florets = 70
  for (let i = 0; i < florets; i++) {
    const a = rnd() * Math.PI * 2
    const r = Math.sqrt(rnd()) * R
    const x = cx + Math.cos(a) * r
    const y = cy + Math.sin(a) * r * 0.85
    // yuqoridagilar yorqinroq (yorug'lik tepadan)
    const light = 0.55 + (1 - (y - (cy - R)) / (2 * R)) * 0.45
    const size = S * (0.045 + rnd() * 0.03)
    const rot = rnd() * Math.PI
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
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
  // Yorug'lik — tepadan iliq nur
  ctx.globalCompositeOperation = 'source-atop'
  const hl = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.5, 0, cx, cy, R * 1.2)
  hl.addColorStop(0, 'rgba(255,240,220,0.35)')
  hl.addColorStop(1, 'rgba(40,0,60,0.35)')
  ctx.fillStyle = hl
  ctx.fillRect(0, 0, S, S)
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
export function radialFloor(pal: Palette): HTMLCanvasElement {
  const S = 512
  const { c, ctx } = canvas(S, S)
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  g.addColorStop(0, pal.bg2)
  g.addColorStop(0.6, pal.bg)
  g.addColorStop(1, 'rgba(0,0,0,1)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  return c
}
