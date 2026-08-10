"use client";

import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PromoteDialog, type PromoteProperty } from "@/components/dashboard/promote-dialog";
import { useI18n } from "@/lib/i18n";

interface Promotion {
  id: string;
  tier: string;
  durationDays: number;
  expiresAt: Date;
  property: { title: string };
  status: string;
}

export function AgentPromoteClient({
  activeProperties,
  activePromotions,
  status,
  reason,
}: {
  activeProperties: PromoteProperty[];
  activePromotions: Promotion[];
  status?: string;
  reason?: string;
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("promoteTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("promoteDesc")}
        </p>
      </div>

      {(status === "ok" || status === "fail" || status === "cancel") && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            status === "ok"
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : "border-amber-300 bg-amber-50 text-amber-800"
          }`}
        >
          {status === "ok" && t("paymentConfirmed")}
          {status === "fail" && `${t("paymentFailed")}${reason ? ` (${reason})` : ""}.`}
          {status === "cancel" && t("paymentCancelled")}
        </div>
      )}

      <Suspense fallback={<div className="h-72 animate-pulse rounded-xl bg-muted" />}>
        <PromoteDialog properties={activeProperties} />
      </Suspense>

      <Card>
        <div className="px-6 py-4">
          <h2 className="text-base font-semibold">{t("activePromotions")}</h2>
        </div>
        <CardContent className="p-0">
          <ul className="divide-y">
            {activePromotions.map((promo) => (
              <li key={promo.id} className="flex items-center justify-between px-6 py-3 text-sm">
                <div>
                  <p className="font-medium">{promo.property.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {promo.tier} · {promo.durationDays} {t("days")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{t("expires")}</p>
                  <p className="font-medium">{promo.expiresAt.toISOString().slice(0, 10)}</p>
                </div>
              </li>
            ))}
            {activePromotions.length === 0 && (
              <li className="px-6 py-8 text-center text-sm text-muted-foreground">
                {t("noActivePromotions")}
              </li>
            )}
          </ul>
        </CardContent>
      </Card>

      {activeProperties.length === 0 && <Badge variant="outline">{t("noListingsToPromote")}</Badge>}
    </div>
  );
}
