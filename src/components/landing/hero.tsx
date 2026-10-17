import { UsernameForm } from "@/components/landing/username-form";
import { TerminalArt } from "@/components/pixelart/terminal";

/**
 * Hero ala Anytype: headline split — Inter 300 untuk klausa pertama,
 * Playfair serif untuk klausa "emosional"; gradient pastel
 * menyala di bawah lewat utilitas .pastel-canvas.
 */
export function Hero() {
  return (
    <section className="pastel-canvas relative flex-1">
      <div className="mx-auto grid w-full max-w-6xl items-start gap-10 px-4 pb-24 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
        <div>
          <p className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[1px] text-ink-subtle">
            <span>Wrapped</span>
            <span className="h-1 w-1 rounded-full bg-ink-subtle" aria-hidden />
            <span>Roast</span>
            <span className="h-1 w-1 rounded-full bg-ink-subtle" aria-hidden />
            <span>Share</span>
          </p>

          <h1 className="mt-6 max-w-3xl text-[clamp(2.5rem,7.5vw,5.5rem)] font-light leading-[1.04] tracking-[-0.05em] text-ink">
            Kode kamu bicara.{" "}
            <span className="block font-serif font-normal tracking-[-0.02em]">
              Lalu kami sindir.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-ink-muted">
            Statistik GitHub-mu dirangkum ala Wrapped — jam kodemu, bahasa
            andalanmu, repo ranahmu, PR yang terkubur — lalu di-sindir rapi
            dalam kartu Instastory.
          </p>

          <div className="mt-10 max-w-md">
            <UsernameForm />
          </div>
        </div>

        <div className="hidden self-end pb-6 lg:block" aria-hidden>
          <TerminalArt className="h-28 w-auto text-ink" />
        </div>
      </div>
    </section>
  );
}
