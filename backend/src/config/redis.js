import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redisConnection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true
});

redisConnection.on("error", (error) => {
  console.error("Redis connection error:", error.message);
});

export { redisConnection };
