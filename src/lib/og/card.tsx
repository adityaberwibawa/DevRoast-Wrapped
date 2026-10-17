/**
 * Kartu Satori — dipakai dua endpoint:
 *  - OG 1200×630   (pratinjau link di chat / sosmed)
 *  - Story 1080×1920 (kartu instastory: unduh & Web Share file)
 *
 * Bahasa desain = Anytype: angka Inter 300 tracking rapat, serif italic
 * untuk satu kalimat emosional, mint sebagai sentuhan aksen tunggal,
 * gradient pastel hanya sebagai latar belakang.
 * Satori = flexbox murni: tanpa Tailwind, semua inline style.
 */
import type { WrappedOk } from "@/components/wrapped/slides";

export type CardVariant = "og" | "story";

/* Palet biar tak tercecer (hex — tanpa var() karena Satori murni) */
const INK = "#000000";
const INK_SUBTLE = "#808080";
const MINT = "#3cd9b3";

const TOKEN = {
  label: { color: INK_SUBTLE, letterSpacing: 2 } as const,
  roast: { color: INK } as const,
};

/** Potong teks roast supaya aman jatuh di kartu — memotong di batas kata. */
function clamp(text: string, max: number): string {
  const flat = text.trim().replace(/\s+/g, " ");
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** Ubah nilai jam 0..23 → "22.00". */
function hourLabel(hour: number): string {
  return `${String(hour).padStart(2, "0")}.00`;
}

const GRADIENT = {
  og:
    "linear-gradient(160deg, #ffffff 22%, #ffedbe 55%, #cdffea 78%, #e7d4ff 100%)",
  story:
    "linear-gradient(170deg, #ffffff 18%, #ffedbe 45%, #cdffea 68%, #e7d4ff 88%, #ffbcc3 100%)",
} as const;

type CardProps = {
  data: WrappedOk;
  variant: CardVariant;
};

/* Skala Tipografi per varian */
const TYPE = {
  og: {
    label: 24,
    handle: 26,
    name: 84,
    nameTrack: -4,
    quote: 40,
    quoteLine: 1.35,
    statLabel: 22,
    statValue: 56,
    footer: 22,
    pad: { x: 72, y: 56 },
  },
  story: {
    label: 30,
    handle: 32,
    name: 128,
    nameTrack: -6,
    quote: 62,
    quoteLine: 1.3,
    statLabel: 22,
    statValue: 96,
    footer: 28,
    pad: { x: 96, y: 96 },
  },
} as const;

export function SatoriCard({ data, variant }: CardProps) {
  const t = TYPE[variant];
  const { profile, stats, roast } = data;

  /* Ringkasan 3 titik data: jam, bahasa, repo */
  const lines: { label: string; value: string }[] = [
    { label: "JAM PALING RAME", value: hourLabel(stats.topHour.hour) },
    {
      label: "REPO FAVORIT",
      value: stats.topRepo ? `${stats.topRepo.commitCount} commit` : "—",
    },
    {
      label: "PR TERBENGBKALAI",
      value: stats.neglectedPR ? `${stats.neglectedPR.ageDays} hari` : "0",
    },
  ];

  /* Satori: default display flex, susunan kolom */
  return (
    <div
      style={{
        width: variant === "og" ? 1200 : 1080,
        height: variant === "og" ? 630 : 1920,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        backgroundImage: GRADIENT[variant],
        fontFamily: "Inter",
        color: INK,
        padding: `${t.pad.y}px ${t.pad.x}px`,
      }}
    >
      {/* Baris atas */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: t.label,
            fontWeight: 500,
            ...TOKEN.label,
          }}
        >
          DEVROAST &amp; WRAPPED
        </div>
        <div style={{ fontSize: t.handle, color: INK_SUBTLE }}>
          {`@${profile.login}`}
        </div>
      </div>

      {/* Tengah: nama + angka-angka + anjuran serif */}
      <div style={{ display: "flex", flexDirection: "column", gap: variant === "og" ? 28 : 56 }}>
        <div
          style={{
            fontSize: t.name,
            fontWeight: 300,
            letterSpacing: t.nameTrack,
            lineHeight: 1,
          }}
        >
          {profile.name ?? profile.login}
        </div>

        {/* Tiga statistik jadi satu baris kolom */}
        {/* Statistik: OG = 3 kolom; story = 3 baris penuh (muat label panjang) */}
        <div
          style={{
            display: "flex",
            flexDirection: variant === "story" ? "column" : "row",
            gap: variant === "og" ? 48 : 64,
            marginTop: variant === "og" ? 4 : 12,
          }}
        >
          {lines.map((line) =>
            variant === "story" ? (
              <div
                key={line.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontSize: t.statLabel, fontWeight: 500, ...TOKEN.label }}>
                  {line.label}
                </div>
                <div style={{ fontSize: t.statValue, fontWeight: 300, letterSpacing: -2 }}>
                  {line.value}
                </div>
              </div>
            ) : (
              <div key={line.label} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: t.statLabel, fontWeight: 500, ...TOKEN.label }}>
                  {line.label}
                </div>
                <div style={{ fontSize: t.statValue, fontWeight: 300, letterSpacing: -2 }}>
                  {line.value}
                </div>
              </div>
            ),
          )}
        </div>

        {/* Kalimat sindiran — serif italic, aksen tanda kutip mint */}
        <div
          style={{
            display: "flex",
            gap: 18,
            marginTop: variant === "og" ? 6 : 20,
            maxWidth: variant === "og" ? 860 : 820,
          }}
        >
          <div style={{ fontFamily: "Playfair Display", fontStyle: "italic", color: MINT, fontSize: t.quote, lineHeight: t.quoteLine }}>
            “
          </div>
          <div
            style={{
              fontFamily: "Playfair Display",
              fontStyle: "italic",
              fontSize: t.quote,
              lineHeight: t.quoteLine,
              ...TOKEN.roast,
            }}
          >
            {clamp(roast.slides.verdict ?? roast.shareText, variant === "og" ? 96 : 150)}
          </div>
        </div>
      </div>

      {/* Baris bawah */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: t.footer, color: INK_SUBTLE }}>
          {`${fmtInt(stats.commitCount)} commit · ${stats.profile.accountAgeYears} tahun GitHub`}
        </div>
        <div style={{ fontSize: t.footer, color: INK_SUBTLE }}>
          tanpa login · data GitHub publik
        </div>
      </div>
    </div>
  );
}

function fmtInt(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}
