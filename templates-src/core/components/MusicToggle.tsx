import { useEffect, useRef, useState } from 'react'
import { config } from '@config'

/**
 * Fon musiqasi tugmasi (o'ng pastda).
 * Brauzerlar avtomatik ijroni bloklaydi, shuning uchun musiqa faqat
 * foydalanuvchi konvertni ochgandan keyin (`autoplay` bayrog'i) yoqiladi.
 */
export function MusicToggle({ autoplay }: { autoplay: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  // Fayl topilmasa (404) yoki format qo'llab-quvvatlanmasa — tugmani
  // ko'rsatmaymiz. Aks holda mehmon bosadi, lekin hech narsa bo'lmaydi.
  const [broken, setBroken] = useState(false)

  // Tugma ikonkasi audio elementining O'Z holatidan olinadi.
  //
  // NEGA `play()` promise'idan emas: musiqani biz to'xtatmasak ham to'xtashi
  // mumkin — brauzer sahifa fonga o'tganda pauza qiladi, telefonda boshqa ilova
  // ovozni tortib oladi, foydalanuvchi tizim tugmasi bilan to'xtatadi. Promise'ga
  // tayanganda tugma "ijro" ko'rinishida qolib, haqiqatdan ayrilib qoladi.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const sync = () => setPlaying(!audio.paused)
    audio.addEventListener('play', sync)
    audio.addEventListener('pause', sync)
    audio.addEventListener('ended', sync)

    return () => {
      audio.removeEventListener('play', sync)
      audio.removeEventListener('pause', sync)
      audio.removeEventListener('ended', sync)
    }
  }, [])

  // Konvert ochilgach ijroni boshlaymiz (brauzer avtomatik ijroni bloklaydi,
  // shuning uchun bu foydalanuvchi harakatidan keyin bo'lishi shart).
  useEffect(() => {
    if (!autoplay) return
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.35
    // Ruxsat berilmasa — jimgina o'tkazamiz, mehmon tugmani qo'lda bosadi.
    void audio.play().catch(() => {})
  }, [autoplay])

  if (!config.music.enabled) return null

  function toggle() {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      audio.volume = 0.35
      void audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={config.music.src}
        loop
        preload="auto"
        onError={() => {
          setBroken(true)
          console.warn(`[taklifnoma] Musiqa yuklanmadi: ${config.music.src} — public/ papkasini tekshiring.`)
        }}
      />

      {!broken && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Musiqani to‘xtatish' : 'Musiqani yoqish'}
          aria-pressed={playing}
          className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full text-paper shadow-[0_10px_24px_-10px_rgba(78,16,22,0.9)] transition-transform active:scale-95"
          style={{ background: 'linear-gradient(140deg,#8b6a24,#5c2a1c 70%,#4e1016)' }}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}

          {/* Ijro paytidagi tarqaluvchi halqa */}
          {playing && (
            <span
              className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-gold/40"
              style={{ animationDuration: '2.4s' }}
              aria-hidden="true"
            />
          )}
        </button>
      )}
    </>
  )
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6.5 4.2v11.6L16 10z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <rect x="4.5" y="3.5" width="4" height="13" rx="1" />
      <rect x="11.5" y="3.5" width="4" height="13" rx="1" />
    </svg>
  )
}
