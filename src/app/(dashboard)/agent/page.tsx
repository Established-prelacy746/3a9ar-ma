import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { AgentDashboardClient } from "@/components/dashboard/agent-dashboard-client";

export const dynamic = "force-dynamic";

export default async function AgentDashboardPage() {
  const guard = await requireRole(["AGENT", "ADMIN"]);
  if (!guard.ok) redirect("/auth/signin");
  const agentId = guard.session.user.id;

  const [total, active, featured, leads, revenueAgg, recentPayments, recentLeads, activeProperties] =
    await Promise.all([
      db.property.count({ where: { ownerId: agentId } }),
      db.property.count({ where: { ownerId: agentId, listingStatus: "ACTIVE" } }),
      db.property.count({ where: { ownerId: agentId, isFeatured: true } }),
      db.lead.count({ where: { agentId } }),
      db.payment.aggregate({
        where: { agentId, status: "COMPLETED" },
        _sum: { amount: true },
        _count: true,
      }),
      db.payment.findMany({
        where: { agentId },
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { property: { select: { title: true } } },
      }),
      db.lead.findMany({ where: { agentId }, orderBy: { createdAt: "desc" }, take: 8 }),
      db.property.findMany({
        where: { ownerId: agentId, listingStatus: "ACTIVE" },
        select: { id: true, title: true, isFeatured: true, featuredExpiresAt: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

  return (
    <AgentDashboardClient
      total={total}
      active={active}
      featured={featured}
      leads={leads}
      revenueAgg={revenueAgg as any}
      recentPayments={recentPayments as any}
      recentLeads={recentLeads as any}
      activeProperties={activeProperties}
    />
  );
}
