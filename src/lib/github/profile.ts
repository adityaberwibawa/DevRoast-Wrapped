import { githubFetch } from "./client";
import type { GitHubProfile } from "@/lib/types";

interface RawUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  created_at: string;
}

export async function fetchProfile(username: string): Promise<GitHubProfile> {
  const u = await githubFetch<RawUser>(`/users/${encodeURIComponent(username)}`);
  return {
    login: u.login,
    name: u.name,
    avatarUrl: u.avatar_url,
    htmlUrl: u.html_url,
    bio: u.bio,
    publicRepos: u.public_repos,
    followers: u.followers,
    createdAt: u.created_at,
  };
}
