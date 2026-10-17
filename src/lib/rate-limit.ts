/**
 * Sliding-window rate limiter sederhana, in-memory per instance server.
 * Cukup untuk proteksi MVP (biar refresh kebanyakan tidak membakar kuota).
 * Bukan pengganti WAF/kv-store untuk skala besar.
 */
const hits = new Map<string, number[]>();

export interface RateLimitOptions {
  /** Maksimum panggilan dalam window. */
  limit: number;
  /** Window milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Detik sampai boleh dipanggil lagi (0 = boleh sekarang). */
  retryAfterSec: number;
}

export function checkRateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const window = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (window.length >= limit) {
    const oldestInWindow = window[0];
    hits.set(key, window);
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((windowMs - (now - oldestInWindow)) / 1000)),
    };
  }

  window.push(now);
  hits.set(key, window);

  // Ringan memangkas memori: buang entry yang sudah tidak ada hit-nya.
  if (hits.size > 5_000) {
    for (const [k, timestamps] of hits) {
      if (timestamps.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }

  return { allowed: true, retryAfterSec: 0 };
}
