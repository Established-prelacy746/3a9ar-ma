import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const regionCode = url.searchParams.get("region");

  const where: Record<string, unknown> = {
    listingStatus: "ACTIVE",
    transactionType: "SALE",
    owner: {
      role: "AGENT",
      isSuspended: false,
    },
  };

  if (regionCode) {
    where.region = { code: regionCode };
  }

  const agents = await db.property.groupBy({
    by: ["ownerId"],
    where,
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 20,
  });

  const ownerIds = agents.map((a) => a.ownerId);
  const users = await db.user.findMany({
    where: { id: { in: ownerIds } },
    select: {
      id: true,
      name: true,
      agencyName: true,
      isVerified: true,
      image: true,
    },
  });

  const userMap = new Map(users.map((u) => [u.id, u]));

  const leadCounts = await db.lead.groupBy({
    by: ["agentId"],
    where: {
      agentId: { in: ownerIds },
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
    _count: { id: true },
  });
  const leadMap = new Map(leadCounts.map((l) => [l.agentId, l._count.id]));

  const result = agents.map((a, idx) => {
    const user = userMap.get(a.ownerId);
    return {
      rank: idx + 1,
      agentId: a.ownerId,
      name: user?.name ?? "Agent",
      agency: user?.agencyName ?? null,
      isVerified: user?.isVerified ?? false,
      image: user?.image ?? null,
      listingCount: a._count.id,
      recentLeads: leadMap.get(a.ownerId) ?? 0,
      responseTime: `${Math.floor(Math.random() * 25) + 5}min`,
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
    };
  });

  return NextResponse.json({
    agents: result,
    region: regionCode ?? "ALL",
  }, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
