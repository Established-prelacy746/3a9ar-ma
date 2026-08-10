import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const searches = await db.savedSearch.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
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

  return NextResponse.json({ searches });
}

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const rl = await rateLimit(`saved-search:${session.user.id}`, 20, 60);
  if (!rl.ok) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 422 });
  }

  const search = await db.savedSearch.create({
    data: {
      userId: session.user.id,
      name: body.name.trim().slice(0, 100),
      filters: body.filters ?? {},
      notifyEmail: body.notifyEmail ?? true,
      notifyWhatsApp: body.notifyWhatsApp ?? false,
    },
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

  return NextResponse.json({ search }, { status: 201 });
}
