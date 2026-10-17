/**
 * OG image file-convention untuk root: /opengraph-image
 * Kartu merek — tagline split serif, gradient pastel, aksen mint.
 * Di-render satu kali saat build (route root static).
 */
import { ImageResponse } from "next/og";
import { loadOGFonts } from "@/lib/og/fonts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DevRoast & Wrapped — kode kamu bicara, lalu kami sindir";

const SUBTLE = "#808080";
const MINT = "#3cd9b3";

export default async function Image() {
  const fonts = await loadOGFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          backgroundImage:
            "linear-gradient(160deg, #ffffff 25%, #ffedbe 55%, #cdffea 80%, #e7d4ff 100%)",
          fontFamily: "Inter",
          color: "#000000",
          padding: "56px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: 2, color: SUBTLE }}>
            {"DEVROAST & WRAPPED"}
          </div>
          <div style={{ fontSize: 26, color: SUBTLE }}>
            {"tanpa login · GitHub publik"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 92, fontWeight: 300, letterSpacing: -5.2, lineHeight: 1.1 }}>
            {"Kode kamu bicara."}
          </div>
          <div
            style={{
              display: "flex",
              gap: 20,
            }}
          >
            <div style={{ fontFamily: "Playfair Display", fontStyle: "italic", fontSize: 92, color: MINT, lineHeight: 1.1 }}>
              {"“"}
            </div>
            <div
              style={{
                fontFamily: "Playfair Display",
                fontStyle: "italic",
                fontSize: 92,
                letterSpacing: -2,
                lineHeight: 1.1,
              }}
            >
              {"Lalu kami sindir.”"}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 24, color: SUBTLE }}>
          {"Wrapped 6 slide ala Instastory — commit, jam coding, bahasa, repo, PR — plus roast yang jujur. Gratis."}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
