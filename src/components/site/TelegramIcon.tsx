/** Telegram belgisi — sayt bo'ylab bir xil ko'rinishda ishlatiladi. */
export function TelegramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M21.94 4.3 19.2 19.1c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.2-8.3c.4-.4-.1-.6-.6-.2L6.8 13l-4.9-1.5c-1-.3-1-1 .2-1.5l18.5-7.1c.9-.3 1.6.2 1.34 1.4Z" />
    </svg>
  );
}
