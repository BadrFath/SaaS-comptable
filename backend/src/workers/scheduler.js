import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { refreshExpiredMandants, refreshMandantByEcb } from "../services/fpsAuth.service.js";
import { refreshQueue } from "./queues.js";

const worker = new Worker(
  "fps-token-refresh",
  async (job) => {
    if (job.name === "refresh-one") {
      await refreshMandantByEcb(job.data.ecbNumber);
      return;
    }

    await refreshExpiredMandants();
  },
  {
    connection: redisConnection,
    concurrency: 3
  }
);

worker.on("completed", (job) => {
  console.log(`[worker] job completed: ${job.id} (${job.name})`);
});

worker.on("failed", (job, err) => {
  console.error(`[worker] job failed: ${job?.id} (${job?.name}) -> ${err.message}`);
});

await refreshQueue.upsertJobScheduler("hourly-token-refresh", {
  pattern: "0 * * * *"
}, {
  name: "refresh-all",
  data: { source: "scheduler" }
});

console.log("BullMQ scheduler/worker started");
