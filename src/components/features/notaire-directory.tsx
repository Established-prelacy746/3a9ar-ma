"use client";

import { useState, useMemo } from "react";
import { Search, Phone, MapPin, Calculator, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface NotaireOffice {
  city: string;
  cityKey: string;
  name: string;
  address: string;
  phone: string;
}

const NOTAIRE_OFFICES: NotaireOffice[] = [
  // Casablanca
  { city: "Casablanca", cityKey: "casablanca", name: "Cabinet El Fassi", address: "Boulevard Mohammed V, Casablanca", phone: "+212 522 27 12 34" },
  { city: "Casablanca", cityKey: "casablanca", name: "Cabinet Benjelloun", address: "Avenue Hassan II, Casablanca", phone: "+212 522 27 56 78" },
  { city: "Casablanca", cityKey: "casablanca", name: "Cabinet Alaoui", address: "Rue Jean Jaurès, Casablanca", phone: "+212 522 22 34 56" },
  { city: "Casablanca", cityKey: "casablanca", name: "Cabinet Tazi", address: "Boulevard Anfa, Casablanca", phone: "+212 522 39 12 34" },
  // Rabat
  { city: "Rabat", cityKey: "rabat", name: "Cabinet Filali", address: "Avenue Mohammed V, Rabat", phone: "+212 537 23 45 67" },
  { city: "Rabat", cityKey: "rabat", name: "Cabinet Berrada", address: "Rue Souissi, Rabat", phone: "+212 537 75 12 34" },
  { city: "Rabat", cityKey: "rabat", name: "Cabinet Chraibi", address: "Avenue Fal Ould Oumeir, Rabat", phone: "+212 537 63 78 90" },
  // Marrakech
  { city: "Marrakech", cityKey: "marrakech", name: "Cabinet El Mansouri", address: "Avenue Mohammed V, Marrakech", phone: "+212 524 38 12 34" },
  { city: "Marrakech", cityKey: "marrakech", name: "Cabinet Guennoun", address: "Boulevard Mohammed VI, Marrakech", phone: "+212 524 43 56 78" },
  { city: "Marrakech", cityKey: "marrakech", name: "Cabinet Idrissi", address: "Rue Bab Agnaou, Marrakech", phone: "+212 524 37 90 12" },
  // Fès
  { city: "Fès", cityKey: "fes", name: "Cabinet Ait Brahim", address: "Avenue Mohammed V, Fès", phone: "+212 535 63 12 34" },
  { city: "Fès", cityKey: "fes", name: "Cabinet Slaoui", address: "Rue Tala, Fès", phone: "+212 535 62 56 78" },
  { city: "Fès", cityKey: "fes", name: "Cabinet Bennani", address: "Boulevard Hassan II, Fès", phone: "+212 535 93 12 34" },
  // Tangier
  { city: "Tanger", cityKey: "tangier", name: "Cabinet Mekouar", address: "Avenue Mohammed V, Tanger", phone: "+212 539 33 12 34" },
  { city: "Tanger", cityKey: "tangier", name: "Cabinet Bensouda", address: "Boulevard Mohammed VI, Tanger", phone: "+212 539 37 56 78" },
  // Agadir
  { city: "Agadir", cityKey: "agadir", name: "Cabinet Ait Ouakrim", address: "Avenue Mohammed V, Agadir", phone: "+212 528 22 12 34" },
  { city: "Agadir", cityKey: "agadir", name: "Cabinet Tlemcani", address: "Boulevard Hassan II, Agadir", phone: "+212 528 84 56 78" },
];

const CITY_KEYS: Record<string, string> = {
  Casablanca: "casablanca",
  Rabat: "rabat",
  Marrakech: "marrakech",
  Fès: "fes",
  Tanger: "tangier",
  Agadir: "agadir",
};

function formatMAD(n: number) {
  return new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 }).format(n) + " MAD";
}

export function NotaireDirectory({ initialPrice }: { initialPrice?: number }) {
  const { t, locale } = useI18n();
  const isAR = locale === "AR";
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [price, setPrice] = useState<string>(initialPrice ? String(initialPrice) : "");
  const [expandedOffice, setExpandedOffice] = useState<string | null>(null);

  const cities = useMemo(() => {
    const unique = Array.from(new Set(NOTAIRE_OFFICES.map((o) => o.city)));
    return unique.sort();
  }, []);

  const filtered = useMemo(() => {
    let list = NOTAIRE_OFFICES;
    if (selectedCity !== "ALL") {
      list = list.filter((o) => o.city === selectedCity);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCity, searchQuery]);

  const priceNum = Number(price.replace(/\D/g, ""));
  const hasPrice = priceNum > 0;

  const calcFees = (status: "TITRE_FONCIER" | "OTHER") => {
    if (!hasPrice) return null;
    const rate = status === "TITRE_FONCIER" ? 0.0125 : 0.035;
    return Math.round(priceNum * rate);
  };

  return (
    <div className="rounded-xl border bg-card p-6" dir={isAR ? "rtl" : "ltr"}>
      <div className="mb-3 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{t("notaireDirectory")}</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{t("notaireDirectoryDesc")}</p>

      {/* Fee Calculator */}
      <div className="mb-5 rounded-lg border bg-muted/30 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">{t("notaireFeeCalculator")}</span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
            placeholder={t("enterPropertyPrice")}
            className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {hasPrice && (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-lg border bg-emerald-50 p-3 dark:bg-emerald-950">
              <p className="text-xs text-muted-foreground">{t("titreFoncierRate")}</p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                {formatMAD(calcFees("TITRE_FONCIER")!)}
              </p>
            </div>
            <div className="rounded-lg border bg-amber-50 p-3 dark:bg-amber-950">
              <p className="text-xs text-muted-foreground">{t("otherStatusRate")}</p>
              <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
                {formatMAD(calcFees("OTHER")!)}
              </p>
            </div>
          </div>
        )}
        <p className="mt-2 text-[11px] text-muted-foreground">{t("notaireDisclaimer")}</p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("search")}
            className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="ALL">{t("allCities")}</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {t(CITY_KEYS[city] as any)}
            </option>
          ))}
        </select>
      </div>

      {/* Office List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">{t("noResultsMatch")}</p>
        )}
        {filtered.map((office) => {
          const officeId = office.name;
          const isExpanded = expandedOffice === officeId;
          return (
            <div
              key={officeId}
              className="rounded-lg border bg-muted/20 transition-colors hover:bg-muted/40"
            >
              <button
                onClick={() => setExpandedOffice(isExpanded ? null : officeId)}
                className="flex w-full items-center justify-between p-3 text-left"
              >
                <div>
                  <p className="text-sm font-medium">{office.name}</p>
                  <p className="text-xs text-muted-foreground">{office.city}</p>
                </div>
                <span className="text-xs text-muted-foreground">{isExpanded ? "−" : "+"}</span>
              </button>
              {isExpanded && (
                <div className="border-t px-3 pb-3 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{office.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <a href={`tel:${office.phone}`} className="text-xs text-primary hover:underline">
                        {office.phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
