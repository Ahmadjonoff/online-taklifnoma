import Link from "next/link";
import { BrandMark } from "@/components/site/BrandMark";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";

export default async function NotFound() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf7f2] px-6 text-center">
      <BrandMark className="h-14 w-auto opacity-90" />
      <h1 className="mt-8 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
        {dict.notFound.title}
      </h1>
      <p className="mt-3 max-w-sm text-stone-600">{dict.notFound.text}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
        >
          {dict.notFound.home}
        </Link>
        <Link
          href="/shablonlar"
          className="rounded-full border border-stone-300 bg-white/70 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-white"
        >
          {dict.notFound.templates}
        </Link>
      </div>
    </div>
  );
}
