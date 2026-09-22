"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function OrderActions({
  orderId,
  status,
}: {
  orderId: number;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
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
          onClick={() => updateStatus("PAID")}
          className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          ✅ To'landi
        </button>
      )}
      {status !== "REJECTED" && (
        <button
          disabled={busy}
          onClick={() => updateStatus("REJECTED")}
          className="rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          ❌ Bekor
        </button>
      )}
    </div>
  );
}
