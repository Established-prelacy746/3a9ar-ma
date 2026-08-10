"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

interface LeadData {
  id: string;
  buyerName: string | null;
  buyerPhone: string;
  buyerMessage: string | null;
  channel: string;
  status: string;
  createdAt: Date;
  property?: { title: string; slug: string } | null;
}

export function AgentLeadsClient({ leads }: { leads: LeadData[] }) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("leadsTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("leadsDesc")}</p>
      </div>

      <Card>
        <div className="px-6 py-4">
          <h2 className="text-base font-semibold">{t("allLeads")} ({leads.length})</h2>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                  <th className="px-6 py-3">{t("buyerHeader")}</th>
                  <th className="px-6 py-3">{t("phoneHeader")}</th>
                  <th className="px-6 py-3">{t("propertyHeader")}</th>
                  <th className="px-6 py-3">{t("channelHeader")}</th>
                  <th className="px-6 py-3">{t("statusHeader")}</th>
                  <th className="px-6 py-3">{t("dateHeader")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/50">
                    <td className="px-6 py-3 font-medium">{lead.buyerName ?? t("anonymous")}</td>
                    <td className="px-6 py-3">{lead.buyerPhone}</td>
                    <td className="px-6 py-3 text-muted-foreground">{lead.property?.title ?? "—"}</td>
                    <td className="px-6 py-3">
                      <Badge variant="secondary">{lead.channel}</Badge>
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={lead.status === "CONVERTED" ? "success" : "secondary"}>{lead.status}</Badge>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{lead.createdAt.toISOString().slice(0, 10)}</td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                      {t("noLeadsYet")}
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
