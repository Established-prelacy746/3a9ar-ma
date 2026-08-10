import type { PropertyCategory, PropertyType, TransactionType } from "@prisma/client";

export type ScraperSource = "AVITO" | "MUBAWAB";
export const SCRAPER_SOURCE_AVITO = "AVITO" as const;
export const SCRAPER_SOURCE_MUBAWAB = "MUBAWAB" as const;

export type ScrapedListing = {
  externalId: string;
  externalUrl: string;
  title: string;
  description?: string;
  price: number;
  transactionType: TransactionType;
  rentFrequency?: "monthly" | "yearly";
  category: PropertyCategory;
  type: PropertyType;
  location: string;
  address?: string;
  plotAreaM2?: number;
  builtAreaM2?: number;
  rooms?: number;
  bathrooms?: number;
  floorLevel?: number;
  furnished?: boolean;
  images: string[];
};

export type ScrapeOptions = {
  url: string;
  maxPages?: number;
  startPage?: number;
  minRequestDelayMs?: number;
  listingStatus?: "ACTIVE" | "PENDING_REVIEW";
  dryRun?: boolean;
  verbose?: boolean;
};

export type ScrapeSummary = {
  source: string;
  startUrl: string;
  pagesFetched: number;
  listingsFound: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  errors: string[];
};

export type RawListingCard = {
  externalId?: string;
  href?: string;
  title?: string;
  priceText?: string;
  location?: string;
  image?: string;
  rooms?: number;
  bathrooms?: number;
  plotAreaM2?: number;
  builtAreaM2?: number;
};
