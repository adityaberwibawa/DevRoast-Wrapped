/**
 * OG image file-convention: /u/[username]/opengraph-image
 * Kartu 1200×630 untuk pratinjau link (WhatsApp/X/GitHub README dsb).
 * Dipanggil saat request share — data lewat pipeline cache 15 menit.
 */
import { ImageResponse } from "next/og";
import { generateWrapped } from "@/lib/wrapped";
import { loadOGFonts } from "@/lib/og/fonts";
import { SatoriCard, type CardVariant } from "@/lib/og/card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username: raw } = await params;
  const result = await generateWrapped(raw);

  const fonts = await loadOGFonts();

  if (!result.ok) {
    // Kartu gagal sederhana — tetap brand, tanpa teks spesifik user
    return new ImageResponse(
      (
        <div
          style={{
            width: size.width,
            height: size.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            backgroundColor: "#ffffff",
            backgroundImage:
              "linear-gradient(160deg, #ffffff 30%, #cdffea 75%, #e7d4ff 100%)",
            fontFamily: "Inter",
          }}
        >
          <div style={{ fontSize: 52, fontWeight: 500, letterSpacing: 2 }}>
            DEVROAST &amp; WRAPPED
          </div>
          <div style={{ fontSize: 34, color: "#808080" }}>
            Username ini nggak ketemu — coba @handle lain.
          </div>
        </div>
      ),
      { ...size, fonts },
    );
  }

  return new ImageResponse(
    <SatoriCard data={result} variant={"og" satisfies CardVariant} />,
    { ...size, fonts },
  );
}
