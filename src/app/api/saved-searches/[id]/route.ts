import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const existing = await db.savedSearch.findUnique({
    where: { id: params.id },
    select: { userId: true },
  });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 422 });
  }

  const updateData: Record<string, unknown> = {};
  if (typeof body.name === "string") updateData.name = body.name.trim().slice(0, 100);
  if (typeof body.notifyEmail === "boolean") updateData.notifyEmail = body.notifyEmail;
  if (typeof body.notifyWhatsApp === "boolean") updateData.notifyWhatsApp = body.notifyWhatsApp;

  const search = await db.savedSearch.update({
    where: { id: params.id },
    data: updateData,
    select: {
      id: true,
      name: true,
      filters: true,
      notifyEmail: true,
      notifyWhatsApp: true,
      createdAt: true,
      lastNotifiedAt: true,
    },
  });

  return NextResponse.json({ search });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const existing = await db.savedSearch.findUnique({
    where: { id: params.id },
    select: { userId: true },
  });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  await db.savedSearch.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
