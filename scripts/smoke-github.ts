/** Smoke test F1 — memanggil GitHub API asli.
 * Jalankan: pnpm dlx tsx scripts/smoke-github.ts [username]
 * Tanpa token: batas 60 req/jam/IP (script butuh ~6). Setelah `.env.local`
 * berisi GITHUB_TOKEN, load `.env` dulu, contoh:
 *   pnpm dlx tsx --env-file=.env.local scripts/smoke-github.ts torvalds
 * CATATAN: generateWrapped() tidak bisa dijalankan dari luar runtime Next
 * (pakai next/cache), jadi yang ditest lapisan github/* + analyze.
 */
import { isGitHubUsername } from "../src/lib/github/client";
import { fetchProfile } from "../src/lib/github/profile";
import { fetchRecentCommits } from "../src/lib/github/commits";
import { fetchOwnRepos, countLanguages } from "../src/lib/github/repos";
import { fetchOldestOpenPR } from "../src/lib/github/search";
import { analyze } from "../src/lib/analyze";
import { site } from "../src/config/site";

const USERNAME = process.argv[2] ?? "gaearon";

async function main() {
  console.log(`[smoke] user: ${USERNAME} (valid: ${isGitHubUsername(USERNAME)})`);

  const profile = await fetchProfile(USERNAME);
  console.log("[profile]", profile.login, profile.publicRepos, "repos,", new Date(profile.createdAt).getFullYear());

  const repos = await fetchOwnRepos(USERNAME, site.recentCommitDays);
  const languages = countLanguages(repos.all);
  console.log(
    "[repos]",
    repos.all.length,
    "non-fork milik sendiri;",
    repos.recent.length,
    "aktif di-scan:",
    repos.recent.map((r) => r.fullName).join(", ") || "(tidak ada)",
  );

  const commits = await fetchRecentCommits(USERNAME, repos.recent, site.maxCommits, site.recentCommitDays);
  console.log("[commits]", commits.length, "unik;", "contoh:", commits[0]?.repo, "—", commits[0]?.message?.slice(0, 48));
  console.log("[languages]", languages.slice(0, 4), `(${languages.length} jenis)`);

  const pr = await fetchOldestOpenPR(USERNAME);
  console.log("[oldest-open-pr]", pr ? `${pr.repo} | ${pr.title?.slice(0, 48)} | ${Math.floor(pr.ageDays / 30)} bulan` : "tidak ada");

  const stats = analyze(profile, commits, languages, pr);
  console.log("[analyze]");
  console.log("  commitCount:", stats.commitCount);
  console.log("  topHour (WIB):", stats.topHour.hour, "—", (stats.topHour.share * 100).toFixed(0) + "%");
  console.log("  buckets:", stats.hourBuckets.map((b) => `${b.bucket} ${(b.share * 100).toFixed(0)}%`).join(" | "));
  console.log("  topRepo:", stats.topRepo);
  console.log("  accountAgeYears:", stats.profile.accountAgeYears);
}

main().catch((e) => {
  console.error("[smoke gagal]", e);
  process.exit(1);
});
