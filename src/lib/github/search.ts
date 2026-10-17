import { githubFetch } from "./client";
import type { NeglectedPR } from "@/lib/types";

interface RawSearchIssue {
  title: string;
  html_url: string;
  created_at: string;
  repository_url: string; // https://api.github.com/repos/{owner}/{repo}
}

/**
 * PR open milik user yang paling lama terbengkalai (sort created asc, 1 item).
 * Search API punya kuota terpisah (30 req/menit dengan token) — 1 requête/user.
 * Bila blocked/tak terdeteksi, kembalikan null (fitur menurun angkat lembut).
 */
export async function fetchOldestOpenPR(
  username: string,
): Promise<NeglectedPR | null> {
  const q = `is:pr is:open author:${encodeURIComponent(username)}`;
  const res = await githubFetch<{
    items: RawSearchIssue[];
  }>(`/search/issues?q=${encodeURIComponent(q)}&sort=created&order=asc&per_page=1`);

  const oldest = res.items[0];
  if (!oldest) return null;

  const repo = oldest.repository_url.split("/repos/")[1] ?? "";
  const createdAt = oldest.created_at;
  const ageDays = Math.max(
    0,
    Math.floor((Date.now() - Date.parse(createdAt)) / 86_400_000),
  );

  return { title: oldest.title, repo, url: oldest.html_url, createdAt, ageDays };
}
