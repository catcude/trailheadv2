/**
 * Fixed-window rate limiter for the check-in endpoint (scaffolding plan §5).
 *
 * The interface is storage-agnostic; this in-memory implementation covers a
 * single serverless instance and local dev. The Postgres-backed store lands
 * with migration 0002 in M1 so limits hold across instances (OQ7: no new
 * vendor at MVP scale).
 */
export interface RateLimiter {
  /** Returns true if the action is allowed for this key in the current window. */
  check(key: string): boolean;
}

export function createFixedWindowLimiter(options: {
  limit: number;
  windowMs: number;
  now?: () => number;
}): RateLimiter {
  const { limit, windowMs, now = Date.now } = options;
  const windows = new Map<string, { windowStart: number; count: number }>();

  return {
    check(key: string): boolean {
      const timestamp = now();
      const entry = windows.get(key);

      if (!entry || timestamp - entry.windowStart >= windowMs) {
        windows.set(key, { windowStart: timestamp, count: 1 });
        return true;
      }

      if (entry.count >= limit) return false;
      entry.count += 1;
      return true;
    },
  };
}
