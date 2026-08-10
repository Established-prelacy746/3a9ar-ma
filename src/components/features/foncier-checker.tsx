"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, ExternalLink, Info, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const STEPS = [
  { titleKey: "step1Title" as const, descKey: "step1Desc" as const },
  { titleKey: "step2Title" as const, descKey: "step2Desc" as const },
  { titleKey: "step3Title" as const, descKey: "step3Desc" as const },
  { titleKey: "step4Title" as const, descKey: "step4Desc" as const },
];

const WARNINGS = [
  "foncierWarning1",
  "foncierWarning2",
  "foncierWarning3",
  "foncierWarning4",
] as const;

export function FoncierChecker() {
  const { t, locale } = useI18n();
  const isAR = locale === "AR";
  const [openStep, setOpenStep] = useState<number | null>(0);

  return (
    <div className="rounded-xl border bg-card p-6" dir={isAR ? "rtl" : "ltr"}>
      <div className="mb-3 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{t("foncierChecker")}</h2>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">{t("foncierCheckerDesc")}</p>

      {/* Steps */}
      <div className="mb-6 space-y-2">
        {STEPS.map((step, idx) => {
          const isOpen = openStep === idx;
          return (
            <div
              key={idx}
              className={cn(
                "rounded-lg border transition-colors",
                isOpen ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20"
              )}
            >
              <button
                onClick={() => setOpenStep(isOpen ? null : idx)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      isOpen
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t(step.titleKey)}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {t("foncierStep")} {idx + 1} {t("foncierOf")} {STEPS.length}
                    </p>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </button>
              {isOpen && (
                <div className="border-t px-4 pb-4 pt-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(step.descKey)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Warning Signs */}
      <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-semibold text-amber-800 dark:text-amber-200">
            {t("foncierWarningTitle")}
          </span>
        </div>
        <ul className="space-y-1.5">
          {WARNINGS.map((wKey) => (
            <li key={wKey} className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              {t(wKey)}
            </li>
          ))}
        </ul>
      </div>

      {/* Tip */}
      <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
        <div className="mb-1 flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
            {t("foncierTip")}
          </span>
        </div>
        <p className="text-xs text-blue-700 dark:text-blue-300">{t("foncierTipText")}</p>
      </div>

      {/* Risk Warning */}
      <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
        <div className="mb-1 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <span className="text-sm font-semibold text-red-800 dark:text-red-200">
            {t("foncierRiskHigh")}
          </span>
        </div>
        <p className="text-xs text-red-700 dark:text-red-300">{t("foncierRiskHighDesc")}</p>
      </div>

      {/* Government Resources */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="mb-2 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">{t("foncierGovResources")}</span>
        </div>
        <div className="space-y-1.5">
          <a
            href="https://www.service-public.ma"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            {t("servicePublicMa")}
          </a>
          <a
            href="https://www.conservation-fonciere.ma"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            {t("conservationFonciere")}
          </a>
        </div>
      </div>
    </div>
  );
}
