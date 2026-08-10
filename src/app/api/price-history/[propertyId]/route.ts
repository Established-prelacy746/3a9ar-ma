import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { propertyId: string } }
) {
  try {
    const history = await db.priceHistory.findMany({
      where: { propertyId: params.propertyId },
      orderBy: { recordedAt: "asc" },
      take: 50,
    });

    return NextResponse.json({ history }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ history: [] }, { status: 500 });
  }
}
