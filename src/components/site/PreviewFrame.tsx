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
   * - `showcase` — vitrina (bosh sahifa).
   *   Ikkalasi ham rasmdek qotib turadi (`?static=1`): shablon ichida scroll
   *   yo'q, konvert ochilmaydi, ustida doim shaffof qatlam — barmoq surilsa
   *   sahifaning o'zi scroll bo'ladi.
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

  // Server'da chizilgan iframe React ulanmasidan oldin yuklanib bo'lishi
  // mumkin — unda `onLoad` o'tkazib yuboriladi va kulrang fon qolib ketadi
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (doc?.readyState === "complete" && doc.URL !== "about:blank") setLoaded(true);
  }, [visible]);

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
  // Shablon hali yuklanmagan bo'lsa qatlam turaveradi — aks holda konvert
  // yopiq holda iframe barmoqni o'ziga olib, sahifa scroll'i to'xtab qolardi.
  function forwardTap(e: React.MouseEvent<HTMLDivElement>) {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!loaded || !iframe || !doc) return;
    const rect = iframe.getBoundingClientRect();
    const target = doc.elementFromPoint(e.clientX - rect.left, e.clientY - rect.top);
    if (!target || !("click" in target)) return;
    (target as HTMLElement).click();
    setOpened(true);
  }

  const still = mode !== "gated";
  const sep = src.includes("?") ? "&" : "?";
  const frameSrc =
    mode === "thumb" ? `${src}${sep}thumb=1&static=1` : still ? `${src}${sep}static=1` : src;
  const interactive = mode === "gated" && opened;

  return (
    <div ref={holderRef} className="relative h-full w-full">
      {visible && (
        <iframe
          ref={iframeRef}
          src={frameSrc}
          title={title}
          // loading="lazy" YO'Q: Chrome qayta yaratilgan (key o'zgargan)
          // iframe'ni yuklamay qo'yardi — preview kulrang bo'lib qolardi.
          // Katalogda iframe baribir faqat ekranga yaqinlashganda qo'yiladi.
          className={`${className ?? ""} ${interactive ? "" : "pointer-events-none"}`}
          style={style}
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setLoaded(true)}
          tabIndex={still ? -1 : undefined}
          // Vitrina: brauzer uchun ham "jonsiz" — fokus, bosish, scroll yo'q
          inert={still}
          scrolling={still ? "no" : undefined}
          // Klaviatura bilan iframe ichiga o'tilsa — qatlam xalaqit bermasin
          onFocus={() => setOpened(true)}
        />
      )}
      {visible && !loaded && (
        <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-b from-stone-200 via-stone-100 to-stone-200" aria-hidden="true" />
      )}
      {/* iframe'ning o'zidagi `pointer-events-none` telefonda (iOS Safari)
          barmoq bilan surishni doim ham to'xtatmaydi — shu sababli
          interaktiv bo'lmaguncha ustida har doim shaffof qatlam turadi. */}
      {!interactive && (
        <div
          className={`absolute inset-0 ${mode === "gated" ? "cursor-pointer" : ""}`}
          onClick={mode === "gated" ? forwardTap : undefined}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
