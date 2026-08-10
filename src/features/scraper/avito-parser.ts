import * as cheerio from "cheerio";
import type { RawListingCard } from "./types";

const LISTING_LINK_SELECTORS = [
  'a[data-testid^="ad-card-v2-"]',
  'a[href*="/ma/a/"]',
  'a[href*="/ma/item/"]',
  "a[data-listing-id]",
];

const PRICE_SELECTORS = [
  "span[class*='sc-b6852cba-2']",
  ".listing-card__price",
  ".listing-item__price",
  ".item-price",
  "[class*='price']",
  "[class*='Price']",
];

const LOCATION_SELECTORS = [
  "span[class*='sc-j5d10c-23']",
  ".listing-card__location",
  ".listing-item__location",
  ".item-location",
  "[class*='location']",
  "[class*='Location']",
];

const IMAGE_SELECTORS = [
  "img[src*='content.avito.ma']",
  "img.listing-card__image",
  "img[src*='img.avito']",
  "img[data-src*='img.avito']",
  "img[data-original*='img.avito']",
];

/** Extracts Avito listing id from an href (new URLs end with `<id>.htm`, old ones with `-<id>`). */
export function extractIdFromHref(href: string | undefined): string | undefined {
  if (!href) return undefined;
  const path = new URL(href, "https://www.avito.ma").pathname.replace(/\/+$/, "");
  const htmMatch = /(\d+)\.htm$/i.exec(path);
  if (htmMatch) return htmMatch[1];
  const segments = path.split("/").filter(Boolean);
  const last = segments[segments.length - 1] ?? "";
  const idMatch = /-(\d+)$/.exec(last);
  return idMatch?.[1] ?? last;
}

function firstImage($: cheerio.CheerioAPI, card: cheerio.Cheerio<any>): string | undefined {
  for (const sel of IMAGE_SELECTORS) {
    const img = card.find(sel).first();
    const src = img.attr("src") ?? img.attr("data-src") ?? img.attr("data-original");
    if (src && /^https?:\/\//i.test(src) && !/placeholder/i.test(src)) return src;
  }
  const anyImg = card.find("img").first();
  const src = anyImg.attr("src") ?? anyImg.attr("data-src");
  if (src && /^https?:\/\//i.test(src) && !/placeholder/i.test(src)) return src;
  return undefined;
}

function firstText($: cheerio.CheerioAPI, card: cheerio.Cheerio<any>, selectors: string[]): string | undefined {
  for (const sel of selectors) {
    const el = card.find(sel).first();
    const text = el.text()?.trim();
    if (text) return text;
  }
  return undefined;
}

function extractTitle($: cheerio.CheerioAPI, card: cheerio.Cheerio<any>): string | undefined {
  const h3 = card.find("h3").first();
  if (h3.length) {
    return h3.attr("title")?.trim() || h3.text()?.trim() || undefined;
  }
  return card.attr("title")?.trim() || undefined;
}

function extractPrice($: cheerio.CheerioAPI, card: cheerio.Cheerio<any>): string | undefined {
  // New Avito layout: price number span is the sibling before the "DH" span.
  let dh: cheerio.Cheerio<any> | undefined;
  card.find("span").each((_i, el) => {
    if (!dh && $(el).text().trim() === "DH") dh = $(el);
  });
  if (dh) {
    const num = dh.prev().text().trim();
    if (/\d/.test(num)) return `${num} DH`;
  }
  const text = firstText($, card, PRICE_SELECTORS);
  if (text) return text;
  const m = card.text().match(/([\d][\d\s\u00A0.,]*)\s*DH/);
  if (m) return `${m[1].trim()} DH`;
  return undefined;
}

function extractLocation($: cheerio.CheerioAPI, card: cheerio.Cheerio<any>): string | undefined {
  const text = firstText($, card, LOCATION_SELECTORS);
  if (text && /[a-z\u0600-\u06FF]/i.test(text)) return text;
  const cardText = card.text();
  const idx = cardText.lastIndexOf("DH");
  if (idx >= 0) {
    const tail = cardText.slice(idx + 2).replace(/\s+/g, " ").trim();
    if (tail) return tail;
  }
  return undefined;
}

function extractFeature($: cheerio.CheerioAPI, card: cheerio.Cheerio<any>, label: string): number | undefined {
  const el = card.find(`span[title="${label}"]`).first();
  if (!el.length) return undefined;
  const m = el.text().match(/\d+/);
  return m ? parseInt(m[1], 10) : undefined;
}

export function parseListingCards(html: string): RawListingCard[] {
  const $ = cheerio.load(html);
  const cards: RawListingCard[] = [];
  const seen = new Set<string>();

  for (const linkSel of LISTING_LINK_SELECTORS) {
    $(linkSel).each((_i, el) => {
      const link = $(el);
      const href = link.attr("href");
      if (!href || seen.has(href)) return;
      seen.add(href);

      const externalId =
        extractIdFromHref(href) ??
        link.attr("data-listing-id") ??
        /ad-card-v2-(\d+)/.exec(link.attr("data-testid") ?? "")?.[1] ??
        link.parent().attr("data-listing-id");

      const title = extractTitle($, link) || link.attr("title")?.trim();
      const priceText = extractPrice($, link);
      const location = extractLocation($, link);
      const image = firstImage($, link);
      const rooms = extractFeature($, link, "Chambres");
      const bathrooms = extractFeature($, link, "Salle de bain");
      const plotAreaM2 = extractFeature($, link, "Surface totale");

      cards.push({ externalId, href, title, priceText, location, image, rooms, bathrooms, plotAreaM2 });
    });

    if (cards.length > 0) break;
  }

  return cards.filter(
    (c) => c.externalId && (c.title || c.priceText) && !isNotAListingUrl(c.href ?? ""),
  );
}

function isNotAListingUrl(href: string): boolean {
  const path = new URL(href, "https://www.avito.ma").pathname.toLowerCase();
  // Current Avito listing URLs end with `<id>.htm`.
  if (/_\d+\.htm$/.test(path)) return false;
  const excluded = ["/ma/a/", "/ma/item/"];
  const isListing = excluded.some((seg) => path.startsWith(seg) || path.includes(seg));
  if (isListing) return false;
  return path.startsWith("/ma/") || path.startsWith("/k-");
}

export function countPaginationPages(html: string): number {
  const $ = cheerio.load(html);
  let last = 0;
  $("a[href*='?p='], a[href*='&p='], a[href*='?o=']").each((_i, el) => {
    const href = $(el).attr("href") ?? "";
    const m = /[?&](?:p|o)=(\d+)/.exec(href);
    if (m) last = Math.max(last, parseInt(m[1], 10));
  });
  return last;
}
