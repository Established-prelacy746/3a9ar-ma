import { scrapeAvito } from "@/features/scraper/avito-scraper";
import { SCRAPER_SOURCE_AVITO } from "@/features/scraper/types";

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const found = process.argv.find((a) => a.startsWith(prefix));
  return found?.slice(prefix.length);
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function usage() {
  console.log(`
Avito.ma scraper CLI

Usage: npm run scrape:avito -- --url <listing-url> [options]

Required:
  --url <url>          Avito category/search URL to scrape, e.g.
                       https://www.avito.ma/ma/appartements-a-vendre/

Options:
  --pages <n>          Max result pages to scrape (default 1)
  --delay <ms>         Delay between requests (default 2000)
  --moderate           Import as PENDING_REVIEW instead of ACTIVE
  --dry-run            Parse & normalize only, do not write to DB
  --verbose            Print each fetched URL

Examples:
  npm run scrape:avito -- --url "https://www.avito.ma/ma/appartements-a-vendre/casablanca/"
  npm run scrape:avito -- --url "https://www.avito.ma/ma/terrains-a-vendre/" --pages 3 --moderate
`);
}

async function main() {
  const url = arg("url");
  if (!url) {
    usage();
    process.exit(1);
  }

  const options = {
    url,
    maxPages: Number(arg("pages") ?? "1"),
    minRequestDelayMs: Number(arg("delay") ?? "2000"),
    listingStatus: (hasFlag("moderate") ? "PENDING_REVIEW" : "ACTIVE") as "ACTIVE" | "PENDING_REVIEW",
    dryRun: hasFlag("dry-run"),
    verbose: hasFlag("verbose"),
  };

  console.log(`[scrape] scraping ${SCRAPER_SOURCE_AVITO} from ${url}`);
  const summary = await scrapeAvito(options);

  console.log("\n=== Scrape summary ===");
  console.log(`pages fetched : ${summary.pagesFetched}`);
  console.log(`listings found: ${summary.listingsFound}`);
  console.log(`created       : ${summary.created}`);
  console.log(`updated       : ${summary.updated}`);
  console.log(`skipped       : ${summary.skipped}`);
  console.log(`failed        : ${summary.failed}`);
  if (summary.errors.length > 0) {
    console.log("\n--- notes/errors ---");
    for (const err of summary.errors.slice(0, 30)) console.log(` - ${err}`);
    if (summary.errors.length > 30) console.log(` ... and ${summary.errors.length - 30} more`);
  }
}

main().catch((err) => {
  console.error("[scrape] fatal:", err);
  process.exit(1);
});
