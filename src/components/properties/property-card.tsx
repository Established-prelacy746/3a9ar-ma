"use client";

import { PropertyImage } from "@/components/properties/property-image";
import Link from "next/link";
import { MapPin, Maximize2, Bath, BedDouble, Sparkles, BadgeCheck, ShieldCheck, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatMAD, formatPricePerM2 } from "@/lib/utils";
import type { PropertyCardData } from "@/types/property";
import { useI18n } from "@/lib/i18n";
import { useCompareStore, MAX_COMPARE_PROPERTIES } from "@/features/properties/hooks/use-compare-store";

export function PropertyCard({ property }: { property: PropertyCardData }) {
  const cover = property.coverImage[0];
  const perM2 = formatPricePerM2(property.price, property.plotAreaM2);
  const { t, locale } = useI18n();
  const isAR = locale === "AR";
  const { toggle, ids } = useCompareStore();
  const isCompared = ids.includes(property.id);
  const isFull = ids.length >= MAX_COMPARE_PROPERTIES && !isCompared;

  return (
    <div className="relative h-full">
      <Link href={`/properties/${property.slug}`} className="group block h-full">
        <Card className={cn("h-full overflow-hidden transition-all group-hover:shadow-lg", property.isFeatured && "border-amber-400")}>
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {cover ? (
              <PropertyImage
                src={cover}
                alt={property.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">{t("noImage")}</div>
            )}
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {property.isFeatured && (
                <Badge variant="featured" className="gap-1">
                  <Sparkles className="h-3 w-3" /> 
                  <span>{t("vedette")}</span>
                </Badge>
              )}
              <Badge variant={property.transactionType === "SALE" ? "default" : "secondary"}>
                {property.transactionType === "SALE" ? t("saleLabel") : `${t("rentLabel")}${property.rentPeriod === "SEASONAL" ? ` ${t("seasonalRental")}` : ""}`}
              </Badge>
            </div>
            <Badge variant="outline" className="absolute right-3 top-3 bg-background/80 backdrop-blur">
              {property.type.replaceAll("_", " ")}
            </Badge>
          </div>

          <div className="p-4">
            <div className="mb-1 flex items-start justify-between gap-2">
              <h3 className="line-clamp-1 text-sm font-semibold">{property.title}</h3>
              <div className="flex shrink-0 items-center gap-1">
                <span title={t("verifiedAgent")}>
                  <BadgeCheck
                    className="h-4 w-4 text-emerald-600"
                  />
                </span>
                {property.legalStatus === "TITRE_FONCIER" && (
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </div>

            <p className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {isAR ? property.city.nameAr : property.city.name}, {isAR ? property.region.nameAr : property.region.name}
              {property.neighborhood ? ` · ${isAR ? property.neighborhood.nameAr : property.neighborhood.name}` : ""}
            </p>

            <div className="mb-3 flex items-end justify-between gap-2">
              <p className="text-lg font-bold text-primary">{formatMAD(property.price)}</p>
              {perM2 && <span className="text-xs text-muted-foreground">{perM2}</span>}
            </div>

            <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
              {property.plotAreaM2 != null && (
                <span className="flex items-center gap-1">
                  <Maximize2 className="h-3.5 w-3.5" /> {Number(property.plotAreaM2).toLocaleString()} m²
                </span>
              )}
              {property.rooms != null && (
                <span className="flex items-center gap-1">
                  <BedDouble className="h-3.5 w-3.5" /> {property.rooms}
                </span>
              )}
              {property.bathrooms != null && (
                <span className="flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
                </span>
              )}
            </div>

            <Button asChild variant="outline" size="sm" className="w-full">
              <span>{t("viewDetails")}</span>
            </Button>
          </div>
        </Card>
      </Link>

      <Button
        variant={isCompared ? "default" : "outline"}
        size="icon"
        className={cn(
          "absolute bottom-16 z-10 h-8 w-8 shadow-md",
          isAR ? "left-2" : "right-2",
          isCompared && "bg-primary text-primary-foreground",
          isFull && "opacity-50 cursor-not-allowed",
        )}
        disabled={isFull}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle(property.id);
        }}
        title={isCompared ? t("compareRemove") : t("compareTooltip")}
      >
        <Scale className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
