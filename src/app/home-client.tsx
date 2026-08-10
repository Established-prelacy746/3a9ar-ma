"use client";

import Link from "next/link";
import { Search, Sparkles, Building2, MessageCircle, MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { PropertyValuation } from "@/components/features/property-valuation";

const categories = [
  { key: "residential" as const, href: "/properties?category=RESIDENTIAL", icon: Building2 },
  { key: "land" as const, href: "/properties?category=LAND", icon: MapPin },
  { key: "commercial" as const, href: "/properties?category=COMMERCIAL", icon: Building2 },
  { key: "riad" as const, href: "/properties?category=RESIDENTIAL&type=RIAD", icon: Building2 },
];

export function HomeClient() {
  const { t } = useI18n();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-secondary/40 to-background">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <div className="container relative grid gap-8 py-20 md:grid-cols-2 md:items-center md:py-24">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="font-medium">3A9AR.MA</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {t("heroTitle")}{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                Morocco
              </span>
            </h1>
            
            <p className="max-w-lg text-lg text-muted-foreground">
              {t("heroSubtitle")}
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-lg">
                <Link href="/properties">
                  <Search className="mr-2 h-4 w-4" /> {t("explore")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/signin">{t("publishAgent")}</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex flex-col gap-1">
                <MapPin className="h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">{t("allMorocco")}</p>
                <p className="text-xs text-muted-foreground">{t("allMoroccoDesc")}</p>
              </div>
              <div className="flex flex-col gap-1">
                <TrendingUp className="h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">{t("bestPrices")}</p>
                <p className="text-xs text-muted-foreground">{t("bestPricesDesc")}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {categories.map(({ key, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-primary/20"
              >
                <div className="rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <span className="text-sm font-medium">{t(key)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Property Valuation Hero CTA */}
      <section className="container py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t("valuationHeroTitle")}</h2>
            <p className="text-muted-foreground">{t("valuationHeroDesc")}</p>
          </div>
          <PropertyValuation />
        </div>
      </section>
    </>
  );
}
