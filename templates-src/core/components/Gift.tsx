import { useState } from 'react'
import { config } from '@config'
import type { Skin } from '../lib/skin'
import { GoldButton, Reveal, ScriptTitle, Section } from '@ui'

/** To'yona: plastik karta ko'rinishi va raqamni nusxalash. */
export function Gift(skin: Skin) {
  const [copied, setCopied] = useState(false)
  const { enabled, title, cardNumber, cardHolder, copyLabel, copiedLabel } = config.gift

  if (!enabled) return null

  async function copy() {
    const plain = cardNumber.replace(/\s/g, '')
    try {
      await navigator.clipboard.writeText(plain)
    } catch {
      // Eski brauzerlar / HTTP uchun zaxira usul
      const ta = document.createElement('textarea')
      ta.value = plain
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }

  return (
    <Section skin={skin}>
      <Reveal>
        <ScriptTitle flourish={false}>{title}</ScriptTitle>
      </Reveal>

      <Reveal delay={180}>
        <div className="mt-9 rounded-2xl border border-gold/20 bg-paper-2/60 p-5">
          {/* Karta */}
          <div
            className="relative overflow-hidden rounded-2xl p-6 text-left shadow-[0_14px_34px_-20px_rgba(90,70,40,0.8)]"
            style={{ background: 'linear-gradient(140deg,#fdfaf3 0%,#f2ead9 55%,#e9dfc9 100%)' }}
          >
            {/* Yorug'lik yaltirashi */}
            <div
              className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full blur-2xl"
              style={{ background: 'radial-gradient(circle,rgba(201,169,97,0.35),transparent 70%)' }}
              aria-hidden="true"
            />

            {/* Chip */}
            <div
              className="h-9 w-12 rounded-md"
              style={{ background: 'linear-gradient(135deg,#e8cd8a,#9c7c2c)' }}
              aria-hidden="true"
            />

            <p className="mt-6 font-mono text-[1.35rem] leading-snug tracking-[0.08em] text-ink sm:text-2xl">
              {cardNumber}
            </p>

            <p className="tracking-wider-caps mt-4 font-body text-sm text-ink-soft">{cardHolder}</p>
          </div>

          <GoldButton onClick={copy} className="mt-5 rounded-full">
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? copiedLabel : copyLabel}
          </GoldButton>
        </div>
      </Reveal>
    </Section>
  )
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5.5" y="5.5" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10.5 5.5v-2a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
