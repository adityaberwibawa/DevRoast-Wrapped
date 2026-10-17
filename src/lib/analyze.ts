import type {
  CommitInfo,
  GitHubProfile,
  HourBucket,
  HourBucketStat,
  LanguageCount,
  NeglectedPR,
  TopHourStat,
  WrappedStats,
} from "@/lib/types";

const MS_DAY = 86_400_000;
const WIB_OFFSET = 7;
const BUCKETS: readonly HourBucket[] = ["subuh", "pagi", "siang", "malam"];

/** Jam WIB (0–23) dari timestamp GitHub ISO UTC. */
function wibHour(pushedAt: string): number {
  return (new Date(pushedAt).getUTCHours() + WIB_OFFSET) % 24;
}

function bucketOf(hour: number): HourBucket {
  if (hour < 6) return "subuh";
  if (hour < 12) return "pagi";
  if (hour < 18) return "siang";
  return "malam";
}

/**
 * Mengubah data mentah GitHub menjadi statistik wrap deterministik.
 * Murni & tanpa efek samping — mudah dites, mudah dipakai ulang saat regen.
 * Semua pertimbangan "humor" dilakukan LLM di F2, di sini data murni.
 */
export function analyze(
  profile: GitHubProfile,
  commits: CommitInfo[],
  rawLanguages: LanguageCount[],
  neglectedPR: NeglectedPR | null,
  now: Date = new Date(),
): WrappedStats {
  const total = commits.length || 1;

  // --- Distribusi jam push (WIB) ---
  const perHour = new Array<number>(24).fill(0);
  for (const commit of commits) perHour[wibHour(commit.pushedAt)]++;

  const topHourIdx = perHour.reduce(
    (best, count, hour) => (count > perHour[best] ? hour : best),
    0,
  );

  const hourBuckets: HourBucketStat[] = BUCKETS.map((bucket) => {
    const count = perHour.reduce(
      (sum, count, hour) => (bucketOf(hour) === bucket ? sum + count : sum),
      0,
    );
    return { bucket, count, share: count / total };
  });

  const topHour: TopHourStat = {
    hour: topHourIdx,
    count: perHour[topHourIdx],
    share: perHour[topHourIdx] / total,
  };

  // --- Bahasa favorit: top 3 + "Lainnya" ---
  const languages: LanguageCount[] =
    rawLanguages.length > 3
      ? [
          ...rawLanguages.slice(0, 3),
          {
            language: "Lainnya",
            repos: rawLanguages
              .slice(3)
              .reduce((sum, l) => sum + l.repos, 0),
          },
        ]
      : rawLanguages;

  // --- Repo favorit ---
  const perRepo = new Map<string, number>();
  for (const commit of commits) {
    perRepo.set(commit.repo, (perRepo.get(commit.repo) ?? 0) + 1);
  }
  let topRepo: WrappedStats["topRepo"] = null;
  for (const [repo, commitCount] of perRepo) {
    if (
      topRepo === null ||
      commitCount > topRepo.commitCount ||
      (commitCount === topRepo.commitCount && repo < topRepo.repo)
    ) {
      topRepo = { repo, commitCount };
    }
  }
  // Repo favorit tak berarti kalau cuma 1 commit sendirian di sampel.
  if (topRepo !== null && topRepo.commitCount === 1 && total === 1) {
    topRepo = null;
  }

  return {
    commitCount: commits.length,
    hourBuckets,
    topHour,
    languages,
    topRepo,
    neglectedPR,
    sampleMessages: [...new Set(commits.map((c) => c.message))].slice(0, 8),
    profile: {
      login: profile.login,
      name: profile.name,
      publicRepos: profile.publicRepos,
      accountAgeYears: Math.floor((now.getTime() - Date.parse(profile.createdAt)) / MS_DAY / 365.25),
    },
  };
}
