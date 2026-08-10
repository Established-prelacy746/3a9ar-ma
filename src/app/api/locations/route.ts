import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const withNeighborhoods = url.searchParams.get("neighborhoods") === "true";

  const regions = await db.region.findMany({
    orderBy: { name: "asc" },
    include: {
      cities: {
        orderBy: { name: "asc" },
        include: withNeighborhoods ? { neighborhoods: { orderBy: { name: "asc" } } } : undefined,
      },
    },
  });

  return NextResponse.json({ regions });
}
