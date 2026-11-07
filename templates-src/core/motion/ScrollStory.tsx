import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { startParticles } from './particles'
import type { MotionConfig, SectionFx } from './types'
import './motion.css'

export type StoryItem = { key: string; node: ReactNode }

const reducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scroll'ga bog'langan taklifnoma sahifasi.
 *
 * Tuzilishi:
 *   .mo-backdrop (fixed)  — har bir sahna uchun bitta qatlam, scroll bilan almashadi
 *   canvas (fixed)        — zarrachalar (gulbarg, oltin chang, fonar, yulduz)
 *   .mo-story             — bo'limlar (foni shaffof — orqadagi sahna ko'rinadi)
 *
 * NEGA REACT STATE EMAS: scroll har kadrda o'zgaradi. Holatni React orqali
 * o'tkazsak butun sahifa qayta render bo'lardi; bu yerda esa bitta rAF
 * ichida faqat kerakli elementlarning atributi / CSS o'zgaruvchisi yoziladi
 * (avval hamma o'qishlar, keyin yozishlar — layout «thrashing» yo'q).
 */
export function ScrollStory({ motion, items, active }: { motion: MotionConfig; items: StoryItem[]; active: boolean }) {
  const storyRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Har bir bo'lim qaysi sahnaga tegishli (mijoz o'chirgan bo'limlar hisobga olinadi)
  const keys = items.map((i) => i.key).join('|')
  const { scenes, sceneOf } = useMemo(() => {
    const order = keys.split('|')
    const starts = motion.scenes
      .map((s) => {
        const from = Array.isArray(s.from) ? s.from : [s.from]
        const at = Math.min(...from.map((k) => order.indexOf(k)).filter((i) => i >= 0))
        return { scene: s, at }
      })
      .filter((s) => Number.isFinite(s.at))
      .sort((a, b) => a.at - b.at)
    if (!starts.length || starts[0].at > 0) starts.unshift({ scene: { from: order[0], tone: 'paper' }, at: 0 })
    const map = order.map((_, i) => {
      let idx = 0
      starts.forEach((s, j) => {
        if (s.at <= i) idx = j
      })
      return idx
    })
    return { scenes: starts.map((s) => s.scene), sceneOf: map }
  }, [keys, motion.scenes])

  useEffect(() => {
    const story = storyRef.current
    const backdrop = backdropRef.current
    if (!story || !backdrop || !active) return
    const reduce = reducedMotion()
    const secs = [...story.children] as HTMLElement[]
    const layers = [...backdrop.children].filter((c) => c.classList.contains('mo-layer')) as HTMLElement[]
    const scrubbed = secs.map((s) => s.dataset.key === 'hero' || s.hasAttribute('data-fold'))
    let current = -1
    let raf = 0
    let lastY = window.scrollY
    const particles =
      !reduce && canvasRef.current && motion.particles && motion.particles !== 'none'
        ? startParticles(canvasRef.current, motion.particles)
        : null

    const setScene = (sc: number) => {
      if (sc === current) return
      current = sc
      // Qatlamlar ustma-ust: yangi sahna oldingisini yopadi, yuqoriga qaytganda ochadi
      layers.forEach((l, j) => (l.dataset.on = String(j <= sc)))
    }

    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const y = window.scrollY
      // 1) o'qishlar
      const rects = secs.map((s) => s.getBoundingClientRect())
      const docH = document.documentElement.scrollHeight
      // 2) faol sahna: ekranning ~55% chizig'idagi bo'lim
      const line = vh * 0.55
      let idx = rects.findIndex((r) => r.top <= line && r.bottom > line)
      if (idx < 0) idx = rects.length && rects[0].top > line ? 0 : secs.length - 1
      // 3) yozishlar
      setScene(sceneOf[idx] ?? 0)
      if (!reduce) {
        rects.forEach((r, i) => {
          if (!scrubbed[i] || r.bottom < -vh || r.top > vh * 2) return
          const out = Math.min(1, Math.max(0, -r.top / Math.max(r.height, 1)))
          secs[i].style.setProperty('--out', out.toFixed(3))
        })
        backdrop.style.setProperty('--sp', (y / Math.max(1, docH - vh)).toFixed(4))
      }
      particles?.nudge(y - lastY)
      lastY = y
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      particles?.stop()
    }
  }, [active, sceneOf, motion.particles])

  const fxOf = (key: string): SectionFx => motion.fx?.[key] ?? 'rise'

  return (
    <>
      <div ref={backdropRef} className="mo-backdrop" data-transition={motion.transition} aria-hidden="true">
        {scenes.map((s, j) => (
          <div key={j} className="mo-layer" data-tone={s.tone} data-on={j === 0 ? 'true' : 'false'} style={{ zIndex: j }}>
            {s.art && s.art !== 'none' && <div className="mo-art" data-art={s.art} />}
          </div>
        ))}
      </div>
      <canvas ref={canvasRef} className="mo-particles" aria-hidden="true" />
      <div ref={storyRef} className="mo-story">
        {items.map(({ key, node }) => (
          <div key={key} className="mo-sec" data-key={key} data-fx={fxOf(key)} data-fold={motion.fold && key !== 'hero' && key !== 'footer' ? '' : undefined}>
            {node}
          </div>
        ))}
      </div>
    </>
  )
}
