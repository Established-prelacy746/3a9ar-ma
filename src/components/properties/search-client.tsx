"use client";

import { useEffect, useState } from "react";
import { PropertyFilters, FilterPanelToggle } from "@/features/properties/components/property-filters";
import { PropertyGrid } from "@/components/properties/property-grid";
import { PropertyMap, type MapProperty } from "@/components/properties/property-map";
import { AreaPriceHeatmap } from "@/components/features/area-price-heatmap";
import dynamic from "next/dynamic";
import { useFilterStore } from "@/features/properties/hooks/use-filter-store";
import { useProperties } from "@/features/properties/hooks/use-properties";
import { fetchMapProperties } from "@/features/properties/api/client";
import type { PropertyQuery } from "@/lib/validations/property-query";
import type { PropertiesResponse } from "@/types/property";
import { MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SavedSearches } from "@/components/features/saved-searches";

const PropertyMapDynamic = dynamic(() => import("@/components/properties/property-map").then((m) => m.PropertyMap), {
  ssr: false,
  loading: () => <div className="h-[420px] animate-pulse rounded-xl bg-muted" />,
});

export function SearchClient({
  initial,
  initialQuery,
}: {
  initial: PropertiesResponse;
  initialQuery: PropertyQuery;
}) {
  const { setFilters, filters, page, limit } = useFilterStore();
  const { t } = useI18n();
  const [mapData, setMapData] = useState<MapProperty[]>([]);

  // Fetch properties based on current filters
  const { data } = useProperties(
    { ...filters, page, limit },
    { initialData: initial },
  );

  // Fetch ALL properties for map (not paginated)
  useEffect(() => {
    fetchMapProperties({ transaction: filters.transaction, category: filters.category, type: filters.type, region: filters.region, city: filters.city })
      .then((items) => setMapData(items as MapProperty[]))
      .catch(() => {});
  }, [filters.transaction, filters.category, filters.type, filters.region, filters.city]);

  useEffect(() => {
    const { page, limit, sort, ...rest } = initialQuery;
    setFilters({ ...rest, sort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const mapItems = mapData.length > 0 ? mapData : (data?.items ?? initial.items) as MapProperty[];

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("propertySearch")}</h1>
          <p className="text-sm text-muted-foreground">
            {data?.pagination.total ?? initial.pagination.total} {t("resultsLabel")} · {t("multiParamFilter")}
          </p>
        </div>
        <FilterPanelToggle />
          <SavedSearches currentFilters={filters} variant="inline" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <aside className="rounded-xl border bg-card p-6 lg:sticky lg:top-24 lg:h-fit lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <PropertyFilters />
        </aside>

        <div className="space-y-8">
          <div className="relative">
            <PropertyMapDynamic properties={mapItems} height={500} />
            <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium shadow-md backdrop-blur">
              <MapPin className="h-4 w-4 text-emerald-600" />
              {mapItems.length.toLocaleString()} {t("propertiesOnMapShort")}
            </div>
          </div>
          <AreaPriceHeatmap height={400} />
          <PropertyGrid initialData={initial} />
        </div>
      </div>
    </div>
  );
}
