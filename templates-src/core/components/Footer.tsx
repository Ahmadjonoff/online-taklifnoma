import { config } from '@config'
import { bgClass, topEdge, type Skin } from '../lib/skin'
import { FloralCorner, Ornament } from '@decor/Floral'
import { TornEdge } from '@decor/TornEdge'
import { Reveal } from '@ui'

/** Yakuniy bo'lim: xayrlashuv so'zi, rasm va imzo. */
export function Footer(skin: Skin) {
  const { title, signature, photo } = config.footer
  const { groom, bride } = config.couple
  const sign = signature || `${groom} va ${bride}`
  const edge = topEdge(skin)

  return (
    <footer className={`paper-grain relative overflow-hidden px-6 pb-16 pt-24 ${bgClass(skin.bg)}`}>
      {edge && <TornEdge position="top" color={edge} />}

      <FloralCorner id="ft-l" position="tl" className="w-[38vw] max-w-[200px]" opacity={0.75} />
      <FloralCorner id="ft-r" position="tr" className="w-[38vw] max-w-[200px]" opacity={0.75} />

      <div className="relative z-20 mx-auto w-full max-w-lg text-center">
        <Reveal>
          <h2 className="font-script text-gilded text-[2.6rem] leading-tight sm:text-5xl">{title}</h2>
          <p className="mt-3 font-display text-2xl text-gold sm:text-3xl">{sign}</p>
        </Reveal>

        {photo && (
          <Reveal delay={200}>
            <img
              src={photo}
              alt={`${groom} va ${bride}`}
              loading="lazy"
              className="mt-9 w-full rounded-lg object-cover shadow-[0_18px_40px_-24px_rgba(90,70,40,0.9)]"
            />
          </Reveal>
        )}

        <Reveal delay={320}>
          <Ornament className="mx-auto mt-12 text-gold/35" width={170} />
          <p className="tracking-wider-caps mt-5 font-body text-xs text-ink-soft/60">
            {config.event.dateLabel}
          </p>
        </Reveal>

        <Promo />
      </div>
    </footer>
  )
}

type PromoConfig = {
  enabled?: boolean
  title?: string
  text?: string
  siteUrl?: string
  siteLabel?: string
  telegramUrl?: string
  instagramUrl?: string
}

/**
 * Platforma reklamasi: mehmon ham shunday taklifnoma buyurtma qila olsin.
 * Qiymatlar platformadan (`config.promo`) keladi — shablon ranglarida,
 * taklifnomaning o'zidan ajralib turadigan, lekin bezovta qilmaydigan blok.
 */
function Promo() {
  const promo = (config as unknown as { promo?: PromoConfig }).promo
  if (!promo?.enabled) return null

  const links = [
    promo.siteUrl && { href: promo.siteUrl, label: promo.siteLabel || 'Sayt', icon: '✦' },
    promo.telegramUrl && { href: promo.telegramUrl, label: 'Telegram', icon: '✈' },
    promo.instagramUrl && { href: promo.instagramUrl, label: 'Instagram', icon: '◎' },
  ].filter(Boolean) as { href: string; label: string; icon: string }[]

  return (
    <aside className="mt-14 rounded-2xl border border-gold/25 bg-paper-2/60 px-5 py-6 backdrop-blur-sm">
      <p className="font-display text-lg text-ink">{promo.title}</p>
      {promo.text && <p className="mt-1.5 font-body text-sm text-ink-soft">{promo.text}</p>}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-4 py-2 font-body text-xs tracking-wide text-gold transition hover:bg-gold hover:text-paper"
          >
            <span aria-hidden="true">{l.icon}</span>
            {l.label}
          </a>
        ))}
      </div>
    </aside>
  )
}
