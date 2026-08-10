"use client";

import { motion } from "framer-motion";
import { PropertyCard } from "@/components/properties/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/features/properties/hooks/use-properties";
import { useFilterStore } from "@/features/properties/hooks/use-filter-store";
import type { PropertiesResponse } from "@/types/property";
import { useI18n } from "@/lib/i18n";

export function PropertyGrid({ initialData }: { initialData?: PropertiesResponse }) {
  const { filters, page, limit, setPage } = useFilterStore();
  const { t } = useI18n();
  const { data, isLoading, isFetching, isError, error } = useProperties(
    { ...filters, page, limit },
    { initialData },
  );

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="py-16 text-center text-sm text-destructive">
          {t("failedToLoad")} {(error as Error)?.message}
        </div>
      ) : data && data.items.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          {t("noResultsMatch")}
        </div>
      ) : (
        <>
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            {data?.items.map((property, i) => (
              <motion.div
                key={property.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.4) }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-10 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage(page - 1)}
            >
              {t("previous")}
            </Button>
            <span className="px-3 text-sm text-muted-foreground">
              {data?.pagination.total === 0
                ? `0 ${t("resultsLabel")}`
                : `${t("pageLabel")} ${data?.pagination.page} / ${data?.pagination.totalPages} · ${data?.pagination.total} ${t("resultsLabel")}`}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= (data?.pagination.totalPages ?? 1) || isFetching}
              onClick={() => setPage(page + 1)}
            >
              {t("next")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
