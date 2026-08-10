"use client";

import { Shield, ShieldAlert, ShieldCheck, ShieldX, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface LegalStatusTranslatorProps {
  currentStatus?: string;
}

const STATUS_CONFIG = {
  TITRE_FONCIER: {
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: ShieldCheck,
    iconColor: "text-emerald-600",
    riskKey: "legalStatusSecure",
    riskColor: "text-emerald-600",
    recKey: "legalStatusRecSafe",
    descKey: "legalStatusTitreFoncierDesc",
  },
  MELKIA: {
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    border: "border-yellow-200 dark:border-yellow-800",
    icon: Shield,
    iconColor: "text-yellow-600",
    riskKey: "legalStatusModerate",
    riskColor: "text-yellow-600",
    recKey: "legalStatusRecModerate",
    descKey: "legalStatusMelkiaDesc",
  },
  ADOULAIRE: {
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    border: "border-orange-200 dark:border-orange-800",
    icon: ShieldAlert,
    iconColor: "text-orange-600",
    riskKey: "legalStatusHigh",
    riskColor: "text-orange-600",
    recKey: "legalStatusRecHigh",
    descKey: "legalStatusAdoulaireDesc",
  },
  NON_TITRE: {
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    border: "border-red-200 dark:border-red-800",
    icon: ShieldX,
    iconColor: "text-red-600",
    riskKey: "legalStatusVeryHigh",
    riskColor: "text-red-600",
    recKey: "legalStatusRecVeryHigh",
    descKey: "legalStatusNonTitreDesc",
  },
} as const;

const LEGAL_STATUS_NAME_KEY: Record<string, string> = {
  TITRE_FONCIER: "legalStatusTitreFoncier",
  MELKIA: "legalStatusMelkia",
  ADOULAIRE: "legalStatusAdoulaire",
  NON_TITRE: "legalStatusNonTitre",
};

export function LegalStatusTranslator({ currentStatus }: LegalStatusTranslatorProps) {
  const { t, locale } = useI18n();
  const isAR = locale === "AR";

  if (!currentStatus || !STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG]) {
    return null;
  }

  const config = STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG];
  const Icon = config.icon;
  const nameKey = LEGAL_STATUS_NAME_KEY[currentStatus] ?? `legalStatus${currentStatus}`;

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6",
        config.border
      )}
      dir={isAR ? "rtl" : "ltr"}
    >
      <div className="mb-3 flex items-center gap-2">
        <Info className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{t("legalStatusTitle")}</h2>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{t("legalStatusDesc")}</p>

      <div className="space-y-4">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
          const StatusIcon = cfg.icon;
          const isActive = status === currentStatus;
          const sNameKey = LEGAL_STATUS_NAME_KEY[status] ?? `legalStatus${status}`;

          return (
            <div
              key={status}
              className={cn(
                "rounded-lg border p-4 transition-colors",
                isActive
                  ? `${cfg.color} ${cfg.border}`
                  : "border-border bg-muted/30 opacity-60"
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon className={cn("h-4 w-4", cfg.iconColor)} />
                  <span className="text-sm font-semibold">{t(sNameKey as any)}</span>
                </div>
                {isActive && (
                  <Badge variant="outline" className="text-xs">
                    ●
                  </Badge>
                )}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t(cfg.descKey as any)}
              </p>
              {isActive && (
                <div className="mt-3 flex flex-wrap gap-3 border-t pt-3">
                  <div>
                    <p className="text-[10px] font-medium uppercase text-muted-foreground">
                      {t("legalStatusRiskLevel")}
                    </p>
                    <p className={cn("text-xs font-semibold", cfg.riskColor)}>
                      {t(cfg.riskKey as any)}
                    </p>
                  </div>
                  <div className="border-l pl-3">
                    <p className="text-[10px] font-medium uppercase text-muted-foreground">
                      {t("legalStatusRecommendation")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t(cfg.recKey as any)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
