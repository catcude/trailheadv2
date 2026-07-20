/**
 * Content-Security-Policy assembly. Lived in next.config.ts until the
 * 2026-07-20 audit (D1); it moved here so middleware can vary the policy per
 * request. Two grades:
 *
 * - Public/static surface: the previous policy, unchanged — statically
 *   prerendered pages can't carry a per-request nonce, so script-src keeps
 *   'unsafe-inline' (Next.js inline runtime scripts). No user-generated
 *   content renders on this surface.
 * - Authenticated surface (always dynamically rendered, and where student
 *   text renders): nonce-based script-src with 'strict-dynamic' — an inline
 *   script executes only with the per-request nonce, so an injected inline
 *   script is dead on arrival.
 *
 * Dev keeps the permissive policy everywhere (React refresh needs eval).
 * style-src retains 'unsafe-inline' on both grades (Next inline styles);
 * no third-party scripts exist by design — js.stripe.com only, and Stripe
 * checkout/portal are full-page redirects.
 */

const SHARED_DIRECTIVES = [
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com",
  "frame-src 'self' https://js.stripe.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
];

function assemble(scriptSrc: string): string {
  return ["default-src 'self'", scriptSrc, ...SHARED_DIRECTIVES].join("; ");
}

/** Policy for the public/static surface (and everything in dev). */
export function publicCsp(): string {
  return assemble(
    process.env.NODE_ENV === "development"
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com"
      : "script-src 'self' 'unsafe-inline' https://js.stripe.com",
  );
}

/**
 * Nonce policy for the authenticated surface. 'strict-dynamic' makes CSP3
 * browsers trust scripts loaded by nonce'd scripts and ignore the host
 * allowlist; 'self' + js.stripe.com remain as the CSP2 fallback.
 */
export function noncedCsp(nonce: string): string {
  return assemble(
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://js.stripe.com`,
  );
}

/** Fresh base64 nonce, web-crypto only — middleware runs on the edge. */
export function generateNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
