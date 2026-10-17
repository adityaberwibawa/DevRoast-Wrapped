/**
 * Kartu story 1080×1920 — /u/[username]/story-image
 * Buat tombol "Unduh PNG" & Web Share file dari slide verdict.
 * Disposisi inline di browser + <a download> di sisi klien yang
 * memaksa file disimpan (same-origin).
 */
import { ImageResponse } from "next/og";
import { generateWrapped } from "@/lib/wrapped";
import { loadOGFonts } from "@/lib/og/fonts";
import { SatoriCard } from "@/lib/og/card";

export const size = { width: 1080, height: 1920 };
export const contentType = "image/png";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username: raw } = await params;
  const result = await generateWrapped(raw);
  const fonts = await loadOGFonts();
  const handle = result.ok ? result.profile.login : raw.toLowerCase();

  const body = result.ok ? (
    <SatoriCard data={result} variant="story" />
  ) : (
    <div
      style={{
        width: size.width,
        height: size.height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        backgroundColor: "#ffffff",
        backgroundImage:
          "linear-gradient(170deg, #ffffff 30%, #cdffea 75%, #e7d4ff 100%)",
        fontFamily: "Inter",
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 500, letterSpacing: 2 }}>
        DEVROAST &amp; WRAPPED
      </div>
      <div style={{ fontSize: 40, color: "#808080" }}>
        Username ini nggak ketemu — coba @handle lain.
      </div>
    </div>
  );

  return new ImageResponse(body, {
    ...size,
    fonts,
    headers: {
      "Cache-Control": "public, max-age=900, stale-while-revalidate=86400",
      "Content-Disposition": `inline; filename="devroast-${handle}.png"`,
    },
  });
}
