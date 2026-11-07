/**
 * Yangi ochilish turlari (hero):
 *
 *   envelope — 3D konvert: mum muhr ikkiga bo'linib uchadi, qanot orqaga
 *              bukiladi, ichidan karta ko'tariladi va kamera unga «kiradi»
 *   gate     — ganch naqshli darvoza: ikki tavaqa ichkariga ochiladi, ichidan
 *              hajmli nur chiqadi, kamera ostonadan o'tadi
 *   curtain  — sahna pardasi: baxmal parda burmalari bilan ikki yonga
 *              yig'iladi, prožektor ostidagi taklif kartasi ochiladi
 *
 * Har biri umumiy kino ssenariysiga (scene.ts → open) o'z harakatini qo'shadi.
 */
import * as THREE from 'three'
import type gsap from 'gsap'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { boxFace, cardFace, glow, shade } from './textures'
import {
  ENVELOPE,
  GATE,
  envelopeFlap,
  envelopeFront,
  envelopeLiner,
  gateDoor,
  gateFrame,
  lightBeam,
  pelmet,
  velvet,
  waxSeal,
} from './openingTextures'
import { additiveSprite, archShape, foilMaterial, goldMaterial, makeSweep, tex, type Kit } from './kit'
import { halo, type HeroBuild } from './heroes'

/** Geometriya UV'larini berilgan to'rtburchakka (0..1) keltirish. */
function fitUV(g: THREE.BufferGeometry, x0: number, x1: number, y0: number, y1: number) {
  const pos = g.attributes.position
  const uv = g.attributes.uv
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - x0) / (x1 - x0), (pos.getY(i) - y0) / (y1 - y0))
  uv.needsUpdate = true
  return g
}

/* ------------------------------------------------------------------ */
/*  3D konvert                                                         */
/* ------------------------------------------------------------------ */

export function envelope(k: Kit): HeroBuild {
  const { pal } = k
  const { w: W, h: H, flap: F } = ENVELOPE
  const root = new THREE.Group()
  const env = new THREE.Group()
  env.position.y = 1.75
  env.rotation.x = -0.05
  root.add(env)

  const paper = (map?: THREE.Texture, color = '#ffffff') =>
    new THREE.MeshStandardMaterial({ map, color, roughness: 0.8, metalness: 0, envMapIntensity: 0.45 })

  // Orqa devor + ichki astar (V kesimdan ko'rinadi)
  const back = new THREE.Mesh(new RoundedBoxGeometry(W, H, 0.03, 2, 0.01), paper(undefined, shade(pal.satin, -0.12)))
  back.position.z = -0.035
  env.add(back)
  const linerTex = k.own(tex(envelopeLiner(pal)))
  linerTex.wrapS = linerTex.wrapT = THREE.RepeatWrapping
  linerTex.repeat.set(1, H / F)
  const liner = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.06, H - 0.06), paper(linerTex))
  liner.position.z = -0.018
  env.add(liner)

  // Karta (ichida yashirin) — qog'oz asos + oltin folga yozuv
  const CH = 1.58
  const CW = (CH * 1024) / 780
  const cardGroup = new THREE.Group()
  cardGroup.position.set(0, -0.06, -0.008)
  env.add(cardGroup)
  cardGroup.add(new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), paper(undefined, shade(pal.satin, 0.35))))
  const cardMat = foilMaterial(k.own(tex(boxFace(k.text, pal))), pal, 0.03, true)
  cardMat.metalness = 0.6
  cardMat.roughness = 0.35
  const cardFaceMesh = new THREE.Mesh(new THREE.PlaneGeometry(CW * 0.98, CH * 0.98), cardMat)
  cardFaceMesh.position.z = 0.002
  cardGroup.add(cardFaceMesh)

  // Old cho'ntak (V kesimi shaffof)
  const front = new THREE.Mesh(
    new THREE.PlaneGeometry(W, H),
    new THREE.MeshStandardMaterial({
      map: k.own(tex(envelopeFront(k.text, pal))),
      alphaTest: 0.5,
      roughness: 0.75,
      envMapIntensity: 0.45,
    }),
  )
  front.position.z = 0.004
  env.add(front)

  // Qanot: ilgak yuqori qirrada, uchi pastga qaragan
  const hinge = new THREE.Group()
  hinge.position.set(0, H / 2, 0.012)
  env.add(hinge)
  const tri = new THREE.Shape()
  tri.moveTo(-W / 2, 0)
  tri.lineTo(W / 2, 0)
  tri.lineTo(0, -F)
  tri.closePath()
  const flapGeo = fitUV(new THREE.ShapeGeometry(tri), -W / 2, W / 2, -F, 0)
  const flapOuter = new THREE.Mesh(flapGeo, paper(k.own(tex(envelopeFlap(pal)))))
  hinge.add(flapOuter)
  const flapInner = new THREE.Mesh(flapGeo, paper(k.own(tex(envelopeLiner(pal)))))
  flapInner.rotation.y = Math.PI
  flapInner.scale.x = -1 // orqa tomondan qaraganda astar to'g'ri tursin
  flapInner.position.z = -0.002
  hinge.add(flapInner)
  const sweep = makeSweep(flapGeo, pal.goldLight)
  sweep.mesh.position.z = 0.002
  hinge.add(sweep.mesh)

  // Mum muhr — ikki yarim (ochilganda bo'linib uchadi)
  const R = 0.22
  const sealTex = k.own(tex(waxSeal(k.text, pal)))
  // Kuchli clearcoat atrofni aks ettirib muhrni oqartirib yuboradi — mo'tadil
  const sealFace = new THREE.MeshPhysicalMaterial({ map: sealTex, roughness: 0.45, clearcoat: 0.3, clearcoatRoughness: 0.3, envMapIntensity: 0.35 })
  const sealBody = new THREE.MeshPhysicalMaterial({ color: shade(pal.wine, -0.25), roughness: 0.4, clearcoat: 0.6 })
  const seal = new THREE.Group()
  seal.position.set(0, -F + 0.12, 0.035)
  hinge.add(seal)
  const halves = [-1, 1].map((d) => {
    const g = new THREE.Group()
    const start = d < 0 ? Math.PI / 2 : -Math.PI / 2
    const hs = new THREE.Shape()
    hs.moveTo(0, 0)
    hs.absarc(0, 0, R, start, start + Math.PI, false)
    hs.closePath()
    const body = new THREE.Mesh(
      new THREE.ExtrudeGeometry(hs, { depth: 0.045, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2, curveSegments: 24 }),
      sealBody,
    )
    body.position.z = -0.03
    g.add(body)
    const face = new THREE.Mesh(new THREE.CircleGeometry(R * 0.96, 32, start, Math.PI), sealFace)
    face.position.z = 0.029
    g.add(face)
    seal.add(g)
    return { g, d }
  })

  const h = halo(k, 1.75, 4.6)
  root.add(h)

  const cardRise = 1.12
  const cardTop = 1.75 + cardGroup.position.y + cardRise

  return {
    root,
    bob: env,
    frame: { w: 3.0, h: 2.7, cy: 1.75 },
    burst: new THREE.Vector3(0, 2.2, 0.2),
    diveY: cardTop,
    diveLook: cardTop,
    halfWidth: 1.4,
    sweeps: [sweep.mat],
    glowMats: [{ m: cardMat, base: 0 }],
    halo: h,
    haloBase: 0.1,
    open(tl: gsap.core.Timeline) {
      // muhr «tirsillaydi» va ikkiga bo'linadi
      tl.to(seal.scale, { x: 1.18, y: 1.18, duration: 0.22, ease: 'power2.out' }, 0)
      for (const { g, d } of halves) {
        tl.to(g.position, { x: d * 0.55, y: -0.5, z: 0.5, duration: 0.7, ease: 'power2.in' }, 0.25)
          .to(g.rotation, { z: d * -1.4, x: 0.8, duration: 0.7, ease: 'power1.in' }, 0.25)
          // qanot bilan yuqoriga «osilib» qolmasin — uchib borib yo'qoladi
          .to(g.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.35, ease: 'power2.in' }, 0.6)
      }
      // qanot orqaga bukiladi (oldinga chiqib, yuqoridan orqaga o'tadi)
      tl.to(hinge.rotation, { x: -Math.PI * 1.12, duration: 0.9, ease: 'power2.inOut' }, 0.35)
        // karta ko'tariladi va mehmonga bir oz egiladi
        .to(cardGroup.position, { y: cardGroup.position.y + cardRise, z: 0.06, duration: 1.05, ease: 'power2.out' }, 0.95)
        .to(cardGroup.rotation, { x: 0.08, duration: 1.05, ease: 'sine.out' }, 0.95)
        .to(env.rotation, { x: 0, duration: 0.8, ease: 'sine.inOut' }, 0)
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Ganch darvoza                                                      */
/* ------------------------------------------------------------------ */

export function gate(k: Kit): HeroBuild {
  const { pal, day } = k
  const { w: W, h: H, openW: OW, openH: OH, arch: AR } = GATE
  const root = new THREE.Group()

  // Ramka: to'g'ri to'rtburchak ichida arka teshik
  const outer = new THREE.Shape()
  outer.moveTo(-W / 2, 0)
  outer.lineTo(W / 2, 0)
  outer.lineTo(W / 2, H)
  outer.lineTo(-W / 2, H)
  outer.closePath()
  outer.holes.push(archShape('ogee', OW, OH, AR))
  const depth = 0.32
  const frameGeo = new THREE.ExtrudeGeometry(outer, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.03,
    bevelThickness: 0.03,
    bevelSegments: 2,
    curveSegments: 48,
  })
  frameGeo.translate(0, 0, -depth / 2)
  fitUV(frameGeo, -W / 2, W / 2, 0, H)
  const frameTex = gateFrame(k.text, pal, day)
  const frameMat = new THREE.MeshStandardMaterial({
    map: k.own(tex(frameTex.base)),
    roughness: 0.82,
    metalness: 0,
    envMapIntensity: 0.5,
  })
  root.add(new THREE.Mesh(frameGeo, frameMat))
  // Ramka yuzidagi oltin naqsh — alohida folga qatlami (metall bo'lib yaltiraydi)
  const frameFaceGeo = fitUV(new THREE.ShapeGeometry(outer, 48), -W / 2, W / 2, 0, H)
  const frameFoil = foilMaterial(k.own(tex(frameTex.foil)), pal, 0.05, day)
  const frameFace = new THREE.Mesh(frameFaceGeo, frameFoil)
  frameFace.position.z = depth / 2 + 0.032
  root.add(frameFace)

  // Ostona (tilla zinapoya)
  const step = new THREE.Mesh(new RoundedBoxGeometry(W + 0.3, 0.14, 0.9, 3, 0.04), goldMaterial(pal.gold, 0.3))
  step.position.set(0, 0.07, 0.1)
  root.add(step)

  // Ichkaridagi nur (eshik ortida)
  const inner = additiveSprite(k.own(tex(glow(pal.goldLight))), 0.0)
  inner.position.set(0, OH * 0.45, -0.9)
  inner.scale.set(2.2, 2.2, 1)
  root.add(inner)
  const light = new THREE.PointLight('#ffe0b0', 0, 0, 2)
  light.position.set(0, OH * 0.5, -0.6)
  root.add(light)
  const beamTex = k.own(tex(lightBeam()))
  const beams: THREE.Mesh[] = []
  for (let i = 0; i < 5; i++) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.55 + i * 0.08, 4.2),
      new THREE.MeshBasicMaterial({
        map: beamTex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    )
    m.position.set((i - 2) * 0.32, OH * 0.42, 0.6)
    m.rotation.set(-1.25, 0, (i - 2) * 0.22)
    root.add(m)
    beams.push(m)
  }

  // Tavaqalar: ilgak tashqi qirrada, eshik o'rtaga qarab cho'ziladi
  const thick = 0.08
  const doorMat = new THREE.MeshStandardMaterial({
    color: day ? shade(pal.satin, -0.15) : shade(pal.wine, -0.5),
    roughness: 0.6,
    metalness: 0.1,
  })
  const doors = ([-1, 1] as const).map((side) => {
    const half = new THREE.Shape()
    if (side < 0) {
      half.moveTo(0, 0)
      half.lineTo(0, OH - AR)
      half.bezierCurveTo(0, OH - AR * 0.45, OW * 0.38, OH - AR * 0.32, OW / 2, OH)
      half.lineTo(OW / 2, 0)
    } else {
      half.moveTo(0, 0)
      half.lineTo(0, OH - AR)
      half.bezierCurveTo(0, OH - AR * 0.45, -OW * 0.38, OH - AR * 0.32, -OW / 2, OH)
      half.lineTo(-OW / 2, 0)
    }
    half.closePath()
    const pivot = new THREE.Group()
    pivot.position.set((side * OW) / 2, 0, -0.02)
    root.add(pivot)
    const bodyGeo = new THREE.ExtrudeGeometry(half, { depth: thick, bevelEnabled: false, curveSegments: 32 })
    bodyGeo.translate(0, 0, -thick / 2)
    pivot.add(new THREE.Mesh(bodyGeo, doorMat))
    const name = side < 0 ? k.text.groom : k.text.bride
    const faceTex = gateDoor(name, side, pal, day)
    const x0 = side < 0 ? 0 : -OW / 2
    const x1 = side < 0 ? OW / 2 : 0
    const faceGeo = fitUV(new THREE.ShapeGeometry(half, 32), x0, x1, 0, OH)
    const base = new THREE.Mesh(
      faceGeo,
      new THREE.MeshStandardMaterial({ map: k.own(tex(faceTex.base)), roughness: 0.55, metalness: 0.05, envMapIntensity: 0.6 }),
    )
    base.position.z = thick / 2 + 0.001
    pivot.add(base)
    const foil = foilMaterial(k.own(tex(faceTex.foil)), pal, 0.06, day)
    const foilMesh = new THREE.Mesh(faceGeo, foil)
    foilMesh.position.z = thick / 2 + 0.003
    pivot.add(foilMesh)
    const sw = makeSweep(faceGeo, pal.goldLight)
    sw.mesh.position.z = thick / 2 + 0.005
    pivot.add(sw.mesh)
    return { pivot, side, foil, sweep: sw.mat }
  })

  const h = halo(k, 2.2, 5.6, -1.4)
  root.add(h)

  return {
    root,
    // Darvoza suzmaydi — faqat nur «nafas oladi» (inner)
    bob: new THREE.Object3D(),
    // h — ramka + ostona + chetdan joy (keng ekranda kadr balandlik bo'yicha tanlanadi)
    frame: { w: 3.45, h: 5.0, cy: 2.1 },
    burst: new THREE.Vector3(0, 1.6, 0.4),
    diveY: 1.65,
    diveLook: 1.65,
    halfWidth: 1.75,
    sweeps: doors.map((d) => d.sweep),
    glowMats: [...doors.map((d) => ({ m: d.foil, base: day ? 0 : 0.06 })), { m: frameFoil, base: day ? 0 : 0.05 }],
    halo: h,
    haloBase: 0.1,
    open(tl: gsap.core.Timeline) {
      for (const d of doors) {
        // avval bir oz «qisiladi», keyin keng ochiladi
        tl.to(d.pivot.rotation, { y: d.side * -0.04, duration: 0.2, ease: 'sine.out' }, 0).to(
          d.pivot.rotation,
          { y: d.side * -1.85, duration: 1.5, ease: 'power2.inOut' },
          0.2,
        )
      }
      tl.to(inner.material, { opacity: 1, duration: 0.6 }, 0.25)
        .to(inner.scale, { x: 9, y: 9, duration: 1.9, ease: 'power2.in' }, 0.3)
        .to(light, { intensity: 45, duration: 1.2, ease: 'sine.in' }, 0.3)
      beams.forEach((b, i) =>
        tl.to(b.material as THREE.MeshBasicMaterial, { opacity: 0.32 + (i % 2) * 0.12, duration: 0.9, ease: 'sine.out' }, 0.45 + i * 0.05),
      )
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Sahna pardasi                                                      */
/* ------------------------------------------------------------------ */

export function curtain(k: Kit): HeroBuild {
  const { pal } = k
  const SW = 3.6 // sahna kengligi
  const SH = 4.4
  const root = new THREE.Group()

  // Tilla portal (yuqorisi yarim doira)
  const outer = new THREE.Shape()
  outer.moveTo(-SW / 2 - 0.25, 0)
  outer.lineTo(SW / 2 + 0.25, 0)
  outer.lineTo(SW / 2 + 0.25, SH + 0.3)
  outer.lineTo(-SW / 2 - 0.25, SH + 0.3)
  outer.closePath()
  outer.holes.push(archShape('round', SW, SH, SW / 2))
  const portal = new THREE.Mesh(
    new THREE.ExtrudeGeometry(outer, { depth: 0.18, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3, curveSegments: 64 }),
    // to'q va mat oltin: katta yorqin yuza bloom bilan butun kadrni oqartirib yuborardi
    goldMaterial(shade(pal.goldDark, -0.15), 0.5),
  )
  portal.position.z = 0.15
  root.add(portal)

  // Sahnadagi taklif kartasi (parda ortida)
  const CW = 1.45
  const CH = CW * (1428 / 1024)
  const card = new THREE.Group()
  card.position.set(0, 0.55 + CH / 2, -0.9)
  root.add(card)
  card.add(
    new THREE.Mesh(
      new RoundedBoxGeometry(CW + 0.06, CH + 0.06, 0.03, 2, 0.01),
      new THREE.MeshPhysicalMaterial({ color: shade(pal.wine, -0.2), sheen: 1, sheenColor: new THREE.Color(shade(pal.wine, 0.4)), roughness: 0.85 }),
    ),
  )
  const cardMat = foilMaterial(k.own(tex(cardFace(k.text, k.cfg.headline || 'Taklifnoma', pal))), pal, 0.04, k.day)
  const cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), cardMat)
  cardMesh.position.z = 0.017
  card.add(cardMesh)
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.12, 0.55, 16), goldMaterial(pal.gold, 0.3))
  stand.position.set(0, 0.27, -0.9)
  root.add(stand)
  const spot = new THREE.SpotLight('#fff1d6', 0, 0, 0.42, 0.7, 1.5)
  spot.position.set(0, SH + 0.6, 1.2)
  spot.target.position.set(0, card.position.y, -0.9)
  root.add(spot, spot.target)

  // Parda: ikki yarim, burmalar vertex'larda hisoblanadi
  const velvetTex = k.own(tex(velvet(pal)))
  velvetTex.wrapS = THREE.RepeatWrapping
  velvetTex.repeat.set(3, 1)
  const velvetMat = new THREE.MeshPhysicalMaterial({
    map: velvetTex,
    roughness: 0.82,
    sheen: 1,
    sheenColor: new THREE.Color(shade(pal.wine, 0.45)),
    sheenRoughness: 0.45,
    side: THREE.DoubleSide,
  })
  const CWID = SW / 2 + 0.12
  const CHGT = SH + 0.1
  const SEG_X = 56
  const tie = 1.5
  const halves = ([-1, 1] as const).map((side) => {
    const geo = new THREE.PlaneGeometry(CWID, CHGT, SEG_X, 14)
    // Lokal x: 0 — tashqi qirra (portal ustuni), CWID — o'rta
    const base = Float32Array.from(geo.attributes.position.array as Float32Array)
    const mesh = new THREE.Mesh(geo, velvetMat)
    mesh.position.set((side * SW) / 2, 0, 0)
    root.add(mesh)
    const apply = (open: number) => {
      const pos = geo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const lx = base[i * 3] + CWID / 2 // 0..CWID (o'rtaga qarab)
        const ly = base[i * 3 + 1] + CHGT / 2 // 0..CHGT
        const pull = Math.exp(-(((ly - tie) / 1.0) ** 2)) // bog'ich balandligida ko'proq tortiladi
        const s = 1 - open * (0.7 + 0.22 * pull)
        const x = lx * s
        const amp = 0.035 + open * 0.07
        const z = Math.sin((lx / CWID) * Math.PI * 2 * 7) * amp + Math.sin((lx / CWID) * Math.PI * 2 * 2.3) * amp * 0.6
        // pastki qirra yonga ko'tariladi (bog'langan parda «yelkasi»)
        const lift = open * 0.35 * Math.max(0, 1 - ly / tie) * (lx / CWID)
        pos.setXYZ(i, -side * x, ly + lift, z)
      }
      pos.needsUpdate = true
      geo.computeVertexNormals()
    }
    apply(0)
    return { apply }
  })

  // Lambrekin — portal tepasida, ismlar bilan
  const PW = SW + 0.2
  const PH = PW * (300 / 1024)
  const pel = new THREE.Mesh(
    new THREE.PlaneGeometry(PW, PH),
    new THREE.MeshPhysicalMaterial({
      map: k.own(tex(pelmet(k.text, pal))),
      alphaTest: 0.5,
      roughness: 0.75,
      sheen: 0.8,
      sheenColor: new THREE.Color(shade(pal.wine, 0.45)),
    }),
  )
  pel.position.set(0, SH - PH / 2 + 0.05, 0.12)
  root.add(pel)

  const h = halo(k, 2.3, 5.8, -1.6)
  root.add(h)

  const state = { open: 0 }
  return {
    root,
    bob: new THREE.Object3D(),
    frame: { w: 3.9, h: 5.05, cy: 2.2 },
    burst: new THREE.Vector3(0, 2, 0.2),
    diveY: card.position.y,
    diveLook: card.position.y,
    halfWidth: 1.95,
    sweeps: [],
    glowMats: [{ m: cardMat, base: 0.04 }],
    halo: h,
    haloBase: 0.1,
    open(tl: gsap.core.Timeline) {
      tl.to(
        state,
        {
          open: 1,
          duration: 1.55,
          ease: 'power2.inOut',
          onUpdate: () => halves.forEach((hv) => hv.apply(state.open)),
        },
        0.1,
      )
        .to(spot, { intensity: 60, duration: 1.0, ease: 'sine.in' }, 0.35)
        .to(pel.position, { y: pel.position.y + 0.25, duration: 1.2, ease: 'sine.inOut' }, 0.3)
    },
  }
}
