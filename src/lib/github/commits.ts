import { githubFetch } from "./client";
import { GitHubApiError } from "./errors";
import type { CommitInfo } from "@/lib/types";
import type { UserRepo } from "@/lib/github/repos";

const MS_DAY = 86_400_000;

/** Pesan hanya baris pertama, dipotong — cukup untuk roast & display. */
function tidyMessage(message: string): string {
  const first = message.split("\n", 1)[0] ?? "";
  return first.length > 140 ? `${first.slice(0, 139)}…` : first;
}

/** Commit dengan tanggal masa depan (humor repo, datetime bogus) ikut saring. */
function isFutureCommit(dateIso: string): boolean {
  return Date.parse(dateIso) > Date.now() + 60_000;
}

/* ---------- Lapisan A: commit repo milik sendiri (REST) ---------- */

interface RestCommitItem {
  sha: string;
  commit: { message: string; author: { date: string } };
}

/**
 * Commit di repo milik sendiri via REST /repos/{r}/commits:
 * kuota 1 request per repo-aktif, tanggal author persis, dan — yang
 * paling penting — bebas dari commit "email-linked" di repo mirror/
 * tiruan pihak ketiga (kasus nyata: comminate/committed milik torvalds).
 */
async function fetchOwnedRepoCommits(
  username: string,
  repos: UserRepo[],
  sinceIso: string,
): Promise<Array<{ repo: string } & CommitInfo>> {
  const results = await Promise.allSettled(
    repos.map((repo) =>
      githubFetch<RestCommitItem[]>(
        `/repos/${repo.fullName}/commits?per_page=100&since=${encodeURIComponent(sinceIso)}&author=${encodeURIComponent(username)}`,
      ),
    ),
  );

  const out: Array<{ repo: string } & CommitInfo> = [];
  results.forEach((result, index) => {
    if (result.status !== "fulfilled") return; // 1 repo bocor ≠ war total
    const fullName = repos[index]?.fullName;
    for (const item of result.value) {
      if (!fullName || !item.commit) continue;
      if (isFutureCommit(item.commit.author.date)) continue;
      out.push({
        sha: item.sha,
        message: tidyMessage(item.commit.message),
        repo: fullName,
        pushedAt: item.commit.author.date,
      });
    }
  });
  return out;
}

/* ---------- Lapisan B: filler lintas-repo (search/commits) ---------- */

interface SearchResultItem extends RestCommitItem {
  repository: { full_name: string };
}

interface SearchResults {
  total_count: number;
  items: SearchResultItem[];
}

/**
 * MENGAPA search/commits untuk filler?
 * GitHub menghapus `payload.commits` dari PushEvent di Events API
 * (tiga kali GitHub API terkini, PushEvent kini tanpa detail commit —
 * ditemukan saat smoke test). search/commits memberi timestamp + repo
 * dalam SATU request per 100 commit. Tradeoff: hanya indeks branch
 * default repo publik; dan bisa memuat commit "email-linked" di repo
 * mirror pihak ketiga — itulah alasan ini hanya menjadi pengisi,
 * bukan sumber utama.
 */
async function fetchCrossRepoCommits(
  username: string,
  dateOnlyCutoff: string,
): Promise<Array<{ repo: string } & CommitInfo>> {
  const handle = username.toLowerCase();
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  await sleep(800); // Reader tempo: layer A (REST) baru saja membakar 8 request.
  const q = `author:${encodeURIComponent(username)} author-date:>=${dateOnlyCutoff}`;
  const commitsBySha = new Map<string, { repo: string } & CommitInfo>();
  const otherCommits: Array<{ repo: string } & CommitInfo> = [];

  // Halaman-1 wajib mencoba keras: retry backoff dua kali bila kena
  // secondary rate limit — diakhiri degrade anggun (kosong ≠ gagal total,
  // layer A tetap memberi data). Halaman-2 opsional, gagal sekali → berhenti.
  let firstPage: SearchResultItem[] = [];
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await sleep(1500 * attempt);
    try {
      const res = await githubFetch<SearchResults>(
        `/search/commits?q=${encodeURIComponent(q)}&sort=author-date&order=desc&per_page=100&page=1`,
      );
      firstPage = res.items;
      break;
    } catch (error) {
      const retriable =
        error instanceof GitHubApiError &&
        (error.kind === "blocked" || error.kind === "rate-limited" ||
          error.kind === "network" || error.kind === "unexpected");
      if (!retriable) throw error;
      if (attempt === 2) {
        console.warn("[commits] search/commits gagal terus — pakai hasil layer A saja");
        return [];
      }
    }
  }

  const pages: SearchResultItem[][] = [firstPage];

  // Dua halaman cukup; halaman-2 opsional (throttle + degrade anggun,
  // search API sensitif terhadap burst/log beruntun).
  for (let page = 2; page <= 2; page++) {
    await sleep(300);
    try {
      const res = await githubFetch<SearchResults>(
        `/search/commits?q=${encodeURIComponent(q)}&sort=author-date&order=desc&per_page=100&page=${page}`,
      );
      pages.push(res.items);
    } catch {
      break; // Halaman tambahan cukup dikaburkan.
    }
  }

  for (const items of pages) {
    if (items.length === 0) continue;

    for (const item of items) {
      if (commitsBySha.has(item.sha)) continue;
      if (isFutureCommit(item.commit.author.date)) continue;
      const info = {
        sha: item.sha,
        message: tidyMessage(item.commit.message),
        repo: item.repository.full_name,
        pushedAt: item.commit.author.date,
      };
      commitsBySha.set(item.sha, info);
      const owner = item.repository.full_name.split("/")[0]?.toLowerCase();
      if (owner !== handle) otherCommits.push(info);
    }
  }

  return otherCommits;
}

/* ---------- Pintu utama ---------- */

/**
 * Commit terakhir user, dua lapis:
 *   1. Commit di repo sendiri (REST, akurat) selalu menang prioritas.
 *   2. Bila belum mencapai `max`, diisi commit lintas-repo (search).
 * Hasil diurut terbaru-lebih-dulu lalu dipotong `max`.
 */
export async function fetchRecentCommits(
  username: string,
  /** Daftar repo-aktif milik sendiri — dari fetchOwnRepos(). */
  ownRecentRepos: UserRepo[],
  /** Batas commit yang diambil (PRD: 100 commit terakhir). */
  max = 100,
  /** Jendela waktu (hari) untuk filter REST & kualifikasi kueri search. */
  days = 120,
): Promise<CommitInfo[]> {
  const sinceDate = new Date(Date.now() - days * MS_DAY);
  const sinceIso = sinceDate.toISOString();
  const cutoffDateOnly = sinceIso.slice(0, 10); // YYYY-MM-DD

  const owned = await fetchOwnedRepoCommits(username, ownRecentRepos, sinceIso);
  const crossRepo = await fetchCrossRepoCommits(username, cutoffDateOnly);

  // Dedupe by sha (commit bisa muncul di kedua lapis).
  const seen = new Set<string>();
  const deduped = [...owned, ...crossRepo].filter((commit) => {
    const key = commit.sha;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Cap per-repo non-owned: satu robot-mirror tidak boleh menguasai
  // seluruh sampel (kasus nyata: 99/100 commit dari satu repo mirror).
  const handle = username.toLowerCase();
  const perRepoCount = new Map<string, number>();
  const CAP_NON_OWNED = 25;
  const capped = deduped.filter((commit) => {
    const owner = commit.repo.split("/")[0]?.toLowerCase();
    if (owner === handle) return true; // repo sendiri tidak dibatasi
    const count = perRepoCount.get(commit.repo) ?? 0;
    perRepoCount.set(commit.repo, count + 1);
    return count < CAP_NON_OWNED;
  });

  // Terbaru lebih dulu, lalu potong ke batas.
  capped.sort((a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt));
  return capped.slice(0, max).map(
    ({ sha, message, repo, pushedAt }) => ({ sha, message, repo, pushedAt }),
  );
}
