export type GitHubErrorKind =
  | "not-found"
  | "rate-limited"
  | "blocked"
  | "network"
  | "unexpected";

export class GitHubApiError extends Error {
  readonly kind: GitHubErrorKind;
  readonly status: number;

  constructor(kind: GitHubErrorKind, status: number, detail?: string) {
    super(detail ?? `GitHub API error (${kind}, HTTP ${status})`);
    this.name = "GitHubApiError";
    this.kind = kind;
    this.status = status;
  }
}
