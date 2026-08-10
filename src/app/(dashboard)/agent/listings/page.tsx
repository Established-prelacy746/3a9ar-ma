import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { AgentListingsClient } from "@/components/dashboard/agent-listings-client";

export const dynamic = "force-dynamic";

export default async function AgentListingsPage() {
  const guard = await requireRole(["AGENT", "ADMIN"]);
  if (!guard.ok) return null;

  const listings = await db.property.findMany({
    where: { ownerId: guard.session.user.id },
    include: { city: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return <AgentListingsClient listings={listings as any} />;
}
