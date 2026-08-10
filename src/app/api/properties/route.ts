import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { queryProperties } from "@/features/properties/server/property-queries";
import { propertyQuerySchema } from "@/lib/validations/property-query";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = propertyQuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_QUERY", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const result = await queryProperties(parsed.data);
  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}

const createPropertySchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  transactionType: z.enum(["SALE", "RENT"]),
  category: z.enum(["RESIDENTIAL", "COMMERCIAL", "LAND"]),
  type: z.enum(["APARTMENT", "VILLA", "RIAD", "BUREAUX", "MAGASIN", "FERME", "LOTISSEMENT", "TERRAIN_CONSTRUCTIBLE", "TERRAIN_AGRICOLE"]),
  price: z.number().positive(),
  plotAreaM2: z.number().positive().optional(),
  builtAreaM2: z.number().positive().optional(),
  rooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  legalStatus: z.enum(["TITRE_FONCIER", "MELKIA", "ADOULAIRE", "NON_TITRE"]).optional(),
  cityCode: z.string(),
  regionCode: z.string(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  coverImage: z.string().url().optional(),
});

export async function POST(request: Request) {
  const session = await import("@/lib/auth").then((m) => m.getAuthSession());
  if (!session?.user || session.user.role === "BUYER") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  // Rate limiting: 10 properties per hour per user
  const rl = await rateLimit(`property:${session.user.id}`, 10, 3600);
  if (!rl.ok) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });

  // Validate input
  const parsed = createPropertySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const city = await db.city.findUnique({ where: { code: parsed.data.cityCode } });
  const region = await db.region.findUnique({ where: { code: parsed.data.regionCode } });
  if (!city || !region) return NextResponse.json({ error: "INVALID_LOCATION" }, { status: 422 });

  const property = await db.property.create({
    data: {
      title: parsed.data.title,
      slug: `${parsed.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`,
      description: parsed.data.description,
      transactionType: parsed.data.transactionType,
      category: parsed.data.category,
      type: parsed.data.type,
      price: parsed.data.price,
      currency: "MAD",
      plotAreaM2: parsed.data.plotAreaM2 ?? null,
      builtAreaM2: parsed.data.builtAreaM2 ?? null,
      rooms: parsed.data.rooms ?? null,
      bathrooms: parsed.data.bathrooms ?? null,
      legalStatus: parsed.data.legalStatus ?? "NON_TITRE",
      regionId: region.id,
      cityId: city.id,
      latitude: parsed.data.latitude ?? null,
      longitude: parsed.data.longitude ?? null,
      ownerId: session.user.id,
      listingStatus: "PENDING_REVIEW",
      coverImage: parsed.data.coverImage ? [parsed.data.coverImage] : [],
    },
  });

  return NextResponse.json({ property }, { status: 201 });
}
