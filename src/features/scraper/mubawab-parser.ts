import * as cheerio from "cheerio";
import type { RawListingCard } from "./types";

const MUBAWAB_BASE = "https://www.mubawab.ma";

export function parseListingCards(html: string): RawListingCard[] {
  const $ = cheerio.load(html);
  const cards: RawListingCard[] = [];
  const seen = new Set<string>();

  $(".listingBox").each((_i, el) => {
    const card = $(el);
    const linkRef = card.attr("linkref") ?? card.attr("linkRef");
    if (!linkRef) return;

    const href = linkRef.startsWith("http") ? linkRef : `${MUBAWAB_BASE}${linkRef}`;
    if (seen.has(href)) return;
    seen.add(href);

    const adId = card.find("input.adId").attr("value");
    const externalId = adId ?? extractIdFromHref(href);
    if (!externalId) return;

    const title = card.find("h2.listingTit a").first().text()?.trim()
      || card.find("h2.listingTit").first().text()?.trim()
      || undefined;

    const priceText = card.find(".priceTag").first().text()?.trim() || undefined;

    const locationText = card.find(".listingH3").first().text()?.replace(/[\n\r\t]+/g, " ").replace(/\s+/g, " ").trim() || undefined;

    const image = card.find("img.sliderImage").first().attr("data-lazy")
      ?? card.find("img.sliderImage").first().attr("src")
      ?? undefined;

    const builtAreaM2 = extractFeature($, card, "icon-triangle");
    const rooms = extractFeature($, card, "icon-house-boxes");
    const bedrooms = extractFeature($, card, "icon-bed");
    const bathrooms = extractFeature($, card, "icon-bath");

    cards.push({
      externalId,
      href,
      title,
      priceText,
      location: locationText,
      image,
      rooms: rooms ?? bedrooms,
      bathrooms,
      plotAreaM2: undefined,
      builtAreaM2,
    });
  });

  return cards.filter((c) => c.externalId && (c.title || c.priceText));
}

function extractIdFromHref(href: string): string | undefined {
  try {
    const path = new URL(href).pathname;
    const m = /\/a\/(\d+)\//.exec(path);
    return m?.[1];
  } catch {
    return undefined;
  }
}

function extractFeature($: cheerio.CheerioAPI, card: cheerio.Cheerio<any>, iconClass: string): number | undefined {
  const container = card.find(`i.${iconClass}`).closest(".adDetailFeature");
  if (!container.length) return undefined;
  const text = container.find("span").text().trim();
  const m = text.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : undefined;
}

export function countPaginationPages(html: string): number {
  const $ = cheerio.load(html);
  let last = 0;

  $("a[href*=':p:']").each((_i, el) => {
    const href = $(el).attr("href") ?? "";
    const m = /:p:(\d+)/.exec(href);
    if (m) last = Math.max(last, parseInt(m[1], 10));
  });

  if (last === 0) {
    const match = html.match(/"(\d+)":\s*"https?:\/\/[^"]*:p:\d+"/);
    if (match) last = parseInt(match[1], 10);
  }

  return last;
}
