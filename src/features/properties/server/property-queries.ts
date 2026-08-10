import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { paginate } from "@/lib/utils";
import { parseBbox, type PropertyQuery } from "@/lib/validations/property-query";
import type { PropertiesResponse, PropertyCardData } from "@/types/property";
import { meilisearch, MEILISEARCH_ENABLED, PROPERTIES_INDEX } from "@/lib/meilisearch";
import { expandDarijaSearch, hasDarijaTerms } from "@/lib/darija-map";

const cardSelect = {
  id: true,
  slug: true,
  title: true,
  transactionType: true,
  rentPeriod: true,
  category: true,
  type: true,
  legalStatus: true,
  price: true,
  currency: true,
  rentFrequency: true,
  plotAreaM2: true,
  builtAreaM2: true,
  rooms: true,
  bathrooms: true,
  latitude: true,
  longitude: true,
  isFeatured: true,
  featuredExpiresAt: true,
  hasPool: true,
  hasTerrace: true,
  createdAt: true,
  coverImage: true,
  city: { select: { name: true, nameAr: true } },
  region: { select: { name: true, nameAr: true } },
  neighborhood: { select: { name: true, nameAr: true } },
} satisfies Prisma.PropertySelect;

async function searchPropertyIds(q: string): Promise<string[]> {
  // Expand Darija search terms to formal equivalents
  const expandedTerms = hasDarijaTerms(q) ? expandDarijaSearch(q) : [q];
  const searchQuery = expandedTerms.join(" ");

  if (MEILISEARCH_ENABLED) {
    const index = meilisearch.index(PROPERTIES_INDEX);
    const res = await index.search(searchQuery, { limit: 100, attributesToRetrieve: ["id"] });
    return res.hits.map((h) => String(h.id));
  }
  // Use parameterized query to prevent SQL injection
  const rows = await db.$queryRaw<{ id: string }[]>`
    SELECT id FROM "Property"
    WHERE "listingStatus" = 'ACTIVE'
      AND to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(description,''))
            @@ plainto_tsquery('simple', ${searchQuery})
    LIMIT 100
  `;
  return rows.map((r) => r.id);
}

function buildWhere(input: PropertyQuery): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = { listingStatus: "ACTIVE" };

  if (input.transaction) where.transactionType = input.transaction;
  if (input.rentPeriod) where.rentPeriod = input.rentPeriod;
  if (input.category) where.category = input.category;
  if (input.type) where.type = input.type;
  if (input.legalStatus) where.legalStatus = input.legalStatus;
  if (input.region) where.region = { code: input.region };
  if (input.city) where.city = { code: input.city };
  if (input.neighborhood) where.neighborhood = { code: input.neighborhood };
  if (input.density) where.density = input.density;

  if (input.minPrice != null || input.maxPrice != null) {
    const price: Prisma.DecimalFilter = {};
    if (input.minPrice != null) price.gte = input.minPrice;
    if (input.maxPrice != null) price.lte = input.maxPrice;
    where.price = price;
  }

  if (input.minArea != null || input.maxArea != null) {
    const area: Prisma.DecimalNullableFilter = {};
    if (input.minArea != null) area.gte = input.minArea;
    if (input.maxArea != null) area.lte = input.maxArea;
    where.plotAreaM2 = area;
  }

  if (input.minBuiltArea != null || input.maxBuiltArea != null) {
    const area: Prisma.DecimalNullableFilter = {};
    if (input.minBuiltArea != null) area.gte = input.minBuiltArea;
    if (input.maxBuiltArea != null) area.lte = input.maxBuiltArea;
    where.builtAreaM2 = area;
  }

  if (input.minRooms != null) where.rooms = { gte: input.minRooms };
  if (input.minBathrooms != null) where.bathrooms = { gte: input.minBathrooms };
  if (input.maxFloors != null) where.floors = { lte: input.maxFloors };
  if (input.minParking != null) where.parkingSpots = { gte: input.minParking };

  if (input.hasElevator != null) where.hasElevator = input.hasElevator;
  if (input.hasPool != null) where.hasPool = input.hasPool;
  if (input.hasTerrace != null) where.hasTerrace = input.hasTerrace;
  if (input.hasSecurity != null) where.hasSecurity = input.hasSecurity;
  if (input.furnished != null) where.furnished = input.furnished;

  if (input.bbox) {
    const { swLat, swLng, neLat, neLng } = parseBbox(input.bbox);
    where.latitude = { gte: Math.min(swLat, neLat), lte: Math.max(swLat, neLat) };
    where.longitude = { gte: Math.min(swLng, neLng), lte: Math.max(swLng, neLng) };
  }

  if (input.featured === true) where.isFeatured = true;

  return where;
}

function buildOrderBy(input: PropertyQuery): Prisma.PropertyOrderByWithRelationInput[] {
  switch (input.sort) {
    case "newest":
      return [{ createdAt: "desc" }, { isFeatured: "desc" }];
    case "price_asc":
      return [{ price: "asc" }, { isFeatured: "desc" }];
    case "price_desc":
      return [{ price: "desc" }, { isFeatured: "desc" }];
    case "area_desc":
      return [{ plotAreaM2: "desc" }, { isFeatured: "desc" }];
    case "featured":
    default:
      return [
        { isFeatured: "desc" },
        { featuredRank: "desc" },
        { featuredExpiresAt: "asc" },
        { createdAt: "desc" },
      ];
  }
}

export function serializePropertyCard<
  T extends {
    price: unknown;
    plotAreaM2: unknown;
    builtAreaM2: unknown;
    featuredExpiresAt: unknown;
    createdAt: unknown;
    neighborhood: { name: string } | null;
  },
>(raw: T): PropertyCardData {
  return {
    ...raw,
    price: String(raw.price),
    plotAreaM2: raw.plotAreaM2 == null ? null : String(raw.plotAreaM2),
    builtAreaM2: raw.builtAreaM2 == null ? null : String(raw.builtAreaM2),
    featuredExpiresAt: raw.featuredExpiresAt == null ? null : String(raw.featuredExpiresAt),
    createdAt: String(raw.createdAt),
  } as unknown as PropertyCardData;
}

export async function queryProperties(input: PropertyQuery): Promise<PropertiesResponse> {
  const where = buildWhere(input);

  if (input.q) {
    const ids = await searchPropertyIds(input.q);
    where.id = { in: ids };
  }

  const total = await db.property.count({ where });

  let page = input.page;
  let limit = input.limit;

  // price_per_m2_asc cannot be expressed with Prisma orderBy; fetch a bounded
  // candidate set and sort in memory (keeps response schema unified).
  if (input.sort === "price_per_m2_asc") {
    const { skip, take, page: safePage, totalPages } = paginate(page, limit, total);
    const candidates = await db.property.findMany({
      where,
      select: cardSelect,
      take: 2000,
    });
    const sorted = candidates
      .filter((c) => Number(c.plotAreaM2) > 0)
      .sort((a, b) => Number(a.price) / Number(a.plotAreaM2) - Number(b.price) / Number(b.plotAreaM2));
    return {
      items: sorted.slice(skip, skip + take).map(serializePropertyCard),
      pagination: { page: safePage, totalPages, total, limit },
      filters: input,
    };
  }

  const { skip, take, page: safePage, totalPages } = paginate(page, limit, total);
  const items = await db.property.findMany({
    where,
    select: cardSelect,
    orderBy: buildOrderBy(input),
    skip,
    take,
  });

  return {
    items: items.map(serializePropertyCard),
    pagination: { page: safePage, totalPages, total, limit },
    filters: input,
  };
}

export type { PropertyQuery };
