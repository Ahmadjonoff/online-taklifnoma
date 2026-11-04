/**
 * «Kristall mehrob» 3D sahnasi — three.js + GSAP, React'siz (imperativ).
 *
 * Sahna: qorong'i saroy zali, markazda tilla poydevordagi shisha mehrob
 * plaket (ichida ismlar va girih naqsh), yon tomonda fonarlar va shamlar,
 * oldinda gortenziya gullari, havoda oltin chang va bokeh nurlari.
 *
 * Kino ssenariy:
 *   intro() — kamera uzoqdan sekin yaqinlashadi, plaket burilib to'g'rilanadi
 *   (idle)  — plaket suzadi, shisha ustidan nur o'tib turadi, barmoq/sichqoncha
 *             bilan yengil parallaks
 *   open()  — shisha bo'ylab yorug'lik chizig'i, oltin chang portlashi,
 *             kamera arka ichiga «kirib» ketadi → oq-oltin chaqnash
 *
 * Bu modul dinamik `import()` bilan yuklanadi — poster darhol ko'rinadi,
 * three.js esa fonda keladi.
 */
import * as THREE from 'three'
import gsap from 'gsap'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import {
  PLAQUE,
  flame,
  glow,
  hydrangea,
  lanternPattern,
  petal,
  plaqueBack,
  plaqueFront,
  radialFloor,
  wall,
  type Palette,
  type PlaqueText,
} from './textures'

export type StageQuality = 'high' | 'medium'

export type StageOptions = {
  canvas: HTMLCanvasElement
  quality: StageQuality
  palette: Palette
  text: PlaqueText
  /** WebGL konteksti yo'qolsa (iOS'da xotira tanqisligi) — CSS variantga o'tish */
  onContextLost?: () => void
}

export type Stage = {
  /** Kamera kirish harakati. Tugagach resolve bo'ladi. */
  intro(): Promise<void>
  /** Ochilish kinosi. `onFlash` — chaqnash boshlanadigan payt. */
  open(onFlash: () => void): Promise<void>
  dispose(): void
}

/* ------------------------------------------------------------------ */
/*  Yordamchilar                                                       */
/* ------------------------------------------------------------------ */

function tex(c: HTMLCanvasElement, srgb = true) {
  const t = new THREE.CanvasTexture(c)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

/** Mehrob konturi — canvas'dagi `mehrabPath` bilan aynan bir xil proporsiya. */
function mehrabShape(w: number, h: number, arch: number) {
  const s = new THREE.Shape()
  s.moveTo(-w / 2, 0)
  s.lineTo(-w / 2, h - arch)
  s.bezierCurveTo(-w / 2, h - arch * 0.45, -w / 2 + w * 0.38, h - arch * 0.32, 0, h)
  s.bezierCurveTo(w / 2 - w * 0.38, h - arch * 0.32, w / 2, h - arch * 0.45, w / 2, h - arch)
  s.lineTo(w / 2, 0)
  s.closePath()
  return s
}

/** ShapeGeometry UV'larini 0..1 ga keltirish — canvas tekstura to'liq sig'sin. */
function normalizedShapeGeometry(shape: THREE.Shape, w: number, h: number) {
  const g = new THREE.ShapeGeometry(shape, 64)
  const pos = g.attributes.position
  const uv = g.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + w / 2) / w, pos.getY(i) / h)
  }
  uv.needsUpdate = true
  return g
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

/* ------------------------------------------------------------------ */
/*  Shaderlar                                                          */
/* ------------------------------------------------------------------ */

const BOKEH_VS = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.18 + aPhase) * 0.18;
    p.x += cos(uTime * 0.12 + aPhase) * 0.12;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vTw = 0.75 + 0.25 * sin(uTime * 0.7 + aPhase * 3.0);
    gl_PointSize = aSize * uPixelRatio * vTw;
    vColor = aColor;
  }
`
const BOKEH_FS = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    // linzadagi bokeh: tekis disk + yorqinroq chekka
    float a = smoothstep(1.0, 0.86, d) * (0.32 + 0.3 * smoothstep(0.55, 0.92, d));
    gl_FragColor = vec4(vColor, a * uOpacity * vTw);
  }
`

const DUST_VS = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  uniform float uTime;
  uniform float uBurst;
  uniform float uPixelRatio;
  varying float vTw;
  void main() {
    vec3 p = position;
    // sekin ko'tarilish (4.6 balandlikda aylanib qaytadi)
    p.y = mod(p.y + uTime * 0.07 * aSpeed, 4.6);
    p.x += sin(uTime * 0.3 + aPhase) * 0.08;
    // ochilishda markazdan tashqariga portlash
    vec3 dir = normalize(p - vec3(0.0, 1.8, -0.2) + 0.0001);
    p += dir * uBurst * uBurst * 5.0 * aSpeed;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vTw = 0.45 + 0.55 * abs(sin(uTime * 1.6 * aSpeed + aPhase));
    gl_PointSize = aSize * uPixelRatio * (1.0 + uBurst * 1.4) * (6.0 / -mv.z);
  }
`
const DUST_FS = /* glsl */ `
  uniform vec3 uColor;
  varying float vTw;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = pow(max(0.0, 1.0 - d), 2.2);
    gl_FragColor = vec4(uColor * 1.6, a * vTw);
  }
`

const SWEEP_VS = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const SWEEP_FS = /* glsl */ `
  uniform float uSweep;
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    // diagonal yorug'lik chizig'i — shisha ustidan o'tadigan «yaltirash»
    float t = vUv.x * 0.55 + vUv.y * 0.85;
    float band = exp(-pow((t - uSweep * 1.7 + 0.2) / 0.07, 2.0));
    float soft = exp(-pow((t - uSweep * 1.7 + 0.2) / 0.3, 2.0)) * 0.25;
    vec3 c = mix(uColor, vec3(1.0), 0.6);
    gl_FragColor = vec4(c, (band + soft) * uIntensity);
  }
`

/* ------------------------------------------------------------------ */
/*  Sahna                                                              */
/* ------------------------------------------------------------------ */

export function createStage(opts: StageOptions): Stage {
  const { canvas, palette: pal, text } = opts
  let quality = opts.quality
  const high = () => quality === 'high'

  /* ---------- renderer ---------- */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  })
  const maxDpr = high() ? 1.75 : 1.5
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.92

  const scene = new THREE.Scene()
  const bgColor = new THREE.Color(pal.bg)
  scene.background = bgColor
  scene.fog = new THREE.FogExp2(bgColor, 0.05)

  const pmrem = new THREE.PMREMGenerator(renderer)
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04)
  scene.environment = envRT.texture
  scene.environmentIntensity = 0.42
  pmrem.dispose()

  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 60)
  const target = new THREE.Vector3(0, 1.62, 0)

  /* ---------- yorug'lik ---------- */
  scene.add(new THREE.AmbientLight(new THREE.Color(pal.glass), 0.18))

  const key = new THREE.SpotLight('#ffd9a8', 55, 0, 0.32, 0.9, 2)
  key.position.set(-2.6, 4.2, 6.5)
  key.target.position.copy(target)
  scene.add(key, key.target)

  const rim = new THREE.DirectionalLight(new THREE.Color(pal.petalA), 2.2)
  rim.position.set(2.5, 4, -5)
  scene.add(rim)

  /* ---------- pol va devor ---------- */
  const floorTex = tex(radialFloor(pal))
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ map: floorTex, color: '#2c2340', roughness: 0.55, metalness: 0.2, envMapIntensity: 0.3 }),
  )
  floor.rotation.x = -Math.PI / 2
  scene.add(floor)

  const wallTex = tex(wall(pal))
  const wallMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 18),
    new THREE.MeshBasicMaterial({ map: wallTex, fog: false }),
  )
  wallMesh.position.set(0, 7.2, -8)
  scene.add(wallMesh)

  /* ---------- plaket ---------- */
  const plaque = new THREE.Group()
  scene.add(plaque)

  const plinth = new THREE.Mesh(
    new RoundedBoxGeometry(2.6, 0.24, 0.8, 4, 0.06),
    new THREE.MeshStandardMaterial({ color: pal.gold, metalness: 1, roughness: 0.24 }),
  )
  plinth.position.y = 0.12
  plaque.add(plinth)

  // ikkinchi, ingichka pog'ona
  const plinth2 = new THREE.Mesh(
    new RoundedBoxGeometry(2.3, 0.08, 0.5, 3, 0.03),
    new THREE.MeshStandardMaterial({ color: pal.goldLight, metalness: 1, roughness: 0.2 }),
  )
  plinth2.position.y = 0.28
  plaque.add(plinth2)

  const slab = new THREE.Group()
  slab.position.y = 0.32
  plaque.add(slab)

  const shape = mehrabShape(PLAQUE.w, PLAQUE.h, PLAQUE.arch)
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
  // u qorong'i va «sutdek» chiqdi, referensdagi binafsha shishaga bu variant
  // yaqinroq va har qanday telefonda yengil.
  const glassColor = new THREE.Color(pal.glass)
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: glassColor.clone(),
    emissive: glassColor,
    emissiveIntensity: 0.08,
    transparent: true,
    opacity: 0.52,
    roughness: 0.05,
    clearcoat: 0.6,
    clearcoatRoughness: 0.08,
    iridescence: 0.25,
    iridescenceIOR: 1.3,
    envMapIntensity: 0.8,
    depthWrite: false,
  })
  const glass = new THREE.Mesh(glassGeo, glassMat)
  slab.add(glass)

  const faceGeo = normalizedShapeGeometry(shape, PLAQUE.w, PLAQUE.h)
  const zFront = depth / 2 + bevel + 0.003

  // Orqa naqsh — shisha ichidan ko'rinadigan girih panjara (alphaTest — tartiblash muammosiz)
  const backTex = tex(plaqueBack(pal))
  const back = new THREE.Mesh(
    faceGeo,
    new THREE.MeshStandardMaterial({
      map: backTex,
      alphaTest: 0.35,
      metalness: 1,
      roughness: 0.35,
      color: '#b89a6a',
      envMapIntensity: 0.8,
    }),
  )
  back.position.z = -zFront
  slab.add(back)

  // Old yuza — ismlar va hoshiya (oltin, metall)
  const frontTex = tex(plaqueFront(text, pal))
  const frontMat = new THREE.MeshStandardMaterial({
    map: frontTex,
    transparent: true,
    metalness: 1,
    roughness: 0.26,
    emissive: new THREE.Color(pal.gold),
    emissiveMap: frontTex,
    emissiveIntensity: 0.06,
    envMapIntensity: 1.5,
    depthWrite: false,
  })
  const front = new THREE.Mesh(faceGeo, frontMat)
  front.position.z = zFront
  slab.add(front)

  // Nur chizig'i
  const sweepMat = new THREE.ShaderMaterial({
    vertexShader: SWEEP_VS,
    fragmentShader: SWEEP_FS,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uSweep: { value: -0.2 },
      uIntensity: { value: 0.55 },
      uColor: { value: new THREE.Color(pal.goldLight) },
    },
  })
  const sweep = new THREE.Mesh(faceGeo, sweepMat)
  sweep.position.z = zFront + 0.002
  slab.add(sweep)

  // Plaket ortidagi yumshoq nur (halo)
  const haloTex = tex(glow(pal.glass, pal.goldLight))
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: haloTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity: 0.1,
    }),
  )
  halo.scale.set(5, 5, 1)
  halo.position.set(0, 1.5, -1.2)
  plaque.add(halo)

  /* ---------- fonarlar ---------- */
  const lanternAlpha = tex(lanternPattern(), false)
  lanternAlpha.wrapS = lanternAlpha.wrapT = THREE.RepeatWrapping
  lanternAlpha.repeat.set(6, 2)
  const lanternMat = new THREE.MeshStandardMaterial({
    color: pal.gold,
    metalness: 1,
    roughness: 0.3,
    alphaMap: lanternAlpha,
    alphaTest: 0.5,
    side: THREE.DoubleSide,
  })
  const goldMat = new THREE.MeshStandardMaterial({ color: pal.gold, metalness: 1, roughness: 0.28 })
  const warmGlowTex = tex(glow('rgba(255,170,90,0.85)'))

  // Fonar profili — silliq egri chiziq (tomchi shakli)
  const lanternProfile = new THREE.SplineCurve(
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

  const flickers: Array<{ obj: THREE.Object3D; base: number; light?: THREE.PointLight; li: number }> = []

  function lantern(x: number, z: number, s: number, withLight: boolean) {
    const g = new THREE.Group()
    const body = new THREE.Mesh(new THREE.LatheGeometry(lanternProfile, 40), lanternMat)
    g.add(body)
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.21, 0.05, 24), goldMat)
    base.position.y = 0.01
    g.add(base)
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.24, 24), goldMat)
    cap.position.y = 0.86
    g.add(cap)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 8, 24), goldMat)
    ring.position.y = 1.02
    g.add(ring)

    const glowSpr = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: warmGlowTex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    )
    glowSpr.position.y = 0.34
    glowSpr.scale.set(1.1, 1.1, 1)
    g.add(glowSpr)

    let light: THREE.PointLight | undefined
    if (withLight) {
      light = new THREE.PointLight('#ffb067', 3.5, 0, 2)
      light.position.y = 0.34
      g.add(light)
    }
    g.position.set(x, 0, z)
    g.scale.setScalar(s)
    scene.add(g)
    flickers.push({ obj: glowSpr, base: 1.1, light, li: 3.5 })
  }

  lantern(-1.5, -1.25, 1.55, true)
  lantern(1.62, -1.9, 1.85, true)
  lantern(-3.1, -3.6, 2.3, high())
  lantern(3.3, -4.4, 2.5, false)

  /* ---------- shamlar ---------- */
  const flameTex = tex(flame())
  const candleMat = new THREE.MeshStandardMaterial({
    color: '#f3e6d3',
    roughness: 0.55,
    emissive: '#ffcf99',
    emissiveIntensity: 0.12,
  })
  function candle(x: number, z: number, h: number) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, h, 24), candleMat)
    c.position.set(x, h / 2, z)
    scene.add(c)
    const f = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: flameTex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    )
    f.scale.set(0.09, 0.18, 1)
    f.position.set(x, h + 0.09, z)
    scene.add(f)
    const gl = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: warmGlowTex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        opacity: 0.7,
      }),
    )
    gl.scale.set(0.7, 0.7, 1)
    gl.position.set(x, h + 0.08, z)
    scene.add(gl)
    flickers.push({ obj: f, base: 0.18, li: 0 })
    flickers.push({ obj: gl, base: 0.7, li: 0 })
  }
  candle(-1.5, 0.75, 0.42)
  candle(-1.22, 1.05, 0.28)
  candle(1.55, 0.85, 0.5)
  candle(1.3, 1.15, 0.24)

  /* ---------- gullar (2.5D) ---------- */
  const flowerTextures: THREE.Texture[] = []
  function flower(x: number, y: number, z: number, s: number, seed: number, blur = 0) {
    const t = tex(hydrangea(pal, seed, blur))
    flowerTextures.push(t)
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }))
    spr.position.set(x, y, z)
    spr.scale.set(s, s, 1)
    scene.add(spr)
  }
  flower(-1.35, 0.42, 0.3, 1.15, 11)
  flower(-0.95, 0.3, 0.62, 0.8, 23)
  flower(1.3, 0.45, 0.25, 1.2, 37)
  flower(0.98, 0.3, 0.66, 0.78, 41)
  flower(-1.05, 0.62, -0.45, 1.25, 53)
  flower(1.15, 0.6, -0.5, 1.2, 67)
  // oldingi plan — fokusdan tashqari, xira
  flower(-1.75, 0.65, 2.5, 1.5, 71, 9)
  flower(1.85, 0.45, 2.7, 1.6, 83, 11)

  /* ---------- tushayotgan gulbarglar ---------- */
  const petalCount = high() ? 46 : 22
  const petalTex = tex(petal(pal))
  const petals = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.075, 0.075),
    new THREE.MeshBasicMaterial({
      map: petalTex,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    petalCount,
  )
  const pState = Array.from({ length: petalCount }, () => ({
    p: new THREE.Vector3(rand(-3.5, 3.5), rand(0, 5), rand(-2, 2.6)),
    v: rand(0.12, 0.28),
    r: new THREE.Euler(rand(0, 6), rand(0, 6), rand(0, 6)),
    s: rand(0.6, 1.3),
    w: rand(0.5, 1.5),
  }))
  scene.add(petals)

  /* ---------- bokeh ---------- */
  function bokehPoints(n: number, zMin: number, zMax: number, sMin: number, sMax: number, opacity: number) {
    const pos = new Float32Array(n * 3)
    const size = new Float32Array(n)
    const phase = new Float32Array(n)
    const col = new Float32Array(n * 3)
    const choices = [pal.goldLight, pal.gold, pal.petalA, '#ffcf99'].map((c) => new THREE.Color(c))
    for (let i = 0; i < n; i++) {
      pos.set([rand(-7, 7), rand(0.4, 6.5), rand(zMin, zMax)], i * 3)
      size[i] = rand(sMin, sMax)
      phase[i] = rand(0, 6.28)
      const c = choices[i % choices.length]
      col.set([c.r, c.g, c.b], i * 3)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
    const m = new THREE.ShaderMaterial({
      vertexShader: BOKEH_VS,
      fragmentShader: BOKEH_FS,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uOpacity: { value: opacity },
      },
    })
    const pts = new THREE.Points(g, m)
    scene.add(pts)
    return m
  }
  const bokehFar = bokehPoints(high() ? 55 : 32, -7, -2.6, 14, 58, 0.6)
  const bokehNear = bokehPoints(6, 2.6, 3.6, 120, 220, 0.12)

  /* ---------- oltin chang ---------- */
  const dustN = high() ? 420 : 200
  const dPos = new Float32Array(dustN * 3)
  const dSize = new Float32Array(dustN)
  const dPhase = new Float32Array(dustN)
  const dSpeed = new Float32Array(dustN)
  for (let i = 0; i < dustN; i++) {
    dPos.set([rand(-3.2, 3.2), rand(0, 4.6), rand(-1.8, 2.4)], i * 3)
    dSize[i] = rand(2, 7)
    dPhase[i] = rand(0, 6.28)
    dSpeed[i] = rand(0.5, 1.5)
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3))
  dustGeo.setAttribute('aSize', new THREE.BufferAttribute(dSize, 1))
  dustGeo.setAttribute('aPhase', new THREE.BufferAttribute(dPhase, 1))
  dustGeo.setAttribute('aSpeed', new THREE.BufferAttribute(dSpeed, 1))
  const dustMat = new THREE.ShaderMaterial({
    vertexShader: DUST_VS,
    fragmentShader: DUST_FS,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uBurst: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uColor: { value: new THREE.Color(pal.goldLight) },
    },
  })
  const dust = new THREE.Points(dustGeo, dustMat)
  dust.frustumCulled = false
  scene.add(dust)

  /* ---------- post-effekt (faqat high) ---------- */
  let composer: EffectComposer | null = null
  let bloom: UnrealBloomPass | null = null
  function buildComposer() {
    const size = renderer.getDrawingBufferSize(new THREE.Vector2())
    const rt = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: 4 })
    composer = new EffectComposer(renderer, rt)
    composer.addPass(new RenderPass(scene, camera))
    bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.42, 0.5, 0.86)
    composer.addPass(bloom)
    composer.addPass(new OutputPass())
  }
  if (high()) buildComposer()

  /** Kadrlar sekin bo'lsa — sifatni pasaytirish (bir marta). */
  function degrade() {
    if (!high()) return
    quality = 'medium'
    composer?.dispose()
    composer = null
    bloom = null
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25))
    resize()
  }

  /* ---------- kamera kadrlash ---------- */
  const ctl = {
    dist: 1, // asosiy masofaga ko'paytiriladi
    camX: 0,
    camY: 0,
    fovMul: 1,
    rot: 0,
    sweep: -0.2,
    sweepI: 0.55,
    burst: 0,
    bloom: 0.42,
    glow: 0,
    idle: 0, // 0 → 1: idle harakatlari (parallaks, suzish) qanchalik faol
  }
  let baseDist = 6
  let baseFov = 38

  function resize() {
    const w = canvas.clientWidth || window.innerWidth
    const h = canvas.clientHeight || window.innerHeight
    renderer.setSize(w, h, false)
    const aspect = w / h
    camera.aspect = aspect
    baseFov = aspect < 0.8 ? 44 : 36
    // Plaket + poydevor + atrofidagi gullar kadrga sig'sin
    const halfV = Math.tan(THREE.MathUtils.degToRad(baseFov / 2))
    const halfH = halfV * aspect
    const needH = 3.9 / 2 / halfV
    const needW = 2.55 / 2 / halfH
    baseDist = Math.max(needH, needW) * 1.02
    composer?.setSize(w, h)
    const pr = renderer.getPixelRatio()
    dustMat.uniforms.uPixelRatio.value = pr
    bokehFar.uniforms.uPixelRatio.value = pr
    bokehNear.uniforms.uPixelRatio.value = pr
  }
  resize()
  window.addEventListener('resize', resize)

  /* ---------- parallaks ---------- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  function onPointer(e: PointerEvent) {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
  }
  function onTilt(e: DeviceOrientationEvent) {
    if (e.gamma == null || e.beta == null) return
    pointer.tx = THREE.MathUtils.clamp(e.gamma / 25, -1, 1)
    pointer.ty = THREE.MathUtils.clamp((e.beta - 45) / 25, -1, 1)
  }
  window.addEventListener('pointermove', onPointer)
  window.addEventListener('deviceorientation', onTilt)

  /* ---------- kontekst yo'qolishi ---------- */
  function onLost(e: Event) {
    e.preventDefault()
    opts.onContextLost?.()
  }
  canvas.addEventListener('webglcontextlost', onLost)

  /* ---------- kadr sikli ---------- */
  const timer = new THREE.Timer()
  const dummy = new THREE.Object3D()
  let raf = 0
  let frames = 0
  let slowFrames = 0
  let disposed = false

  function tick() {
    raf = requestAnimationFrame(tick)
    if (document.hidden) return
    timer.update()
    const dt = Math.min(timer.getDelta(), 0.1)
    const t = timer.getElapsed()

    // Moslashuvchan sifat: dastlabki ~2 soniyada sekin kadrlarni sanash
    if (frames < 120) {
      frames++
      if (frames > 20 && dt > 1 / 32) slowFrames++
      if (frames === 120 && slowFrames > 45) degrade()
    }

    pointer.x += (pointer.tx - pointer.x) * 0.04
    pointer.y += (pointer.ty - pointer.y) * 0.04

    // kamera
    const idle = ctl.idle
    camera.fov = baseFov * ctl.fovMul
    camera.updateProjectionMatrix()
    const d = baseDist * ctl.dist
    camera.position.set(
      ctl.camX + (pointer.x * 0.35 + Math.sin(t * 0.21) * 0.12) * idle,
      1.5 + ctl.camY + (-pointer.y * 0.18 + Math.sin(t * 0.17) * 0.05) * idle,
      d,
    )
    camera.lookAt(target)

    // plaket
    plaque.rotation.y = ctl.rot + (pointer.x * 0.1 + Math.sin(t * 0.35) * 0.035) * idle
    slab.position.y = 0.32 + Math.sin(t * 0.9) * 0.012 * idle

    // shisha yaltirashi: idle'da har ~6 soniyada bir o'tadi
    if (idle > 0.5 && ctl.burst === 0) {
      const cycle = (t % 6.5) / 6.5
      sweepMat.uniforms.uSweep.value = cycle * 1.4 - 0.2
    } else {
      sweepMat.uniforms.uSweep.value = ctl.sweep
    }
    sweepMat.uniforms.uIntensity.value = ctl.sweepI
    frontMat.emissiveIntensity = 0.06 + ctl.glow * 1.1
    ;(halo.material as THREE.SpriteMaterial).opacity = 0.1 + ctl.glow * 0.75

    // zarrachalar
    dustMat.uniforms.uTime.value = t
    dustMat.uniforms.uBurst.value = ctl.burst
    bokehFar.uniforms.uTime.value = t
    bokehNear.uniforms.uTime.value = t

    // gulbarglar
    for (let i = 0; i < petalCount; i++) {
      const s = pState[i]
      s.p.y -= s.v * dt
      s.p.x += Math.sin(t * s.w + i) * 0.004
      s.r.x += dt * s.w
      s.r.y += dt * s.w * 0.7
      if (s.p.y < 0) {
        s.p.y = 5
        s.p.x = rand(-3.5, 3.5)
      }
      dummy.position.copy(s.p)
      dummy.rotation.copy(s.r)
      dummy.scale.setScalar(s.s)
      dummy.updateMatrix()
      petals.setMatrixAt(i, dummy.matrix)
    }
    petals.instanceMatrix.needsUpdate = true

    // fonar va sham alangasi tebranishi
    for (const f of flickers) {
      const k = 1 + Math.sin(t * 13 + f.base * 50) * 0.04 + Math.sin(t * 7.3 + f.base * 9) * 0.05
      if (f.obj instanceof THREE.Sprite) {
        const sx = f.obj.scale.x / f.obj.scale.y
        f.obj.scale.y = f.base * k
        f.obj.scale.x = f.base * k * sx
      }
      if (f.light) f.light.intensity = f.li * k
    }

    if (composer && bloom) {
      bloom.strength = ctl.bloom
      composer.render(dt)
    } else {
      renderer.render(scene, camera)
    }
  }
  raf = requestAnimationFrame(tick)

  /* ---------- kino ---------- */
  const tweens: gsap.core.Animation[] = []

  function intro(): Promise<void> {
    ctl.dist = 2.1
    ctl.camX = 1.4
    ctl.camY = -0.75
    ctl.rot = -0.6
    ctl.bloom = 0.95
    ctl.fovMul = 1.12
    return new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve })
      tl.to(ctl, { dist: 1, camX: 0, camY: 0, fovMul: 1, duration: 3.4, ease: 'power3.out' }, 0)
        .to(ctl, { rot: 0, duration: 3.2, ease: 'power2.out' }, 0.15)
        .to(ctl, { bloom: 0.42, duration: 2.6, ease: 'sine.out' }, 0.2)
        .fromTo(ctl, { sweep: -0.2 }, { sweep: 1.25, duration: 1.6, ease: 'power2.inOut' }, 2.0)
        .to(ctl, { idle: 1, duration: 1.4, ease: 'sine.inOut' }, 2.6)
      tweens.push(tl)
    })
  }

  function open(onFlash: () => void): Promise<void> {
    // intro hali tugamagan bo'lsa — to'xtatamiz, ochilish undan davom etadi
    tweens.forEach((t) => t.kill())
    return new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve })
      tl.to(ctl, { idle: 0, duration: 0.6, ease: 'sine.out' }, 0)
        .fromTo(ctl, { sweep: -0.2, sweepI: 0.55 }, { sweep: 1.3, sweepI: 1.2, duration: 1.0, ease: 'power2.inOut' }, 0)
        .to(ctl, { glow: 1, duration: 1.4, ease: 'sine.in' }, 0.15)
        .to(ctl, { burst: 1, duration: 2.5, ease: 'power2.in' }, 0.3)
        .to(ctl, { bloom: 1.7, duration: 1.8, ease: 'sine.in' }, 0.5)
        .to(ctl, { rot: 0, camX: 0, duration: 0.8, ease: 'sine.inOut' }, 0)
        // kamera arka cho'qqisi tomon «kirib» ketadi
        .to(ctl, { dist: 0.12, camY: 1.15, fovMul: 0.78, duration: 2.3, ease: 'power3.in' }, 0.55)
        .call(onFlash, [], 1.95)
        .to({}, { duration: 0.6 }, 2.55)
      tweens.push(tl)
    })
  }

  /* ---------- tozalash ---------- */
  function dispose() {
    if (disposed) return
    disposed = true
    cancelAnimationFrame(raf)
    timer.dispose()
    tweens.forEach((t) => t.kill())
    window.removeEventListener('resize', resize)
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('deviceorientation', onTilt)
    canvas.removeEventListener('webglcontextlost', onLost)
    scene.traverse((o) => {
      const m = o as THREE.Mesh
      m.geometry?.dispose()
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : []
      mats.forEach((mat) => mat.dispose())
    })
    ;[floorTex, wallTex, backTex, frontTex, haloTex, lanternAlpha, warmGlowTex, flameTex, petalTex, ...flowerTextures].forEach(
      (t) => t.dispose(),
    )
    envRT.dispose()
    composer?.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
  }

  return { intro, open, dispose }
}
