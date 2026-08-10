import type { PropertyQuery } from "@/lib/validations/property-query";

export type PropertyFilters = Omit<PropertyQuery, "page" | "limit" | "sort"> & {
  sort: PropertyQuery["sort"];
};

export interface PropertiesResponse {
  items: PropertyCardData[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  filters: PropertyQuery;
}

export interface PropertyCardData {
  id: string;
  slug: string;
  title: string;
  transactionType: "SALE" | "RENT";
  rentPeriod?: "LONG_TERM" | "SEASONAL" | null;
  category: string;
  type: string;
  legalStatus: string;
  price: string;
  currency: string;
  rentFrequency?: string | null;
  plotAreaM2?: string | null;
  builtAreaM2?: string | null;
  rooms?: number | null;
  bathrooms?: number | null;
  city: { name: string; nameAr: string };
  region: { name: string; nameAr: string };
  neighborhood?: { name: string; nameAr: string } | null;
  coverImage: string[];
  latitude?: number | null;
  longitude?: number | null;
  isFeatured: boolean;
  featuredExpiresAt?: string | null;
  hasPool: boolean;
  hasTerrace: boolean;
  createdAt: string;
}
