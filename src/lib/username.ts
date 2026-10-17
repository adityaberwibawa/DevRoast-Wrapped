/**
 * Validasi username GitHub — dipakai bersama (server + client).
 * GitHub login: alfanumerik + tanda minus, 1–39 char (mulai huruf/angka).
 */
export function isGitHubUsername(username: string): boolean {
  return /^[A-Za-z0-9-]{1,39}$/.test(username);
}

/** Bentuk kanonik yang dipakai sebagai kunci route & cache. */
export function canonicalGitHubUsername(username: string): string {
  const handle = username.trim().replace(/^@/, "").toLowerCase();
  return handle;
}
