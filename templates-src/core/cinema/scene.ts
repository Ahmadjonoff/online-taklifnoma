/**
 * Kinematik 3D sahna dvigateli — three.js + GSAP, React'siz (imperativ).
 *
 * Sahna: zal (devor, pol yoki atlas mato), markazda «qahramon» obyekt
 * (heroes.ts), atrofida bezaklar (decor.ts), havoda bokeh, oltin chang va
 * tushayotgan gulbarglar. Kayfiyat: `night` (sham va fonar) yoki `day`.
 *
 * Kino ssenariy:
 *   intro() — kamera uzoqdan sekin yaqinlashadi, obyekt burilib to'g'rilanadi
 *   (idle)  — obyekt suzadi, yuzasidan nur o'tib turadi, yengil parallaks
 *   open()  — nur chizig'i, oltin chang portlashi, obyektning o'z harakati
 *             (medalyon aylanadi, quti ochiladi ...), kamera ichkariga
 *             «kirib» ketadi → chaqnash
 *
 * Bu modul dinamik `import()` bilan yuklanadi — poster darhol ko'rinadi.
 */
import * as THREE from 'three'
import gsap from 'gsap'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { petal, radialFloor, satinFloor, wall, type Palette, type PlaqueText } from './textures'
import { rand, tex, type Kit, type Scene3D } from './kit'
import { buildHero } from './heroes'
import { buildDecor } from './decor'

export type StageQuality = 'high' | 'medium'

export type StageOptions = {
  canvas: HTMLCanvasElement
  quality: StageQuality
  palette: Palette
  text: PlaqueText
  scene: Scene3D
  /** WebGL konteksti yo'qolsa (iOS'da xotira tanqisligi) — CSS variantga o'tish */
  onContextLost?: () => void
}

export type Stage = {
  /**
   * Shader'lar kompilyatsiya qilinib, birinchi kadr tayyor bo'lganda resolve.
   * Kompilyatsiya parallel (KHR_parallel_shader_compile) — sahifa qotmaydi,
   * poster esa shu vaqtgacha ko'rinib turadi.
   */
  ready: Promise<void>
  /** Kamera kirish harakati. Tugagach resolve bo'ladi. */
  intro(): Promise<void>
  /** Ochilish kinosi. `onFlash` — chaqnash boshlanadigan payt. */
  open(onFlash: () => void): Promise<void>
  dispose(): void
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
  uniform vec3 uCenter;
  varying float vTw;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * 0.07 * aSpeed, 4.6);
    p.x += sin(uTime * 0.3 + aPhase) * 0.08;
    vec3 dir = normalize(p - uCenter + 0.0001);
    p += dir * uBurst * uBurst * 5.0 * aSpeed;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vTw = 0.45 + 0.55 * abs(sin(uTime * 1.6 * aSpeed + aPhase));
    gl_PointSize = aSize * uPixelRatio * (1.0 + uBurst * 1.4) * (6.0 / -mv.z);
  }
`
const DUST_FS = /* glsl */ `
  uniform vec3 uColor;
  uniform float uGain;
  varying float vTw;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = pow(max(0.0, 1.0 - d), 2.2);
    gl_FragColor = vec4(uColor * uGain, a * vTw);
  }
`

/* ------------------------------------------------------------------ */
/*  Sahna                                                              */
/* ------------------------------------------------------------------ */

export function createStage(opts: StageOptions): Stage {
  const { canvas, palette: pal, text, scene: cfg } = opts
  let quality = opts.quality
  const high = quality === 'high'
  const day = cfg.mood === 'day'

  /* ---------- renderer ---------- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, high ? 1.75 : 1.5))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = day ? 0.82 : 0.92

  const scene = new THREE.Scene()
  const bgColor = new THREE.Color(pal.bg)
  scene.background = bgColor
  scene.fog = new THREE.FogExp2(bgColor, day ? 0.035 : 0.05)

  const owned: THREE.Texture[] = []
  const own = <T extends THREE.Texture>(t: T) => {
    owned.push(t)
    return t
  }

  const pmrem = new THREE.PMREMGenerator(renderer)
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04)
  scene.environment = envRT.texture
  scene.environmentIntensity = day ? 0.5 : 0.42
  pmrem.dispose()

  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 60)

  /* ---------- yorug'lik ---------- */
  if (day) {
    scene.add(new THREE.AmbientLight('#ffffff', 0.15))
    scene.add(new THREE.HemisphereLight('#ffffff', new THREE.Color(pal.bg), 0.35))
  } else {
    scene.add(new THREE.AmbientLight(new THREE.Color(pal.glass), 0.18))
  }
  const key = new THREE.SpotLight(day ? '#ffe9cf' : '#ffd9a8', day ? 45 : 55, 0, 0.32, 0.9, 2)
  key.position.set(-2.6, 4.2, 6.5)
  scene.add(key, key.target)
  const rim = new THREE.DirectionalLight(day ? '#ffffff' : new THREE.Color(pal.petalA), day ? 0.8 : 2.2)
  rim.position.set(2.5, 4, -5)
  scene.add(rim)

  /* ---------- pol va devor ---------- */
  const floorMat = cfg.drape
    ? new THREE.MeshPhysicalMaterial({
        map: own(tex(satinFloor(pal))),
        // tunda mato sham nurida — yorqinligi pasaytiriladi (aks holda bloom «oqartiradi»)
        color: day ? '#ffffff' : '#74685a',
        roughness: 0.5,
        metalness: 0.1,
        sheen: 1,
        sheenColor: new THREE.Color('#ffffff'),
        sheenRoughness: 0.4,
      })
    : new THREE.MeshStandardMaterial({
        map: own(tex(radialFloor(pal, day))),
        color: day ? '#e6d9d2' : '#2c2340',
        roughness: day ? 0.45 : 0.55,
        metalness: day ? 0.1 : 0.2,
        envMapIntensity: day ? 0.6 : 0.3,
      })
  if (cfg.drape && floorMat.map) {
    floorMat.map.wrapS = floorMat.map.wrapT = THREE.RepeatWrapping
    floorMat.map.repeat.set(3, 3)
  }
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), floorMat)
  floor.rotation.x = -Math.PI / 2
  scene.add(floor)

  // Devor keng ekranda ham chetsiz bo'lsin: arkalar yon tomonga takrorlanadi
  const wallTex = own(tex(wall(pal, day)))
  wallTex.wrapS = THREE.RepeatWrapping
  wallTex.repeat.set(2, 1)
  wallTex.offset.x = 0.5
  const wallMesh = new THREE.Mesh(new THREE.PlaneGeometry(36, 18), new THREE.MeshBasicMaterial({ map: wallTex, fog: false }))
  wallMesh.position.set(0, 7.2, -8)
  scene.add(wallMesh)

  /* ---------- qahramon va bezaklar ---------- */
  const kit: Kit = { scene, pal, text, cfg, high, day, own }
  const hero = buildHero(kit)
  scene.add(hero.root)
  const bobBase = hero.bob.position.y
  const target = new THREE.Vector3(0, hero.frame.cy, 0)
  key.target.position.copy(target)
  const decor = buildDecor(kit, hero.halfWidth)

  /* ---------- tushayotgan gulbarglar ---------- */
  const petalCount = high ? 46 : 22
  const petals = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.075, 0.075),
    new THREE.MeshBasicMaterial({ map: own(tex(petal(pal))), transparent: true, side: THREE.DoubleSide, depthWrite: false }),
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

  /* ---------- bokeh va yulduzlar ---------- */
  function bokehPoints(
    n: number,
    box: [number, number, number, number, number, number],
    sMin: number,
    sMax: number,
    opacity: number,
    colors: string[],
  ) {
    const pos = new Float32Array(n * 3)
    const size = new Float32Array(n)
    const phase = new Float32Array(n)
    const col = new Float32Array(n * 3)
    const choices = colors.map((c) => new THREE.Color(c))
    for (let i = 0; i < n; i++) {
      pos.set([rand(box[0], box[1]), rand(box[2], box[3]), rand(box[4], box[5])], i * 3)
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
    pts.frustumCulled = false
    scene.add(pts)
    return m
  }
  const bokehColors = day ? ['#ffffff', pal.petalB, pal.goldLight] : [pal.goldLight, pal.gold, pal.petalA, '#ffcf99']
  const pointMats = [
    bokehPoints(high ? 55 : 32, [-7, 7, 0.4, 6.5, -7, -2.6], 14, 58, day ? 0.18 : 0.6, bokehColors),
    bokehPoints(6, [-7, 7, 0.4, 6.5, 2.6, 3.6], 120, 220, day ? 0.06 : 0.12, bokehColors),
  ]
  if (cfg.moon) pointMats.push(bokehPoints(140, [-9, 9, 2.5, 10, -7.6, -6], 2, 5, 1, ['#ffffff', pal.goldLight]))

  /* ---------- oltin chang ---------- */
  const dustN = high ? 420 : 200
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
    // Yorug' fonda qo'shiluvchi (additive) zarra ko'rinmaydi — oddiy aralashtirish
    blending: day ? THREE.NormalBlending : THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uBurst: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uCenter: { value: hero.burst.clone() },
      uColor: { value: new THREE.Color(day ? pal.gold : pal.goldLight) },
      uGain: { value: day ? 1.0 : 1.6 },
    },
  })
  const dust = new THREE.Points(dustGeo, dustMat)
  dust.frustumCulled = false
  scene.add(dust)

  /* ---------- post-effekt (faqat high) ---------- */
  const bloomBase = day ? 0.06 : 0.42
  let composer: EffectComposer | null = null
  let bloom: UnrealBloomPass | null = null
  if (high) {
    const size = renderer.getDrawingBufferSize(new THREE.Vector2())
    const rt = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: 4 })
    composer = new EffectComposer(renderer, rt)
    composer.addPass(new RenderPass(scene, camera))
    bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), bloomBase, day ? 0.4 : 0.5, day ? 0.93 : 0.86)
    composer.addPass(bloom)
    composer.addPass(new OutputPass())
  }

  /** Kadrlar sekin bo'lsa — bloom'ni o'chirib, piksel zichligini pasaytirish. */
  function degrade() {
    if (quality !== 'high') return
    quality = 'medium'
    composer?.dispose()
    composer = null
    bloom = null
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25))
    resize()
  }

  /* ---------- kamera kadrlash ---------- */
  const ctl = {
    dist: 1,
    camX: 0,
    camY: 0,
    fovMul: 1,
    rot: 0,
    sweep: -0.2,
    sweepI: 0.55,
    burst: 0,
    bloom: bloomBase,
    glow: 0,
    idle: 0,
  }
  let baseDist = 6
  let baseFov = 38
  let opening = false

  function resize() {
    const w = canvas.clientWidth || window.innerWidth
    const h = canvas.clientHeight || window.innerHeight
    renderer.setSize(w, h, false)
    const aspect = w / h
    camera.aspect = aspect
    baseFov = aspect < 0.8 ? 44 : 36
    const halfV = Math.tan(THREE.MathUtils.degToRad(baseFov / 2))
    const halfH = halfV * aspect
    baseDist = Math.max(hero.frame.h / 2 / halfV, hero.frame.w / 2 / halfH) * 1.02
    composer?.setSize(w, h)
    const pr = renderer.getPixelRatio()
    dustMat.uniforms.uPixelRatio.value = pr
    pointMats.forEach((m) => (m.uniforms.uPixelRatio.value = pr))
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

    const idle = ctl.idle
    camera.fov = baseFov * ctl.fovMul
    camera.updateProjectionMatrix()
    camera.position.set(
      ctl.camX + (pointer.x * 0.35 + Math.sin(t * 0.21) * 0.12) * idle,
      target.y - 0.12 + ctl.camY + (-pointer.y * 0.18 + Math.sin(t * 0.17) * 0.05) * idle,
      baseDist * ctl.dist,
    )
    camera.lookAt(target)

    hero.root.rotation.y = ctl.rot + (pointer.x * 0.1 + Math.sin(t * 0.35) * 0.035) * idle
    if (!opening) hero.bob.position.y = bobBase + Math.sin(t * 0.9) * 0.012 * idle

    // Yuza yaltirashi: idle'da har ~6.5 soniyada bir o'tadi
    const sweepVal = idle > 0.5 && !opening ? ((t % 6.5) / 6.5) * 1.4 - 0.2 : ctl.sweep
    for (const s of hero.sweeps) {
      s.uniforms.uSweep.value = sweepVal
      s.uniforms.uIntensity.value = ctl.sweepI
    }
    for (const g of hero.glowMats) g.m.emissiveIntensity = g.base + ctl.glow * 1.1
    hero.halo.material.opacity = hero.haloBase + ctl.glow * 0.75

    dustMat.uniforms.uTime.value = t
    dustMat.uniforms.uBurst.value = ctl.burst
    pointMats.forEach((m) => (m.uniforms.uTime.value = t))

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

    decor.update(t)

    if (composer && bloom) {
      bloom.strength = ctl.bloom
      composer.render(dt)
    } else {
      renderer.render(scene, camera)
    }
  }
  // Avval intro'ning boshlang'ich kadri bo'yicha shader'larni kompilyatsiya
  // qilamiz, keyin kadr siklini boshlaymiz
  ctl.dist = 2.1
  ctl.camX = 1.4
  ctl.camY = -0.75
  ctl.rot = -0.6
  ctl.fovMul = 1.12
  const ready = renderer
    .compileAsync(scene, camera)
    .catch(() => undefined)
    .then(() => {
      if (!disposed) raf = requestAnimationFrame(tick)
    })

  /* ---------- kino ---------- */
  const tweens: gsap.core.Animation[] = []

  function intro(): Promise<void> {
    ctl.dist = 2.1
    ctl.camX = 1.4
    ctl.camY = -0.75
    ctl.rot = -0.6
    ctl.bloom = bloomBase * 2.2
    ctl.fovMul = 1.12
    return new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve })
      tl.to(ctl, { dist: 1, camX: 0, camY: 0, fovMul: 1, duration: 3.4, ease: 'power3.out' }, 0)
        .to(ctl, { rot: 0, duration: 3.2, ease: 'power2.out' }, 0.15)
        .to(ctl, { bloom: bloomBase, duration: 2.6, ease: 'sine.out' }, 0.2)
        .fromTo(ctl, { sweep: -0.2 }, { sweep: 1.25, duration: 1.6, ease: 'power2.inOut' }, 2.0)
        .to(ctl, { idle: 1, duration: 1.4, ease: 'sine.inOut' }, 2.6)
      tweens.push(tl)
    })
  }

  function open(onFlash: () => void): Promise<void> {
    // intro hali tugamagan bo'lsa — to'xtatamiz, ochilish undan davom etadi
    tweens.forEach((tw) => tw.kill())
    opening = true
    const diveCamY = hero.diveY - (target.y - 0.12)
    return new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve })
      tl.to(ctl, { idle: 0, duration: 0.6, ease: 'sine.out' }, 0)
        .fromTo(ctl, { sweep: -0.2, sweepI: 0.55 }, { sweep: 1.3, sweepI: 1.2, duration: 1.0, ease: 'power2.inOut' }, 0)
        .to(ctl, { glow: 1, duration: 1.4, ease: 'sine.in' }, 0.15)
        .to(ctl, { burst: 1, duration: 2.5, ease: 'power2.in' }, 0.3)
        .to(ctl, { bloom: day ? 0.8 : 1.7, duration: 1.8, ease: 'sine.in' }, 0.5)
        .to(ctl, { rot: 0, camX: 0, duration: 0.8, ease: 'sine.inOut' }, 0)
        .to(ctl, { dist: 0.12, camY: diveCamY, fovMul: 0.78, duration: 2.3, ease: 'power3.in' }, 0.55)
        .call(onFlash, [], 1.95)
        .to({}, { duration: 0.6 }, 2.55)
      hero.open?.(tl)
      tweens.push(tl)
    })
  }

  /* ---------- tozalash ---------- */
  function dispose() {
    if (disposed) return
    disposed = true
    cancelAnimationFrame(raf)
    timer.dispose()
    tweens.forEach((tw) => tw.kill())
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
    owned.forEach((tx) => tx.dispose())
    envRT.dispose()
    composer?.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
  }

  return { ready, intro, open, dispose }
}
