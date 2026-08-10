import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");

  if (!propertyId) {
    return NextResponse.json({ error: "MISSING_PROPERTY_ID" }, { status: 422 });
  }

  const reviews = await db.propertyReview.findMany({
    where: { propertyId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      reviewerName: true,
      rating: true,
      comment: true,
      createdAt: true,
      userId: true,
    },
  });

  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const rl = await rateLimit(`review:${request.headers.get("x-forwarded-for") ?? "anon"}`, 5, 60);
  if (!rl.ok) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.propertyId || !body?.reviewerName || !body?.rating) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 422 });
  }

  const rating = Number(body.rating);
  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return NextResponse.json({ error: "INVALID_RATING" }, { status: 422 });
  }

  const property = await db.property.findUnique({
    where: { id: body.propertyId },
    select: { id: true },
  });
  if (!property) {
    return NextResponse.json({ error: "PROPERTY_NOT_FOUND" }, { status: 404 });
  }

  const review = await db.propertyReview.create({
    data: {
      propertyId: body.propertyId,
      reviewerName: String(body.reviewerName).trim().slice(0, 100),
      rating,
      comment: body.comment ? String(body.comment).trim().slice(0, 2000) : null,
    },
    select: {
      id: true,
      reviewerName: true,
      rating: true,
      comment: true,
      createdAt: true,
      userId: true,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
