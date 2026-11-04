/**
 * 3D sahna uchun umumiy turlar va yordamchilar.
 *
 * Har bir shablon `config.scene3d` da o'z sahnasini tanlaydi: markaziy obyekt
 * (`hero`), kayfiyat (`mood`) va bezaklar. Dvigatel (`scene.ts`) bitta.
 */
import * as THREE from 'three'
import type { ArchKind, Palette, PlaqueText } from './textures'

export type HeroKind = 'mehrab' | 'arch' | 'medallion' | 'card' | 'giftbox'

export type Scene3D = {
  /** Markaziy obyekt */
  hero: HeroKind
  /** night — qorong'i zal, sham va fonar nuri; day — yorug', havodor */
  mood: 'night' | 'day'
  lanterns?: boolean
  candles?: boolean
  flowers?: 'hydrangea' | 'rose' | 'none'
  /** Osmonda hilol va yulduzlar */
  moon?: boolean
  /** Orqada gullardan yasalgan arka */
  floralArch?: boolean
  /** Orqada butun fonni qoplaydigan gul devori (to'y fotozonasidagi kabi) */
  flowerWall?: boolean
  /** Pol o'rniga atlas mato */
  drape?: boolean
  /** Oldinda marvarid shodalari */
  pearls?: boolean
  /** Medalyondagi arabcha yozuv (masalan, Bismillah) */
  arabic?: string
  /** Kartadagi sarlavha («Save the Date») */
  headline?: string
}

export const DEFAULT_SCENE: Scene3D = {
  hero: 'mehrab',
  mood: 'night',
  lanterns: true,
  candles: true,
  flowers: 'hydrangea',
}

/** Sahna qismlarini quruvchi funksiyalarga beriladigan kontekst. */
export type Kit = {
  scene: THREE.Scene
  pal: Palette
  text: PlaqueText
  cfg: Scene3D
  high: boolean
  day: boolean
  /** Teksturani ro'yxatga oladi — sahna yopilganda tozalanadi. */
  own<T extends THREE.Texture>(t: T): T
}

export function tex(c: HTMLCanvasElement, srgb = true) {
  const t = new THREE.CanvasTexture(c)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

export function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

/** Arka konturi — canvas'dagi `archPath` bilan aynan bir xil proporsiya. */
export function archShape(kind: ArchKind, w: number, h: number, arch: number) {
  const s = new THREE.Shape()
  s.moveTo(-w / 2, 0)
  if (kind === 'round') {
    s.lineTo(-w / 2, h - w / 2)
    s.absarc(0, h - w / 2, w / 2, Math.PI, 0, true)
  } else {
    s.lineTo(-w / 2, h - arch)
    s.bezierCurveTo(-w / 2, h - arch * 0.45, -w / 2 + w * 0.38, h - arch * 0.32, 0, h)
    s.bezierCurveTo(w / 2 - w * 0.38, h - arch * 0.32, w / 2, h - arch * 0.45, w / 2, h - arch)
  }
  s.lineTo(w / 2, 0)
  s.closePath()
  return s
}

/** ShapeGeometry UV'larini 0..1 ga keltirish — canvas tekstura to'liq sig'sin. */
export function normalizedShapeGeometry(shape: THREE.Shape, w: number, h: number) {
  const g = new THREE.ShapeGeometry(shape, 64)
  const pos = g.attributes.position
  const uv = g.attributes.uv
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + w / 2) / w, pos.getY(i) / h)
  uv.needsUpdate = true
  return g
}

/* ------------------------------------------------------------------ */
/*  Nur chizig'i — yuza ustidan o'tadigan «yaltirash»                   */
/* ------------------------------------------------------------------ */

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
    float t = vUv.x * 0.55 + vUv.y * 0.85;
    float band = exp(-pow((t - uSweep * 1.7 + 0.2) / 0.07, 2.0));
    float soft = exp(-pow((t - uSweep * 1.7 + 0.2) / 0.3, 2.0)) * 0.25;
    vec3 c = mix(uColor, vec3(1.0), 0.6);
    gl_FragColor = vec4(c, (band + soft) * uIntensity);
  }
`

export function makeSweep(geo: THREE.BufferGeometry, color: string) {
  const mat = new THREE.ShaderMaterial({
    vertexShader: SWEEP_VS,
    fragmentShader: SWEEP_FS,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uSweep: { value: -0.2 },
      uIntensity: { value: 0.55 },
      uColor: { value: new THREE.Color(color) },
    },
  })
  return { mesh: new THREE.Mesh(geo, mat), mat }
}

export function additiveSprite(map: THREE.Texture, opacity = 1) {
  return new THREE.Sprite(
    new THREE.SpriteMaterial({
      map,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity,
    }),
  )
}

export function goldMaterial(color: string, roughness = 0.26) {
  return new THREE.MeshStandardMaterial({ color, metalness: 1, roughness })
}

/**
 * Tilla folga yuzasi: canvas'dagi oltin chiziqlar metall bo'lib yaltiraydi.
 * Kunduzgi (yorug') sahnada to'liq metall oq atrofni aks ettirib, yozuv
 * o'qilmay qoladi — shuning uchun u yerda metallik pasaytiriladi.
 */
export function foilMaterial(map: THREE.Texture, pal: Palette, emissive = 0.06, day = false) {
  return new THREE.MeshStandardMaterial({
    map,
    transparent: true,
    metalness: day ? 0 : 1,
    roughness: day ? 0.6 : 0.26,
    emissive: new THREE.Color(pal.gold),
    emissiveMap: map,
    emissiveIntensity: day ? 0 : emissive,
    envMapIntensity: day ? 0.3 : 1.5,
    depthWrite: false,
  })
}
