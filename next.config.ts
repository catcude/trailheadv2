import type { NextConfig } from "next";

/*
 * Security headers (scaffolding plan §5). No third-party scripts exist by
 * design — no analytics, no trackers.
 *
 * Content-Security-Policy is NOT set here: it's assembled per request in
 * middleware (lib/utils/csp.ts) so the authenticated surface gets a
 * nonce-based script-src while the static/public surface keeps the
 * inline-allowing policy prerendered pages require (2026-07-20 audit, D1).
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
