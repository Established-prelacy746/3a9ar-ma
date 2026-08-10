import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { propertyQuerySchema } from "@/lib/validations/property-query";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = propertyQuerySchema.safeParse(Object.fromEntries(url.searchParams));

  const where: any = { listingStatus: "ACTIVE" };
  if (parsed.success) {
    if (parsed.data.transaction) where.transactionType = parsed.data.transaction;
    if (parsed.data.category) where.category = parsed.data.category;
    if (parsed.data.type) where.type = parsed.data.type;
    if (parsed.data.region) where.region = { code: parsed.data.region };
    if (parsed.data.city) where.city = { code: parsed.data.city };
  }

  const properties = await db.property.findMany({
    where,
    select: {
      id: true,
      slug: true,
      title: true,
      price: true,
      latitude: true,
      longitude: true,
      plotAreaM2: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(properties, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
