"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Element ekranga kirganda mayin paydo bo'ladi.
 * `prefers-reduced-motion` sozlamasi `globals.css` da hurmat qilinadi.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // suppressHydrationWarning: layout'dagi skript birinchi ekrandagilarga
    // `is-visible`ni gidratsiyadan oldin qo'shadi — bu kutilgan farq
    <div
      ref={ref}
      className={`reveal-up ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
