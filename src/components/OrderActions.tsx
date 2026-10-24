"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function OrderActions({
  orderId,
  status,
  isDemo,
}: {
  orderId: number;
  status: string;
  isDemo: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  async function patch(body: { status?: string; isDemo?: boolean }) {
    setLoading(true);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      startTransition(() => router.refresh());
    } finally {
      setLoading(false);
    }
  }

  const busy = loading || pending;

  return (
    <div className="flex gap-2">
      {status !== "PAID" && (
        <button
          disabled={busy}
          onClick={() => patch({ status: "PAID" })}
          className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          ✅ To'landi
        </button>
      )}
      {status !== "REJECTED" && (
        <button
          disabled={busy}
          onClick={() => patch({ status: "REJECTED" })}
          className="rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          ❌ Bekor
        </button>
      )}
      <button
        disabled={busy}
        onClick={() => patch({ isDemo: !isDemo })}
        title="Demo/test buyurtma statistikaga va daromadga kirmaydi"
        className={`rounded-full border px-4 py-2 text-xs font-semibold transition disabled:opacity-50 ${
          isDemo ? "border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100" : "border-stone-300 text-stone-500 hover:bg-stone-50"
        }`}
      >
        {isDemo ? "🧪 Demo" : "Demo emas"}
      </button>
    </div>
  );
}
