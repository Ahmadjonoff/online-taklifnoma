import { useEffect, useRef, useState } from 'react'
import { config } from '../config'
import { lockScroll } from '@core/lib/scrollLock'
import { detectQuality } from '../three/quality'
import { loadFonts, plaqueText, readPalette } from '../three/content'
import type { Stage } from '../three/scene'
import { Envelope } from './Envelope'
import './cinematic.css'

type Phase = 'loading' | 'intro' | 'ready' | 'opening' | 'flash' | 'fade' | 'gone' | 'fallback'

/**
 * Kinematik 3D ochilish ekrani.
 *
 * Bosqichlar:
 *   loading → poster (CSS) ko'rinadi, three.js fonda yuklanadi
 *   intro   → kamera sahnaga kirib keladi (tugmani bosish mumkin)
 *   ready   → «Ochish uchun bosing»
 *   opening → ochilish kinosi; musiqa shu bosish bilan yoqiladi
 *   flash   → oq-oltin chaqnash ekranni qoplaydi, sahna tozalanadi
 *   fade    → chaqnash so'nib, taklifnoma ko'rinadi
 *
 * WebGL yo'q, «kamroq harakat» tanlangan yoki kontekst yo'qolgan bo'lsa —
 * oddiy CSS konvert (`Envelope`) ko'rsatiladi.
 */
export function CinematicOpening({ onOpen }: { onOpen: () => void }) {
  const [quality] = useState(detectQuality)
  const [phase, setPhase] = useState<Phase>(quality === 'off' ? 'fallback' : 'loading')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef<Stage | null>(null)
  const openedRef = useRef(false)

  const covering = phase !== 'gone' && phase !== 'fade' && phase !== 'fallback'

  // Ochilmaguncha sahifa aylanmasin
  useEffect(() => {
    if (!covering) return
    return lockScroll()
  }, [covering])

  // Sahnani yaratish va tozalash — bitta effektda (StrictMode'da ham to'g'ri)
  useEffect(() => {
    if (quality === 'off') return
    let cancelled = false
    ;(async () => {
      try {
        const text = plaqueText()
        const [, mod] = await Promise.all([loadFonts(text), import('../three/scene')])
        if (cancelled || !canvasRef.current) return
        const stage = mod.createStage({
          canvas: canvasRef.current,
          quality,
          palette: readPalette(),
          text,
          onContextLost: () => {
            if (openedRef.current) return
            stageRef.current?.dispose()
            stageRef.current = null
            setPhase('fallback')
          },
        })
        stageRef.current = stage
        setPhase('intro')
        await stage.intro()
        if (!cancelled) setPhase((p) => (p === 'intro' ? 'ready' : p))
      } catch (err) {
        console.error('[cinematic-3d]', err)
        if (!cancelled) setPhase('fallback')
      }
    })()
    return () => {
      cancelled = true
      stageRef.current?.dispose()
      stageRef.current = null
    }
  }, [quality])

  function open() {
    const stage = stageRef.current
    if (!stage || openedRef.current || (phase !== 'intro' && phase !== 'ready')) return
    openedRef.current = true
    onOpen() // musiqa foydalanuvchi bosganidan keyin yoqiladi (brauzer talabi)
    setPhase('opening')
    stage
      .open(() => setPhase('flash'))
      .then(() => {
        stage.dispose()
        stageRef.current = null
        setPhase('fade')
        window.setTimeout(() => setPhase('gone'), 1100)
      })
  }

  if (phase === 'fallback') return <Envelope onOpen={onOpen} />
  if (phase === 'gone') return null

  const kicker = (config as { envelope?: { kicker?: string } }).envelope?.kicker
  const showCanvas = phase !== 'loading' && phase !== 'fade'
  const showCta = phase === 'ready'
  const flashOn = phase === 'flash'

  return (
    <div
      className="fixed inset-0 z-50 select-none overflow-hidden"
      style={{ pointerEvents: phase === 'fade' ? 'none' : 'auto', cursor: covering ? 'pointer' : 'default' }}
      onClick={open}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
      role="button"
      tabIndex={0}
      aria-label="Taklifnomani ochish"
    >
      {/* Poster: three.js yuklanguncha */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000"
        style={{
          opacity: phase === 'loading' ? 1 : 0,
          background:
            'radial-gradient(ellipse at 50% 42%, var(--tpl-grad-b) 0%, var(--tpl-grad-a) 62%, #05030a 100%)',
        }}
        aria-hidden="true"
      >
        <div className="cine-spinner" />
        <p className="mt-6 font-script text-4xl text-gilded">
          {config.couple.groom} &amp; {config.couple.bride}
        </p>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-[1400ms]"
        style={{ opacity: showCanvas ? 1 : 0, touchAction: 'none' }}
      />

      {/* Yuqori va pastki matn (HTML — o'qilishi va tarjima uchun) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-[max(1.25rem,env(safe-area-inset-top))] transition-opacity duration-700"
        style={{ opacity: phase === 'intro' || phase === 'ready' ? 1 : 0 }}
      >
        {kicker && <p className="tracking-wider-caps text-xs text-gold-light/85 cine-fade-down">{kicker}</p>}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-[max(2rem,env(safe-area-inset-bottom))] transition-opacity duration-700"
        style={{ opacity: showCta ? 1 : 0 }}
      >
        <span className="cine-tap" aria-hidden="true" />
        <p className="tracking-wider-caps text-[0.7rem] text-gold-light">Ochish uchun bosing</p>
      </div>

      {/* Chaqnash: kamera arka ichiga kirganda ekranni qoplaydi */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: flashOn ? 1 : 0,
          transition: flashOn ? 'opacity 650ms ease-in' : 'opacity 1000ms ease-out',
          background:
            'radial-gradient(circle at 50% 45%, #fffaf0 0%, var(--color-gold-light) 38%, var(--color-gold) 70%, var(--tpl-grad-b) 100%)',
        }}
      />
    </div>
  )
}
