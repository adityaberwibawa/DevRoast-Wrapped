import type { Metadata } from "next";
import Link from "next/link";
import { generateWrapped } from "@/lib/wrapped";
import { WrappedSlideshow } from "@/components/wrapped/slideshow";
import { TerminalArt } from "@/components/pixelart/terminal";

/**
 * Metadata per-username: judul + deskripsi statistik + OG/Twitter card
 * (image disuplai otomatis oleh opengraph-image.tsx di route ini).
 */
export async function generateMetadata({
  params,
}: PageProps<"/u/[username]">): Promise<Metadata> {
  const { username: raw } = await params;
  const result = await generateWrapped(raw);

  if (!result.ok) {
    return { title: "Nggak jadi" };
  }

  const title = `Wrapped @${result.profile.login}`;
  const description = `${result.stats.commitCount} commit dianalisis · jam paling rame ${String(result.stats.topHour.hour).padStart(2, "0")}.00 WIB · plus roast yang jujur.`;

  return {
    title,
    description,
    alternates: { canonical: `/u/${result.profile.login}` },
    openGraph: {
      title,
      description,
      type: "profile",
      url: `/u/${result.profile.login}`,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/**
 * Rute wrapped: pipeline penuh (cache 15 menit + Gemini sekali jalan)
 * lalu slideshow 6 slide ala Instastory. Gagal → layar "Nggak jadi."
 * dengan copy siap-pakai dari WrappedResult.
 */
export default async function WrappedPage({
  params,
}: PageProps<"/u/[username]">) {
  const { username: raw } = await params;
  const result = await generateWrapped(raw);

  if (!result.ok) {
    return (
      <main className="bg-canvas min-h-svh">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-start justify-center gap-6 px-4 sm:px-6">
          <TerminalArt className="h-16 w-auto text-ink" />
          <h1 className="text-4xl font-light tracking-[-0.03em] text-ink">
            Nggak{" "}
            <span className="font-serif font-normal">jadi.</span>
          </h1>
          <p className="max-w-md text-lg font-light leading-relaxed text-ink-muted">
            {result.message}
          </p>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-base font-medium text-canvas hover:bg-ink/80"
          >
            Kembali & coba lagi
          </Link>
        </div>
      </main>
    );
  }

  return <WrappedSlideshow data={result} />;
}
