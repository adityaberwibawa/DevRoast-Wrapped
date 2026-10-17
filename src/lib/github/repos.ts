import { githubFetch } from "./client";
import type { LanguageCount } from "@/lib/types";

const MS_DAY = 86_400_000;

export interface UserRepo {
  fullName: string;
  language: string | null;
  pushedAt: string; // ISO
}

interface RawRepo {
  name: string;
  fork: boolean;
  language: string | null;
  pushed_at: string;
  owner: { login: string };
}

interface ReposPair {
  /** Semua repo non-fork milik sendiri (≤100, sort terbaru) — sumber hitungan bahasa. */
  all: UserRepo[];
  /** Repo yang diberi tanda 'aktif' dalam window waktu — dipakai pengambil commit REST. */
  recent: UserRepo[];
}

/**
 * Daftar repo milik sendiri (bukan fork) — SATU request memuaskan dua
 * konsumen: pencacah bahasa & daftar repo-aktif untuk pengambilan commit.
 */
export async function fetchOwnRepos(
  username: string,
  /** Repo dianggap "aktif" bila pushed_at ≥ cutoff hari ini - actDays. */
  actDays = 120,
  /** Maksimum repo-aktif yang di-commit-scan (kuota hemat: 1 req/repo). */
  recentCap = 8,
): Promise<ReposPair> {
  const repos = await githubFetch<RawRepo[]>(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`,
  );

  const handle = username.toLowerCase();
  const own = repos
    .filter(
      (repo) => !repo.fork && repo.owner.login.toLowerCase() === handle,
    )
    .map((repo) => ({
      fullName: `${repo.owner.login}/${repo.name}`,
      language: repo.language,
      pushedAt: repo.pushed_at,
    }));

  const cutoff = Date.now() - actDays * MS_DAY;
  const recent = own
    .filter((repo) => Date.parse(repo.pushedAt) >= cutoff)
    .sort((a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt))
    .slice(0, recentCap);

  return { all: own, recent };
}

/** Pencacah bahasa dari list repo — top sort menurun + alfabetis agar stabil. */
export function countLanguages(repos: UserRepo[]): LanguageCount[] {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (repo.language === null) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([language, count]) => ({ language, repos: count }))
    .sort((a, b) => b.repos - a.repos || a.language.localeCompare(b.language));
}
