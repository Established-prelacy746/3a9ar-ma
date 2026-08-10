import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { AdminDashboardClient } from "@/components/dashboard/admin-dashboard-client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const guard = await requireRole(["ADMIN"]);
  if (!guard.ok) redirect("/agent");

  const [
    revenueAgg,
    byProvider,
    pendingCount,
    agentsCount,
    listingsCount,
    leadsCount,
    payments,
    pendingListings,
  ] = await Promise.all([
    db.payment.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true }, _count: true }),
    db.payment.groupBy({
      by: ["provider"],
      where: { status: "COMPLETED" },
      _sum: { amount: true },
      _count: true,
    }),
    db.property.count({ where: { listingStatus: "PENDING_REVIEW" } }),
    db.user.count({ where: { role: "AGENT" } }),
    db.property.count(),
    db.lead.count(),
    db.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { agent: { select: { name: true, id: true } }, property: { select: { title: true } } },
    }),
    db.property.findMany({
      where: { listingStatus: "PENDING_REVIEW" },
      include: { owner: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
      take: 50,
    }),
  ]);

  return (
    <AdminDashboardClient
      stats={{
        revenue: Number(revenueAgg._sum.amount ?? 0),
        paidCount: revenueAgg._count,
        agentsCount,
        listingsCount,
        leadsCount,
        pendingCount,
      }}
      byProvider={byProvider as any}
      payments={payments as any}
      pendingListings={pendingListings.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        price: p.price.toString(),
        type: p.type,
        owner: { name: p.owner.name, email: p.owner.email },
      }))}
      pendingCount={pendingCount}
    />
  );
}
