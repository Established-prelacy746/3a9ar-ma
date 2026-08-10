import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { QUEUE_NAMES } from "@/lib/queues";
import { sweepExpiredPromotions } from "@/features/payments/server/promotion.service";

export const promotionWorker = new Worker(
  QUEUE_NAMES.PROMOTIONS,
  async (job) => {
    switch (job.name) {
      case "promotion.sweep": {
        const demoted = await sweepExpiredPromotions();
        return { demoted };
      }
      case "promotion.apply": {
        const { paymentId } = job.data as { paymentId: string };
        const applied = await sweepExpiredPromotions();
        return { applied, paymentId };
      }
      default:
        return { skipped: job.name };
    }
  },
  { connection: redis, concurrency: 3 },
);

promotionWorker.on("failed", (job, err) => {
  console.error(`[promotion-worker] job ${job?.id} (${job?.name}) failed:`, err.message);
});
