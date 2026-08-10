"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@radix-ui/react-separator";
import { useFilterStore } from "@/features/properties/hooks/use-filter-store";
import { useLocations } from "@/features/properties/hooks/use-properties";
import { useI18n, translateRegion, translateType, translateSort, translateLegalStatus, translateCategory } from "@/lib/i18n";
import {
  CATEGORY_OPTIONS,
  DENSITY_OPTIONS,
  LEGAL_STATUS_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  RENT_PERIOD_OPTIONS,
  SORT_OPTIONS,
  TRANSACTION_OPTIONS,
} from "@/config/property-labels";
import type { PropertyFilters } from "@/types/property";

export function PropertyFilters() {
  const { filters, setFilter, setFilters, reset, isFilterOpen, toggleFilterPanel } = useFilterStore();
  const { data: locations } = useLocations();
  const { t, locale } = useI18n();

  const regionCode = filters.region;
  const cityCode = filters.city;

  const selectedRegion = locations?.regions.find((r) => r.code === regionCode);
  const selectedCity = selectedRegion?.cities.find((c) => c.code === cityCode);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("filterProperties")}
        </h2>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw className="mr-1 h-3.5 w-3.5" /> {t("reset")}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("transaction")}</Label>
                  <Select
                    value={filters.transaction ?? "ALL"}
                    onValueChange={(v) => setFilter("transaction", v === "ALL" ? undefined : v as "SALE" | "RENT")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("all")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">{t("all")}</SelectItem>
                      {TRANSACTION_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.value === "SALE" ? t("transactionSale") : t("transactionRent")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {filters.transaction === "RENT" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t("rentPeriod")}</Label>
                    <Select
                      value={filters.rentPeriod ?? "ALL"}
                      onValueChange={(v) => setFilter("rentPeriod", v === "ALL" ? undefined : v as "LONG_TERM" | "SEASONAL")}
                    >
                      <SelectTrigger><SelectValue placeholder={t("all")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">{t("all")}</SelectItem>
                        {RENT_PERIOD_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.value === "LONG_TERM" ? t("longTermLabel") : t("seasonalLabel")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("category")}</Label>
                  <Select
                    value={filters.category ?? "ALL"}
                    onValueChange={(v) => setFilter("category", v === "ALL" ? undefined : v as "RESIDENTIAL" | "COMMERCIAL" | "LAND")}
                  >
                    <SelectTrigger><SelectValue placeholder={t("all")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">{t("all")}</SelectItem>
                      <SelectItem value="RESIDENTIAL">{t("residentialLabel")}</SelectItem>
                      <SelectItem value="COMMERCIAL">{t("commercialLabel")}</SelectItem>
                      <SelectItem value="LAND">{t("landLabel")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("type")}</Label>
                  <Select
                    value={filters.type ?? "ALL"}
                    onValueChange={(v) =>
                      setFilter("type", v === "ALL" ? undefined : (v as PropertyFilters["type"]))
                    }
                  >
                    <SelectTrigger><SelectValue placeholder={t("all")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">{t("all")}</SelectItem>
                      {PROPERTY_TYPE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{translateType(o.value, t)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("legalStatus")}</Label>
                  <Select
                    value={filters.legalStatus ?? "ALL"}
                    onValueChange={(v) =>
                      setFilter("legalStatus", v === "ALL" ? undefined : (v as PropertyFilters["legalStatus"]))
                    }
                  >
                    <SelectTrigger><SelectValue placeholder={t("all")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">{t("all")}</SelectItem>
                      {LEGAL_STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{translateLegalStatus(o.value, t)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("region")}</Label>
                  <Select
                    value={filters.region ?? "ALL"}
                    onValueChange={(v) => setFilters({ region: v === "ALL" ? undefined : v, city: undefined, neighborhood: undefined })}
                  >
                    <SelectTrigger><SelectValue placeholder={t("all")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">{t("all")}</SelectItem>
                      {locations?.regions.map((r) => (
                        <SelectItem key={r.code} value={r.code}>{locale === "AR" ? r.nameAr : r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("city")}</Label>
                  <Select
                    value={filters.city ?? "ALL"}
                    disabled={!regionCode}
                    onValueChange={(v) => setFilter("city", v === "ALL" ? undefined : v)}
                  >
                    <SelectTrigger><SelectValue placeholder={t("all")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">{t("all")}</SelectItem>
                      {selectedRegion?.cities.map((c) => (
                        <SelectItem key={c.code} value={c.code}>{locale === "AR" ? c.nameAr : c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("neighborhood")}</Label>
                  <Select
                    value={filters.neighborhood ?? "ALL"}
                    disabled={!cityCode}
                    onValueChange={(v) => setFilter("neighborhood", v === "ALL" ? undefined : v)}
                  >
                    <SelectTrigger><SelectValue placeholder={t("all")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">{t("all")}</SelectItem>
                      {selectedCity?.neighborhoods.map((n) => (
                        <SelectItem key={n.code} value={n.code}>{locale === "AR" ? n.nameAr : n.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-2 bg-border" />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("minPrice")}</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    className="w-full"
                    value={filters.minPrice ?? ""}
                    onChange={(e) => setFilter("minPrice", e.target.value === "" ? undefined : Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("maxPrice")}</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="∞"
                    className="w-full"
                    value={filters.maxPrice ?? ""}
                    onChange={(e) => setFilter("maxPrice", e.target.value === "" ? undefined : Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("plotArea")}</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="min"
                    value={filters.minArea ?? ""}
                    onChange={(e) => setFilter("minArea", e.target.value === "" ? undefined : Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("builtArea")}</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="min"
                    value={filters.minBuiltArea ?? ""}
                    onChange={(e) => setFilter("minBuiltArea", e.target.value === "" ? undefined : Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("minRooms")}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={filters.minRooms ?? ""}
                    onChange={(e) => setFilter("minRooms", e.target.value === "" ? undefined : Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("minBathrooms")}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={filters.minBathrooms ?? ""}
                    onChange={(e) => setFilter("minBathrooms", e.target.value === "" ? undefined : Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("minParking")}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={filters.minParking ?? ""}
                    onChange={(e) => setFilter("minParking", e.target.value === "" ? undefined : Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t("maxFloors")}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={filters.maxFloors ?? ""}
                    onChange={(e) => setFilter("maxFloors", e.target.value === "" ? undefined : Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">{t("amenities")}</Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { key: "hasElevator" as const, labelKey: "elevator" as const },
                    { key: "hasPool" as const, labelKey: "pool" as const },
                    { key: "hasTerrace" as const, labelKey: "terrace" as const },
                    { key: "hasSecurity" as const, labelKey: "security" as const },
                    { key: "furnished" as const, labelKey: "furnished" as const },
                  ].map(({ key, labelKey }) => (
                    <label key={key} className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm hover:bg-muted/50 transition-colors cursor-pointer">
                      <span className="font-medium">{t(labelKey)}</span>
                      <Switch
                        checked={filters[key] === true}
                        onCheckedChange={(v) => setFilter(key, v || undefined)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4">
        <Label>{t("sort")}</Label>
        <Select value={filters.sort} onValueChange={(v) => setFilter("sort", v as typeof filters.sort)}>
          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{translateSort(o.value, t)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function FilterPanelToggle() {
  const { isFilterOpen, toggleFilterPanel } = useFilterStore();
  const { t } = useI18n();
  return (
    <Button variant="outline" size="sm" onClick={toggleFilterPanel}>
      {isFilterOpen ? <X className="mr-1 h-4 w-4" /> : null}
      {isFilterOpen ? t("hideFilters") : t("showFilters")}
    </Button>
  );
}
