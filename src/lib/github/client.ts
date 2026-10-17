import { GitHubApiError } from "./errors";
import { isGitHubUsername } from "@/lib/username";

export { isGitHubUsername };

const GITHUB_API = "https://api.github.com";

/**
 * Token PAT diambil dari env server (`GITHUB_TOKEN`).
 * Tanpa token: 60 req/jam/IP — dengan token: 5.000 req/jam. Lihat .env.example.
 */
function authHeader(): string | undefined {
  const token = process.env.GITHUB_TOKEN;
  return token ? `Bearer ${token}` : undefined;
}

/**
 * Low-level fetch untuk REST GitHub.
 * HANYA dipakai dari dalam scope `use cache` (lib/wrapped) — hasilnya
 * membeku ke dalam cache entry, sehingga tidak butuh opsi caching fetch sendiri.
 */
export async function githubFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: authHeader() ?? "",
    },
    cache: "no-store",
  }).catch(() => {
    throw new GitHubApiError("network", 0, "Gagal menghubungi GitHub API");
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new GitHubApiError("not-found", 404, "Pengguna tidak ditemukan");
    }
    const remaining = res.headers.get("x-ratelimit-remaining");
    if ((res.status === 403 || res.status === 429) && remaining === "0") {
      throw new GitHubApiError(
        "rate-limited",
        res.status,
        "Kuota GitHub API habis",
      );
    }
    if (res.status === 403) {
      // 403 tanpa depletion kuota = blokir (abuse/multifaktor/resource policy)
      throw new GitHubApiError("blocked", 403, "Akses GitHub ditolak");
    }
    throw new GitHubApiError(
      "unexpected",
      res.status,
      `HTTP ${res.status} dari GitHub`,
    );
  }

  return (await res.json()) as T;
}
