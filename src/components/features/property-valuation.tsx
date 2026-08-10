"use client";

import { useState } from "react";
import { Calculator, TrendingUp, MapPin, Home, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

const PROPERTY_TYPES = [
  { value: "APARTMENT", labelKey: "apartmentLabel" as const },
  { value: "VILLA", labelKey: "villaLabel" as const },
  { value: "RIAD", labelKey: "riadLabel" as const },
  { value: "BUREAUX", labelKey: "bureauxLabel" as const },
  { value: "MAGASIN", labelKey: "magasinLabel" as const },
  { value: "TERRAIN_CONSTRUCTIBLE", labelKey: "terrainConstructibleLabel" as const },
];

const CITIES = [
  { value: "CASABLANCA", label: "Casablanca" },
  { value: "MARRAKECH", label: "Marrakech" },
  { value: "RABAT", label: "Rabat" },
  { value: "FES", label: "Fès" },
  { value: "TANGIER", label: "Tanger" },
  { value: "AGADIR", label: "Agadir" },
  { value: "MEKNES", label: "Meknès" },
  { value: "OUJDA", label: "Oujda" },
  { value: "KENITRA", label: "Kénitra" },
  { value: "TETOUAN", label: "Tétouan" },
  { value: "SAFI", label: "Safi" },
  { value: "MOHAMMEDIA", label: "Mohammedia" },
  { value: "KHOURIBGA", label: "Khouribga" },
  { value: "BENI_MELLAL", label: "Béni Mellal" },
  { value: "NADOR", label: "Nador" },
  { value: "Settat", label: "Settat" },
  { value: "EL_JADIDA", label: "El Jadida" },
  { value: "AZROU", label: "Azrou" },
  { value: "ERRACHIDIA", label: "Errachidia" },
  { value: "ERRACHIDIA", label: "Errachidia" },
  { value: "TIZNIT", label: "Tiznit" },
  { value: "LAAYOUNE", label: "Laâyoune" },
  { value: "DAKHLA", label: "Dakhla" },
];

interface ValuationResult {
  estimatedMin: number | null;
  estimatedMax: number | null;
  estimatedMedian: number | null;
  pricePerM2: number | null;
  sampleSize: number;
  confidence: "low" | "medium" | "high";
  city?: string;
  type?: string;
  areaM2?: number;
  message?: string;
}

export function PropertyValuation() {
  const { t, locale } = useI18n();
  const isAR = locale === "AR";

  const [cityCode, setCityCode] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [areaM2, setAreaM2] = useState<number>(80);
  const [rooms, setRooms] = useState<number>(3);
  const [hasPool, setHasPool] = useState(false);
  const [hasTerrace, setHasTerrace] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleValuate = async () => {
    if (!cityCode || !propertyType || areaM2 <= 0) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityCode,
          propertyType,
          transactionType: "SALE",
          areaM2,
          rooms,
          hasPool,
          hasTerrace,
          furnished,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to calculate valuation");
        return;
      }

      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(isAR ? "ar-MA" : "fr-MA", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const confidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high": return "bg-emerald-500";
      case "medium": return "bg-amber-500";
      default: return "bg-red-400";
    }
  };

  const confidenceWidth = (confidence: string) => {
    switch (confidence) {
      case "high": return "90%";
      case "medium": return "60%";
      default: return "30%";
    }
  };

  return (
    <Card className="w-full" dir={isAR ? "rtl" : "ltr"}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          {t("valuationTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("city")}</Label>
            <Select value={cityCode} onValueChange={setCityCode}>
              <SelectTrigger>
                <SelectValue placeholder={t("city")} />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("type")}</Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder={t("type")} />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((pt) => (
                  <SelectItem key={pt.value} value={pt.value}>
                    {t(pt.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="areaM2">{t("area")} (m²)</Label>
            <Input
              id="areaM2"
              type="number"
              value={areaM2}
              onChange={(e) => setAreaM2(Number(e.target.value))}
              min={1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rooms">{t("rooms")}</Label>
            <Input
              id="rooms"
              type="number"
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              min={0}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="hasPool" className="text-sm">{t("pool")}</Label>
            <Switch id="hasPool" checked={hasPool} onCheckedChange={setHasPool} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="hasTerrace" className="text-sm">{t("terrace")}</Label>
            <Switch id="hasTerrace" checked={hasTerrace} onCheckedChange={setHasTerrace} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="furnished" className="text-sm">{t("furnished")}</Label>
            <Switch id="furnished" checked={furnished} onCheckedChange={setFurnished} />
          </div>
        </div>

        <Button onClick={handleValuate} disabled={loading} className="w-full">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              {t("valuating")}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t("valuate")}
            </span>
          )}
        </Button>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {result && result.estimatedMedian !== null && (
          <div className="space-y-4">
            <div className="rounded-xl bg-gradient-to-r from-primary/5 to-emerald-500/5 p-6 border">
              <p className="text-sm font-medium text-muted-foreground mb-2">{t("estimatedValue")}</p>
              <p className="text-3xl font-bold text-primary">
                {formatPrice(result.estimatedMin!)} - {formatPrice(result.estimatedMax!)} MAD
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("median")}: {formatPrice(result.estimatedMedian!)} MAD
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs font-medium text-muted-foreground">{t("pricePerM2")}</p>
                <p className="mt-1 text-lg font-bold">{formatPrice(result.pricePerM2!)} MAD/m²</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs font-medium text-muted-foreground">{t("sampleSize")}</p>
                <p className="mt-1 text-lg font-bold">{result.sampleSize}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{t("confidence")}</Label>
                <Badge variant={result.confidence === "high" ? "default" : result.confidence === "medium" ? "secondary" : "outline"}>
                  {result.confidence === "high" ? t("confidenceHigh") : result.confidence === "medium" ? t("confidenceMedium") : t("confidenceLow")}
                </Badge>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${confidenceColor(result.confidence)}`}
                  style={{ width: confidenceWidth(result.confidence) }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="flex-1"
              >
                {showDetails ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                {t("valuationDetails")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setResult(null);
                  setShowDetails(false);
                }}
                className="flex-1"
              >
                {t("reset")}
              </Button>
            </div>

            {showDetails && (
              <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{result.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  <span className="text-sm">{t(result.type === "APARTMENT" ? "apartmentLabel" : result.type === "VILLA" ? "villaLabel" : "riadLabel")}</span>
                  <span className="text-sm text-muted-foreground">• {result.areaM2} m²</span>
                </div>
                <p className="text-xs text-muted-foreground">{t("valuationDisclaimer")}</p>
              </div>
            )}
          </div>
        )}

        {result && result.estimatedMedian === null && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
            {t("notEnoughData")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
