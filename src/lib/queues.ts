import { Queue, type JobsOptions } from "bullmq";
import { redis } from "@/lib/redis";

export const QUEUE_NAMES = {
  WHATSAPP: "ar3ar-whatsapp",
  PAYMENTS: "ar3ar-payments",
  PROMOTIONS: "ar3ar-promotions",
  SCRAPER: "ar3ar-scraper",
} as const;

export type WhatsAppJobNames =
  | "wa.inbound"
  | "wa.outbound"
  | "wa.status"
  | "wa.bot-query";

export type PaymentJobNames = "payment.complete" | "payment.verify";

export type PromotionJobNames = "promotion.apply" | "promotion.sweep";

export type ScraperJobNames = "scraper.avito";

const defaultJobOptions: JobsOptions = {
  attempts: 5,
  backoff: { type: "exponential", delay: 2_000 },
  removeOnComplete: { age: 60 * 60 * 24 * 7, count: 5_000 },
  removeOnFail: { age: 60 * 60 * 24 * 30 },
};

export const whatsappQueue = new Queue(QUEUE_NAMES.WHATSAPP, {
  connection: redis,
  defaultJobOptions,
});

export const paymentQueue = new Queue(QUEUE_NAMES.PAYMENTS, {
  connection: redis,
  defaultJobOptions,
});

export const promotionQueue = new Queue(QUEUE_NAMES.PROMOTIONS, {
  connection: redis,
  defaultJobOptions,
});

export const scraperQueue = new Queue(QUEUE_NAMES.SCRAPER, {
  connection: redis,
  defaultJobOptions,
});

export async function registerCronSweep() {
  const existing = await promotionQueue.getRepeatableJobs();
  const hasSweep = existing.some((j) => j.name === "promotion.sweep");
  if (!hasSweep) {
    await promotionQueue.add(
      "promotion.sweep",
      {},
      { repeat: { pattern: "0 * * * *" }, jobId: "cron:promotion-sweep" },
    );
  }

  const existingScraper = await scraperQueue.getRepeatableJobs();
  const hasScraper = existingScraper.some((j) => j.name === "scraper.avito");
  if (!hasScraper && process.env.SCRAPER_URL) {
    await scraperQueue.add(
      "scraper.avito",
      { url: process.env.SCRAPER_URL, maxPages: Number(process.env.SCRAPER_MAX_PAGES ?? 1) },
      { repeat: { pattern: "0 */6 * * *" }, jobId: "cron:scraper-avito" },
    );
  }
}
