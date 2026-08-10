import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const existing = await db.propertyReview.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  await db.propertyReview.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
