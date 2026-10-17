import type { ReactNode } from "react";

/**
 * Kanvas per-slide ala Anytype: putih di atas yang bergradasi pastel
 * (stops dipakai HANYA sebagai background fill — aturan referensi).
 * Tiap slide dapat kombinasi stop berbeda supaya antar-slide tidak Kembar.
 */
const GRADIENTS: readonly string[] = [
  // 0 — cover: kanvas klasik hero (hangat → mint → lavender → lime)
  "linear-gradient(165deg, #ffffff 30%, var(--color-cream) 52%, var(--color-mintwash) 72%, var(--color-lavender) 92%, var(--color-limewash) 100%)",
  // 1 — jam kodding: langit-biru dingin (jam malam)
  "linear-gradient(150deg, #ffffff 26%, var(--color-skywash) 58%, var(--color-mintwash) 90%)",
  // 2 — bahasa: lime segar
  "linear-gradient(180deg, #ffffff 30%, var(--color-limewash) 60%, var(--color-mintwash) 92%)",
  // 3 — repo favorit: rose hangat
  "linear-gradient(155deg, #ffffff 28%, var(--color-rose) 58%, var(--color-cream) 92%)",
  // 4 — PR: langit → lavender (kuburan PR)
  "linear-gradient(170deg, #ffffff 26%, var(--color-skywash) 56%, var(--color-lavender) 92%)",
  // 5 — verdict: penutup emosional, lavender → rose
  "linear-gradient(200deg, #ffffff 20%, var(--color-lavender) 60%, var(--color-rose) 96%)",
];

export type SlideIndex = 0 | 1 | 2 | 3 | 4 | 5;

type SlideShellProps = {
  index: SlideIndex;
  /** Label seksi pendek (3–6 kata) — uppercase label-caps ala Anytype. */
  label: string;
  children: ReactNode;
};

export function SlideShell({ index, label, children }: SlideShellProps) {
  return (
    <section
      className="relative flex flex-1 flex-col"
      style={{
        backgroundImage: GRADIENTS[index],
        backgroundColor: "#ffffff",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 pb-28 pt-24 sm:px-10">
        <p className="text-[13px] uppercase tracking-[1px] text-ink-subtle">
          {label}
        </p>
        <div className="flex flex-1 flex-col justify-center gap-8 py-10">
          {children}
        </div>
      </div>
    </section>
  );
}
