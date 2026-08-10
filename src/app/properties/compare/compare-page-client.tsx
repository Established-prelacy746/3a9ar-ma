"use client";

import { useI18n } from "@/lib/i18n";
import { CompareProperties } from "@/components/features/compare-properties";
import { useCompareStore } from "@/features/properties/hooks/use-compare-store";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ComparePageClient() {
  const { t, locale } = useI18n();
  const isAR = locale === "AR";
  const { ids } = useCompareStore();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("compareTitle")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("compareBar", { count: String(ids.length) })}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/properties">
            <ArrowLeft className={cn("h-4 w-4", isAR ? "rotate-180" : "")} />
            {t("compareBack")}
          </Link>
        </Button>
      </div>
      <CompareProperties />
    </div>
  );
}
