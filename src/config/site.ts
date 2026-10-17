// Konstanta global aplikasi. Sumber tunggal untuk metadata & limit MVP.
// NOTE: ganti url sesuai domain produksi saat deploy ke Vercel.
export const site = {
  name: "DevRoast & Wrapped",
  // `||` — bila NEXT_PUBLIC_APP_URL di-set tapi kosong, anggap tidak ada.
  url: process.env.NEXT_PUBLIC_APP_URL || "https://devroast-n-wrapped.vercel.app",
  description:
    "Wrapped statistik GitHub-mu ala Spotify Wrapped — lengkap dengan roast yang lucu, tajam, dan siap di-share.",
  /** Jumlah slide wrapped untuk MVP. */
  slidesCount: 6,
  /** Maksimum commit yang dianalisis (PRD: 100 commit terakhir). */
  maxCommits: 100,
  /** Jendela kueri commit dalam hari (search/commits author-date). */
  recentCommitDays: 120,
  /** Model Gemini untuk roast (bisa dioverride via GEMINI_MODEL). */
  geminiModel: "gemini-3.8-flash",
} as const;

export type Site = typeof site;
