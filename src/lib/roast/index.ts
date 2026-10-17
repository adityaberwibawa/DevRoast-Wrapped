import { generateRoastData } from "@/lib/roast/gemini";
import { fallbackRoast } from "@/lib/roast/fallback";
import type { RoastResult, WrappedStats } from "@/lib/types";
import { ROAST_SLIDE_KEYS } from "@/lib/roast/prompt";

/**
 * Roast final: coba Gemini; slide yang gagal/kosong dilengkapi dengan
 * template fallback; jika Gemini sama sekali tidak memberikan apa-apa,
 * seluruh hasil template murni.
 *
 * Fungsi ini TIDAK menggunakan next/cache — hasilnya dibekukan di
 * cache entry generateWrapped (TTL 15 menit per username), sehingga
 * satu username = maksimal satu biaya LLM per window.
 */
export async function buildRoast(stats: WrappedStats): Promise<RoastResult> {
  const template = fallbackRoast(stats);

  try {
    const data = await generateRoastData(stats);
    if (!data) return template;

    const slides = { ...template.slides };
    for (const key of ROAST_SLIDE_KEYS) {
      const fromGemini = data.slides[key];
      if (fromGemini) slides[key] = fromGemini;
    }

    return {
      shareText: data.shareText ?? template.shareText,
      slides,
      // fallback=true hanya jika Gemini GAGAL TOTAL — untuk badge UI.
      fallback: false,
    };
  } catch (error) {
    console.warn("[roast] buildRoast meledak — pakai template:", error);
    return template;
  }
}
