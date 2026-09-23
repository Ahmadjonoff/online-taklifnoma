"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Props = {
  src: string;
  title: string;
  className?: string;
  style?: CSSProperties;
  /**
   * - `thumb`    — katalog kartasi: umuman interaktiv emas, faqat ekranga
   *                yaqinlashganda yuklanadi va uzoqlashganda o'chiriladi,
   *                gulbarglar o'chiq (`?thumb=1`).
   * - `showcase` — vitrina (bosh sahifa): interaktiv emas, scroll doim
   *                sahifaga o'tadi.
   * - `gated`    — shablon sahifasi / buyurtma: konvert ochilguncha ustida
   *                shaffof qatlam turadi (barmoq surilsa sahifa scroll
   *                bo'ladi); bosilganda bosish iframe ichiga uzatiladi va
   *                qatlam olinadi — shundan keyin shablonning o'zi scroll
   *                bo'ladi.
   */
  mode: "thumb" | "showcase" | "gated";
};

/**
 * Shablon preview'i uchun iframe.
 *
 * NEGA: telefonda iframe barmoq harakatini o'ziga oladi — sahifani surmoqchi
 * bo'lgan foydalanuvchi shablon ichini surib qoladi. Shablon faqat shablon
 * sahifasida, konvert ochilgandan keyin scroll bo'lishi kerak.
 */
export function PreviewFrame({ src, title, className, style, mode }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  // Shablon yuklanguncha qora bo'sh joy o'rniga yumshoq "yuklanmoqda" foni
  const [loaded, setLoaded] = useState(false);
  // thumb: iframe faqat ekranga yaqin bo'lganda DOM'da turadi
  const [visible, setVisible] = useState(mode !== "thumb");

  useEffect(() => {
    if (mode !== "thumb") return;
    const el = holderRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        // Qayta ko'ringanda iframe yangidan yuklanadi — fon ham qaytsin
        if (!entry.isIntersecting) setLoaded(false);
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  // Qatlamga bosilganda — aynan o'sha nuqtadagi element iframe ichida bosiladi
  // (iframe same-origin, shu sababli contentDocument ochiq). Konvertlar
  // `onClick` bilan ochiladi, `click()` React'ning hodisasiga yetib boradi.
  function forwardTap(e: React.MouseEvent<HTMLDivElement>) {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (iframe && doc) {
      const rect = iframe.getBoundingClientRect();
      const target = doc.elementFromPoint(e.clientX - rect.left, e.clientY - rect.top);
      if (target && "click" in target) (target as HTMLElement).click();
    }
    setOpened(true);
  }

  const frameSrc = mode === "thumb" ? `${src}${src.includes("?") ? "&" : "?"}thumb=1` : src;
  const interactive = mode === "gated" && opened;

  return (
    <div ref={holderRef} className="relative h-full w-full">
      {visible && (
        <iframe
          ref={iframeRef}
          src={frameSrc}
          title={title}
          loading="lazy"
          className={`${className ?? ""} ${interactive ? "" : "pointer-events-none"}`}
          style={style}
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setLoaded(true)}
          tabIndex={mode === "gated" ? undefined : -1}
          // Klaviatura bilan iframe ichiga o'tilsa — qatlam xalaqit bermasin
          onFocus={() => setOpened(true)}
        />
      )}
      {visible && !loaded && (
        <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-b from-stone-200 via-stone-100 to-stone-200" aria-hidden="true" />
      )}
      {mode === "gated" && !opened && (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={forwardTap}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
