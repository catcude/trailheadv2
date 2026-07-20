/**
 * CSRF backstop for state-changing API routes (2026-07-20 audit, D2).
 * Supabase auth cookies are SameSite=Lax, which already blocks cross-site
 * cookie-bearing POSTs — this makes that guarantee explicit so a future
 * cookie-config change can't silently reopen it. Browsers always send Origin
 * on cross-site POSTs; a missing header means a non-browser client, which
 * carries no ambient-cookie CSRF risk, so it passes.
 */
export function isTrustedOrigin(request: { headers: Headers }): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
