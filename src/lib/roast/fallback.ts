import type { HourBucket, RoastResult, WrappedStats } from "@/lib/types";
import { site } from "@/config/site";

/**
 * Roast template deterministik — dipakai sebagai fallback penuh
 * maupun penyelamat slide yang tidak terisi Gemini.
 * Kalimat tetap dibuat generik-lucu karena template tidak tahu siapa user.
 */

const FLAVOR_BY_BUCKET: Record<HourBucket, string> = {
  subuh: "romantis, sampai bug-nya justru bangun di jam kerja",
  pagi: "siap dan sehat, hanya korban-korban meeting yang sedikit banyak",
  siang: "jujur dan selaras — statistik teknis yang paling membosankan",
  malam: "jarang produktif, seringnya adalah pelarian yang berkualitas",
};

function percent(share: number): string {
  return `${Math.max(1, Math.round(share * 100))}%`;
}

function labelBucket(bucket: HourBucket): string {
  switch (bucket) {
    case "subuh":
      return "di jam subuh";
    case "pagi":
      return "pagi-pagi";
    case "siang":
      return "pas siang-siang";
    case "malam":
      return "tengah malam";
  }
}

function hourLine(stats: WrappedStats): string {
  const top = [...stats.hourBuckets].sort((a, b) => b.share - a.share)[0];
  if (!top || top.count === 0) {
    return "Tidak ada commit dalam sampel. Jam kerjamu kosong, dan slide ini tak berguna.";
  }
  return `${percent(top.share)} commit kamu ${labelBucket(top.bucket)} — ${FLAVOR_BY_BUCKET[top.bucket]}.`;
}

export function fallbackRoast(stats: WrappedStats): RoastResult {
  const login = stats.profile.login;
  const years = stats.profile.accountAgeYears;
  const repos = stats.profile.publicRepos;

  const cover = `Halo @${login} — ${stats.commitCount} commit dari akun ${years} tahun dengan ${repos} repo publik. Mari kita baca.`;

  const language = (() => {
    const top = stats.languages[0];
    if (!top) {
      return "Bahasa favoritmu tidak terbaca. Misterius, atau kehabisan semangat.";
    }
    const second = stats.languages[1];
    const tail = second
      ? `, ${second.language} menyusul`
      : " — satu bahasa, satu jalur";
    return `${top.language} menang dengan ${top.repos} repo${tail}. Pilihan bagus — atau kecanduan yang tertata.`;
  })();

  const repo = (() => {
    if (!stats.topRepo) {
      return "Commit kamu tersebar ke banyak repo. Penjelajah, bukan penjaga.";
    }
    const { repo, commitCount } = stats.topRepo;
    return `${repo} menelan ${commitCount} dari ${stats.commitCount} commit kamu. Cinta satu-arah yang konsisten.`;
  })();

  const pr = (() => {
    const pr = stats.neglectedPR;
    if (!pr) {
      return "Tidak ada PR terbengkalai. Kerapian seperti ini patut dicurigai.";
    }
    const months = Math.max(1, Math.round(pr.ageDays / 30));
    return `PR "${pr.title}" di ${pr.repo} sudah ${months} bulan. Ia bukan menggantung — ia di-arsipkan.`;
  })();

  const verdict = (() => {
    if (stats.neglectedPR) {
      return "Commit-nya kencang, PR-nya parkir. Klasik: berani mulai, takut menuntaskan.";
    }
    return "Semua rapi, semua terbaca. Terlalu jujur — masih dianggap keanehan.";
  })();

  const shareText = `Wrapped GitHub @${login}: disindir dalam ${site.slidesCount} slide.`;

  return {
    shareText,
    slides: { cover, hour: hourLine(stats), language, repo, pr, verdict },
    fallback: true,
  };
}
