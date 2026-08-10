import { Suspense } from "react";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { AgentPromoteClient } from "@/components/dashboard/agent-promote-client";

export const dynamic = "force-dynamic";

export default async function AgentPromotePage({
  searchParams,
}: {
  searchParams: { status?: string; reason?: string };
}) {
  const guard = await requireRole(["AGENT", "ADMIN"]);
  if (!guard.ok) return null;

  const [activeProperties, activePromotions] = await Promise.all([
    db.property.findMany({
      where: { ownerId: guard.session.user.id, listingStatus: "ACTIVE" },
      select: { id: true, title: true, isFeatured: true, featuredExpiresAt: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.promotion.findMany({
      where: { agentId: guard.session.user.id, status: "ACTIVE" },
      include: { property: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const { status, reason } = searchParams;

  return (
    <Suspense fallback={<div className="h-72 animate-pulse rounded-xl bg-muted" />}>
      <AgentPromoteClient
        activeProperties={activeProperties}
        activePromotions={activePromotions as any}
        status={status}
        reason={reason}
      />
    </Suspense>
  );
}
