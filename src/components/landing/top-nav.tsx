import Link from "next/link";

/** Top-nav minimal ala referensi: wordmark kiri, label kanan. */
export function TopNav() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
      <Link
        href="/"
        className="text-lg font-medium tracking-tight text-ink"
      >
        DevRoast{" "}
        <span className="font-serif italic font-normal text-mint">&amp;</span>{" "}
        Wrapped
      </Link>
      <span className="text-[11px] uppercase tracking-[1px] text-ink-subtle">
        Wrapped · Roast · Share
      </span>
    </header>
  );
}
