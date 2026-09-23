import { after, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyAdminOrderConfirmed } from "@/lib/telegramBot";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = Number(id);
    if (Number.isNaN(orderId)) {
      return NextResponse.json({ error: "Noto'g'ri ID" }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body as { status: string };

    if (!["PENDING", "PAID", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Noto'g'ri holat" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { invitation: { select: { slug: true } } },
    });
    if (!order) {
      return NextResponse.json({ error: "Buyurtma topilmadi" }, { status: 404 });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Endi tasdiqlangan bo'lsa — mijozga yuborish uchun tayyor xabar botga
    if (status === "PAID" && order.status !== "PAID" && order.invitation) {
      const origin = new URL(req.url).origin;
      after(() =>
        notifyAdminOrderConfirmed({
          id: order.id,
          customerName: order.customerName,
          phone: order.phone,
          invitationUrl: `${origin}/e/${order.invitation!.slug}`,
          customerPageUrl: `${origin}/buyurtma/${order.accessToken}`,
        })
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Buyurtma holatini yangilashda xatolik:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
