import { fallbackRoast } from "../src/lib/roast/fallback";
import type { WrappedStats } from "../src/lib/types";

const stats = {
  commitCount: 0,
  hourBuckets: [
    { bucket: "malam", count: 0, share: 0 },
    { bucket: "pagi", count: 0, share: 0 },
    { bucket: "siang", count: 0, share: 0 },
    { bucket: "subuh", count: 0, share: 0 },
  ],
  topHour: { hour: 23, count: 0, share: 0 },
  languages: [{ language: "TypeScript", repos: 41 }],
  topRepo: null,
  neglectedPR: null,
  sampleMessages: [],
  profile: { login: "example", name: null, publicRepos: 3, accountAgeYears: 2 },
} as unknown as WrappedStats;

const r = fallbackRoast(stats);
console.log("fallback =", r.fallback);
console.log("shareText:", r.shareText);
for (const [key, value] of Object.entries(r.slides)) {
  console.log(`[${key}] ${value}`);
}
