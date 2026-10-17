import type { WrappedStats } from "@/lib/types";

/**
 * Kumpulan prompt & schema untuk roast generator.
 * Persona: komedian tech Indonesia — menyindir KEBIASAAN, bukan pribadi.
 */

export type RoastSlideKey =
  | "cover"
  | "hour"
  | "language"
  | "repo"
  | "pr"
  | "verdict";

export const ROAST_SLIDE_KEYS: readonly RoastSlideKey[] = [
  "cover",
  "hour",
  "language",
  "repo",
  "pr",
  "verdict",
] as const;

/** JSON schema untuk structured output Gemini. */
export const roastSchema = {
  type: "object",
  properties: {
    shareText: {
      type: "string",
      description:
        "Caption hook untuk share, ≤ 12 kata. Menggoda untuk klik, jangan sobe sombong.",
    },
    slides: {
      type: "object",
      properties: {
        cover: {
          type: "string",
          description:
            "Sambutan terhadap akun (@username + angka kunci), ≤ 22 kata.",
        },
        hour: {
          type: "string",
          description:
            "Sindiran tentang jam push (pakai topHour & share), ≤ 22 kata.",
        },
        language: {
          type: "string",
          description:
            "Sindiran tentang bahasa favorit (sebut bahasa + repo count), ≤ 22 kata.",
        },
        repo: {
          type: "string",
          description:
            "Sindiran tentang repo favorit (sebut repo + share commit), ≤ 22 kata.",
        },
        pr: {
          type: "string",
          description:
            "Sindiran PR terbengkalai (sebut repo + lamaSleep bulan); bila null, sindir kerapian selesai terlalu sering, ≤ 22 kata.",
        },
        verdict: {
          type: "string",
          description:
            "Kesimpulan rapat full akun, satu kalimat tajam-witty, ≤ 25 kata.",
        },
      },
      required: ["cover", "hour", "language", "repo", "pr", "verdict"],
    },
  },
  required: ["shareText", "slides"],
} as const;

const RULES = [
  "Kamu adalah 'DevRoast': komedian tech Indonesia yang menyindir KEBIASAAN KERJA KODING seseorang berdasarkan data GitHub mereka.",
  "Roast tayang sebagai slide thresh ala Instastory: pendek, satu kalimat, lucu, tajam, tapi hangat — sindiran, bukan bully.",
  "",
  "ATURAN KERAS:",
  "1. Sindir HANYA kebiasaan koding (jam kerja, bahasa, repo, PR, pesan commit). JANGAN menyindir fisik, nama asli, gender, etnis, agama, ras, orientasi, kondisi mental atau kesehatan.",
  "2. Bahasa Indonesia santai yang pintar (bebas slang ringan). Tanpa kata kasar, tanpa emoji.",
  "3. Data adalah plakat: angka, nama repo, bahasa, dan jam WAJIB dari data di bawah — jangan mengarang angka baru.",
  "4. Panjang: tiap slide ≤ 22 kata; verdict ≤ 25 kata; shareText ≤ 12 kata.",
  "5. Bila data aneh (misal: satu repo robot/mirror dominan), justru jadikan itu material utama.",
  "6. Output HANYA JSON valid sesuai schema. Tanpa penjelasan tambahan.",
].join("\n");

/** Prompt datar (instruksi + JSON data) untuk `input` interactions API. */
export function buildRoastPrompt(stats: WrappedStats): string {
  const payload = {
    login: stats.profile.login,
    nama_display: stats.profile.name,
    umur_akun_tahun: stats.profile.accountAgeYears,
    repo_publik: stats.profile.publicRepos,
    commit_dianalisis: stats.commitCount,
    jam_push_paling_sering_WIB: stats.topHour.hour,
    persentase_jam_sering: Math.round(stats.topHour.share * 100),
    distribusi_waktu: stats.hourBuckets.map((b) => ({
      bucket: b.bucket,
      persen: Math.round(b.share * 100),
    })),
    bahasa: stats.languages.map((l) => ({ bahasa: l.language, jumlah_repo: l.repos })),
    repo_favorit: stats.topRepo
      ? { repo: stats.topRepo.repo, dari_commit: stats.topRepo.commitCount, total: stats.commitCount }
      : null,
    pr_terbengkalai: stats.neglectedPR
      ? {
          repo: stats.neglectedPR.repo,
          judul: stats.neglectedPR.title,
          umur_hari: stats.neglectedPR.ageDays,
        }
      : null,
    contoh_pesan_commit: stats.sampleMessages.slice(0, 8),
  };

  return `${RULES}\n\nDATA (JSON):\n${JSON.stringify(payload)}`;
}
