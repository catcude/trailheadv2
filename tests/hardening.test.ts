import { describe, expect, it } from "vitest";
import { generateNonce, noncedCsp, publicCsp } from "@/lib/utils/csp";
import { isTrustedOrigin } from "@/lib/utils/origin-check";
import { streakWindowStart, STREAK_WINDOW_DAYS } from "@/lib/utils/streak";

/** 2026-07-20 audit hardening: per-request CSP, Origin backstop, streak window. */

describe("csp", () => {
  it("public policy allows Next's inline runtime, keeps core lockdowns", () => {
    const csp = publicCsp();
    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).not.toContain("nonce-");
  });

  it("nonced policy drops unsafe-inline from script-src", () => {
    const csp = noncedCsp("abc123");
    const scriptSrc = csp
      .split("; ")
      .find((d) => d.startsWith("script-src")) as string;
    expect(scriptSrc).toContain("'nonce-abc123'");
    expect(scriptSrc).toContain("'strict-dynamic'");
    expect(scriptSrc).not.toContain("unsafe-inline");
    // Everything else matches the public policy.
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain(
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com",
    );
  });

  it("nonces are fresh and base64", () => {
    const a = generateNonce();
    const b = generateNonce();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^[A-Za-z0-9+/]+=*$/);
  });
});

describe("isTrustedOrigin", () => {
  const req = (headers: Record<string, string>) => ({
    headers: new Headers(headers),
  });

  it("passes when Origin is absent (non-browser client)", () => {
    expect(isTrustedOrigin(req({}))).toBe(true);
  });

  it("passes a same-host Origin", () => {
    expect(
      isTrustedOrigin(
        req({ origin: "https://app.example.com", host: "app.example.com" }),
      ),
    ).toBe(true);
  });

  it("prefers x-forwarded-host behind a proxy", () => {
    expect(
      isTrustedOrigin(
        req({
          origin: "https://app.example.com",
          "x-forwarded-host": "app.example.com",
          host: "internal:3000",
        }),
      ),
    ).toBe(true);
  });

  it("rejects a cross-site Origin", () => {
    expect(
      isTrustedOrigin(
        req({ origin: "https://evil.example", host: "app.example.com" }),
      ),
    ).toBe(false);
  });

  it("rejects a malformed Origin", () => {
    expect(
      isTrustedOrigin(req({ origin: "null", host: "app.example.com" })),
    ).toBe(false);
  });
});

describe("streakWindowStart", () => {
  it("starts the window STREAK_WINDOW_DAYS before today", () => {
    expect(streakWindowStart("2026-07-20")).toBe("2025-07-19");
    expect(STREAK_WINDOW_DAYS).toBe(366);
  });
});
