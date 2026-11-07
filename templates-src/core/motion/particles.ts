/**
 * Fon zarrachalari — oddiy 2D canvas (WebGL emas: ochilishdagi 3D sahna
 * allaqachon yopilgan, bu yerda bir necha o'nlab zarra uchun GPU konteksti
 * ochish ortiqcha). Har zarraning «chuqurligi» bor: yaqinlari kattaroq va
 * scroll'ga ko'proq ergashadi — parallaks hajm hissini beradi.
 */
import type { Particles } from './types'

type P = { x: number; y: number; z: number; vx: number; vy: number; r: number; a: number; va: number; ph: number }

function cssColor(name: string, fallback: string) {
  const probe = document.createElement('span')
  probe.style.display = 'none'
  probe.style.color = `var(${name}, ${fallback})`
  document.body.appendChild(probe)
  const c = getComputedStyle(probe).color || fallback
  probe.remove()
  return c
}

function sprite(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  draw(c.getContext('2d')!, size)
  return c
}

export function startParticles(canvas: HTMLCanvasElement, mode: Exclude<Particles, 'none'>) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const gold = cssColor('--color-gold-light', '#f6e2b0')
  const petalA = cssColor('--tpl-petal-a', '#f2b8c6')
  const petalB = cssColor('--tpl-petal-b', '#fff1f4')

  const glowDot = sprite(64, (c, s) => {
    const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.18, gold)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    c.fillStyle = g
    c.fillRect(0, 0, s, s)
  })
  const petal = (col: string) =>
    sprite(48, (c, s) => {
      const g = c.createLinearGradient(0, 0, s, s)
      g.addColorStop(0, petalB)
      g.addColorStop(1, col)
      c.fillStyle = g
      c.beginPath()
      c.moveTo(s / 2, 2)
      c.bezierCurveTo(s, s * 0.25, s * 0.85, s * 0.85, s / 2, s - 2)
      c.bezierCurveTo(s * 0.15, s * 0.85, 0, s * 0.25, s / 2, 2)
      c.fill()
    })
  const petals = [petal(petalA), petal(petalB)]
  const lantern = sprite(96, (c, s) => {
    const g = c.createRadialGradient(s / 2, s * 0.55, 0, s / 2, s * 0.55, s / 2)
    g.addColorStop(0, 'rgba(255,200,120,0.55)')
    g.addColorStop(1, 'rgba(255,160,80,0)')
    c.fillStyle = g
    c.fillRect(0, 0, s, s)
    const body = c.createLinearGradient(0, s * 0.3, 0, s * 0.75)
    body.addColorStop(0, '#ffd89a')
    body.addColorStop(1, '#ff9a4a')
    c.fillStyle = body
    c.beginPath()
    c.moveTo(s * 0.38, s * 0.3)
    c.lineTo(s * 0.62, s * 0.3)
    c.lineTo(s * 0.58, s * 0.74)
    c.lineTo(s * 0.42, s * 0.74)
    c.closePath()
    c.fill()
  })

  const count = { petals: 26, dust: 46, lanterns: 14, stars: 70 }[mode]
  let W = 0
  let H = 0
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  const resize = () => {
    W = window.innerWidth
    H = window.innerHeight
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()

  const rnd = (a: number, b: number) => a + Math.random() * (b - a)
  const spawn = (initial: boolean): P => {
    const z = rnd(0.35, 1)
    const p: P = { x: rnd(0, W), y: 0, z, vx: 0, vy: 0, r: 0, a: rnd(0, 6.28), va: rnd(-1, 1), ph: rnd(0, 6.28) }
    if (mode === 'petals') {
      p.vy = rnd(18, 34) * z
      p.r = rnd(9, 16) * z
      p.y = initial ? rnd(-H, H) : rnd(-60, -20)
    } else if (mode === 'lanterns') {
      p.vy = -rnd(10, 22) * z
      p.r = rnd(26, 46) * z
      p.y = initial ? rnd(0, H * 1.4) : H + rnd(40, 120)
    } else if (mode === 'dust') {
      p.vy = -rnd(4, 12) * z
      p.r = rnd(5, 14) * z
      p.y = initial ? rnd(0, H) : H + 20
    } else {
      p.r = rnd(3, 9) * z
      p.y = rnd(0, H)
    }
    return p
  }
  const ps = Array.from({ length: count }, () => spawn(true))

  let scrollPush = 0
  let raf = 0
  let last = performance.now()
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    if (document.hidden) return
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    const t = now / 1000
    // scroll tezligi asta so'nadi
    const push = scrollPush
    scrollPush *= 0.88
    ctx.clearRect(0, 0, W, H)
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i]
      // Yaqin zarra scroll'ga ko'proq ergashadi (parallaks)
      p.y += p.vy * dt - push * p.z * 0.35
      p.x += Math.sin(t * 0.6 + p.ph) * 12 * dt * p.z + p.vx * dt
      p.a += p.va * dt
      if (mode === 'stars') {
        if (p.y < -10) p.y += H + 20
        if (p.y > H + 10) p.y -= H + 20
      } else if ((p.vy > 0 && p.y > H + 40) || (p.vy < 0 && p.y < -120)) {
        ps[i] = spawn(false)
        continue
      }
      if (mode === 'petals') {
        const img = petals[i % 2]
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.a)
        ctx.scale(1, 0.55 + 0.45 * Math.sin(t * 1.4 + p.ph)) // aylanib tushish
        ctx.globalAlpha = 0.5 + 0.4 * p.z
        ctx.drawImage(img, -p.r, -p.r, p.r * 2, p.r * 2)
        ctx.restore()
      } else if (mode === 'lanterns') {
        ctx.globalAlpha = (0.45 + 0.4 * p.z) * (0.85 + 0.15 * Math.sin(t * 3 + p.ph))
        ctx.drawImage(lantern, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2)
      } else {
        const tw = mode === 'stars' ? 0.35 + 0.65 * Math.abs(Math.sin(t * 0.9 + p.ph)) : 0.5 + 0.5 * Math.sin(t * 1.7 + p.ph)
        ctx.globalAlpha = tw * (0.4 + 0.6 * p.z)
        ctx.drawImage(glowDot, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2)
      }
    }
    ctx.globalAlpha = 1
  }
  raf = requestAnimationFrame(frame)
  window.addEventListener('resize', resize)

  return {
    /** Scroll siljishi (px) — zarrachalarni chuqurligiga qarab suradi. */
    nudge(dy: number) {
      scrollPush = Math.max(-60, Math.min(60, scrollPush + dy))
    },
    stop() {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      ctx.clearRect(0, 0, W, H)
    },
  }
}
