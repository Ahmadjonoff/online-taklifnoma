import type { getDictionary } from "@/lib/i18n/dictionary";

/** «Uchrashuvga taklif» shabloni — javoblar boshqacha ko'rsatiladi */
export const DATE_INVITE_THEME = "uchrashuv-taklif";

const dateFmt = new Intl.DateTimeFormat("uz-UZ", {
  timeZone: "Asia/Tashkent",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * Mijozning shaxsiy "Mehmonlar javoblari" bo'limi: RSVP va tilaklar.
 * Faqat tasdiqlangan (havola mehmonlarga yuborilgan) buyurtmada ko'rinadi.
 * Ikki joyda: buyurtma sahifasi (/buyurtma/<token>) va admin mijozga beradigan
 * alohida javoblar sahifasi (/javoblar/<token>) — barcha shablonlar uchun.
 */
export function GuestResponses({
  token,
  rsvps,
  wishes,
  os,
  dateInvite = false,
}: {
  token: string;
  rsvps: { id: number; guestName: string; attending: boolean; guestsCount: number; comment: string; createdAt: Date }[];
  wishes: { id: number; guestName: string; message: string; createdAt: Date }[];
  os: ReturnType<typeof getDictionary>["orderStatus"];
  /** «Uchrashuvga taklif»: javob — «Ha» va tanlangan uchrashuv tafsilotlari */
  dateInvite?: boolean;
}) {
  const coming = rsvps.filter((r) => r.attending);
  const stats = [
    { label: os.guestsAttending, value: coming.length, tone: "text-emerald-700" },
    { label: os.guestsNotAttending, value: rsvps.length - coming.length, tone: "text-rose-700" },
    { label: os.guestsTotal, value: coming.reduce((s, r) => s + r.guestsCount, 0), tone: "text-stone-900" },
  ];

  return (
    <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/60 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="font-serif text-2xl font-bold">{os.guestsTitle}</h2>
        {rsvps.length > 0 && (
          <a
            href={`/buyurtma/${token}/mehmonlar.csv`}
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-400"
          >
            ⬇ {os.downloadCsv}
          </a>
        )}
      </div>
      <p className="mt-2 text-sm text-stone-500">{os.guestsHint}</p>

      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-stone-50 px-3 py-4">
            <p className={`font-serif text-3xl font-bold ${s.tone}`}>{s.value}</p>
            <p className="mt-1 text-xs text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>

      {rsvps.length === 0 ? (
        <p className="mt-6 text-sm text-stone-500">{os.guestsNone}</p>
      ) : (
        <ul className="mt-6 divide-y divide-stone-100">
          {rsvps.map((r) => (
            <li key={r.id} className="flex items-start justify-between gap-3 py-3 text-sm">
              <div className="min-w-0">
                <p className="font-medium text-stone-900">{r.guestName}</p>
                {r.comment && <p className="mt-0.5 whitespace-pre-line text-stone-500">{r.comment}</p>}
                <p className="mt-0.5 text-xs text-stone-400">{dateFmt.format(r.createdAt)}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  r.attending ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}
              >
                {dateInvite ? (r.attending ? os.dateYes : os.guestsNotAttending) : r.attending ? `${os.guestsAttending} · ${r.guestsCount}` : os.guestsNotAttending}
              </span>
            </li>
          ))}
        </ul>
      )}

      <h3 className="mt-8 font-serif text-xl font-bold">{os.wishesTitle}</h3>
      {wishes.length === 0 ? (
        <p className="mt-3 text-sm text-stone-500">{os.wishesNone}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {wishes.map((w) => (
            <li key={w.id} className="rounded-2xl bg-stone-50 px-4 py-3 text-sm">
              <p className="text-stone-800">{w.message}</p>
              <p className="mt-1 text-xs text-stone-500">
                — {w.guestName} · {dateFmt.format(w.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
