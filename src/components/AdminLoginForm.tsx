"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function AdminLoginForm({ dict }: { dict: Dictionary }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        throw new Error(res.status === 429 ? dict.adminLogin.rateLimited : dict.adminLogin.wrongPassword);
      }
      router.push("/boshqaruv");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.adminLogin.wrongPassword);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-6">
      <div className="w-full max-w-sm rounded-3xl border border-stone-200 bg-white p-8 shadow-xl shadow-stone-200/60">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-stone-800 to-stone-600 text-2xl text-white shadow-lg">
          🔒
        </div>
        <h1 className="mt-5 text-center font-serif text-2xl font-bold">{dict.adminLogin.title}</h1>
        <p className="mt-1 text-center text-sm text-stone-500">{dict.adminLogin.subtitle}</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={dict.adminLogin.placeholder}
            autoFocus
            className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-100"
          />
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-stone-900 py-3 font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50"
          >
            {loading ? dict.adminLogin.submitting : dict.adminLogin.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
