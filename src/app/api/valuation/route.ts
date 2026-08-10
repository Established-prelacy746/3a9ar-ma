import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const valuationSchema = z.object({
  cityCode: z.string().min(1),
  propertyType: z.enum([
    "APARTMENT",
    "VILLA",
    "RIAD",
    "BUREAUX",
    "MAGASIN",
    "FERME",
    "LOTISSEMENT",
    "TERRAIN_CONSTRUCTIBLE",
    "TERRAIN_AGRICOLE",
  ]),
  transactionType: z.enum(["SALE", "RENT"]).default("SALE"),
  areaM2: z.number().positive(),
  rooms: z.number().int().min(0).optional(),
  hasPool: z.boolean().optional().default(false),
  hasTerrace: z.boolean().optional().default(false),
  furnished: z.boolean().optional().default(false),
});

function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const parsed = valuationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const data = parsed.data;

  const city = await db.city.findUnique({ where: { code: data.cityCode } });
  if (!city) {
    return NextResponse.json({ error: "CITY_NOT_FOUND" }, { status: 404 });
  }

  const similarProperties = await db.property.findMany({
    where: {
      listingStatus: "ACTIVE",
      transactionType: data.transactionType,
      type: data.propertyType,
      cityId: city.id,
      price: { gt: 0 },
      ...(data.transactionType === "SALE"
        ? { plotAreaM2: { gt: 0 } }
        : {}),
    },
    select: {
      price: true,
      plotAreaM2: true,
      builtAreaM2: true,
      rooms: true,
      hasPool: true,
      hasTerrace: true,
      furnished: true,
    },
    take: 500,
  });

  if (similarProperties.length === 0) {
    return NextResponse.json(
      {
        estimatedMin: null,
        estimatedMax: null,
        estimatedMedian: null,
        pricePerM2: null,
        sampleSize: 0,
        confidence: "low",
        message: "NOT_ENOUGH_DATA",
      },
      { status: 200 },
    );
  }

  const pricePerM2List: number[] = [];
  for (const p of similarProperties) {
    const area = Number(p.builtAreaM2 ?? p.plotAreaM2 ?? 0);
    const price = Number(p.price);
    if (area > 0 && price > 0) {
      pricePerM2List.push(price / area);
    }
  }

  if (pricePerM2List.length === 0) {
    return NextResponse.json(
      {
        estimatedMin: null,
        estimatedMax: null,
        estimatedMedian: null,
        pricePerM2: null,
        sampleSize: 0,
        confidence: "low",
        message: "NO_AREA_DATA",
      },
      { status: 200 },
    );
  }

  const basePricePerM2 = median(pricePerM2List);

  let adjustment = 1.0;
  if (data.hasPool) adjustment += 0.08;
  if (data.hasTerrace) adjustment += 0.04;
  if (data.furnished) adjustment += 0.06;

  const adjustedPricePerM2 = basePricePerM2 * adjustment;
  const estimatedMedian = adjustedPricePerM2 * data.areaM2;

  const sortedPrices = pricePerM2List.sort((a, b) => a - b);
  const p25 = sortedPrices[Math.floor(sortedPrices.length * 0.25)] ?? sortedPrices[0];
  const p75 = sortedPrices[Math.floor(sortedPrices.length * 0.75)] ?? sortedPrices[sortedPrices.length - 1];

  const estimatedMin = p25 * adjustment * data.areaM2;
  const estimatedMax = p75 * adjustment * data.areaM2;

  let confidence: "low" | "medium" | "high";
  if (similarProperties.length >= 50) {
    confidence = "high";
  } else if (similarProperties.length >= 15) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  return NextResponse.json({
    estimatedMin: Math.round(estimatedMin),
    estimatedMax: Math.round(estimatedMax),
    estimatedMedian: Math.round(estimatedMedian),
    pricePerM2: Math.round(adjustedPricePerM2),
    sampleSize: similarProperties.length,
    confidence,
    city: city.name,
    type: data.propertyType,
    areaM2: data.areaM2,
  });
}
