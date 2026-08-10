import "./whatsapp.worker";
import "./payment.worker";
import { promotionWorker } from "./promotion.worker";
import { scraperWorker } from "./scraper.worker";
import { registerCronSweep } from "@/lib/queues";

async function bootstrap() {
  await registerCronSweep();
  console.log("[workers] whatsapp, payments, promotions, scraper workers running");
  console.log("[workers] hourly promotion sweep registered");
  if (process.env.SCRAPER_URL) {
    console.log("[workers] avito scrape cron registered (every 6h)");
  }
  console.log("[workers] press Ctrl+C to stop");
}

bootstrap().catch((err) => {
  console.error("[workers] bootstrap failed:", err);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  await promotionWorker.close();
  await scraperWorker.close();
  process.exit(0);
});
