/**
 * Loader font untuk Satori (@vercel/og) — file woff static di public/fonts.
 * Satori TIDAK mendukung variable font, jadi kita ambil per-weight file static
 * dari Fontsource (subset latin, ~30 KB / file).
 * Hasil di-load sekali per instance server (cache level module).
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

import "server-only";

export interface OGFontData {
  name: string;
  data: Buffer;
  weight: 300 | 400 | 500;
  style: "normal" | "italic";
}

const FONT_FILES: readonly {
  name: string;
  file: string;
  weight: OGFontData["weight"];
  style: OGFontData["style"];
}[] = [
  { name: "Inter", file: "inter-latin-300-normal.woff", weight: 300, style: "normal" },
  { name: "Inter", file: "inter-latin-400-normal.woff", weight: 400, style: "normal" },
  { name: "Inter", file: "inter-latin-500-normal.woff", weight: 500, style: "normal" },
  {
    name: "Playfair Display",
    file: "playfair-display-latin-400-italic.woff",
    weight: 400,
    style: "italic",
  },
];

let cache: Promise<OGFontData[]> | null = null;

export function loadOGFonts(): Promise<OGFontData[]> {
  cache ??= Promise.all(
    FONT_FILES.map(async (font) => ({
      name: font.name,
      weight: font.weight,
      style: font.style,
      data: await readFile(path.join(process.cwd(), "public", "fonts", font.file)),
    })),
  );
  return cache;
}
