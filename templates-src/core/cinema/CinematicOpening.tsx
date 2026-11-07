import { useEffect, useRef, useState, type ReactNode } from 'react'
import { config } from '@config'
import { lockScroll } from '@core/lib/scrollLock'
import { detectQuality } from './quality'
import { loadFonts, plaqueText, readPalette, sceneConfig } from './content'
import type { Stage } from './scene'
import './cinematic.css'

type Phase = 'loading' | 'intro' | 'ready' | 'opening' | 'flash' | 'fade' | 'gone' | 'fallback'

/**
 * 3D chunk va shriftlarni modul yuklanishi bilanoq so'raymiz — React render
 * va effektni kutmasdan (sekin telefonda bu ~0.3–0.8 s yutuq). Sifat `off`
 * bo'lsa (WebGL yo'q / kamroq harakat) hech narsa yuklanmaydi.
 */
const initialQuality = detectQuality()
const early =
  initialQuality === 'off'
    ? null
    : (() => {
        const scene = sceneConfig()
        const text = plaqueText()
        return { scene, text, mod: import('./scene'), fonts: loadFonts(text, scene) }
      })()

/** Intro boshlangandan keyin «Ochish uchun bosing» qancha kutadi (ms). */
const CTA_DELAY = 1300

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
 * shablonning oddiy CSS konverti (`fallback`) ko'rsatiladi.
 *
 * Sahna turi (mehrob, medalyon, karta, quti ...) `config.scene3d` dan olinadi.
 */
export function CinematicOpening({
  onOpen,
  fallback,
  onPrimed,
}: {
  onOpen: () => void
  fallback: ReactNode
  /**
   * Taklifnoma (asosiy kontent) qachon render qilinsin. 3D chunk kelguncha
   * galereya suratlari u bilan tarmoqni bo'lishmasin — shu sabab kontent
   * chunk kelib, sahna shader'lari fonda kompilyatsiya bo'layotganda (asosiy
   * oqim bo'sh) chiqariladi. WebGL bo'lmasa — darhol.
   */
  onPrimed?: () => void
}) {
  const [quality] = useState(initialQuality)
  const [scene] = useState(() => early?.scene ?? sceneConfig())
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
  const primedRef = useRef(false)
  const onPrimedRef = useRef(onPrimed)
  useEffect(() => {
    onPrimedRef.current = onPrimed
  }, [onPrimed])
  const primed = () => {
    if (primedRef.current) return
    primedRef.current = true
    onPrimedRef.current?.()
  }
  useEffect(() => {
    if (phase === 'fallback') primed()
  })

  useEffect(() => {
    if (quality === 'off') return
    let cancelled = false
    let ctaTimer = 0
    ;(async () => {
      try {
        const text = early?.text ?? plaqueText()
        const [, mod] = await Promise.all([early?.fonts ?? loadFonts(text, scene), early?.mod ?? import('./scene')])
        if (cancelled || !canvasRef.current) return
        const stage = mod.createStage({
          canvas: canvasRef.current,
          quality,
          palette: readPalette(scene),
          text,
          scene,
          onContextLost: () => {
            if (openedRef.current) return
            stageRef.current?.dispose()
            stageRef.current = null
            setPhase('fallback')
          },
        })
        stageRef.current = stage
        primed()
        await stage.ready
        if (cancelled) return
        setPhase('intro')
        // Tugma intro oxirini kutmaydi — kamera hali yaqinlashayotganda chiqadi
        ctaTimer = window.setTimeout(() => setPhase((p) => (p === 'intro' ? 'ready' : p)), CTA_DELAY)
        await stage.intro()
        if (!cancelled) setPhase((p) => (p === 'intro' ? 'ready' : p))
      } catch (err) {
        console.error('[cinematic-3d]', err)
        if (!cancelled) setPhase('fallback')
      }
    })()
    return () => {
      cancelled = true
      window.clearTimeout(ctaTimer)
      stageRef.current?.dispose()
      stageRef.current = null
    }
  }, [quality, scene])

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

  if (phase === 'fallback') return <>{fallback}</>
  if (phase === 'gone') return null

  const kicker = (config as { envelope?: { kicker?: string } }).envelope?.kicker
  const showCanvas = phase !== 'loading' && phase !== 'fade'
  const showCta = phase === 'ready'
  const flashOn = phase === 'flash'

  return (
    <div
      className={`fixed inset-0 z-50 select-none overflow-hidden ${scene.mood === 'day' ? 'cine-day' : ''}`}
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
            scene.mood === 'day'
              ? 'radial-gradient(ellipse at 50% 42%, #ffffff 0%, var(--tpl-scene-b, var(--tpl-grad-b)) 55%, var(--tpl-scene-a, var(--tpl-grad-a)) 100%)'
              : 'radial-gradient(ellipse at 50% 42%, var(--tpl-scene-b, var(--tpl-grad-b)) 0%, var(--tpl-scene-a, var(--tpl-grad-a)) 62%, #05030a 100%)',
        }}
        aria-hidden="true"
      >
        <div className="cine-spinner" />
        <p className="mt-6 font-script text-4xl text-gilded">
          {config.couple.groom} &amp; {config.couple.bride}
        </p>
      </div>

      {/* `fade` da canvas darhol yashiriladi: sahna yopilganda WebGL konteksti
          o'chiriladi (forceContextLoss) va Chrome konteksti yo'qolgan canvas
          o'rniga «qayg'u yuzli» belgi chizadi — u so'nayotgan canvas ichida
          mehmonga ko'rinib qolardi. Bu paytda chaqnash ekranni to'liq yopib turadi. */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-[1400ms]"
        style={{ opacity: showCanvas ? 1 : 0, visibility: phase === 'fade' ? 'hidden' : 'visible', touchAction: 'none' }}
      />

      {/* Yuqori va pastki matn (HTML — o'qilishi va tarjima uchun) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-[max(1.25rem,env(safe-area-inset-top))] transition-opacity duration-700"
        style={{ opacity: phase === 'intro' || phase === 'ready' ? 1 : 0 }}
      >
        {kicker && <p className="cine-label tracking-wider-caps text-xs cine-fade-down">{kicker}</p>}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-[max(2rem,env(safe-area-inset-bottom))] transition-opacity duration-700"
        style={{ opacity: showCta ? 1 : 0 }}
      >
        <span className="cine-tap" aria-hidden="true" />
        <p className="cine-label tracking-wider-caps text-[0.7rem]">Ochish uchun bosing</p>
      </div>

      {/* Chaqnash: kamera arka ichiga kirganda ekranni qoplaydi */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: flashOn ? 1 : 0,
          transition: flashOn ? 'opacity 650ms ease-in' : 'opacity 1000ms ease-out',
          background:
            'radial-gradient(circle at 50% 45%, #fffaf0 0%, var(--color-gold-light) 38%, var(--color-gold) 70%, var(--tpl-scene-b, var(--tpl-grad-b)) 100%)',
        }}
      />
    </div>
  )
}
