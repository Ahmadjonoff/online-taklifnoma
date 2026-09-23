import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminResponsesPage() {
  const invitations = await prisma.invitation.findMany({
    include: {
      template: true,
      rsvps: { orderBy: { id: "desc" } },
      wishes: { orderBy: { id: "desc" } },
    },
    orderBy: { id: "desc" },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <header className="bg-stone-900 py-5 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <h1 className="font-serif text-lg font-bold">RSVP va tilaklar</h1>
          <div className="flex items-center gap-5 text-sm">
            <Link href="/boshqaruv" className="text-stone-300 hover:text-white">
              Buyurtmalar
            </Link>
            <Link href="/" className="text-stone-300 hover:text-white">
              ← Saytga
            </Link>
            <form action="/api/admin/logout" method="post">
              <button className="rounded-full border border-stone-700 px-3 py-1 text-xs text-stone-400 transition hover:border-stone-500 hover:text-white">
                Chiqish
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-6 py-8">
        {invitations.map((inv) => {
          const coming = inv.rsvps.filter((r) => r.attending);
          const notComing = inv.rsvps.filter((r) => !r.attending);
          const totalGuests = coming.reduce((s, r) => s + r.guestsCount, 0);

          return (
            <div
              key={inv.id}
              className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif font-bold text-stone-900">
                    {inv.title}
                  </h2>
                  <p className="text-sm text-stone-500">
                    {inv.template.name} •{" "}
                    <Link href={`/e/${inv.slug}`} className="underline" target="_blank">
                      /e/{inv.slug}
                    </Link>{" "}
                    • {inv.views} ko&apos;rish
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-emerald-700">
                    ✅ {coming.length} keladi ({totalGuests} kishi)
                  </span>
                  <span className="rounded-full bg-red-100 px-3 py-1.5 text-red-700">
                    ❌ {notComing.length} kelolmaydi
                  </span>
                  <span className="rounded-full bg-sky-100 px-3 py-1.5 text-sky-700">
                    💌 {inv.wishes.length} tilak
                  </span>
                </div>
              </div>

              {(inv.rsvps.length > 0 || inv.wishes.length > 0) && (
                <div className="mt-5 grid gap-5 border-t border-stone-100 pt-5 md:grid-cols-2">
                  {inv.rsvps.length > 0 && (
                    <div>
                      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-stone-400">
                        Javoblar
                      </h3>
                      <ul className="space-y-2">
                        {inv.rsvps.map((r) => (
                          <li
                            key={r.id}
                            className="rounded-xl bg-stone-50 px-4 py-2.5 text-sm"
                          >
                            <span className="font-semibold">{r.guestName}</span>{" "}
                            —{" "}
                            {r.attending ? (
                              <span className="font-medium text-emerald-700">
                                keladi ({r.guestsCount} kishi)
                              </span>
                            ) : (
                              <span className="font-medium text-red-600">
                                kelolmaydi
                              </span>
                            )}
                            {r.comment && (
                              <p className="mt-1 text-stone-500">«{r.comment}»</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {inv.wishes.length > 0 && (
                    <div>
                      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-stone-400">
                        Tilaklar
                      </h3>
                      <ul className="space-y-2">
                        {inv.wishes.map((w) => (
                          <li
                            key={w.id}
                            className="rounded-xl bg-stone-50 px-4 py-2.5 text-sm"
                          >
                            <span className="font-semibold">{w.guestName}</span>
                            <p className="mt-0.5 text-stone-600">
                              «{w.message}»
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {invitations.length === 0 && (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white/50 p-12 text-center text-stone-500">
            Hozircha taklifnomalar yo&apos;q.
          </div>
        )}
      </main>
    </div>
  );
}
