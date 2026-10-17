"use client";

/**
 * Form username GitHub — satu-satunya input MVP.
 * Klik/Enter → navigasi ke /u/{username}; halaman wrapped yang menanggung
 * loading (skeleton) & cache supaya submit identik = instan (cache 15 menit).
 */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  canonicalGitHubUsername,
  isGitHubUsername,
} from "@/lib/username";

export function UsernameForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const handle = canonicalGitHubUsername(username);

    if (handle.length === 0) {
      setError("Isi dulu username GitHub-nya, ya.");
      return;
    }
    if (!isGitHubUsername(handle)) {
      setError(
        "Username GitHub cuma boleh huruf, angka, dan tanda minus (maks 39).",
      );
      return;
    }

    setError(null);
    startTransition(() => {
      router.push(`/u/${handle}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <label
        htmlFor="github-username"
        className="mb-2 block text-[11px] uppercase tracking-[1px] text-ink-subtle"
      >
        Username GitHub
      </label>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <Input
          id="github-username"
          name="username"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="octocat"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          aria-invalid={error ? true : undefined}
          className="h-12 rounded-2xl border-hairline bg-canvas/80 px-4 text-base text-ink placeholder:text-ink-faint focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink/10"
        />
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-12 shrink-0 rounded-full bg-ink px-7 text-base text-canvas hover:bg-ink/80"
        >
          {pending ? "Menyindir…" : "Wrapped & roast"}
        </Button>
      </div>
      {error ? (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-sm font-light text-ink-subtle">
          Tanpa login. Tanpa simpan data. Hanya aktivitas publik yang dibaca.
        </p>
      )}
    </form>
  );
}
