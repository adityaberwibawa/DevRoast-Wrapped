import { GoogleGenAI } from "@google/genai";
import { buildRoastPrompt, roastSchema, ROAST_SLIDE_KEYS } from "@/lib/roast/prompt";
import type { RoastSlideKey } from "@/lib/roast/prompt";
import type { WrappedStats } from "@/lib/types";
import { site } from "@/config/site";

const TIMEOUT_MS = 30_000;
const MAX_SLIDE_CHARS = 280;

export interface RoastGeminiData {
  shareText?: string;
  slides: Partial<Record<RoastSlideKey, string>>;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function clampSlide(key: string, value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (trimmed.length < 2) return undefined;
  return trimmed.length > MAX_SLIDE_CHARS
    ? `${trimmed.slice(0, MAX_SLIDE_CHARS - 1)}…`
    : trimmed;
}

function normalize(raw: unknown): RoastGeminiData | null {
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  const slides = obj.slides;
  if (typeof slides !== "object" || slides === null) return null;

  const normalized: RoastGeminiData = { slides: {} };
  const shareText = clampSlide(
    "shareText",
    (obj as { shareText?: unknown }).shareText,
  );
  if (shareText) normalized.shareText = shareText;

  const slideSource = slides as Record<string, unknown>;
  let filled = 0;
  for (const key of ROAST_SLIDE_KEYS) {
    const value = clampSlide(key, slideSource[key]);
    if (value) {
      normalized.slides[key] = value;
      filled++;
    }
  }
  return filled === 0 ? null : normalized;
}

/**
 * Memanggil Gemini (interactions API) untuk merubah statistik jadi roast JSON.
 * - Tidak ada API key → null (UI fallback template).
 * - Gagal sementara → 1 retry, lalu null.
 * - Output rusak/parsial → null atau field yang valid saja.
 *
 * Modul ini TIDAK memakai next/cache — murni fungsi data, termampu dites
 * di luar runtime Next (smoke test), hasilnya dibekukan oleh `use cache`
 * di lapisan wrapped.
 */
export async function generateRoastData(
  stats: WrappedStats,
): Promise<RoastGeminiData | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[roast] GEMINI_API_KEY belum di-set — pakai template fallback");
    return null;
  }

  const client = new GoogleGenAI({
    apiKey,
    httpOptions: { timeout: TIMEOUT_MS },
  });
  const model = process.env.GEMINI_MODEL ?? site.geminiModel;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const interaction = await client.interactions.create({
        model,
        input: buildRoastPrompt(stats),
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: roastSchema,
        },
        generation_config: { temperature: 0.95 },
      });

      const raw = interaction.output_text;
      if (!raw) {
        console.warn("[roast] respons Gemini kosong");
      } else {
        try {
          return normalize(JSON.parse(raw));
        } catch (parseError) {
          console.warn(
            "[roast] JSON rusak dari Gemini:",
            raw.slice(0, 160),
            parseError,
          );
        }
      }
    } catch (error) {
      if (attempt === 1) {
        console.warn("[roast] Gemini gagal (2 upaya):", error);
        return null;
      }
      await sleep(1200);
    }
  }

  return null;
}
