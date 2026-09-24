import { notFound } from "next/navigation";
import { AdminOrderEditor } from "@/components/AdminOrderEditor";
import { parseStoredCustomization } from "@/lib/customization";
import { isoDate } from "@/lib/dates";
import type { TimelineItem } from "@/lib/eventDefaults";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Admin: buyurtmani tahrirlash (himoya — src/proxy.ts, /boshqaruv/*). */
export default async function AdminOrderEditPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const order = await prisma.order.findUnique({
    where: { id },
    include: { invitation: true, template: true },
  });
  if (!order?.invitation) notFound();
  const inv = order.invitation;
  const c = parseStoredCustomization(inv.options);

  // null — shablonning standart kun tartibi; [] — ko'rsatilmaydi
  let templateTimeline: TimelineItem[] = [];
  try {
    templateTimeline = JSON.parse(order.template.timeline);
  } catch {}

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <header className="bg-stone-900 py-5 text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="font-serif text-lg font-bold">
            #{order.id} tahrirlash — {order.template.name}
          </h1>
          <p className="mt-1 text-xs text-stone-400">
            Havola o&apos;zgarmaydi: /e/{inv.slug}
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-8">
        <AdminOrderEditor
          orderId={order.id}
          slug={inv.slug}
          paid={order.status === "PAID"}
          initial={{
            customerName: order.customerName,
            phone: order.phone,
            partner1: inv.partner1,
            partner2: inv.partner2,
            eventDate: isoDate(inv.eventDate),
            eventTime: inv.eventTime,
            venueName: inv.venueName,
            venueAddress: inv.venueAddress,
            message: inv.message,
            kicker: c.kicker,
            scheduleOn: !(Array.isArray(c.timeline) && c.timeline.length === 0),
            timeline: c.timeline && c.timeline.length ? c.timeline : templateTimeline,
            googleMapsUrl: c.googleMapsUrl,
            yandexMapsUrl: c.yandexMapsUrl,
            mapConfirmed: c.mapConfirmed,
            rsvp: c.rsvp,
            wishes: c.wishes,
            petals: c.petals,
          }}
        />
      </main>
    </div>
  );
}
