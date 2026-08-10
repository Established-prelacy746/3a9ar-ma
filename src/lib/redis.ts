import IORedis from "ioredis";

const globalForRedis = globalThis as unknown as { redis?: IORedis };

export const redis =
  globalForRedis.redis ??
  new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times) => Math.min(times * 200, 2000),
  });

redis.on("error", () => {
  // Redis may be down during local dev/build; queues retry automatically.
});

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
