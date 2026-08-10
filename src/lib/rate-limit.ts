import { redis } from "@/lib/redis";

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  limit: number;
}

export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const cacheKey = `ratelimit:${key}`;
  try {
    const count = await redis.incr(cacheKey);
    if (count === 1) await redis.expire(cacheKey, windowSeconds);
    return { ok: count <= limit, remaining: Math.max(0, limit - count), limit };
  } catch {
    return { ok: true, remaining: limit, limit };
  }
}
