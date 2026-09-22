/** Sayt logotipi. */
export function BrandMark({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <img
      src="/brand/logo-mark.png"
      alt="Online taklifnomalar"
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
