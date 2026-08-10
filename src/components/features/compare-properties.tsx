"use client";

import { useCompareStore, MAX_COMPARE_PROPERTIES } from "@/features/properties/hooks/use-compare-store";
import { useI18n } from "@/lib/i18n";
import { cn, formatMAD } from "@/lib/utils";
import { PropertyImage } from "@/components/properties/property-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Trash2, ArrowLeft, Check, Minus } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { PropertyCardData } from "@/types/property";

interface ComparePropertiesProps {
  className?: string;
}

function useCompareProperties(ids: string[]) {
  const { data, isLoading } = useQuery<{ items: PropertyCardData[] }>({
    queryKey: ["compare-properties", ids],
    queryFn: async () => {
      const results: PropertyCardData[] = [];
      for (const id of ids) {
        try {
          const res = await fetch(`/api/properties?limit=1`, { cache: "no-store" });
          if (res.ok) {
            const all = await res.json();
            const found = all.items?.find((p: PropertyCardData) => p.id === id);
            if (found) results.push(found);
          }
        } catch {
          // skip
        }
      }
      return { items: results };
    },
    enabled: ids.length > 0,
    staleTime: 30_000,
  });
  return { properties: data?.items ?? [], isLoading };
}

export function CompareProperties({ className }: ComparePropertiesProps) {
  const { ids, remove, clear } = useCompareStore();
  const { t, locale } = useI18n();
  const isAR = locale === "AR";
  const { properties, isLoading } = useCompareProperties(ids);

  if (ids.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
        <p className="text-lg text-muted-foreground">{t("compareEmpty")}</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/properties">
            <ArrowLeft className={cn("h-4 w-4", isAR ? "rotate-180" : "")} />
            {t("compareBack")}
          </Link>
        </Button>
      </div>
    );
  }

  const compareRows: { key: string; labelKey: string; render: (p: PropertyCardData) => React.ReactNode }[] = [
    {
      key: "image",
      labelKey: "compareRowImage",
      render: (p) => (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
          {p.coverImage[0] ? (
            <PropertyImage
              src={p.coverImage[0]}
              alt={p.title}
              fill
              sizes="300px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              {t("noImage")}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      labelKey: "compareRowTitle",
      render: (p) => (
        <Link href={`/properties/${p.slug}`} className="text-sm font-semibold hover:underline">
          {p.title}
        </Link>
      ),
    },
    {
      key: "price",
      labelKey: "compareRowPrice",
      render: (p) => <span className="font-bold text-primary">{formatMAD(p.price)}</span>,
    },
    {
      key: "area",
      labelKey: "compareRowArea",
      render: (p) => (
        <span>{p.plotAreaM2 ? `${Number(p.plotAreaM2).toLocaleString()} m²` : "—"}</span>
      ),
    },
    {
      key: "rooms",
      labelKey: "compareRowRooms",
      render: (p) => <span>{p.rooms ?? "—"}</span>,
    },
    {
      key: "bathrooms",
      labelKey: "compareRowBathrooms",
      render: (p) => <span>{p.bathrooms ?? "—"}</span>,
    },
    {
      key: "type",
      labelKey: "compareRowType",
      render: (p) => <span>{p.type.replaceAll("_", " ")}</span>,
    },
    {
      key: "transaction",
      labelKey: "compareRowTransaction",
      render: (p) => (
        <Badge variant={p.transactionType === "SALE" ? "default" : "secondary"}>
          {p.transactionType === "SALE" ? t("saleLabel") : t("rentLabel")}
        </Badge>
      ),
    },
    {
      key: "legalStatus",
      labelKey: "compareRowLegalStatus",
      render: (p) => <span>{p.legalStatus?.replaceAll("_", " ") ?? "—"}</span>,
    },
    {
      key: "location",
      labelKey: "compareRowLocation",
      render: (p) => (
        <span className="text-xs leading-tight">
          {isAR ? p.city.nameAr : p.city.name},<br />
          {isAR ? p.region.nameAr : p.region.name}
        </span>
      ),
    },
    {
      key: "amenities",
      labelKey: "compareRowAmenities",
      render: (p) => (
        <div className="flex flex-wrap gap-2">
          {p.hasPool && (
            <Badge variant="outline" className="gap-1 text-xs">
              <Check className="h-3 w-3" /> {t("pool")}
            </Badge>
          )}
          {p.hasTerrace && (
            <Badge variant="outline" className="gap-1 text-xs">
              <Check className="h-3 w-3" /> {t("terrace")}
            </Badge>
          )}
          {!p.hasPool && !p.hasTerrace && (
            <span className="text-muted-foreground"><Minus className="h-3 w-3 inline" /></span>
          )}
        </div>
      ),
    },
  ];

  const colCount = Math.min(ids.length, MAX_COMPARE_PROPERTIES);

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className={cn("w-full border-collapse text-sm", isAR && "direction-rtl")}>
        <thead>
          <tr>
            <th className={cn("sticky left-0 z-10 w-36 min-w-[8rem] bg-muted/80 p-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur", isAR && "text-end")}>
              {t("compareProperty")}
            </th>
            {properties.map((p) => (
              <th key={p.id} className="relative min-w-[16rem] p-3 text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6"
                  onClick={() => remove(p.id)}
                  aria-label={t("compareRemove")}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {compareRows.map((row) => (
            <tr key={row.key} className="border-t border-border/50">
              <td className={cn("sticky left-0 z-10 bg-muted/80 p-3 font-medium text-xs uppercase tracking-wider text-muted-foreground backdrop-blur", isAR && "text-end")}>
                {t(row.labelKey as any)}
              </td>
              {properties.map((p) => (
                <td key={p.id} className="p-3 text-center align-top">
                  {row.render(p)}
                </td>
              ))}
              {properties.length < colCount &&
                Array.from({ length: colCount - properties.length }).map((_, i) => (
                  <td key={`empty-${i}`} className="p-3 text-center text-muted-foreground">
                    —
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-2 text-sm text-muted-foreground">{t("compareLoading")}</span>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={clear}>
          <Trash2 className="h-4 w-4" />
          {t("compareClear")}
        </Button>
        <Button asChild>
          <Link href="/properties">
            <ArrowLeft className={cn("h-4 w-4", isAR ? "rotate-180" : "")} />
            {t("compareBack")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
