"use client";

import { useState } from "react";
import { MapPin, Maximize2, BedDouble, Bath, Ruler, Landmark, Building, MessageCircle, ArrowLeft, BadgeCheck, FileWarning, Calculator, ShieldCheck, Clock } from "lucide-react";
import { formatMAD, formatPricePerM2, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactAgentForm } from "@/components/properties/contact-agent-form";
import { PropertyDetailMap } from "@/components/properties/property-detail-map";
import { PropertyImage } from "@/components/properties/property-image";
import { MortgageCalculator } from "@/components/features/mortgage-calculator";
import { MortgagePrequal } from "@/components/features/mortgage-prequal";
import { ShareButtons } from "@/components/features/share-buttons";
import { DocumentChecklist } from "@/components/features/document-checklist";
import { LegalStatusTranslator } from "@/components/features/legal-status-translator";
import { NotaireDirectory } from "@/components/features/notaire-directory";
import { FoncierChecker } from "@/components/features/foncier-checker";
import { NeighborhoodScore } from "@/components/features/neighborhood-score";
import { PriceHistoryGraph } from "@/components/features/price-history-graph";
import { PropertyReviews } from "@/components/features/property-reviews";
import { WhatsAppQuickInquiry } from "@/components/features/whatsapp-quick-inquiry";
import { VirtualTourViewer } from "@/components/features/virtual-tour-viewer";
import { ArPropertyPreview } from "@/components/features/ar-property-preview";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { LEGAL_STATUS_OPTIONS } from "@/config/property-labels";

interface PropertyData {
  slug: string;
  title: string;
  description: string;
  price: number;
  transactionType: string;
  rentPeriod?: string | null;
  isFeatured: boolean;
  plotAreaM2?: number | null;
  builtAreaM2?: number | null;
  rooms?: number | null;
  bathrooms?: number | null;
  floorLevel?: number | null;
  density?: string | null;
  legalStatus: string;
  coverImage: string[];
  latitude?: number | null;
  longitude?: number | null;
  rentFrequency?: string | null;
  id: string;
  city: { name: string; nameAr: string };
  region: { name: string; nameAr: string };
  neighborhood?: { id: string; name: string; nameAr: string } | null;
  owner: { id: string; name: string | null; whatsappNumber?: string | null; agencyName?: string | null };
  amenities: { amenity: { id: string; label: string } }[];
}

const LEGAL_LABELS: Record<string, { FR: string; EN: string; AR: string }> = {
  TITRE_FONCIER: { FR: "Titre Foncier", EN: "Title Deed", AR: "الشهادة العقارية" },
  MELKIA: { FR: "Melkia", EN: "Melkia", AR: "ملكية" },
  ADOULAIRE: { FR: "Adoulaire", EN: "Adoulaire", AR: "عدولية" },
  NON_TITRE: { FR: "Sans titre", EN: "No title", AR: "بدون عنوان" },
};

export function PropertyDetailClient({ property }: { property: PropertyData }) {
  const { t, locale } = useI18n();
  const isAR = locale === "AR";
  const perM2 = formatPricePerM2(property.price, property.plotAreaM2);
  const legalLabel = LEGAL_LABELS[property.legalStatus]?.[locale] ?? property.legalStatus;
  const agentWa = property.owner.whatsappNumber;
  const appUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const waLink = agentWa
    ? `https://wa.me/${agentWa.replace(/\D/g, "")}?text=${encodeURIComponent(`*${property.title}*\n💰 ${formatMAD(property.price)}\n🔗 ${appUrl}/properties/${property.slug}\n💬 Ref: #${property.slug}`)}`
    : null;
  const [showMortgageCalc, setShowMortgageCalc] = useState(false);
  const [showMortgagePrequal, setShowMortgagePrequal] = useState(false);

  const facts = [
    property.plotAreaM2 != null && { icon: Maximize2, label: t("plotAreaDetail"), value: `${Number(property.plotAreaM2).toLocaleString()} m²` },
    property.builtAreaM2 != null && { icon: Ruler, label: t("builtAreaDetail"), value: `${Number(property.builtAreaM2).toLocaleString()} m²` },
    property.rooms != null && { icon: BedDouble, label: t("roomsLabel"), value: `${property.rooms}` },
    property.bathrooms != null && { icon: Bath, label: t("bathroomsLabel"), value: `${property.bathrooms}` },
    property.floorLevel != null && { icon: Building, label: t("floorLabel"), value: `${property.floorLevel}` },
    property.density && { icon: Landmark, label: t("densityLabel"), value: property.density },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[];

  return (
    <div className="container py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/properties">
          <ArrowLeft className="mr-1 h-4 w-4" /> {t("backToSearch")}
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-xl border">
            <div className="relative aspect-[16/9] bg-muted">
              {property.coverImage[0] ? (
                <PropertyImage src={property.coverImage[0]} alt={property.title} fill priority className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">{t("noImageAvailable")}</div>
              )}
              <div className="absolute left-4 top-4 flex gap-2">
                <Badge variant="outline" className="bg-background/80 backdrop-blur">
                  {property.transactionType === "SALE" ? t("saleLabel") : `${t("rentLabel")}${property.rentPeriod === "SEASONAL" ? ` · ${t("seasonalRental")}` : ""}`}
                </Badge>
                {property.isFeatured && <Badge variant="featured">{t("vedette")}</Badge>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="rounded-xl border bg-card p-4">
                <f.icon className="mb-2 h-5 w-5 text-primary" />
                <p className="text-xs text-muted-foreground">{f.label}</p>
                <p className="text-sm font-semibold">{f.value}</p>
              </div>
            ))}
            <div className="rounded-xl border bg-card p-4">
              <Landmark className="mb-2 h-5 w-5 text-primary" />
              <p className="text-xs text-muted-foreground">{t("legalStatusLabel")}</p>
              <p className="flex items-center gap-1 text-sm font-semibold">
                {property.legalStatus === "TITRE_FONCIER" ? (
                  <BadgeCheck className="h-4 w-4 text-emerald-600" />
                ) : (
                  <FileWarning className="h-4 w-4 text-amber-500" />
                )}
                {legalLabel}
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="mb-2 text-lg font-semibold">{t("description")}</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{property.description}</p>
          </div>

          {property.amenities.length > 0 && (
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-3 text-lg font-semibold">{t("amenitiesLabel")}</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map(({ amenity }) => (
                  <Badge key={amenity.id} variant="secondary">{amenity.label}</Badge>
                ))}
              </div>
            </div>
          )}

          {property.latitude != null && property.longitude != null && (
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-3 text-lg font-semibold">{t("location")}</h2>
              <PropertyDetailMap lat={property.latitude} lng={property.longitude} title={property.title} price={Number(property.price)} slug={property.slug} />
            </div>
          )}

          {property.neighborhood && (
            <NeighborhoodScore neighborhoodId={property.neighborhood.id} />
          )}

          <PriceHistoryGraph propertyId={property.id} />

          <LegalStatusTranslator currentStatus={property.legalStatus} />

          <DocumentChecklist transactionType={property.transactionType as "SALE" | "RENT"} />

          <NotaireDirectory initialPrice={property.price} />

          <FoncierChecker />

          {property.coverImage[0] && (
            <VirtualTourViewer imageUrl={property.coverImage[0]} title={property.title} />
          )}

          <ArPropertyPreview title={property.title} />

          <PropertyReviews
            propertyId={property.id}
            agentId={property.owner.id}
            agentVerified={true}
            agentResponseTime="< 2h"
          />
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className={cn("rounded-xl border bg-card p-6", property.isFeatured && "border-amber-400")}>
            <p className="text-xs text-muted-foreground">{isAR ? property.city.nameAr : property.city.name}, {isAR ? property.region.nameAr : property.region.name}</p>
            <h1 className="mt-1 text-xl font-bold">{property.title}</h1>
            <div className="mt-3 flex items-end justify-between gap-2">
              <p className="text-2xl font-bold text-primary">{formatMAD(property.price)}</p>
              {property.rentFrequency && (
                <span className="text-xs text-muted-foreground">/{property.rentFrequency}</span>
              )}
            </div>
            {perM2 && <p className="mt-1 text-sm text-muted-foreground">{perM2}</p>}

            <div className="mt-3 flex items-center gap-2">
              <Badge variant="secondary" className="gap-1 text-xs">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                {t("verifiedAgent")}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {t("responseTime")}: &lt; 2h
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {waLink && (
                <>
                  <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <a href={waLink} target="_blank" rel="noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" /> {t("whatsappAgent")}
                    </a>
                  </Button>
                  <div className="mt-3 rounded-lg border bg-muted/50 p-3">
                    <WhatsAppQuickInquiry
                      agentPhone={agentWa ?? ""}
                      propertyTitle={property.title}
                      propertyPrice={property.price}
                      propertySlug={property.slug}
                    />
                  </div>
                </>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowMortgageCalc(!showMortgageCalc)}
              >
                <Calculator className="mr-2 h-4 w-4" /> {t("mortgageCalculator")}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowMortgagePrequal(!showMortgagePrequal)}
              >
                <ShieldCheck className="mr-2 h-4 w-4" /> {t("prequalTitle")}
              </Button>
            </div>

            {showMortgageCalc && (
              <div className="mt-4 border-t pt-4">
                <MortgageCalculator initialPrice={property.price} />
              </div>
            )}

            {showMortgagePrequal && (
              <div className="mt-4 border-t pt-4">
                <MortgagePrequal initialPrice={property.price} />
              </div>
            )}

            <div className="mt-4 border-t pt-4">
              <ShareButtons
                title={property.title}
                price={property.price}
                city={property.city.name}
                slug={property.slug}
              />
            </div>

            <div className="mt-4 border-t pt-4">
              <p className="mb-1 text-xs text-muted-foreground">{t("contactViaFormulaire")}</p>
              <ContactAgentForm propertyId={property.id} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
