/**
 * Tipe domain DevRoast & Wrapped.
 * Sumber: PRD.md §Key Features + struktur hasil GitHub API.
 * Catatan: return "use cache" harus serializable — jangan pakai class/Date methods.
 */

/* ---------- GitHub raw ---------- */

export interface GitHubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
  bio: string | null;
  publicRepos: number;
  followers: number;
  createdAt: string; // ISO — sejak kapan akun dibuat
}

/** Satu commit unik hasil agregasi PushEvent (≤ 100 commit terakhir). */
export interface CommitInfo {
  sha: string;
  message: string;
  repo: string; // "owner/repo"
  pushedAt: string; // ISO UTC — timestamp event push
}

export interface LanguageCount {
  language: string;
  repos: number;
}

/** PR open milik user yang paling lama terbengkalai. */
export interface NeglectedPR {
  title: string;
  repo: string;
  url: string;
  createdAt: string; // ISO
  ageDays: number;
}

/* ---------- Statistik hasil analisis ---------- */

export type HourBucket = "subuh" | "pagi" | "siang" | "malam";

export interface HourBucketStat {
  bucket: HourBucket;
  count: number;
  share: number; // 0..1
}

export interface TopHourStat {
  hour: number; // 0..23 WIB
  count: number;
  share: number; // 0..1
}

export interface WrappedStats {
  /** Jumlah commit unik yang dianalisis (≤ 100). */
  commitCount: number;
  /** Distribusi 4 bucket waktu (WIB), urut: subuh, pagi, siang, malam. */
  hourBuckets: HourBucketStat[];
  /** Jam paling sering push (WIB). */
  topHour: TopHourStat;
  /** Bahasa favorit (repo milik sendiri yang non-fork), urut menurun. */
  languages: LanguageCount[];
  /** Repo dengan commit terbanyak dalam sampel. */
  topRepo: { repo: string; commitCount: number } | null;
  /** PR open paling tua; null jika tidak ada / tak terdeteksi. */
  neglectedPR: NeglectedPR | null;
  /** Beberapa pesan commit (unik, baris pertama) — flavor di prompt LLM. */
  sampleMessages: string[];
  /** Info profil ringan yang dikirim ke LLM / UI. */
  profile: {
    login: string;
    name: string | null;
    publicRepos: number;
    accountAgeYears: number;
  };
}

/* ---------- Roast ---------- */

export interface RoastResult {
  /** Teks pendek untuk caption share. */
  shareText: string;
  /** Roast per slide, key = slide id (cover, hour, language, repo, pr, verdict). */
  slides: Partial<
    Record<
      "cover" | "hour" | "language" | "repo" | "pr" | "verdict",
      string
    >
  >;
  /** true jika bukan output Gemini tapi template fallback. */
  fallback: boolean;
}

/* ---------- Hasil pipeline ---------- */

export type WrappedFailureReason =
  | "invalid-username"
  | "not-found"
  | "no-activity"
  | "rate-limited"
  | "unavailable";

export type WrappedResult =
  | {
      ok: true;
      profile: GitHubProfile;
      stats: WrappedStats;
      /** Selalu terisi — Gemini atau template fallback. */
      roast: RoastResult;
      generatedAt: string;
    }
  | {
      ok: false;
      reason: WrappedFailureReason;
      /** CopyBahasa Indonesia siap-tampil di UI. */
      message: string;
    };
