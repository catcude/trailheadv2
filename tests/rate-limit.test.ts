import { describe, expect, it } from "vitest";
import { createFixedWindowLimiter } from "@/lib/utils/rate-limit";

describe("createFixedWindowLimiter", () => {
  it("allows up to the limit within a window", () => {
    const limiter = createFixedWindowLimiter({
      limit: 3,
      windowMs: 1000,
      now: () => 0,
    });
    expect(limiter.check("user-a")).toBe(true);
    expect(limiter.check("user-a")).toBe(true);
    expect(limiter.check("user-a")).toBe(true);
    expect(limiter.check("user-a")).toBe(false);
  });

  it("tracks keys independently", () => {
    const limiter = createFixedWindowLimiter({
      limit: 1,
      windowMs: 1000,
      now: () => 0,
    });
    expect(limiter.check("user-a")).toBe(true);
    expect(limiter.check("user-b")).toBe(true);
    expect(limiter.check("user-a")).toBe(false);
  });

  it("resets after the window elapses", () => {
    let clock = 0;
    const limiter = createFixedWindowLimiter({
      limit: 1,
      windowMs: 1000,
      now: () => clock,
    });
    expect(limiter.check("user-a")).toBe(true);
    expect(limiter.check("user-a")).toBe(false);
    clock = 1000;
    expect(limiter.check("user-a")).toBe(true);
  });
});
