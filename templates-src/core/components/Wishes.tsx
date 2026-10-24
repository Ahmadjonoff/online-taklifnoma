import { useEffect, useState } from 'react'
import { config } from '@config'
import { bgClass, topEdge, type Skin } from '../lib/skin'
import { fetchWishes, isPreviewContext, submitWish, type WishItem } from '../lib/wishes'
import { TornEdge } from '@decor/TornEdge'
import { GoldButton, Reveal, ScriptTitle } from '@ui'

type Status = 'idle' | 'sending' | 'done' | 'error'

type WishesConfig = {
  enabled?: boolean
  title?: string
  namePlaceholder?: string
  messagePlaceholder?: string
  submitLabel?: string
  successText?: string
}

const FALLBACK_WISHES: WishItem[] = [
  { id: -1, guestName: 'Nodira', message: 'Sizlarga katta baxt tilayman! Quvnoq kunlar yetib borsin.', createdAt: '' },
  { id: -2, guestName: 'Jasur', message: 'Muborak bo\'lsin! Umringiz uzun, kunlaringiz quyoshli bo\'lsin.', createdAt: '' },
  { id: -3, guestName: 'Aziza', message: 'Quvonchingizga quvonaman. Do\'moq do\'st bo\'ling!', createdAt: '' },
]

/** Tilaklar daftari — mehmonlar xabar qoldiradi va boshqalarni o'qiydi. */
export function Wishes(skin: Skin) {
  const edge = topEdge(skin)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [wishes, setWishes] = useState<WishItem[] | null>(null)
  const preview = isPreviewContext()

  // Ko'p shablonlarning config-default'ida matnlar yo'q (server faqat
  // `enabled` yuboradi) — standart qiymatlar shu yerda
  const wc = ((config as unknown as { wishes?: WishesConfig }).wishes ?? {}) as WishesConfig
  const enabled = wc.enabled !== false
  const title = wc.title || 'Tilaklar daftari'
  const namePlaceholder = wc.namePlaceholder || 'Ismingiz'
  const messagePlaceholder = wc.messagePlaceholder || 'Xabaringizni yozing'
  const submitLabel = wc.submitLabel || 'Xabar yuborish'
  const successText = wc.successText || 'Tilagingiz uchun rahmat!'

  // Tilaklarni yuklash. Namunaviy tilaklar FAQAT preview'da — haqiqiy
  // taklifnomada hali tilak bo'lmasa, mehmonlarga soxta tilaklar ko'rsatilmaydi.
  useEffect(() => {
    if (!enabled) return
    let alive = true
    fetchWishes().then((items) => {
      if (!alive) return
      setWishes(preview && items.length === 0 ? FALLBACK_WISHES : items)
    })
    return () => {
      alive = false
    }
  }, [enabled, preview])

  if (!enabled) return null

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim() || status === 'sending') return

    setStatus('sending')
    try {
      await submitWish(name.trim(), message.trim())
      setStatus('done')
      setName('')
      setMessage('')
      // Ro'yxatni yangilash
      fetchWishes().then((items) => setWishes(items))
      window.setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className={`paper-grain relative overflow-hidden px-6 py-24 ${bgClass(skin.bg)}`}>
      {edge && <TornEdge position="top" color={edge} />}

      <div className="relative z-20 mx-auto w-full max-w-lg text-center">
        <Reveal>
          <ScriptTitle flourish={false}>{title}</ScriptTitle>
        </Reveal>

        {/* Tilaklar galereyasi */}
        {wishes !== null && wishes.length > 0 && (
          <Reveal delay={120}>
            <div className="mt-10 space-y-3.5 text-left">
              {wishes.slice(0, 12).map((w, i) => (
                <div
                  key={w.id}
                  className="rounded-2xl border border-gold/20 bg-paper/70 p-5 shadow-[0_2px_14px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-0.5"
                  style={{ animation: `reveal-up 0.6s ease-out ${0.08 * i}s both` }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 font-display text-sm text-gold-dark">
                      {w.guestName.trim().charAt(0).toUpperCase()}
                    </span>
                    <p className="font-display text-sm tracking-wide text-gold-dark">{w.guestName}</p>
                    <svg width="13" height="13" viewBox="0 0 20 20" fill="none" className="ml-auto text-gold/50" aria-hidden="true">
                      <path d="M10 2.5l1.9 4.4 4.8.4-3.6 3.1 1.1 4.7L10 12.6l-4.2 2.5 1.1-4.7L3.3 7.3l4.8-.4L10 2.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="mt-2.5 font-body text-[1.02rem] leading-relaxed text-ink-soft">«{w.message}»</p>
                </div>
              ))}
            </div>
            {wishes.length > 12 && (
              <p className="mt-4 font-body text-sm text-ink-soft/60">
                va yana {wishes.length - 12} ta tilak...
              </p>
            )}
          </Reveal>
        )}

        <Reveal delay={180}>
          <div className="mt-9 rounded-2xl border border-gold/20 bg-paper/70 p-5">
            {preview ? (
              <p className="py-4 text-center font-body text-sm text-ink-soft">
                Bu — namuna. Tilaklar faqat haqiqiy (sotib olingan) taklifnomada saqlanadi.
              </p>
            ) : status === 'done' ? (
              <div className="py-12">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </div>
                <p className="mt-4 font-script text-gilded text-3xl">{successText}</p>
              </div>
            ) : (
              <form onSubmit={send} className="space-y-3.5">
                <p className="font-body text-lg text-ink-soft">Siz ham tilak qoldiring ✍️</p>
                <IconInput icon={<UserIcon />}>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={namePlaceholder}
                    className={fieldClass}
                  />
                </IconInput>

                <IconInput icon={<ChatIcon />} align="start">
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={messagePlaceholder}
                    className={`${fieldClass} resize-none`}
                  />
                </IconInput>

                {status === 'error' && (
                  <p className="font-body text-[0.95rem] text-wine">
                    Yuborishda xatolik. Iltimos, qaytadan urinib ko‘ring.
                  </p>
                )}

                <GoldButton
                  type="submit"
                  disabled={status === 'sending'}
                  className="rounded-full bg-[linear-gradient(100deg,var(--color-gold-dark),var(--color-gold),var(--color-wine))]"
                >
                  {status === 'sending' ? 'Yuborilmoqda...' : submitLabel}
                  <SendIcon />
                </GoldButton>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const fieldClass =
  'w-full bg-transparent font-body text-lg text-ink placeholder:text-ink-soft/55 outline-none'

function IconInput({
  icon,
  children,
  align = 'center',
}: {
  icon: React.ReactNode
  children: React.ReactNode
  align?: 'center' | 'start'
}) {
  return (
    <div
      className={`flex gap-3 rounded-2xl border border-gold/20 bg-paper-2/70 px-4 py-3.5 transition-colors focus-within:border-gold/55 ${
        align === 'start' ? 'items-start' : 'items-center'
      }`}
    >
      <span className={`shrink-0 text-ink-soft/50 ${align === 'start' ? 'mt-1' : ''}`}>{icon}</span>
      {children}
    </div>
  )
}

function UserIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="6.5" r="3.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3.5 17c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 5.5A2.5 2.5 0 0 1 5.5 3h9A2.5 2.5 0 0 1 17 5.5v6A2.5 2.5 0 0 1 14.5 14H8l-4 3.2V14h-.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M17.5 2.5L9 11M17.5 2.5l-5.5 15-3-6.5-6.5-3 15-5.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}
