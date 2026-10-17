/**
 * Skeleton segmen /u/[username] — meniru struktur slide cover:
 * chrome atas, avatar + blok teks, roast placeholder.
 */
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="pastel-canvas relative min-h-svh">
      {/* chrome atas */}
      <div className="fixed inset-x-0 top-0 z-20">
        <div className="mx-auto w-full max-w-3xl px-6 pt-4 sm:px-10">
          <div className="flex gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-1 flex-1 rounded-full" />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* isi slide */}
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 pb-28 pt-28 sm:px-10">
        <Skeleton className="size-24 border-none" />
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-3.5 w-72" />
        <div className="mt-6 w-full max-w-md space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      {/* chrome bawah */}
      <div className="fixed inset-x-0 bottom-0 z-20">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 pb-6 sm:px-10">
          <Skeleton className="h-4 w-12" />
          <p className="text-[11px] uppercase tracking-[1px] text-ink-subtle">
            Menggali GitHub · roasting kencang…
          </p>
        </div>
      </div>
    </main>
  );
}
