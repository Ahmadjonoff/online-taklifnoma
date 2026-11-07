/**
 * Yangi ochilish turlari uchun canvas teksturalar:
 *   envelope — 3D konvert (old cho'ntak, qopqoq, ichki astar, mum muhr)
 *   gate     — ganch naqshli ikki tavaqali darvoza (eshik, ramka, nur)
 *   curtain  — baxmal sahna pardasi (tepa drapirovka)
 *
 * Hammasi `textures.ts` dagi umumiy bezaklardan (rozetka, jingalak, oltin
 * gradient) foydalanadi — uslub boshqa sahnalar bilan bir xil bo'lsin.
 */
import {
  BODY,
  SCRIPT,
  SERIF,
  canvas,
  cornerFlourish,
  crown,
  divider,
  drawSpaced,
  embossShadow,
  fitFont,
  goldGradient,
  noShadow,
  rosette,
  shade,
  type Palette,
  type PlaqueText,
} from './textures'

/** Qog'oz tolasi: juda nozik dog'lar (tekis rang «plastik» ko'rinmasin). */
function paperGrain(ctx: CanvasRenderingContext2D, w: number, h: number, alpha = 0.05) {
  for (let i = 0; i < (w * h) / 900; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(60,40,20,${alpha})`
    ctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2)
  }
}

/* ------------------------------------------------------------------ */
/*  Konvert                                                            */
/* ------------------------------------------------------------------ */

/** Konvert nisbati (3D o'lcham ham shu): kenglik 2.6, balandlik 1.8. */
export const ENVELOPE = { w: 2.6, h: 1.8, flap: 1.05 }

/**
 * Konvertning old cho'ntagi: yon qanotlar bukilgan chiziqlari, pastki
 * uchburchak qanot va ismlar. Yuqori qismi V shaklida kesilgan — u yer
 * shaffof (alphaTest), ichidan karta ko'rinadi.
 */
export function envelopeFront(text: PlaqueText, pal: Palette): HTMLCanvasElement {
  const W = 1024
  const H = Math.round((W * ENVELOPE.h) / ENVELOPE.w)
  const { c, ctx } = canvas(W, H)
  const notch = H * 0.5 // V kesimining chuqurligi (yuqoridan)

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(W / 2, notch)
  ctx.lineTo(W, 0)
  ctx.lineTo(W, H)
  ctx.lineTo(0, H)
  ctx.closePath()
  ctx.save()
  ctx.clip()
  ctx.fillStyle = pal.satin
  ctx.fillRect(0, 0, W, H)
  paperGrain(ctx, W, H)

  // Yon va pastki qanotlarning bukilgan joyi — yumshoq soya
  const fold = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, a: number) => {
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.closePath()
    ctx.fillStyle = `rgba(80,50,30,${a})`
    ctx.fill()
  }
  fold(0, 0, W * 0.5, H * 0.58, 0, H, 0.05)
  fold(W, 0, W * 0.5, H * 0.58, W, H, 0.07)
  fold(0, H, W * 0.5, H * 0.52, W, H, 0.03)

  const gold = goldGradient(ctx, 0, 0, W, H, pal, true)
  ctx.strokeStyle = gold
  ctx.fillStyle = gold
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(18, H - 18)
  ctx.lineTo(W * 0.5, H * 0.52 + 14)
  ctx.lineTo(W - 18, H - 18)
  ctx.stroke()
  ctx.lineWidth = 4
  ctx.strokeRect(14, 14, W - 28, H - 28)
  ctx.lineWidth = 3
  cornerFlourish(ctx, 44, H - 44, 1, 90)
  cornerFlourish(ctx, W - 44, H - 44, -1, 90)

  // Ismlar — pastki qanotda
  ctx.textAlign = 'center'
  const names = `${text.groom} & ${text.bride}`
  const n = fitFont(ctx, names, SCRIPT, 96, W * 0.62)
  ctx.font = `${n}px ${SCRIPT}`
  ctx.fillText(names, W / 2, H * 0.82)
  ctx.font = `600 30px ${BODY}`
  drawSpaced(ctx, text.date, W / 2, H * 0.92, 6)
  ctx.restore()
  return c
}

/** Uchburchak qanot (tashqi tomoni): qog'oz + oltin hoshiya. */
export function envelopeFlap(pal: Palette): HTMLCanvasElement {
  const W = 1024
  const H = Math.round((W * ENVELOPE.flap) / ENVELOPE.w)
  const { c, ctx } = canvas(W, H)
  ctx.fillStyle = shade(pal.satin, -0.03)
  ctx.fillRect(0, 0, W, H)
  paperGrain(ctx, W, H)
  // canvas'ning yuqorisi — qanot asosi (bukilish chizig'i), pasti — uchi
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, 'rgba(70,40,20,0.12)')
  g.addColorStop(0.25, 'rgba(70,40,20,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  const gold = goldGradient(ctx, 0, 0, W, H, pal, true)
  ctx.strokeStyle = gold
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(26, 10)
  ctx.lineTo(W / 2, H - 30)
  ctx.lineTo(W - 26, 10)
  ctx.stroke()
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(70, 10)
  ctx.lineTo(W / 2, H - 70)
  ctx.lineTo(W - 70, 10)
  ctx.stroke()
  return c
}

/** Qanotning ichki tomoni — naqshli astar (ochilganda ko'rinadi). */
export function envelopeLiner(pal: Palette): HTMLCanvasElement {
  const W = 512
  const H = Math.round((W * ENVELOPE.flap) / ENVELOPE.w)
  const { c, ctx } = canvas(W, H)
  ctx.fillStyle = pal.wine
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = shade(pal.gold, -0.1)
  ctx.fillStyle = shade(pal.gold, -0.1)
  ctx.globalAlpha = 0.55
  ctx.lineWidth = 1.5
  const step = 64
  for (let y = 0; y < H + step; y += step)
    for (let x = Math.round(y / step) % 2 ? step / 2 : 0; x < W + step; x += step) rosette(ctx, x, y, step * 0.38)
  ctx.globalAlpha = 1
  return c
}

/** Mum muhr yuzasi: bo'rtma halqa va kelin-kuyov bosh harflari. */
export function waxSeal(text: PlaqueText, pal: Palette): HTMLCanvasElement {
  const S = 512
  const { c, ctx } = canvas(S, S)
  const base = pal.wine
  const g = ctx.createRadialGradient(S * 0.42, S * 0.38, S * 0.05, S / 2, S / 2, S / 2)
  g.addColorStop(0, shade(base, 0.25))
  g.addColorStop(0.6, base)
  g.addColorStop(1, shade(base, -0.45))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)

  const ring = (r: number, w: number, light: boolean) => {
    ctx.lineWidth = w
    ctx.strokeStyle = light ? 'rgba(255,230,220,0.35)' : 'rgba(0,0,0,0.35)'
    ctx.beginPath()
    ctx.arc(S / 2, S / 2 + (light ? -2 : 2), r, 0, Math.PI * 2)
    ctx.stroke()
  }
  ring(S * 0.36, 6, false)
  ring(S * 0.36, 4, true)

  const initials = `${[...text.groom][0] ?? ''}${[...text.bride][0] ?? ''}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `150px ${SCRIPT}`
  // bo'rtma: pastda qorong'i, yuqorida yorug' «soya»
  ctx.fillStyle = 'rgba(0,0,0,0.4)'
  ctx.fillText(initials, S / 2 + 3, S / 2 + 6)
  ctx.fillStyle = 'rgba(255,225,215,0.4)'
  ctx.fillText(initials, S / 2 - 2, S / 2 - 3)
  ctx.fillStyle = shade(base, 0.08)
  ctx.fillText(initials, S / 2, S / 2)
  // Halqa ichida mayda nuqtalar
  ctx.fillStyle = 'rgba(255,225,215,0.3)'
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2
    ctx.beginPath()
    ctx.arc(S / 2 + Math.cos(a) * S * 0.42, S / 2 + Math.sin(a) * S * 0.42, 5, 0, Math.PI * 2)
    ctx.fill()
  }
  return c
}

/* ------------------------------------------------------------------ */
/*  Darvoza                                                            */
/* ------------------------------------------------------------------ */

/** Darvoza o'lchamlari (3D birlik). Eshik yo'li — piyozsimon arka. */
export const GATE = { w: 3.2, h: 4.3, openW: 2.2, openH: 3.45, arch: 1.15 }

/**
 * Bitta eshik tavaqasi (chap yoki o'ng): o'yma panellar, girih yulduzlari,
 * o'rtada ism. Canvas — eshikning to'g'ri to'rtburchak qutisi; arka chizig'i
 * geometriyada kesiladi.
 */
export function gateDoor(name: string, side: -1 | 1, pal: Palette, day: boolean) {
  const W = 512
  const H = Math.round((W * GATE.openH) / (GATE.openW / 2))
  const { c: base, ctx: bctx } = canvas(W, H)
  const { c, ctx } = canvas(W, H)
  const archPx = (GATE.arch / GATE.openH) * H

  // Yog'och / baxmal asos — alohida canvas (metall emas), naqsh — folga
  const wood = day ? shade(pal.satin, -0.06) : shade(pal.wine, -0.35)
  const g = bctx.createLinearGradient(0, 0, W, 0)
  g.addColorStop(0, shade(wood, side < 0 ? -0.25 : 0.05))
  g.addColorStop(1, shade(wood, side < 0 ? 0.05 : -0.25))
  bctx.fillStyle = g
  bctx.fillRect(0, 0, W, H)
  paperGrain(bctx, W, H, 0.06)

  const gold = goldGradient(ctx, 0, 0, W, H, pal, day)
  ctx.strokeStyle = gold
  ctx.fillStyle = gold
  ctx.lineCap = 'round'

  // Tashqi hoshiya (arka chizig'i bo'ylab) — eshik markazi `side` tomonda
  const inner = side < 0 ? W : 0 // eshiklar uchrashadigan qirra
  const outer = side < 0 ? 0 : W
  const dx = inner - outer
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.moveTo(outer + Math.sign(dx) * 22, H - 22)
  ctx.lineTo(outer + Math.sign(dx) * 22, archPx)
  ctx.bezierCurveTo(
    outer + Math.sign(dx) * 22,
    archPx * 0.45 + 18,
    outer + dx * 0.76,
    archPx * 0.32 + 18,
    inner - Math.sign(dx) * 6,
    40,
  )
  ctx.stroke()
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(inner - Math.sign(dx) * 8, 40)
  ctx.lineTo(inner - Math.sign(dx) * 8, H - 22)
  ctx.lineTo(outer + Math.sign(dx) * 22, H - 22)
  ctx.stroke()

  // Panellar: yuqori (arka ostida) — girih, o'rta — ism, pastki — girih
  const px0 = 60
  const px1 = W - 60
  const panel = (y0: number, y1: number) => {
    ctx.lineWidth = 3
    ctx.strokeRect(px0, y0, px1 - px0, y1 - y0)
    ctx.lineWidth = 1.5
    ctx.strokeRect(px0 + 12, y0 + 12, px1 - px0 - 24, y1 - y0 - 24)
  }
  const girih = (y0: number, y1: number) => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(px0 + 14, y0 + 14, px1 - px0 - 28, y1 - y0 - 28)
    ctx.clip()
    ctx.lineWidth = 2
    const step = 88
    for (let y = y0; y < y1 + step; y += step)
      for (let x = px0 + (Math.round((y - y0) / step) % 2 ? step / 2 : 0); x < px1 + step; x += step) rosette(ctx, x, y, step * 0.4)
    ctx.restore()
  }
  const midTop = H * 0.43
  const midBot = H * 0.6
  panel(archPx + 60, midTop - 30)
  girih(archPx + 60, midTop - 30)
  panel(midTop, midBot)
  panel(midBot + 30, H - 70)
  girih(midBot + 30, H - 70)

  // Ism — o'rta panelda
  embossShadow(ctx, day)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const n = fitFont(ctx, name, SCRIPT, 120, px1 - px0 - 50)
  ctx.font = `${n}px ${SCRIPT}`
  ctx.fillText(name, W / 2, (midTop + midBot) / 2)
  noShadow(ctx)

  // Halqa tutqich — uchrashish qirrasida
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(inner - Math.sign(dx) * 70, midBot + 120, 26, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(inner - Math.sign(dx) * 70, midBot + 92, 9, 0, Math.PI * 2)
  ctx.fill()
  return { base, foil: c }
}

/**
 * Darvoza ramkasi — ganch (o'yma gips) naqsh: oq-fil suyagi asos, oltin
 * chiziqlar. Tepada kartushda sana va tadbir nomi.
 */
export function gateFrame(text: PlaqueText, pal: Palette, day: boolean) {
  const W = 1024
  const H = Math.round((W * GATE.h) / GATE.w)
  const { c: base, ctx: bctx } = canvas(W, H)
  const { c, ctx } = canvas(W, H)
  const ganch = day ? '#f7efe2' : shade(pal.satin, -0.18)
  bctx.fillStyle = ganch
  bctx.fillRect(0, 0, W, H)
  paperGrain(bctx, W, H, 0.07)

  // O'yma naqsh — ganchdagi «chuqurcha» (asos canvas'da), oltin — folgada
  bctx.strokeStyle = shade(ganch, -0.2)
  bctx.lineWidth = 3
  const step = 92
  for (let y = 0; y < H + step; y += step)
    for (let x = Math.round(y / step) % 2 ? step / 2 : 0; x < W + step; x += step) rosette(bctx, x, y, step * 0.42)

  const gold = goldGradient(ctx, 0, 0, W, H, pal, true)
  ctx.strokeStyle = gold
  ctx.fillStyle = gold
  ctx.lineWidth = 8
  ctx.strokeRect(18, 18, W - 36, H - 36)
  ctx.lineWidth = 3
  ctx.strokeRect(44, 44, W - 88, H - 88)

  // Eshik yo'li atrofidagi hoshiya
  const ox = ((GATE.w - GATE.openW) / 2 / GATE.w) * W
  const ow = (GATE.openW / GATE.w) * W
  const oh = (GATE.openH / GATE.h) * H
  const oy = H - oh
  const ar = (GATE.arch / GATE.h) * H
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.moveTo(ox - 16, H)
  ctx.lineTo(ox - 16, oy + ar)
  ctx.bezierCurveTo(ox - 16, oy + ar * 0.45 - 10, ox + ow * 0.38, oy + ar * 0.32 - 22, ox + ow / 2, oy - 26)
  ctx.bezierCurveTo(ox + ow * 0.62, oy + ar * 0.32 - 22, ox + ow + 16, oy + ar * 0.45 - 10, ox + ow + 16, oy + ar)
  ctx.lineTo(ox + ow + 16, H)
  ctx.stroke()
  ctx.lineWidth = 3.5
  crown(ctx, W / 2, oy - 80, 46)

  // Yuqori kartush: tadbir nomi va sana
  const cy = (oy - 120) / 2 + 40
  bctx.fillStyle = shade(ganch, 0.35)
  bctx.fillRect(W * 0.2, cy - 60, W * 0.6, 120)
  ctx.strokeRect(W * 0.2, cy - 60, W * 0.6, 120)
  ctx.fillStyle = gold
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  if (text.kicker) {
    ctx.font = `600 30px ${SERIF}`
    drawSpaced(ctx, text.kicker.toUpperCase(), W / 2, cy - 20, 8)
  }
  ctx.font = `600 40px ${BODY}`
  drawSpaced(ctx, text.date, W / 2, cy + (text.kicker ? 26 : 0), 8)
  ctx.lineWidth = 2.5
  cornerFlourish(ctx, 80, H - 80, 1, 110)
  cornerFlourish(ctx, W - 80, H - 80, -1, 110)
  return { base, foil: c }
}

/** Nur «ustuni» — eshikdan chiqadigan hajmli nur uchun yumshoq gradient. */
export function lightBeam(): HTMLCanvasElement {
  const { c, ctx } = canvas(64, 256)
  const gx = ctx.createLinearGradient(0, 0, 64, 0)
  gx.addColorStop(0, 'rgba(255,240,210,0)')
  gx.addColorStop(0.5, 'rgba(255,240,210,1)')
  gx.addColorStop(1, 'rgba(255,240,210,0)')
  ctx.fillStyle = gx
  ctx.fillRect(0, 0, 64, 256)
  ctx.globalCompositeOperation = 'destination-in'
  const gy = ctx.createLinearGradient(0, 0, 0, 256)
  gy.addColorStop(0, 'rgba(0,0,0,0)')
  gy.addColorStop(0.35, 'rgba(0,0,0,0.9)')
  gy.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = gy
  ctx.fillRect(0, 0, 64, 256)
  return c
}

/* ------------------------------------------------------------------ */
/*  Sahna pardasi                                                      */
/* ------------------------------------------------------------------ */

/** Baxmal tolasi: vertikal burmalar uchun nozik chiziqlar (map). */
export function velvet(pal: Palette): HTMLCanvasElement {
  const W = 256
  const H = 512
  const { c, ctx } = canvas(W, H)
  ctx.fillStyle = pal.wine
  ctx.fillRect(0, 0, W, H)
  for (let x = 0; x < W; x += 2) {
    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '255,255,255' : '0,0,0'},${Math.random() * 0.05})`
    ctx.fillRect(x, 0, 2, H)
  }
  // Pastda oltin hoshiya (popuk)
  const gold = goldGradient(ctx, 0, H - 40, W, H, pal)
  ctx.fillStyle = gold
  ctx.fillRect(0, H - 26, W, 10)
  for (let x = 4; x < W; x += 12) ctx.fillRect(x, H - 16, 4, 14)
  return c
}

/**
 * Parda tepasidagi drapirovka (lambrekin): to'lqinli pastki qirra, oltin
 * popuk, o'rtada ismlar. To'lqinlardan tashqarisi shaffof.
 */
export function pelmet(text: PlaqueText, pal: Palette): HTMLCanvasElement {
  const W = 1024
  const H = 300
  const { c, ctx } = canvas(W, H)
  const waves = 5
  const body = H - 90
  const path = () => {
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(W, 0)
    ctx.lineTo(W, body)
    for (let i = waves; i > 0; i--) {
      const x1 = (W / waves) * (i - 1)
      ctx.quadraticCurveTo((W / waves) * (i - 0.5), body + 80, x1, body)
    }
    ctx.closePath()
  }
  path()
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, shade(pal.wine, -0.45))
  g.addColorStop(0.55, pal.wine)
  g.addColorStop(1, shade(pal.wine, -0.25))
  ctx.fillStyle = g
  ctx.fill()

  // To'lqinlar bo'ylab oltin hoshiya
  const gold = goldGradient(ctx, 0, 0, W, H, pal)
  ctx.save()
  path()
  ctx.clip()
  ctx.strokeStyle = gold
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.moveTo(W, body - 6)
  for (let i = waves; i > 0; i--) {
    const x1 = (W / waves) * (i - 1)
    ctx.quadraticCurveTo((W / waves) * (i - 0.5), body + 74, x1, body - 6)
  }
  ctx.stroke()
  ctx.restore()

  // Popuklar — har to'lqin uchida
  ctx.fillStyle = gold
  for (let i = 0; i < waves; i++) {
    const x = (W / waves) * (i + 0.5)
    ctx.fillRect(x - 3, body + 36, 6, 22)
    ctx.beginPath()
    ctx.ellipse(x, body + 66, 12, 16, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.fillStyle = gold
  ctx.strokeStyle = gold
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  embossShadow(ctx, false)
  const names = `${text.groom} & ${text.bride}`
  // Portal arkasi yuqori burchaklarni yopadi — ismlar markazda, tor joyda
  const n = fitFont(ctx, names, SCRIPT, 80, W * 0.44)
  ctx.font = `${n}px ${SCRIPT}`
  ctx.fillText(names, W / 2, body * 0.6)
  noShadow(ctx)
  ctx.lineWidth = 2.5
  divider(ctx, W / 2, body * 0.6 + 52, 110)
  return c
}
