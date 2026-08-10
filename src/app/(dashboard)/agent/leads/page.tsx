import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { AgentLeadsClient } from "@/components/dashboard/agent-leads-client";

export const dynamic = "force-dynamic";

export default async function AgentLeadsPage() {
  const guard = await requireRole(["AGENT", "ADMIN"]);
  if (!guard.ok) return null;

  const leads = await db.lead.findMany({
    where: { agentId: guard.session.user.id },
    include: { property: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return <AgentLeadsClient leads={leads as any} />;
}
