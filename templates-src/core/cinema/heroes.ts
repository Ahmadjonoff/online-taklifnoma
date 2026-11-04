/**
 * Markaziy obyektlar (hero): sahnaning «qahramoni» va uning ochilish harakati.
 *
 *   mehrab    — shisha mehrob plaket, tilla poydevorda (Kristall, Hilol)
 *   arch      — yarim doira arkali shisha plaket (Gul bog')
 *   medallion — molbertdagi bronza medalyon, arabcha yozuv (Medalyon)
 *   card      — molbertdagi baxmal «Save the Date» kartasi (Bordo)
 *   giftbox   — lentali sovg'a qutisi: bant uchadi, qopqoq ochiladi (Sovg'a)
 */
import * as THREE from 'three'
import type gsap from 'gsap'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { PLAQUE, boxFace, cardFace, glow, medallionFace, plaqueBack, plaqueFront, shade, type ArchKind } from './textures'
import {
  additiveSprite,
  archShape,
  foilMaterial,
  goldMaterial,
  makeSweep,
  normalizedShapeGeometry,
  tex,
  type Kit,
} from './kit'

export type HeroBuild = {
  /** Idle'da yengil buriladigan guruh */
  root: THREE.Group
  /** Idle'da yuqori-past suzadigan qism */
  bob: THREE.Object3D
  /** Kadrga sig'ishi kerak bo'lgan quti (kenglik, balandlik, markaz Y) */
  frame: { w: number; h: number; cy: number }
  /** Oltin chang portlashi markazi */
  burst: THREE.Vector3
  /** Ochilishda kamera «kirib» boradigan balandlik */
  diveY: number
  /** Footprint yarim kengligi — gul va shamlar shu atrofga qo'yiladi */
  halfWidth: number
  sweeps: THREE.ShaderMaterial[]
  glowMats: Array<{ m: THREE.MeshStandardMaterial; base: number }>
  halo: THREE.Sprite
  haloBase: number
  /** Qo'shimcha ochilish harakatlari (umumiy kinoga qo'shiladi) */
  open?(tl: gsap.core.Timeline): void
}

function halo(k: Kit, y: number, scale: number, z = -1.2) {
  const h = additiveSprite(k.own(tex(glow(k.pal.glass, k.pal.goldLight))), 0.1)
  h.scale.set(scale, scale, 1)
  h.position.set(0, y, z)
  return h
}

/* ------------------------------------------------------------------ */
/*  Shisha plaket (mehrob yoki yarim doira)                            */
/* ------------------------------------------------------------------ */

function plaque(k: Kit, kind: ArchKind): HeroBuild {
  const { pal } = k
  const root = new THREE.Group()

  const plinth = new THREE.Mesh(new RoundedBoxGeometry(2.6, 0.24, 0.8, 4, 0.06), goldMaterial(pal.gold, 0.24))
  plinth.position.y = 0.12
  root.add(plinth)
  const plinth2 = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.08, 0.5, 3, 0.03), goldMaterial(pal.goldLight, 0.2))
  plinth2.position.y = 0.28
  root.add(plinth2)

  const slab = new THREE.Group()
  slab.position.y = 0.32
  root.add(slab)

  const arch = kind === 'round' ? PLAQUE.w / 2 : PLAQUE.arch
  const shape = archShape(kind, PLAQUE.w, PLAQUE.h, arch)
  const depth = 0.16
  const bevel = 0.035
  const glassGeo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 64,
  })
  glassGeo.translate(0, 0, -depth / 2)

  // Shisha: shaffof fizik material. Refraksiya (transmission) sinab ko'rildi —
  // qorong'i va «sutdek» chiqdi; bu variant referensga yaqinroq va yengil.
  const glassColor = new THREE.Color(pal.glass)
  const glass = new THREE.Mesh(
    glassGeo,
    new THREE.MeshPhysicalMaterial({
      color: glassColor.clone(),
      emissive: glassColor,
      emissiveIntensity: k.day ? 0.02 : 0.08,
      transparent: true,
      opacity: k.day ? 0.55 : 0.52,
      roughness: 0.05,
      clearcoat: 0.6,
      clearcoatRoughness: 0.08,
      iridescence: 0.25,
      iridescenceIOR: 1.3,
      envMapIntensity: 0.8,
      depthWrite: false,
    }),
  )
  slab.add(glass)

  const faceGeo = normalizedShapeGeometry(shape, PLAQUE.w, PLAQUE.h)
  const zFront = depth / 2 + bevel + 0.003

  // Orqa naqsh — shisha ichidan ko'rinadigan girih panjara
  const back = new THREE.Mesh(
    faceGeo,
    new THREE.MeshStandardMaterial({
      map: k.own(tex(plaqueBack(pal, kind))),
      alphaTest: 0.35,
      metalness: 1,
      roughness: 0.35,
      color: '#b89a6a',
      envMapIntensity: 0.8,
    }),
  )
  back.position.z = -zFront
  slab.add(back)

  const frontMat = foilMaterial(k.own(tex(plaqueFront(k.text, pal, kind, k.day))), pal, 0.06, k.day)
  const front = new THREE.Mesh(faceGeo, frontMat)
  front.position.z = zFront
  slab.add(front)

  const sweep = makeSweep(faceGeo, pal.goldLight)
  sweep.mesh.position.z = zFront + 0.002
  slab.add(sweep.mesh)

  const h = halo(k, 1.5, 5)
  root.add(h)

  return {
    root,
    bob: slab,
    frame: { w: 2.55, h: 3.9, cy: 1.62 },
    burst: new THREE.Vector3(0, 1.8, -0.2),
    diveY: 2.65,
    halfWidth: 1.3,
    sweeps: [sweep.mat],
    glowMats: [{ m: frontMat, base: k.day ? 0 : 0.06 }],
    halo: h,
    haloBase: 0.1,
  }
}

/* ------------------------------------------------------------------ */
/*  Molbert (medalyon va karta uchun)                                  */
/* ------------------------------------------------------------------ */

function easel(k: Kit, height: number, ledgeY: number, lean: number) {
  const g = new THREE.Group()
  const mat = goldMaterial(k.pal.gold, 0.3)
  const legGeo = new THREE.CylinderGeometry(0.026, 0.034, height, 12)
  for (const d of [-1, 1]) {
    const leg = new THREE.Mesh(legGeo, mat)
    leg.position.set(d * 0.52, height / 2, 0)
    leg.rotation.z = d * 0.1
    g.add(leg)
  }
  const backLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.03, height * 1.02, 12), mat)
  backLeg.position.set(0, height / 2, -0.5)
  backLeg.rotation.x = 0.3
  g.add(backLeg)
  const ledge = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.05, 0.18, 2, 0.02), mat)
  ledge.position.set(0, ledgeY, 0.06)
  g.add(ledge)
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 10), mat)
  bar.rotation.z = Math.PI / 2
  bar.position.set(0, height - 0.08, 0)
  g.add(bar)
  for (const d of [-1, 1]) {
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), mat)
    knob.position.set(d * (0.52 - Math.sin(0.1) * height), height + 0.02, 0)
    g.add(knob)
  }
  g.rotation.x = -lean
  return g
}

/* ------------------------------------------------------------------ */
/*  Medalyon                                                           */
/* ------------------------------------------------------------------ */

function medallion(k: Kit): HeroBuild {
  const { pal } = k
  const root = new THREE.Group()
  const R = 1.0
  const ledgeY = 0.86
  const stand = easel(k, 3.0, ledgeY, 0.1)
  root.add(stand)

  const disc = new THREE.Group()
  disc.position.set(0, ledgeY + 0.03 + R, 0.12)
  stand.add(disc)

  const body = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.09, 96), goldMaterial(pal.gold, 0.28))
  body.rotation.x = Math.PI / 2
  disc.add(body)

  const faceTex = k.own(tex(medallionFace(k.text, k.cfg.arabic ?? '', pal)))
  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTex,
    // To'g'ri qaraganda yuza ko'zgudek atrofni aks ettirmasin (oqarib ketadi)
    metalness: 0.35,
    roughness: 0.55,
    emissive: new THREE.Color(pal.gold),
    emissiveMap: faceTex,
    emissiveIntensity: 0.03,
    envMapIntensity: 0.5,
  })
  const faceGeo = new THREE.CircleGeometry(R * 0.985, 96)
  const face = new THREE.Mesh(faceGeo, faceMat)
  face.position.z = 0.046
  disc.add(face)

  const rim = new THREE.Mesh(new THREE.TorusGeometry(R, 0.04, 16, 120), goldMaterial(pal.goldLight, 0.22))
  rim.position.z = 0.04
  disc.add(rim)

  const sweep = makeSweep(faceGeo, pal.goldLight)
  sweep.mesh.position.z = 0.049
  disc.add(sweep.mesh)

  const h = halo(k, 1.9, 4.6)
  root.add(h)

  return {
    root,
    bob: disc,
    frame: { w: 2.5, h: 3.75, cy: 1.65 },
    burst: new THREE.Vector3(0, 1.9, 0.1),
    diveY: 1.95,
    halfWidth: 0.85,
    sweeps: [sweep.mat],
    glowMats: [{ m: faceMat, base: 0.03 }],
    halo: h,
    haloBase: 0.1,
    open(tl) {
      // Tanga kabi bir marta aylanadi — nur chaqnashi bilan bir vaqtda
      tl.to(disc.rotation, { y: Math.PI * 2, duration: 1.6, ease: 'power2.inOut' }, 0.05)
    },
  }
}

/* ------------------------------------------------------------------ */
/*  «Save the Date» baxmal karta                                       */
/* ------------------------------------------------------------------ */

function card(k: Kit): HeroBuild {
  const { pal } = k
  const root = new THREE.Group()
  const ledgeY = 0.62
  const stand = easel(k, 3.25, ledgeY, 0.1)
  root.add(stand)

  const W = 1.9
  const H = 2.66
  const holder = new THREE.Group()
  holder.position.set(0, ledgeY + 0.03 + H / 2, 0.11)
  stand.add(holder)

  const velvet = new THREE.MeshPhysicalMaterial({
    color: pal.wine,
    sheen: 1,
    sheenColor: new THREE.Color(shade(pal.wine, 0.4)),
    sheenRoughness: 0.45,
    roughness: 0.85,
  })
  holder.add(new THREE.Mesh(new RoundedBoxGeometry(W, H, 0.035, 2, 0.012), velvet))

  const faceGeo = new THREE.PlaneGeometry(W - 0.06, (W - 0.06) * (1428 / 1024))
  const faceMat = foilMaterial(k.own(tex(cardFace(k.text, k.cfg.headline || 'Save the Date', pal))), pal, 0.03, k.day)
  faceMat.envMapIntensity = k.day ? 0.7 : 1.1
  const face = new THREE.Mesh(faceGeo, faceMat)
  face.position.z = 0.019
  holder.add(face)

  const sweep = makeSweep(faceGeo, pal.goldLight)
  sweep.mesh.position.z = 0.021
  holder.add(sweep.mesh)

  const h = halo(k, 2, 5)
  root.add(h)

  return {
    root,
    bob: holder,
    frame: { w: 2.5, h: 3.95, cy: 1.75 },
    burst: new THREE.Vector3(0, 2, 0.1),
    diveY: 2.1,
    halfWidth: 0.85,
    sweeps: [sweep.mat],
    glowMats: [{ m: faceMat, base: k.day ? 0 : 0.03 }],
    halo: h,
    haloBase: 0.1,
    open(tl) {
      // Karta mehmonga qarab bir oz egiladi
      tl.to(holder.rotation, { x: 0.14, duration: 1.1, ease: 'sine.inOut' }, 0)
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Sovg'a qutisi                                                      */
/* ------------------------------------------------------------------ */

function giftbox(k: Kit): HeroBuild {
  const { pal } = k
  const root = new THREE.Group()
  const W = 1.9
  const H = 1.4
  const D = 1.6

  const paper = new THREE.MeshPhysicalMaterial({
    color: pal.satin,
    roughness: 0.55,
    sheen: 0.5,
    sheenColor: new THREE.Color('#ffffff'),
  })
  const ribbon = new THREE.MeshPhysicalMaterial({
    color: pal.wine,
    roughness: 0.35,
    sheen: 1,
    sheenColor: new THREE.Color(shade(pal.wine, 0.5)),
    clearcoat: 0.4,
  })

  const boxMesh = new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 4, 0.03), paper)
  boxMesh.position.y = H / 2
  root.add(boxMesh)

  const faceH = (W * 0.86 * 780) / 1024
  const faceGeo = new THREE.PlaneGeometry(W * 0.86, faceH)
  const faceMat = foilMaterial(k.own(tex(boxFace(k.text, pal))), pal, 0.04, k.day)
  const face = new THREE.Mesh(faceGeo, faceMat)
  face.position.set(0, H / 2 - 0.03, D / 2 + 0.004)
  root.add(face)

  const sweep = makeSweep(faceGeo, pal.goldLight)
  sweep.mesh.position.copy(face.position).add(new THREE.Vector3(0, 0, 0.002))
  root.add(sweep.mesh)

  for (const d of [-1, 1]) {
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.02, H + 0.002, 0.3), ribbon)
    band.position.set(d * (W / 2 + 0.01), H / 2, 0)
    root.add(band)
  }

  // Qopqoq + lenta + bant — bitta guruh, ochilishda uchib ketadi
  const lid = new THREE.Group()
  lid.position.y = H - 0.05
  root.add(lid)
  const lidMesh = new THREE.Mesh(new RoundedBoxGeometry(W + 0.1, 0.26, D + 0.1, 4, 0.03), paper)
  lidMesh.position.y = 0.13
  lid.add(lidMesh)
  const lidBand = new THREE.Mesh(new THREE.BoxGeometry(W + 0.12, 0.27, 0.3), ribbon)
  lidBand.position.y = 0.13
  lid.add(lidBand)

  const bow = new THREE.Group()
  bow.position.y = 0.27
  lid.add(bow)
  for (const d of [-1, 1]) {
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.07, 14, 40), ribbon)
    loop.scale.set(1, 0.62, 0.55)
    loop.position.set(d * 0.27, 0.13, 0)
    loop.rotation.z = d * 0.35
    bow.add(loop)
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.015, 0.55), ribbon)
    tail.position.set(d * 0.12, 0.01, 0.38)
    tail.rotation.y = d * 0.35
    bow.add(tail)
  }
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.095, 20, 16), ribbon)
  knot.scale.set(1, 0.85, 0.9)
  knot.position.y = 0.1
  bow.add(knot)

  // Quti ichidan chiqadigan nur
  const inner = additiveSprite(k.own(tex(glow(pal.goldLight))), 0)
  inner.position.set(0, H - 0.05, 0)
  inner.scale.set(0.01, 0.01, 1)
  root.add(inner)
  const light = new THREE.PointLight('#ffdcaa', 0, 0, 2)
  light.position.set(0, H + 0.2, 0)
  root.add(light)

  const h = halo(k, 1.1, 4.4)
  root.add(h)

  return {
    root,
    bob: lid,
    frame: { w: 2.9, h: 2.9, cy: 1.15 },
    burst: new THREE.Vector3(0, 1.45, 0),
    diveY: 1.95,
    halfWidth: 1.15,
    sweeps: [sweep.mat],
    glowMats: [{ m: faceMat, base: k.day ? 0 : 0.04 }],
    halo: h,
    haloBase: 0.1,
    open(tl) {
      tl.to(bow.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.55, ease: 'back.in(2)' }, 0.05)
        .to(bow.position, { y: 1.1, duration: 0.55, ease: 'power2.in' }, 0.05)
        .to(bow.rotation, { y: 2.5, duration: 0.55 }, 0.05)
        .to(lid.position, { y: H + 2.6, z: -1.4, duration: 1.4, ease: 'power2.in' }, 0.45)
        .to(lid.rotation, { x: -1.1, z: 0.35, duration: 1.4, ease: 'power2.in' }, 0.45)
        .to(inner.scale, { x: 7, y: 7, duration: 1.6, ease: 'power2.in' }, 0.6)
        .to(inner.material, { opacity: 1, duration: 0.8 }, 0.6)
        .to(light, { intensity: 30, duration: 1.4 }, 0.6)
    },
  }
}

export function buildHero(k: Kit): HeroBuild {
  switch (k.cfg.hero) {
    case 'arch':
      return plaque(k, 'round')
    case 'medallion':
      return medallion(k)
    case 'card':
      return card(k)
    case 'giftbox':
      return giftbox(k)
    default:
      return plaque(k, 'ogee')
  }
}
