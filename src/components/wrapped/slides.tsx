"use client";

/**
 * Enam slide wrapped ala Instastory. Sumber desain: REFERENSI-DESIGN.md
 * (Anytype) — angka raksasa Inter 300 tracking rapat, serif hanya untuk
 * momen emosional, mint sebagai aksen jejak tunggal, label-caps pendek.
 *
 * File ini "use client" karena slide verdict interaktif (copy & share).
 */
import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { refreshWrapped } from "@/actions/refresh-wrapped";
import type { WrappedResult } from "@/lib/types";
import { SlideShell } from "./slide-shell";
import { TerminalArt } from "@/components/pixelart/terminal";
import { PixelCalendar } from "@/components/pixelart/calendar";

export type WrappedOk = Extract<WrappedResult, { ok: true }>;

/* ---------- util kecil ---------- */

const fmtInt = (n: number) => new Intl.NumberFormat("id-ID").format(n);
const fmtPct = (share: number) => `${Math.round(share * 100)}%`;
const fmtHour = (hour: number) => `${String(hour).padStart(2, "0")}.00`;

/** Web Share API hanya ada di browser — baca via store agar aman hydration. */
const noopSubscribe = () => () => {};
const canWebShare = () =>
  typeof navigator !== "undefined" && typeof navigator.share === "function";

type SlideProps = Readonly<{ data: WrappedOk }>;

/** Akses slide roast yang tipe-nya Partial — runtime selalu terisi penuh. */
function slideOf(data: WrappedOk, key: keyof WrappedOk["roast"]["slides"] & string): string {
  return data.roast.slides[key] ?? "";
}

/* ---------- Slide 1 — Cover ---------- */

export function CoverSlide({ data }: SlideProps) {
  const { profile, stats } = data;
  return (
    <SlideShell index={0} label="Wrapped · GitHub">
      <div className="flex flex-1 flex-col items-center gap-7 text-center">
        <Image
          src={profile.avatarUrl}
          alt={`Avatar ${profile.login}`}
          width={96}
          height={96}
          priority
          unoptimized
          className="size-24 border border-hairline"
        />
        <div>
          <h1 className="text-[clamp(2.5rem,7vw,4.75rem)] font-light leading-none tracking-[-0.045em] text-ink">
            {profile.name ?? profile.login}
          </h1>
          <p className="mt-3 font-mono text-sm text-ink-subtle">
            @{profile.login}
          </p>
        </div>
        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] uppercase tracking-[1px] text-ink-muted">
          <span>{fmtInt(stats.commitCount)} commit</span>
          <span aria-hidden>·</span>
          <span>{stats.profile.accountAgeYears} tahun</span>
          <span aria-hidden>·</span>
          <span>{fmtInt(stats.profile.publicRepos)} repo</span>
        </p>
        <p className="max-w-md text-lg font-light leading-relaxed text-ink">
          {slideOf(data, "cover")}
        </p>
        <p className="text-[11px] uppercase tracking-[1px] text-ink-subtle">
          Swipe atau pencet panah
        </p>
      </div>
    </SlideShell>
  );
}

/* ---------- Slide 2 — Jam coding ---------- */

export function HourSlide({ data }: SlideProps) {
  const { stats } = data;
  // Aksen mint menandai bucket TEMPAT jam-top berada (konsisten dengan
  // angka raksasa di atas), bukan sekadar bucket terbesar.
  const h = stats.topHour.hour;
  const topBucket: string =
    h < 6 ? "subuh" : h < 12 ? "pagi" : h < 18 ? "siang" : "malam";

  return (
    <SlideShell index={1} label="Jam coding — WIB">
      <p className="text-[clamp(3.5rem,13vw,7rem)] font-light leading-none tracking-[-0.055em] text-ink">
        {fmtHour(stats.topHour.hour)}
      </p>
      <p className="-mt-2 text-lg font-light text-ink-muted">
        jam paling rame — {fmtPct(stats.topHour.share)} dari{" "}
        {fmtInt(stats.commitCount)} commit
      </p>

      {/* Distribusi 4 bucket: mint = pemenang (satu-satunya aksen), sisanya abu */}
      <div
        className="flex h-3.5 w-full max-w-xl overflow-hidden"
        role="img"
        aria-label={`Distribusi jam: ${stats.hourBuckets
          .map((b) => `${b.bucket} ${fmtPct(b.share)}`)
          .join(", ")}`}
      >
        {stats.hourBuckets.map((b) => (
          <div
            key={b.bucket}
            style={{
              width: `${Math.max(b.share, 0.02) * 100}%`,
              background:
                b.bucket === topBucket ? "var(--color-mint)" : "rgba(0,0,0,0.22)",
            }}
          />
        ))}
      </div>
      <div className="flex max-w-xl flex-wrap gap-x-5 gap-y-1 text-[12px] uppercase tracking-[1px] text-ink-subtle">
        {stats.hourBuckets.map((b) => (
          <span key={b.bucket}>
            {b.bucket} {fmtPct(b.share)}
          </span>
        ))}
      </div>

      <p className="max-w-xl text-lg font-light leading-relaxed text-ink">
        {slideOf(data, "hour")}
      </p>
    </SlideShell>
  );
}

/* ---------- Slide 3 — Bahasa ---------- */

export function LanguageSlide({ data }: SlideProps) {
  const { stats } = data;
  const [first, ...rest] = stats.languages;

  return (
    <SlideShell index={2} label="Bahasa andalan">
      {first ? (
        <div>
          <p className="text-[clamp(2.75rem,10vw,6rem)] font-light leading-none tracking-[-0.045em] text-ink">
            {first.language}
          </p>
          <p className="mt-2 text-lg font-light text-ink-muted">
            kandangnya {fmtInt(first.repos)} repo
          </p>
        </div>
      ) : (
        <p className="text-2xl font-light text-ink-muted">Belum ada bahasa teridentifikasi.</p>
      )}

      {rest.length > 0 && (
        <ul className="w-full max-w-xl">
          {rest.map((lang, i) => (
            <li
              key={lang.language}
              className="flex items-baseline justify-between border-t border-hairline/20 py-3"
            >
              <span className="text-xl font-normal text-ink">
                <span className="mr-3 font-mono text-sm text-ink-subtle">
                  {i + 2}.
                </span>
                {lang.language}
              </span>
              <span className="text-sm text-ink-subtle">
                {fmtInt(lang.repos)} repo
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="max-w-xl text-lg font-light leading-relaxed text-ink">
        {slideOf(data, "language")}
      </p>
    </SlideShell>
  );
}

/* ---------- Slide 4 — Repo favorit ---------- */

export function RepoSlide({ data }: SlideProps) {
  const { stats } = data;
  const repo = stats.topRepo;

  return (
    <SlideShell index={3} label="Repo favorit">
      {repo ? (
        <>
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-mono text-[clamp(1.75rem,5.5vw,3rem)] leading-tight tracking-tight text-ink">
                {repo.repo}
              </p>
              <p className="mt-3 text-lg font-light text-ink-muted">
                {fmtInt(repo.commitCount)} commit dalam sampel ·{" "}
                {fmtPct(repo.commitCount / (stats.commitCount || 1))} dari semua
              </p>
            </div>
            <TerminalArt className="hidden h-16 w-auto shrink-0 text-ink sm:block" />
          </div>
          <a
            href={`https://github.com/${repo.repo}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm underline decoration-hairline/40 underline-offset-4 hover:decoration-ink"
          >
            Buka repo ↗
          </a>
        </>
      ) : (
        <p className="text-2xl font-light text-ink-muted">
          Belum cukup commit untuk menobatkan repo favorit.
        </p>
      )}
      <p className="max-w-xl text-lg font-light leading-relaxed text-ink">
        {slideOf(data, "repo")}
      </p>
    </SlideShell>
  );
}

/* ---------- Slide 5 — PR terbengkalai ---------- */

export function PRSlide({ data }: SlideProps) {
  const { stats } = data;
  const pr = stats.neglectedPR;

  return (
    <SlideShell index={4} label="PR terbengkalai">
      {pr ? (
        <>
          <p className="text-[clamp(3.5rem,13vw,7rem)] font-light leading-none tracking-[-0.05em] text-ink">
            {fmtInt(pr.ageDays)}
            <span className="ml-3 text-2xl font-light tracking-normal text-ink-muted">
              hari menggantung
            </span>
          </p>
          <blockquote>
            <p className="max-w-xl font-serif text-xl italic leading-snug text-ink">
              “{pr.title}”
            </p>
            <footer className="mt-3 flex flex-wrap gap-x-4 text-sm text-ink-subtle">
              <span className="font-mono">{pr.repo}</span>
              <a
                href={pr.url}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-hairline/40 underline-offset-4 hover:decoration-ink"
              >
                Lihat bekasnya ↗
              </a>
            </footer>
          </blockquote>
        </>
      ) : (
        <div className="flex flex-col items-start gap-6">
          <p className="text-[clamp(3.5rem,13vw,7rem)] font-light leading-none tracking-[-0.05em] text-ink">
            0
          </p>
          <PixelCalendar className="h-16 w-auto text-ink" />
          <p className="text-lg font-light text-ink-muted">
            Nol PR terkatung-katung. Rapi banget, kayak rak kapster.
          </p>
        </div>
      )}
      <p className="max-w-xl text-lg font-light leading-relaxed text-ink">
        {slideOf(data, "pr")}
      </p>
    </SlideShell>
  );
}

/* ---------- Slide 6 — Verdict + share ---------- */

export function VerdictSlide({ data }: SlideProps) {
  const { roast, profile } = data;
  const canShare = useSyncExternalStore(noopSubscribe, canWebShare, () => false);
  const router = useRouter();
  const [regenPending, startRegen] = useTransition();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(roast.shareText);
      toast.success("Caption tersalin. Sebarkan!");
    } catch {
      toast.error("Browser menolak clipboard — salin manual, ya.");
    }
  }

  /** Roast baru: buang tag cache → pipeline jalan lagi (rate-limit 2×/5menit/IP). */
  function handleRegen() {
    startRegen(async () => {
      const result = await refreshWrapped(profile.login);
      if (result.ok) {
        toast.success("Roast dibangun ulang. Lihat bedanya, hehe.");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  /**
   * Bagikan kartu: prioritas file PNG story (cek navigator.canShare file),
   * lalu share teks+URL, kalau dibatalkan pun dianggep bukan error.
   */
  async function handleShare() {
    const meta = {
      title: `Wrapped @${profile.login}`,
      text: roast.shareText,
    };
    try {
      const response = await fetch(`/u/${profile.login}/story-image`);
      if (response.ok) {
        const blob = await response.blob();
        const file = new File([blob], `devroast-${profile.login}.png`, {
          type: "image/png",
        });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], ...meta });
          return;
        }
      }
    } catch {
      // fetch PNG gagal → turun ke share teks di bawah
    }
    try {
      await navigator.share({ ...meta, url: window.location.href });
    } catch {
      // dibatalkan user — bukan error
    }
  }

  return (
    <SlideShell index={5} label="Verdict">
      <blockquote>
        <span className="font-serif text-5xl leading-none text-mint" aria-hidden>
          “
        </span>
        <p className="-mt-3 max-w-xl font-serif text-[clamp(1.5rem,4.5vw,2.5rem)] italic leading-snug text-ink">
          {slideOf(data, "verdict")}
        </p>
      </blockquote>

      <div className="w-full max-w-xl border border-hairline/30 bg-canvas/70 p-4">
        <p className="text-[11px] uppercase tracking-[1px] text-ink-subtle">
          Caption
        </p>
        <p className="mt-2 font-mono text-sm leading-relaxed text-ink">
          {roast.shareText}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {canShare && (
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-base font-medium text-canvas hover:bg-ink/85"
          >
            Bagikan kartu
          </button>
        )}
        <a
          href={`/u/${profile.login}/story-image`}
          download={`devroast-${profile.login}.png`}
          className="inline-flex h-11 items-center rounded-full border border-hairline px-6 text-base font-medium text-ink hover:bg-ink hover:text-canvas"
        >
          Unduh PNG
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-11 items-center rounded-full border border-hairline px-6 text-base font-medium text-ink hover:bg-ink hover:text-canvas"
        >
          Salin caption
        </button>
        <button
          type="button"
          onClick={handleRegen}
          disabled={regenPending}
          className="inline-flex h-11 items-center px-2 text-base font-light text-ink-subtle underline decoration-hairline/40 underline-offset-4 hover:text-ink disabled:opacity-50"
        >
          {regenPending ? "Memasak ulang…" : "Roast baru"}
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center px-2 text-base font-light text-ink-subtle underline decoration-hairline/40 underline-offset-4 hover:text-ink"
        >
          Sindir username lain
        </Link>
      </div>
    </SlideShell>
  );
}
