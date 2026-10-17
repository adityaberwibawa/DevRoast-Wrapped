/**
 * Smoke test F2 — pipeline GitHub lengkap + Gemini roast.
 * Jalankan: pnpm dlx tsx --env-file=.env.local scripts/smoke-roast.ts [username]
 * Catatan: buildRoast memanggil Gemini asli (berbiaya kecil, 1 call/user).
 */
import { isGitHubUsername } from "../src/lib/github/client";
import { fetchProfile } from "../src/lib/github/profile";
import { fetchRecentCommits } from "../src/lib/github/commits";
import { fetchOwnRepos, countLanguages } from "../src/lib/github/repos";
import { fetchOldestOpenPR } from "../src/lib/github/search";
import { analyze } from "../src/lib/analyze";
import { buildRoast } from "../src/lib/roast";
import { site } from "../src/config/site";

const USERNAME = process.argv[2] ?? "torvalds";

async function main() {
  if (!isGitHubUsername(USERNAME)) throw new Error("username tidak valid");
  const t0 = Date.now();

  const profile = await fetchProfile(USERNAME);
  const repos = await fetchOwnRepos(USERNAME, site.recentCommitDays);
  const commits = await fetchRecentCommits(USERNAME, repos.recent, site.maxCommits, site.recentCommitDays);
  const pr = await fetchOldestOpenPR(USERNAME);
  const languages = countLanguages(repos.all);

  const stats = analyze(profile, commits, languages, pr);
  console.log(`[pipeline] ${stats.commitCount} commit, ${Date.now() - t0}ms`);

  const t1 = Date.now();
  const roast = await buildRoast(stats);
  console.log(`[roast] fallback=${roast.fallback}, ${Date.now() - t1}ms, model=${process.env.GEMINI_MODEL ?? site.geminiModel}`);

  console.log("shareText:", roast.shareText);
  for (const [key, text] of Object.entries(roast.slides)) {
    console.log(`\n[${key}] ${text}`);
  }

  console.log(`\n[total] ${Date.now() - t0}ms`);
}

main().catch((e) => {
  console.error("[smoke gagal]", e);
  process.exit(1);
});
