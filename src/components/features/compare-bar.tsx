"use client";

import { useCompareStore } from "@/features/properties/hooks/use-compare-store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRight, Scale } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export function CompareBar() {
  const { ids, remove, clear } = useCompareStore();
  const { t, locale } = useI18n();
  const isAR = locale === "AR";

  if (ids.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] backdrop-blur supports-[backdrop-filter]:bg-background/80"
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Scale className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              {t("compareBar", { count: String(ids.length) })}
            </span>
            <Badge variant="secondary" className="ml-1">
              {ids.length}/{3}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clear}>
              {t("compareClear")}
            </Button>
            <Button asChild size="sm" disabled={ids.length < 2}>
              <Link href="/properties/compare">
                {t("compareNow")}
                <ArrowRight className={cn("h-4 w-4", isAR ? "rotate-180" : "")} />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
