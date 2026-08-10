"use client";

import { Banknote, Building2, Users, ShieldCheck } from "lucide-react";
import { formatMAD } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModerationRow, type PendingProperty } from "@/components/dashboard/moderation-row";
import { useI18n } from "@/lib/i18n";

interface AdminStats {
  revenue: number;
  paidCount: number;
  agentsCount: number;
  listingsCount: number;
  leadsCount: number;
  pendingCount: number;
}

interface Payment {
  id: string;
  property?: { title: string } | null;
  reference: string;
  agent: { name: string | null; id: string };
  provider: string;
  amount: number;
  status: string;
  createdAt: Date;
}

interface GatewayRevenue {
  provider: string;
  _sum: { amount: number | null };
  _count: number;
}

export function AdminDashboardClient({
  stats,
  byProvider,
  payments,
  pendingListings,
}: {
  stats: AdminStats;
  byProvider: GatewayRevenue[];
  payments: Payment[];
  pendingListings: PendingProperty[];
  pendingCount: number;
}) {
  const { t } = useI18n();

  const statCards = [
    { label: t("revenueMAD"), value: formatMAD(stats.revenue), icon: Banknote },
    { label: t("paidTxns"), value: stats.paidCount, icon: Banknote },
    { label: t("agentsLabel"), value: stats.agentsCount, icon: Users },
    { label: t("listingsLabel"), value: stats.listingsCount, icon: Building2 },
    { label: t("leadsLabel"), value: stats.leadsCount, icon: Users },
    { label: t("pendingModeration"), value: stats.pendingCount, icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t("adminConsole")}</h1>
        <p className="text-sm text-muted-foreground">{t("adminDesc")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-3 p-4">
              <Icon className="h-8 w-8 text-primary" />
              <div className="min-w-0">
                <p className="truncate text-base font-bold leading-tight">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <div className="px-6 py-4">
            <h2 className="text-base font-semibold">{t("revenueByGateway")}</h2>
          </div>
          <CardContent className="p-0">
            <ul className="divide-y">
              {byProvider.map((g) => (
                <li key={g.provider} className="flex items-center justify-between px-6 py-3 text-sm">
                  <span className="font-medium">{g.provider}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{g._count} txns</span>
                    <span className="font-semibold">{formatMAD(g._sum.amount ?? 0)}</span>
                  </div>
                </li>
              ))}
              {byProvider.length === 0 && (
                <li className="px-6 py-8 text-center text-sm text-muted-foreground">{t("noRevenue")}</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <div className="px-6 py-4">
            <h2 className="text-base font-semibold">{t("paymentLog")}</h2>
          </div>
          <CardContent className="p-0">
            <ul className="divide-y">
              {payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between px-6 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.property?.title ?? p.reference}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.agent.name ?? p.agent.id} · {p.provider} · {p.createdAt.toISOString().slice(0, 10)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{formatMAD(p.amount)}</span>
                    <Badge variant={p.status === "COMPLETED" ? "success" : "secondary"}>{p.status}</Badge>
                  </div>
                </li>
              ))}
              {payments.length === 0 && (
                <li className="px-6 py-8 text-center text-sm text-muted-foreground">{t("noPayments")}</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="px-6 py-4">
          <h2 className="text-base font-semibold">
            {t("listingModeration")} ({stats.pendingCount} {t("pendingLabel")})
          </h2>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                  <th className="px-6 py-3">{t("listingHeader")}</th>
                  <th className="px-6 py-3">{t("typeHeader")}</th>
                  <th className="px-6 py-3">{t("priceHeader")}</th>
                  <th className="px-6 py-3">{t("ownerHeader")}</th>
                  <th className="px-6 py-3">{t("statusHeader")}</th>
                  <th className="px-6 py-3">{t("actionsHeader")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pendingListings.map((p) => (
                  <ModerationRow key={p.id} property={p} />
                ))}
                {pendingListings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                      {t("moderationEmpty")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
