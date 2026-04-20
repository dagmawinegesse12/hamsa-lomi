import { AppError } from "@/lib/errors";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function assertRateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  if (bucket.count >= limit) {
    throw new AppError("Too many requests", "RATE_LIMITED", 429);
  }
  bucket.count += 1;
}
