import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { QUEUE_NAMES } from "@/lib/queues";
import { applyPromotion } from "@/features/payments/server/promotion.service";
import { db } from "@/lib/db";

export const paymentWorker = new Worker(
  QUEUE_NAMES.PAYMENTS,
  async (job) => {
    switch (job.name) {
      case "payment.complete": {
        const { paymentId } = job.data as { paymentId: string };
        const applied = await applyPromotion(paymentId);
        return { applied };
      }
      case "payment.verify": {
        const { paymentId } = job.data as { paymentId: string };
        const payment = await db.payment.findUnique({ where: { id: paymentId } });
        if (!payment) return { status: "NOT_FOUND" };
        if (payment.status === "COMPLETED") {
          await applyPromotion(paymentId);
          return { status: "COMPLETED" };
        }
        return { status: payment.status };
      }
      default:
        return { skipped: job.name };
    }
  },
  { connection: redis, concurrency: 5 },
);

paymentWorker.on("failed", (job, err) => {
  console.error(`[payment-worker] job ${job?.id} (${job?.name}) failed:`, err.message);
});
