import { site } from "@/config/site";

/** Footer strip — semuanya kontinyu dengan canvas (tanpa surface lift). */
export function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-8 text-sm font-light text-ink-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          {site.name} — dibangun untuk dev, oleh dev. Data buatan GitHub API
          publik.
        </p>
        <p className="text-[11px] uppercase tracking-[1px]">
          SUPER BOWO 
        </p>
      </div>
    </footer>
  );
}
