"use server";

/**
 * Server Action: paksa re-generate data wrapped untuk satu username.
 * Dipanggil tombol "Muat Ulang" pada UI wrapped (F4).
 *
 * Origin client dihitung untuk rate-limit (aksi ini boleh memicu
 * pemborosan kuota GitHub + biaya Gemini jika dilepaskan tanpa guard).
 */
import { headers } from "next/headers";
import { updateTag } from "next/cache";
import { checkRateLimit } from "@/lib/rate-limit";
import { wrappedTag } from "@/lib/wrapped";
import { isGitHubUsername } from "@/lib/github/client";

const WINDOW_MS = 5 * 60 * 1000; // 5 menit
const LIMIT = 2; // maks 2 refresh per window per IP

interface RefreshResult {
  ok: boolean;
  message: string;
}

export async function refreshWrapped(username: string): Promise<RefreshResult> {
  const handle = username.trim().toLowerCase();
  if (!isGitHubUsername(handle)) {
    return { ok: false, message: "Username tidak valid." };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "anon";

  const gate = checkRateLimit(`refresh:${ip}`, { limit: LIMIT, windowMs: WINDOW_MS });
  if (!gate.allowed) {
    return {
      ok: false,
      message: `Santai dulu. Coba lagi dalam ${gate.retryAfterSec} detik.`,
    };
  }

  updateTag(wrappedTag(handle));
  return { ok: true, message: "Data di-refresh." };
}
