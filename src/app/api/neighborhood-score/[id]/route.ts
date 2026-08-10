import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const score = await db.neighborhoodScore.findUnique({
      where: { neighborhoodId: params.id },
    });

    return NextResponse.json({ score }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({ score: null }, { status: 500 });
  }
}
