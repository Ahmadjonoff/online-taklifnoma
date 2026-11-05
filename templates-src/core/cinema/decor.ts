/**
 * Sahna bezaklari: fonarlar, shamlar, gullar, hilol oy, gulli arka, marvaridlar.
 * Qaysilari chiqishi `config.scene3d` dan olinadi (qarang: kit.ts → Scene3D).
 */
import * as THREE from 'three'
import { crescent, flame, glow, hydrangea, lanternPattern, rose, shade } from './textures'
import { additiveSprite, tex, type Kit } from './kit'

type Flicker = { obj: THREE.Sprite; base: number; light?: THREE.PointLight; li: number }

export type DecorBuild = {
  update(t: number): void
}

export function buildDecor(k: Kit, halfWidth: number): DecorBuild {
  const { scene, pal, cfg } = k
  const flickers: Flicker[] = []
  const bw = halfWidth
  const warmGlow = k.own(tex(glow('rgba(255,170,90,0.85)')))

  /* ---------- fonarlar ---------- */
  if (cfg.lanterns) {
    const alpha = k.own(tex(lanternPattern(), false))
    alpha.wrapS = alpha.wrapT = THREE.RepeatWrapping
    alpha.repeat.set(6, 2)
    const lanternMat = new THREE.MeshStandardMaterial({
      color: pal.gold,
      metalness: 1,
      roughness: 0.3,
      alphaMap: alpha,
      alphaTest: 0.5,
      side: THREE.DoubleSide,
    })
    const goldMat = new THREE.MeshStandardMaterial({ color: pal.gold, metalness: 1, roughness: 0.28 })
    const profile = new THREE.SplineCurve(
      [
        [0.02, 0],
        [0.2, 0.02],
        [0.27, 0.14],
        [0.31, 0.34],
        [0.27, 0.54],
        [0.17, 0.68],
        [0.06, 0.76],
      ].map(([r, y]) => new THREE.Vector2(r, y)),
    ).getPoints(28)

    const lantern = (x: number, z: number, s: number, withLight: boolean) => {
      const g = new THREE.Group()
      g.add(new THREE.Mesh(new THREE.LatheGeometry(profile, 40), lanternMat))
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.21, 0.05, 24), goldMat)
      base.position.y = 0.01
      g.add(base)
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.24, 24), goldMat)
      cap.position.y = 0.86
      g.add(cap)
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 8, 24), goldMat)
      ring.position.y = 1.02
      g.add(ring)
      const spr = additiveSprite(warmGlow)
      spr.position.y = 0.34
      spr.scale.set(1.1, 1.1, 1)
      g.add(spr)
      let light: THREE.PointLight | undefined
      if (withLight) {
        light = new THREE.PointLight('#ffb067', 3.5, 0, 2)
        light.position.y = 0.34
        g.add(light)
      }
      g.position.set(x, 0, z)
      g.scale.setScalar(s)
      scene.add(g)
      flickers.push({ obj: spr, base: 1.1, light, li: 3.5 })
    }
    lantern(-bw - 0.2, -1.25, 1.55, true)
    lantern(bw + 0.32, -1.9, 1.85, true)
    lantern(-3.1, -3.6, 2.3, k.high)
    lantern(3.3, -4.4, 2.5, false)
  }

  /* ---------- shamlar ---------- */
  if (cfg.candles) {
    const flameTex = k.own(tex(flame()))
    const mat = new THREE.MeshStandardMaterial({
      color: '#f3e6d3',
      roughness: 0.55,
      emissive: '#ffcf99',
      emissiveIntensity: 0.12,
    })
    const candle = (x: number, z: number, h: number) => {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, h, 24), mat)
      c.position.set(x, h / 2, z)
      scene.add(c)
      const f = additiveSprite(flameTex)
      f.scale.set(0.09, 0.18, 1)
      f.position.set(x, h + 0.09, z)
      scene.add(f)
      const gl = additiveSprite(warmGlow, k.day ? 0.4 : 0.7)
      gl.scale.set(0.7, 0.7, 1)
      gl.position.set(x, h + 0.08, z)
      scene.add(gl)
      flickers.push({ obj: f, base: 0.18, li: 0 })
      flickers.push({ obj: gl, base: 0.7, li: 0 })
    }
    candle(-bw - 0.2, 0.75, 0.42)
    candle(-bw + 0.08, 1.05, 0.28)
    candle(bw + 0.25, 0.85, 0.5)
    candle(bw, 1.15, 0.24)
  }

  /* ---------- gullar (2.5D billboard) ---------- */
  const flowerCache = new Map<string, THREE.Texture>()
  const flowerTex = (kind: 'rose' | 'hydrangea', seed: number, blur = 0) => {
    const key = `${kind}-${seed}-${blur}`
    let t = flowerCache.get(key)
    if (!t) {
      t = k.own(tex(kind === 'rose' ? rose(pal, seed, blur) : hydrangea(pal, seed, blur)))
      flowerCache.set(key, t)
    }
    return t
  }
  const flower = (kind: 'rose' | 'hydrangea', x: number, y: number, z: number, s: number, seed: number, blur = 0) => {
    const spr = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: flowerTex(kind, seed, blur),
        transparent: true,
        depthWrite: false,
        // oldingi plandagi xira gullar sahnani «tumanlatib» yubormasin
        opacity: blur ? 0.55 : 1,
      }),
    )
    spr.position.set(x, y, z)
    spr.scale.set(s, s, 1)
    scene.add(spr)
  }

  if (cfg.flowers && cfg.flowers !== 'none') {
    const kind = cfg.flowers
    const s = kind === 'rose' ? 0.72 : 1
    const spots: Array<[number, number, number, number]> = [
      [-bw - 0.05, 0.42, 0.3, 1.15],
      [-bw + 0.35, 0.3, 0.62, 0.8],
      [bw, 0.45, 0.25, 1.2],
      [bw - 0.32, 0.3, 0.66, 0.78],
      [-bw + 0.25, 0.62, -0.45, 1.25],
      [bw - 0.15, 0.6, -0.5, 1.2],
    ]
    spots.forEach(([x, y, z, sc], i) => {
      flower(kind, x, y * (kind === 'rose' ? 0.75 : 1), z, sc * s, 11 + i * 13)
      // atirgullar to'p bo'lib turadi — yoniga yana bittadan
      if (kind === 'rose') flower(kind, x + (i % 2 ? -0.28 : 0.28), y * 0.6, z + 0.15, sc * s * 0.85, 97 + i * 7)
    })
    flower(kind, -1.75, 0.65, 2.5, 1.5 * s, 71, 9)
    flower(kind, 1.85, 0.45, 2.7, 1.6 * s, 83, 11)
  }

  /* ---------- gulli arka ---------- */
  if (cfg.floralArch) {
    const R = 1.85
    const cy = 2.35
    const z = -0.8
    let i = 0
    const put = (x: number, y: number, sc: number) => {
      flower(i % 3 === 1 ? 'hydrangea' : 'rose', x, y, z + Math.sin(i * 2.1) * 0.12, sc, 5 + (i % 6) * 17)
      i++
    }
    for (let a = 0; a <= 16; a++) {
      const ang = (a / 16) * Math.PI
      put(Math.cos(ang) * R, cy + Math.sin(ang) * R, 0.75 + Math.sin(a * 1.3) * 0.12)
    }
    for (const d of [-1, 1]) for (let y = 0.35; y < cy; y += 0.42) put(d * R, y, 0.8)
  }

  /* ---------- gul devori ---------- */
  if (cfg.flowerWall) {
    const z = -1.7
    // Gullar orasidagi bo'shliq och devor bo'lib «teshik» ko'rinmasin — orqasida
    // gullarning soyadagi tusidagi tag qatlam
    // Tag qatlam gullardan biroz kichik — chetlari gullar orqasida yashirinadi
    const backing = new THREE.Mesh(
      new THREE.PlaneGeometry(7.6, 4.9),
      new THREE.MeshBasicMaterial({ color: shade(pal.petalA, -0.38) }),
    )
    backing.position.set(0, 2.55, z - 0.08)
    scene.add(backing)

    // Panjara + tasodifiy siljish: tabiiy, zich gul devori. Balandligi telefon
    // kadrining tepasigacha (tik ekranda kamera uzoqroq turadi).
    // Teksturalar keshda — 7 xil gul ko'p marta takrorlanadi.
    let i = 0
    let s = 7
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647
    for (let y = 0.15; y <= 5.2; y += 0.42) {
      const odd = Math.round(y / 0.42) % 2
      for (let x = -4.1 + (odd ? 0.25 : 0); x <= 4.1; x += 0.5) {
        const hyd = rnd() < 0.3
        flower(
          hyd ? 'hydrangea' : 'rose',
          x + (rnd() - 0.5) * 0.18,
          y + (rnd() - 0.5) * 0.14,
          z + rnd() * 0.18,
          (hyd ? 0.78 : 0.66) + rnd() * 0.16,
          hyd ? 200 + (i % 3) * 31 : 300 + (i % 4) * 29,
        )
        i++
      }
    }
  }

  /* ---------- hilol va yulduzlar ---------- */
  if (cfg.moon) {
    const moon = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: k.own(tex(crescent(pal.goldLight))),
        transparent: true,
        depthWrite: false,
        fog: false,
      }),
    )
    moon.position.set(1.7, 6.1, -7.5)
    moon.scale.set(2.6, 2.6, 1)
    scene.add(moon)
  }

  /* ---------- marvarid shodalari ---------- */
  if (cfg.pearls) {
    const curves = [
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-bw - 0.4, 0.035, 1.0),
        new THREE.Vector3(-0.5, 0.035, 1.7),
        new THREE.Vector3(0.25, 0.035, 1.3),
      ),
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0.45, 0.035, 1.45),
        new THREE.Vector3(1.05, 0.035, 1.05),
        new THREE.Vector3(bw + 0.5, 0.035, 1.55),
      ),
    ]
    const per = 40
    const pearls = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.035, 14, 10),
      new THREE.MeshPhysicalMaterial({
        color: '#fffaf0',
        roughness: 0.15,
        clearcoat: 1,
        iridescence: 0.6,
      }),
      per * curves.length,
    )
    const m = new THREE.Matrix4()
    curves.forEach((c, ci) => {
      for (let j = 0; j < per; j++) {
        const p = c.getPointAt(j / (per - 1))
        m.makeTranslation(p.x, p.y, p.z)
        pearls.setMatrixAt(ci * per + j, m)
      }
    })
    scene.add(pearls)
  }

  return {
    update(t) {
      for (const f of flickers) {
        const kf = 1 + Math.sin(t * 13 + f.base * 50) * 0.04 + Math.sin(t * 7.3 + f.base * 9) * 0.05
        const ratio = f.obj.scale.x / f.obj.scale.y
        f.obj.scale.y = f.base * kf
        f.obj.scale.x = f.base * kf * ratio
        if (f.light) f.light.intensity = f.li * kf
      }
    },
  }
}
