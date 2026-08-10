import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { parseListingCards } from "./avito-parser";
import { normalizeCard } from "./normalizer";
import { importListings } from "./importer";
import { SCRAPER_SOURCE_AVITO, type ScrapeOptions, type ScrapeSummary, type ScrapedListing } from "./types";

const execFileAsync = promisify(execFile);

const CURL = process.platform === "win32" ? "curl.exe" : "curl";
const STATUS_MARKER = "__AR3AR_CURL_STATUS__";

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,*/*;q=0.8",
  "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8,ar;q=0.7",
  "Cache-Control": "no-cache",
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let proxyUrl: string | undefined;

function getProxyUrl(): string | undefined {
  if (proxyUrl === undefined) {
    proxyUrl = process.env.SCRAPER_PROXY_URL?.trim() || undefined;
  }
  return proxyUrl;
}

async function fetchWithRetry(
  url: string,
  headers: Record<string, string>,
  attempts = 3,
): Promise<{ ok: boolean; html?: string; status?: number }> {
  const proxy = getProxyUrl();

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const args: string[] = [
        "-sS", "-L", "--compressed", "-A", headers["User-Agent"],
        "-H", `Accept: ${headers.Accept}`,
        "-H", `Accept-Language: ${headers["Accept-Language"]}`,
        "-H", `Cache-Control: ${headers["Cache-Control"]}`,
        "-H", "Sec-Fetch-Dest: document",
        "-H", "Sec-Fetch-Mode: navigate",
        "-H", "Sec-Fetch-Site: none",
        "-H", "Upgrade-Insecure-Requests: 1",
        "--max-time", "25",
        "-w", `\n${STATUS_MARKER}%{http_code}`,
        "-o", "-",
      ];
      if (proxy) args.push("--proxy", proxy);
      args.push(url);

      const { stdout } = await execFileAsync(CURL, args, {
        maxBuffer: 30 * 1024 * 1024,
      });

      const markerIdx = stdout.lastIndexOf(`\n${STATUS_MARKER}`);
      const status = markerIdx >= 0
        ? Number(stdout.slice(markerIdx + STATUS_MARKER.length + 1).trim())
        : 0;
      const html = markerIdx >= 0 ? stdout.slice(0, markerIdx) : stdout;

      if (status === 429 || status === 503) {
        if (attempt < attempts) {
          await sleep(5_000 * attempt);
          continue;
        }
        return { ok: false, status };
      }

      if (status === 0 || status >= 400) return { ok: false, status };
      return { ok: true, html, status };
    } catch {
      if (attempt < attempts) {
        await sleep(3_000 * attempt);
        continue;
      }
      return { ok: false };
    }
  }
  return { ok: false };
}

function isBlocked(html: string): boolean {
  return /captcha|datadome|cf_chl|challenge-platform|verify/i.test(html.slice(0, 20_000));
}

function paginatedUrl(baseUrl: string, page: number): string {
  if (page <= 1) return baseUrl;
  const url = new URL(baseUrl);
  url.searchParams.set("p", String(page));
  return url.toString();
}

export async function scrapeAvito(options: ScrapeOptions): Promise<ScrapeSummary> {
  const summary: ScrapeSummary = {
    source: SCRAPER_SOURCE_AVITO,
    startUrl: options.url,
    pagesFetched: 0,
    listingsFound: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  };

  const delay = options.minRequestDelayMs ?? 2_000;
  const maxPages = options.maxPages ?? 1;
  const allPages = maxPages <= 0;
  const headers = { ...DEFAULT_HEADERS };

  const origin = new URL(options.url).origin;
  try {
    const robotsRes = await fetchWithRetry(`${origin}/robots.txt`, headers, 1);
    if (robotsRes.ok && robotsRes.html) {
      const disallow = robotsRes.html.match(/Disallow:\s*(.+)/gi) ?? [];
      const path = new URL(options.url).pathname;
      if (disallow.some((line) => line.toLowerCase().includes("user-agent: *") && matchRule(path, line))) {
        summary.errors.push("Blocked by robots.txt — refusing to scrape.");
        return summary;
      }
    }
  } catch {
    // robots.txt unreachable; proceed (best effort).
  }

  const found = new Map<string, ScrapedListing>();

  let page = 0;
  let stalePages = 0;
  const maxStalePages = 10;
  const BATCH_SIZE = 20;

  async function flushBatch() {
    if (found.size === 0) return;
    const toImport = [...found.values()].filter(
      (l): l is ScrapedListing => Boolean(l.externalId),
    );
    if (options.verbose) console.log(`[scraper] importing batch of ${toImport.length} listings...`);
    const result = await importListings(toImport, {
      listingStatus: options.listingStatus,
      dryRun: options.dryRun,
    });
    summary.created += result.created;
    summary.updated += result.updated;
    summary.skipped += result.skipped;
    summary.failed += result.failed;
    summary.errors.push(...result.errors);
    found.clear();
    if (options.verbose) console.log(`[scraper] batch imported: +${result.created} new, ${result.updated} updated, ${result.skipped} skipped`);
  }

  while (true) {
    page++;
    if (!allPages && page > maxPages) break;
    const pageUrl = paginatedUrl(options.url, page);
    if (options.verbose) console.log(`[scraper] fetching page ${page}: ${pageUrl}`);

    const res = await fetchWithRetry(pageUrl, headers);
    if (!res.ok || !res.html) {
      summary.errors.push(`HTTP ${res.status ?? "error"} on page ${page} (${pageUrl})`);
      if (res.status === 403 || res.status === 401) break;
      if (allPages) break;
      continue;
    }

    if (isBlocked(res.html)) {
      summary.errors.push(
        "Avito returned a bot-detection challenge (403/CAPTCHA). Scraping stopped — try a different network, delay, or proxy.",
      );
      break;
    }

    summary.pagesFetched++;
    const cards = parseListingCards(res.html);
    const prevSize = found.size;

    for (const card of cards) {
      const ctx = { url: card.href ?? pageUrl, sourceUrl: pageUrl };
      const listing = normalizeCard(card, ctx);
      if (!listing?.externalId) continue;

      const existing = found.get(listing.externalId);
      if (existing) {
        if (existing.images.length === 0 && listing.images && listing.images.length > 0) {
          existing.images = listing.images;
        }
      } else {
        found.set(listing.externalId, listing as ScrapedListing);
      }
    }

    if (cards.length === 0) {
      if (options.verbose) console.log(`[scraper] page ${page} empty — done.`);
      break;
    }

    if (found.size === prevSize) {
      stalePages++;
    } else {
      stalePages = 0;
    }

    if (allPages && stalePages >= maxStalePages) {
      if (options.verbose) console.log(`[scraper] ${maxStalePages} pages with no new listings — stopping.`);
      break;
    }

    if (options.verbose) console.log(`[scraper] page ${page}: ${cards.length} cards (${found.size} unique total)`);

    if (page % BATCH_SIZE === 0) {
      await flushBatch();
    }

    await sleep(delay);
  }

  await flushBatch();

  summary.listingsFound = summary.created + summary.updated;

  return summary;
}

function matchRule(path: string, disallowLine: string): boolean {
  const rule = disallowLine.replace(/^disallow:\s*/i, "").trim() || "/";
  if (rule === "*") return true;
  if (rule.endsWith("*")) return path.startsWith(rule.slice(0, -1));
  return path.startsWith(rule);
}
