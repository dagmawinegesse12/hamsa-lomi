/**
 * Simple in-memory rate limiter for server actions and API routes.
 * In a multi-instance deployment, replace the store with Redis.
 */

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

// Clean up expired entries every 5 minutes to prevent memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { limited: false, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { limited: true, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { limited: false, remaining: limit - entry.count, resetAt: entry.resetAt };
}
