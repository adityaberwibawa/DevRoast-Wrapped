"use client";

/**
 * Orkestrator slideshow ala Instastory:
 * - 6 slide progresif dengan segmen atas ala ig-story
 * - Keyboard: →/↓/Space/PageDown lanjut, ←/↑/Backspace/PageUp mundur,
 *   Home/End lompat; swipe horizontal di mobile; zona klik desktop.
 * - Chrome: wordmark kiri-atas, @login kanan-atas, counter kiri-bawah,
 *   tombol panah kanan-bawah (desktop).
 */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";
import {
  CoverSlide,
  HourSlide,
  LanguageSlide,
  PRSlide,
  RepoSlide,
  VerdictSlide,
  type WrappedOk,
} from "./slides";

const SLIDES: readonly ((props: { data: WrappedOk }) => React.JSX.Element)[] = [
  CoverSlide,
  HourSlide,
  LanguageSlide,
  RepoSlide,
  PRSlide,
  VerdictSlide,
];

const SLIDE_TITLES = [
  "Sambutan",
  "Jam Coding",
  "Bahasa",
  "Repo Favorit",
  "PR Terbengkalai",
  "Verdict",
] as const;

export function WrappedSlideshow({ data }: { data: WrappedOk }) {
  const total = SLIDES.length;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback(
    (delta: 1 | -1) => {
      setDir(delta);
      setIndex((i) => Math.min(total - 1, Math.max(0, i + delta)));
    },
    [total],
  );

  const jump = useCallback(
    (target: number) => {
      setDir(target >= index ? 1 : -1);
      setIndex(Math.min(total - 1, Math.max(0, target)));
    },
    [index, total],
  );

  /* --- Keyboard --- */
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          event.preventDefault();
          go(1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
        case "Backspace":
          event.preventDefault();
          go(-1);
          break;
        case "Home":
          event.preventDefault();
          jump(0);
          break;
        case "End":
          event.preventDefault();
          jump(total - 1);
          break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, jump, total]);

  /* --- Swipe + zona klik (abaikan interaksi elemen interaktif) --- */
  function onTouchStart(event: React.TouchEvent) {
    const t = event.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }
  function onTouchEnd(event: React.TouchEvent) {
    const start = touchStart.current;
    if (!start) return;
    touchStart.current = null;
    const t = event.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
  }
  function onClickZone(event: React.MouseEvent) {
    const el = event.target as HTMLElement;
    if (el.closest("a, button, input, textarea, [role='alert']")) return;
    const boundary = window.innerWidth / 4;
    if (event.clientX < boundary && index > 0) go(-1);
    else if (index < total - 1 || event.clientX >= boundary) go(1);
  }

  const Slide = SLIDES[index];

  return (
    <div
      className="relative flex min-h-svh flex-col bg-canvas"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={onClickZone}
    >
      {/* Chrome atas: segmen progress + wordmark + handle */}
      <header className="fixed inset-x-0 top-0 z-20">
        <div className="mx-auto w-full max-w-3xl px-6 pt-4 sm:px-10">
          <div className="flex gap-1.5" aria-hidden>
            {SLIDES.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-300",
                  i <= index ? "bg-ink" : "bg-ink/15",
                )}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Link
              href="/"
              className="text-[13px] font-medium tracking-tight text-ink"
            >
              DevRoast <span className="font-serif italic text-mint">&</span>{" "}
              Wrapped
            </Link>
            <span className="font-mono text-[13px] text-ink-subtle">
              @{data.profile.login}
            </span>
          </div>
        </div>
      </header>

      {/* Slide aktif — direction-aware transition */}
      <div
        key={index}
        className={cn(
          "flex min-h-svh flex-1 flex-col",
          dir === 1
            ? "animate-in fade-in slide-in-from-right-6"
            : "animate-in fade-in slide-in-from-left-6",
          "duration-300 motion-reduce:animate-none",
        )}
      >
        <Slide data={data} />
      </div>

      {/* Chrome bawah: counter + panah */}
      <footer className="fixed inset-x-0 bottom-0 z-20">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 pb-6 sm:px-10">
          <span className="font-mono text-sm text-ink-subtle">
            {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              disabled={index === 0}
              aria-label="Slide sebelumnya"
              className="inline-flex size-10 items-center justify-center rounded-full border border-hairline text-ink transition-colors hover:bg-ink hover:text-canvas disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              disabled={index === total - 1}
              aria-label="Slide berikutnya"
              className="inline-flex size-10 items-center justify-center rounded-full border border-hairline text-ink transition-colors hover:bg-ink hover:text-canvas disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* Pengumuman screen reader */}
      <p className="sr-only" aria-live="polite">
        Slide {index + 1} dari {total}: {SLIDE_TITLES[index]}
      </p>
    </div>
  );
}
