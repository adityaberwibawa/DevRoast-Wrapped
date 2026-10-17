/**
 * Probe: Search API commits — kandidat pengganti PushEvent yang
 * sudah kehilangan payload.commits di GitHub API terkini.
 * Jalankan: pnpm dlx tsx --env-file=.env.local scripts/probe-search-commits.ts [username]
 */
const U = process.argv[2] ?? "sindresorhus";
const TOKEN = process.env.GITHUB_TOKEN;

async function main() {
  // Commit authored oleh user, terbaru dulu, default-branch index.
  const url =
    `https://api.github.com/search/commits?q=${encodeURIComponent(`author:${U}`)}` +
    `&sort=committer-date&order=desc&per_page=5`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    cache: "no-store",
  });
  console.log("search/commits ->", res.status, "| limit remaining:", res.headers.get("x-ratelimit-remaining"));
  const json = await res.json();
  if (!res.ok) {
    console.log(JSON.stringify(json).slice(0, 500));
    return;
  }
  const jc = json as {
    total_count: number;
    items: Array<{
      repository: { full_name: string; fork: boolean };
      sha: string;
      commit: { message: string; author: { name: string; date: string; email?: string } };
    }>;
  };
  console.log("total_count:", jc.total_count);
  for (const item of jc.items) {
    console.log(
      "-",
      item.repository.full_name,
      "| author.date:",
      item.commit.author.date,
      "| name:",
      item.commit.author.name,
      "| msg:",
      item.commit.message.slice(0, 40).replace(/\n/g, " "),
    );
  }
}

main();
