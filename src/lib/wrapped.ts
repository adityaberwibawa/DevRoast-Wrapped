import { cacheTag, cacheLife } from "next/cache";
import { analyze } from "@/lib/analyze";
import { buildRoast } from "@/lib/roast";
import { GitHubApiError } from "@/lib/github/errors";
import { isGitHubUsername } from "@/lib/github/client";
import { fetchProfile } from "@/lib/github/profile";
import { fetchRecentCommits } from "@/lib/github/commits";
import { fetchOwnRepos, countLanguages } from "@/lib/github/repos";
import { fetchOldestOpenPR } from "@/lib/github/search";
import type {
  WrappedResult,
  WrappedFailureReason,
} from "@/lib/types";
import { site } from "@/config/site";

/** Tag cache per-username — dipakai action refresh utk invalidasi. */
export function wrappedTag(username: string): string {
  return `wrapped:${username.toLowerCase()}`;
}

function failure(
  reason: WrappedFailureReason,
  message: string,
): WrappedResult {
  return { ok: false, reason, message };
}

/**
 * Diratakan-lowercase oleh CALLER (halaman/action) supaya `TorvaLds` dan
 * `torvalds` berbagi satu cache entry. Kontrak: input sudah lowercase-valid.
 */
export async function generateWrapped(
  username: string,
): Promise<WrappedResult> {
  "use cache";

  // Statistik GitHub bergerak pelan: content sama 15 menit itu sah.
  cacheLife({ stale: 0, revalidate: 900, expire: 86_400 });
  cacheTag(wrappedTag(username));

  const handle = username.trim();
  if (!isGitHubUsername(handle)) {
    return failure(
      "invalid-username",
      "Username GitHub cuma boleh huruf, angka, dan tanda minus.",
    );
  }

  try {
    const profile = await fetchProfile(handle);

    // Repo-milik-sendiri dulu (sumber daftar bahasa + takar target commit).
    const repos = await fetchOwnRepos(handle, site.recentCommitDays);

    // Paralel, tapi jangan saling gugur: satu endpoint kena limit ≠ war total.
    const [commitsRes, prRes] = await Promise.allSettled([
      fetchRecentCommits(handle, repos.recent, site.maxCommits, site.recentCommitDays),
      fetchOldestOpenPR(handle),
    ]);

    const commits =
      commitsRes.status === "fulfilled" ? commitsRes.value : [];
    const neglectedPR = prRes.status === "fulfilled" ? prRes.value : null;
    const languages = countLanguages(repos.all);

    const hasActivity = commits.length > 0 || languages.length > 0;
    if (!hasActivity) {
      return failure(
        "no-activity",
        "Akun ini nggak punya aktivitas publik yang bisa di-wrap. Tanam commit dulu, tarik napas, lalu coba lagi.",
      );
    }

    const stats = analyze(profile, commits, languages, neglectedPR);

    // Roast: Gemini dulu, gagal → template. Satu cache entry per username
    // berarti satu biaya LLM per jendela 15 menit.
    const roast = await buildRoast(stats);

    return { ok: true, profile, stats, roast, generatedAt: new Date().toISOString() };
  } catch (error) {
    if (error instanceof GitHubApiError) {
      const copy: Record<(typeof error)["kind"], string> = {
        "not-found":
          "Akun GitHub itu kayanya nggak ada. Cek lagi ejaannya?",
        "rate-limited":
          "Kuota GitHub API keburu habis. Santai, coba lagi nanti ya.",
        blocked: "GitHub nolak permintaan kita. Coba beberapa saat lagi.",
        network: "Koneksi ke GitHub terputus. Coba lagi sebentar.",
        unexpected: "Ada yang meleset di GitHub API. Coba lagi nanti.",
      };
      if (error.kind === "rate-limited" || error.kind === "blocked") {
        return failure("rate-limited", copy[error.kind]);
      }
      return failure(
        error.kind === "not-found" ? "not-found" : "unavailable",
        copy[error.kind],
      );
    }
    return failure("unavailable", "Ada yang meleset. Cek log dan coba lagi.");
  }
}
