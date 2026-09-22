import type { Dictionary } from "@/lib/i18n/dictionary";

/** Ko'p so'raladigan savollar — `<details>` asosida, JS talab qilmaydi. */
export function Faq({ items }: { items: Dictionary["faq"] }) {
  return (
    <div className="mx-auto mt-12 max-w-3xl space-y-3">
      {items.map((item) => (
        <details
          key={item.q}
          className="group rounded-2xl border border-stone-200/80 bg-white/80 px-6 py-5 transition open:border-amber-200 open:bg-white open:shadow-[0_20px_50px_-40px_rgba(60,45,20,0.7)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-stone-900 [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stone-300 text-stone-500 transition group-open:rotate-45 group-open:border-amber-300 group-open:text-amber-700">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
