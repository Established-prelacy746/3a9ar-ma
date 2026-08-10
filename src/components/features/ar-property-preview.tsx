"use client";

import { Smartphone, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

interface ArPropertyPreviewProps {
  title?: string;
}

export function ArPropertyPreview({ title }: ArPropertyPreviewProps) {
  const { t } = useI18n();

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium">
        <Smartphone className="h-4 w-4 text-primary" />
        {t("arPreviewTitle")}
      </div>

      <div className="relative mx-auto max-w-xs overflow-hidden rounded-2xl border-4 border-gray-800 bg-gray-900 shadow-xl">
        {/* Phone notch */}
        <div className="relative mx-auto h-6 w-32 rounded-b-xl bg-gray-800">
          <div className="absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gray-600" />
        </div>

        {/* Phone screen */}
        <div className="relative aspect-[9/16] bg-gradient-to-b from-sky-400 to-sky-200 p-4">
          {/* AR visualization mockup */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* 3D grid lines */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute left-0 right-0 border-t border-white"
                  style={{ top: `${(i + 1) * 12.5}%` }}
                />
              ))}
              {[...Array(6)].map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute top-0 bottom-0 border-l border-white"
                  style={{ left: `${(i + 1) * 16.6}%` }}
                />
              ))}
            </div>

            {/* AR marker */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="h-16 w-16 rounded-lg border-2 border-dashed border-white/60 bg-white/10 backdrop-blur-sm">
                <div className="flex h-full items-center justify-center">
                  <Eye className="h-8 w-8 text-white/80" />
                </div>
              </div>
              <div className="rounded-lg bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                {title ?? t("arPropertyLabel")}
              </div>
            </div>

            {/* AR frame corners */}
            <div className="absolute left-4 top-1/3 h-8 w-8 border-l-2 border-t-2 border-white/60" />
            <div className="absolute right-4 top-1/3 h-8 w-8 border-r-2 border-t-2 border-white/60" />
            <div className="absolute bottom-1/3 left-4 h-8 w-8 border-b-2 border-l-2 border-white/60" />
            <div className="absolute bottom-1/3 right-4 h-8 w-8 border-b-2 border-r-2 border-white/60" />
          </div>

          {/* Status bar */}
          <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 pt-1 text-[10px] text-white">
            <span>9:41</span>
            <span className="font-medium">3A9AR.ma AR</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="mb-1 text-sm font-medium">{t("arComingSoon")}</p>
        <p className="mb-3 text-xs text-muted-foreground">{t("arDescription")}</p>
        <Button variant="outline" size="sm" disabled>
          {t("arNotifyMe")}
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
