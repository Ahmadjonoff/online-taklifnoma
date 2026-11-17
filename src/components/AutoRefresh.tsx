"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Server sahifasini vaqti-vaqti bilan qayta yuklaydi (yangi javoblar uchun).
 * Tab yashirin bo'lsa so'rov yubormaydi; qaytganda darhol yangilaydi.
 */
export function AutoRefresh({ seconds = 30 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const id = window.setInterval(tick, seconds * 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [router, seconds]);
  return null;
}
