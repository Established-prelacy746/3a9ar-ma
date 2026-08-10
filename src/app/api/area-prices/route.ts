import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const cities = await db.city.findMany({
      where: {
        properties: { some: { listingStatus: "ACTIVE", builtAreaM2: { not: null } } },
      },
      include: {
        _count: { select: { properties: true } },
        properties: {
          where: { listingStatus: "ACTIVE", builtAreaM2: { not: null } },
          select: { price: true, builtAreaM2: true },
          take: 200,
        },
      },
    });

    const result = cities
      .filter((c) => c.properties.length > 0 && c.latitude != null && c.longitude != null)
      .map((c) => {
        const pricesM2 = c.properties
          .map((p) => Number(p.price) / Number(p.builtAreaM2))
          .filter((v) => v > 0 && v < 500000);

        const avgPriceM2 = pricesM2.length > 0
          ? pricesM2.reduce((a, b) => a + b, 0) / pricesM2.length
          : 0;

        return {
          cityId: c.id,
          cityName: c.name,
          cityNameAr: c.nameAr,
          latitude: c.latitude,
          longitude: c.longitude,
          avgPriceM2: Math.round(avgPriceM2),
          propertyCount: c._count.properties,
        };
      })
      .filter((c) => c.avgPriceM2 > 0)
      .sort((a, b) => b.avgPriceM2 - a.avgPriceM2);

    return NextResponse.json({ cities: result }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({ cities: [] }, { status: 500 });
  }
}
