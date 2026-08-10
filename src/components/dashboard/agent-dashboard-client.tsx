"use client";

import { Building2, Star, Users, Banknote } from "lucide-react";
import { formatMAD } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PromoteDialog, type PromoteProperty } from "@/components/dashboard/promote-dialog";
import { useI18n } from "@/lib/i18n";

interface Stat {
  labelKey: string;
  value: string | number;
  icon: typeof Building2;
}

interface Payment {
  id: string;
  property?: { title: string } | null;
  reference: string;
  provider: string;
  amount: number;
  status: string;
  createdAt: Date;
}

interface Lead {
  id: string;
  buyerName: string | null;
  buyerPhone: string;
  buyerMessage: string | null;
  channel: string;
  status: string;
  createdAt: Date;
}

export function AgentDashboardClient({
  total,
  active,
  featured,
  leads,
  revenueAgg,
  recentPayments,
  recentLeads,
  activeProperties,
}: {
  total: number;
  active: number;
  featured: number;
  leads: number;
  revenueAgg: { _sum: { amount: number | null }; _count: number };
  recentPayments: Payment[];
  recentLeads: Lead[];
  activeProperties: PromoteProperty[];
}) {
  const { t } = useI18n();

  const stats: Stat[] = [
    { labelKey: "listingsLabel", value: total, icon: Building2 },
    { labelKey: "activeLabel", value: active, icon: Building2 },
    { labelKey: "featuredLabel", value: featured, icon: Star },
    { labelKey: "leadsLabel", value: leads, icon: Users },
    { labelKey: "revenueLabel", value: formatMAD(revenueAgg._sum.amount ?? 0), icon: Banknote },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("agentDashboard")}</h1>
          <p className="text-sm text-muted-foreground">{t("manageLeads")}</p>
        </div>
        <Badge variant="outline">{revenueAgg._count} {t("paidTransactions")}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map(({ labelKey, value, icon: Icon }) => (
          <Card key={labelKey}>
            <CardContent className="flex items-center gap-3 p-4">
              <Icon className="h-8 w-8 text-primary" />
              <div>
                <p className="text-lg font-bold leading-tight">{value}</p>
                <p className="text-xs text-muted-foreground">{t(labelKey as any)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <div className="px-6 py-4">
            <h2 className="text-base font-semibold">{t("recentPayments")}</h2>
          </div>
          <div className="p-0">
            <ul className="divide-y">
              {recentPayments.map((p) => (
                <li key={p.id} className="flex items-center justify-between px-6 py-3 text-sm">
                  <div>
                    <p className="font-medium">{p.property?.title ?? p.reference}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.provider} · {p.createdAt.toISOString().slice(0, 10)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{formatMAD(p.amount)}</span>
                    <Badge variant={p.status === "COMPLETED" ? "success" : "secondary"}>{p.status}</Badge>
                  </div>
                </li>
              ))}
              {recentPayments.length === 0 && (
                <li className="px-6 py-8 text-center text-sm text-muted-foreground">{t("noPayments")}</li>
              )}
            </ul>
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4">
            <h2 className="text-base font-semibold">{t("recentLeads")}</h2>
          </div>
          <div className="p-0">
            <ul className="divide-y">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="px-6 py-3 text-sm">
                  <p className="font-medium">
                    {lead.buyerName ?? lead.buyerPhone}{" "}
                    <span className="text-xs text-muted-foreground">· {lead.channel}</span>
                  </p>
                  {lead.buyerMessage && <p className="line-clamp-1 text-xs text-muted-foreground">{lead.buyerMessage}</p>}
                  <p className="mt-1 text-xs">
                    <Badge variant="secondary">{lead.status}</Badge>
                    <span className="ml-2 text-muted-foreground">{lead.createdAt.toISOString().slice(0, 10)}</span>
                  </p>
                </li>
              ))}
              {recentLeads.length === 0 && (
                <li className="px-6 py-8 text-center text-sm text-muted-foreground">{t("noLeads")}</li>
              )}
            </ul>
          </div>
        </Card>
      </div>

      <PromoteDialog properties={activeProperties} />
    </div>
  );
}
