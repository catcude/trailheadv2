/**
 * Authenticated app surface. Route groups don't appear in URLs, so the
 * (app) group's pages are matched by path prefix. Kept as a pure function
 * so middleware behavior is unit-testable.
 */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/checkin",
  "/community",
  "/settings",
  "/onboarding",
] as const;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
