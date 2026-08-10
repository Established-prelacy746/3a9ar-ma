import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { SCRAPER_SOURCE_AVITO, type ScraperSource, type ScrapeSummary, type ScrapedListing } from "./types";

const SYSTEM_OWNER_EMAIL = process.env.SCRAPER_OWNER_EMAIL ?? "scraper@ar3ar.ma";

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’`]/g, "")
    .trim();
}

type LocationIndex = {
  city: { id: string; name: string; regionId: string };
  neighborhoods: { id: string; name: string }[];
};

type ResolvedLocation = {
  city: { id: string; name: string; regionId: string; latitude?: number | null; longitude?: number | null };
  neighborhood?: { id: string; name: string };
};

async function buildLocationIndex(): Promise<LocationIndex[]> {
  const cities = await db.city.findMany({
    include: { neighborhoods: { select: { id: true, name: true } } },
  });
  return cities.map((city) => ({
    city: {
      id: city.id,
      name: city.name,
      regionId: city.regionId,
      latitude: city.latitude,
      longitude: city.longitude,
    },
    neighborhoods: city.neighborhoods,
  }));
}

function resolveLocation(
  index: LocationIndex[],
  locationText: string,
): ResolvedLocation | undefined {
  const hay = normalize(locationText);
  if (!hay) return undefined;

  const cityHit = index
    .filter((entry) => hay.includes(normalize(entry.city.name)))
    .sort((a, b) => normalize(b.city.name).length - normalize(a.city.name).length)[0];
  if (!cityHit) return undefined;

  const neighborhoodHit = cityHit.neighborhoods
    .filter((n) => hay.includes(normalize(n.name)))
    .sort((a, b) => normalize(b.name).length - normalize(a.name).length)[0];

  return {
    city: cityHit.city,
    neighborhood: neighborhoodHit
      ? { id: neighborhoodHit.id, name: neighborhoodHit.name }
      : undefined,
  };
}

export async function ensureScraperOwner(): Promise<string> {
  const existing = await db.user.findUnique({ where: { email: SYSTEM_OWNER_EMAIL } });
  if (existing) return existing.id;
  const created = await db.user.create({
    data: {
      email: SYSTEM_OWNER_EMAIL,
      name: "AR3AR Import (System)",
      role: "AGENT",
      isVerified: true,
    },
  });
  return created.id;
}

export async function importListings(
  listings: ScrapedListing[],
  options: { listingStatus?: "ACTIVE" | "PENDING_REVIEW"; dryRun?: boolean; source?: ScraperSource } = {},
): Promise<Pick<ScrapeSummary, "created" | "updated" | "skipped" | "failed" | "errors">> {
  const listingStatus = options.listingStatus ?? "ACTIVE";
  const dryRun = options.dryRun ?? false;
  const source = options.source ?? SCRAPER_SOURCE_AVITO;

  const ownerId = await ensureScraperOwner();
  const locationIndex = await buildLocationIndex();

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const listing of listings) {
    try {
      if (!listing.price || listing.price <= 0) {
        skipped++;
        continue;
      }

      const resolved = resolveLocation(locationIndex, listing.location);
      if (!resolved) {
        skipped++;
        errors.push(`no city match for "${listing.title}" (${listing.location || "no location"})`);
        continue;
      }

      const slug = `${slugify(listing.title)}-${listing.externalId.slice(-6)}`;
      const data = {
        slug,
        title: listing.title,
        description:
          listing.description ?? `Annonce importée depuis Avito (${listing.externalUrl})`,
        transactionType: listing.transactionType,
        rentPeriod: listing.transactionType === "RENT" ? ("LONG_TERM" as const) : undefined,
        rentFrequency: listing.rentFrequency,
        category: listing.category,
        type: listing.type,
        legalStatus: "NON_TITRE" as const,
        price: listing.price,
        currency: "MAD",
        plotAreaM2: listing.plotAreaM2 ?? null,
        builtAreaM2: listing.builtAreaM2 ?? null,
        rooms: listing.rooms ?? null,
        bathrooms: listing.bathrooms ?? null,
        floorLevel: listing.floorLevel ?? null,
        furnished: listing.furnished ?? false,
        regionId: resolved.city.regionId,
        cityId: resolved.city.id,
        latitude: resolved.city.latitude ?? null,
        longitude: resolved.city.longitude ?? null,
        neighborhoodId: resolved.neighborhood?.id ?? null,
        address: listing.address ?? listing.location ?? null,
        coverImage: listing.images,
        galleryImages: listing.images,
        listingStatus,
        publishedAt: listingStatus === "ACTIVE" ? new Date() : null,
        source,
        externalId: listing.externalId,
        externalUrl: listing.externalUrl,
        lastSeenAt: new Date(),
      };

      if (dryRun) {
        created++;
        continue;
      }

      const where = {
        source_externalId: { source, externalId: listing.externalId },
      };

      const existing = await db.property.findUnique({
        where,
        select: { id: true, externalId: true },
      });

      if (existing) {
        await db.property.update({ where: { id: existing.id }, data });
        updated++;
      } else {
        await db.property.create({ data: { ...data, ownerId } });
        created++;
      }
    } catch (err) {
      failed++;
      errors.push(`${listing.title}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { created, updated, skipped, failed, errors };
}
