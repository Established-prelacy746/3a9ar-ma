import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { QUEUE_NAMES } from "@/lib/queues";
import { scrapeAvito } from "@/features/scraper/avito-scraper";

export const scraperWorker = new Worker(
  QUEUE_NAMES.SCRAPER,
  async (job) => {
    switch (job.name) {
      case "scraper.avito": {
        const { url, maxPages } = job.data as { url?: string; maxPages?: number };
        if (!url) return { skipped: "no url in job data" };
        const summary = await scrapeAvito({
          url,
          maxPages,
          minRequestDelayMs: 3_000,
          listingStatus: "PENDING_REVIEW",
        });
        return { summary };
      }
      default:
        return { skipped: job.name };
    }
  },
  { connection: redis, concurrency: 1 },
);

scraperWorker.on("failed", (job, err) => {
  console.error(`[scraper-worker] job ${job?.id} (${job?.name}) failed:`, err.message);
});
