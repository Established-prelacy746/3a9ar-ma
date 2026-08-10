"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Star, Crown, Loader2 } from "lucide-react";
import { formatMAD } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export interface PromoteProperty {
  id: string;
  title: string;
  isFeatured: boolean;
  featuredExpiresAt?: Date | null;
}

const PACKAGES: { value: string; tier: "FEATURED" | "TOP_BANNER"; durationDays: number; label: string; price: number }[] = [
  { value: "FEATURED-7", tier: "FEATURED", durationDays: 7, label: "Featured · 7 days", price: 150 },
  { value: "FEATURED-14", tier: "FEATURED", durationDays: 14, label: "Featured · 14 days", price: 250 },
  { value: "FEATURED-30", tier: "FEATURED", durationDays: 30, label: "Featured · 30 days", price: 450 },
  { value: "TOP_BANNER-30", tier: "TOP_BANNER", durationDays: 30, label: "Top Banner · 30 days", price: 1500 },
];

export function PromoteDialog({ properties }: { properties: PromoteProperty[] }) {
  const [propertyId, setPropertyId] = useState("");
  const [pkg, setPkg] = useState(PACKAGES[0].value);
  const [provider, setProvider] = useState<"CMI" | "STRIPE">("CMI");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  const selected = PACKAGES.find((p) => p.value === pkg)!;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!propertyId) return;
    setLoading(true);
    setError(null);

    const res = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        tier: selected.tier,
        durationDays: selected.durationDays,
        provider,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Payment initiation failed");
      setLoading(false);
      return;
    }

    if (data.provider === "CMI") {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.gatewayUrl;
      form.style.display = "none";
      Object.entries(data.formParams).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
      return;
    }

    window.location.href = data.checkoutUrl;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-500" /> {t("promoteAListing")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("propertyLabel")}</Label>
            <Select value={propertyId} onValueChange={setPropertyId}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectActiveListing")} />
              </SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id} disabled={p.isFeatured}>
                    {p.title} {p.isFeatured ? t("alreadyFeatured") : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("packageLabel")}</Label>
            <Select value={pkg} onValueChange={setPkg}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PACKAGES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label} · {formatMAD(p.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("paymentMethod")}</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProvider("CMI")}
                className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${provider === "CMI" ? "border-primary bg-primary/10" : "hover:bg-muted"}`}
              >
                CMI Card <span className="block text-xs text-muted-foreground">MAD / Visa / Mastercard</span>
              </button>
              <button
                type="button"
                onClick={() => setProvider("STRIPE")}
                className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${provider === "STRIPE" ? "border-primary bg-primary/10" : "hover:bg-muted"}`}
              >
                Stripe <span className="block text-xs text-muted-foreground">International cards</span>
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Star className="h-4 w-4 text-amber-500" /> {t("totalLabel")}
              </span>
              <span className="font-bold">{formatMAD(selected.price)}</span>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={!propertyId || loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("redirecting")}
              </>
            ) : (
              t("payAndPromote")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
