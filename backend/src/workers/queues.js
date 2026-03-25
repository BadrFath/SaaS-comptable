import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

const refreshQueue = new Queue("fps-token-refresh", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: true,
    backoff: {
      type: "exponential",
      delay: 3000
    }
  }
});

async function enqueueRefreshForMandant(ecbNumber) {
  await refreshQueue.add("refresh-one", { ecbNumber });
}

async function enqueueBulkRefresh() {
  await refreshQueue.add("refresh-all", { initiatedAt: new Date().toISOString() });
}

export { refreshQueue, enqueueRefreshForMandant, enqueueBulkRefresh };
