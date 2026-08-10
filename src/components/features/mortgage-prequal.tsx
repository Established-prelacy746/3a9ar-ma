"use client";

import { useState, useMemo } from "react";
import { ShieldCheck, TrendingUp, AlertTriangle, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface PrequalResult {
  maxAffordablePrice: number;
  maxMonthlyPayment: number;
  dtiRatio: number;
  approvalLikelihood: "green" | "yellow" | "red";
  loanAmountNeeded: number;
}

export function MortgagePrequal({ initialPrice }: { initialPrice?: number }) {
  const { t, locale } = useI18n();
  const isAR = locale === "AR";

  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [existingDebts, setExistingDebts] = useState<number>(0);
  const [propertyPrice, setPropertyPrice] = useState<number>(initialPrice ?? 0);
  const [downPayment, setDownPayment] = useState<number>(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isAR ? "ar-MA" : "fr-MA", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const result = useMemo<PrequalResult | null>(() => {
    if (monthlyIncome <= 0) return null;

    // Moroccan bank rule: max 33% of income for total debt service
    const maxTotalDebtService = monthlyIncome * 0.33;
    const availableForNewLoan = Math.max(0, maxTotalDebtService - existingDebts);

    // Average Moroccan mortgage rate ~4.8% over 20 years
    const annualRate = 4.8 / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = 20 * 12;

    // Max loan amount based on available monthly capacity
    const maxLoanAmount =
      availableForNewLoan > 0
        ? (availableForNewLoan * (Math.pow(1 + monthlyRate, totalMonths) - 1)) /
          (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))
        : 0;

    const maxAffordablePrice = maxLoanAmount / (1 - downPayment / Math.max(propertyPrice, 1));
    const loanAmountNeeded = propertyPrice - downPayment;
    const estimatedMonthlyPayment =
      loanAmountNeeded > 0
        ? (loanAmountNeeded * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1)
        : 0;

    const totalDebtService = existingDebts + estimatedMonthlyPayment;
    const dtiRatio = monthlyIncome > 0 ? (totalDebtService / monthlyIncome) * 100 : 0;

    let approvalLikelihood: "green" | "yellow" | "red";
    if (dtiRatio <= 30) {
      approvalLikelihood = "green";
    } else if (dtiRatio <= 33) {
      approvalLikelihood = "yellow";
    } else {
      approvalLikelihood = "red";
    }

    return {
      maxAffordablePrice,
      maxMonthlyPayment: availableForNewLoan,
      dtiRatio,
      approvalLikelihood,
      loanAmountNeeded,
    };
  }, [monthlyIncome, existingDebts, propertyPrice, downPayment]);

  const resetForm = () => {
    setMonthlyIncome(0);
    setExistingDebts(0);
    setPropertyPrice(initialPrice ?? 0);
    setDownPayment(0);
  };

  const likelihoodConfig = {
    green: {
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200",
      icon: ShieldCheck,
      label: t("prequalApproved"),
    },
    yellow: {
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
      icon: AlertTriangle,
      label: t("prequalBorderline"),
    },
    red: {
      color: "text-red-600",
      bg: "bg-red-50 border-red-200",
      icon: XCircle,
      label: t("prequalRisky"),
    },
  };

  return (
    <Card className="w-full" dir={isAR ? "rtl" : "ltr"}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldCheck className="h-5 w-5 text-primary" />
          {t("prequalTitle")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t("prequalDesc")}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="prequal-income" className="flex items-center gap-1">
              {t("prequalMonthlyIncome")} <span className="text-xs text-muted-foreground">({t("priceCurrency")})</span>
            </Label>
            <Input
              id="prequal-income"
              type="number"
              value={monthlyIncome || ""}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              min={0}
              placeholder="15 000"
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prequal-debts" className="flex items-center gap-1">
              {t("prequalExistingDebts")} <span className="text-xs text-muted-foreground">({t("priceCurrency")})</span>
            </Label>
            <Input
              id="prequal-debts"
              type="number"
              value={existingDebts || ""}
              onChange={(e) => setExistingDebts(Number(e.target.value))}
              min={0}
              placeholder="0"
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prequal-price" className="flex items-center gap-1">
              {t("prequalPropertyPrice")} <span className="text-xs text-muted-foreground">({t("priceCurrency")})</span>
            </Label>
            <Input
              id="prequal-price"
              type="number"
              value={propertyPrice || ""}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              min={0}
              placeholder="800 000"
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prequal-down" className="flex items-center gap-1">
              {t("prequalDownPayment")} <span className="text-xs text-muted-foreground">({t("priceCurrency")})</span>
            </Label>
            <Input
              id="prequal-down"
              type="number"
              value={downPayment || ""}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              min={0}
              placeholder="160 000"
              className="text-base"
            />
          </div>
        </div>

        {monthlyIncome > 0 && result && (
          <div className="space-y-4">
            {/* Approval likelihood */}
            <div className={cn("rounded-xl border p-4", likelihoodConfig[result.approvalLikelihood].bg)}>
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = likelihoodConfig[result.approvalLikelihood].icon;
                  return <Icon className={cn("h-8 w-8", likelihoodConfig[result.approvalLikelihood].color)} />;
                })()}
                <div>
                  <p className={cn("text-lg font-bold", likelihoodConfig[result.approvalLikelihood].color)}>
                    {likelihoodConfig[result.approvalLikelihood].label}
                  </p>
                  <p className="text-sm text-muted-foreground">{t("prequalBasedOnBanks")}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-xs font-medium uppercase text-muted-foreground">{t("prequalMaxAffordable")}</p>
                <p className="mt-1 text-lg font-bold text-primary">
                  {formatCurrency(result.maxAffordablePrice)}
                  <span className="text-xs font-normal text-muted-foreground"> {t("priceCurrency")}</span>
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-xs font-medium uppercase text-muted-foreground">{t("prequalMaxMonthly")}</p>
                <p className="mt-1 text-lg font-bold text-primary">
                  {formatCurrency(result.maxMonthlyPayment)}
                  <span className="text-xs font-normal text-muted-foreground"> {t("priceCurrency")}</span>
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-xs font-medium uppercase text-muted-foreground">{t("prequalDtiRatio")}</p>
                <p className={cn(
                  "mt-1 text-lg font-bold",
                  result.dtiRatio <= 30 ? "text-emerald-600" : result.dtiRatio <= 33 ? "text-amber-600" : "text-red-600"
                )}>
                  {result.dtiRatio.toFixed(1)}%
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-xs font-medium uppercase text-muted-foreground">{t("prequalLoanNeeded")}</p>
                <p className="mt-1 text-lg font-bold text-orange-600">
                  {formatCurrency(result.loanAmountNeeded)}
                  <span className="text-xs font-normal text-muted-foreground"> {t("priceCurrency")}</span>
                </p>
              </div>
            </div>

            {/* DTI bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t("prequalDtiRatio")}</span>
                <span>{result.dtiRatio.toFixed(1)}% / 33%</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    result.dtiRatio <= 30 ? "bg-emerald-500" : result.dtiRatio <= 33 ? "bg-amber-500" : "bg-red-500"
                  )}
                  style={{ width: `${Math.min(100, (result.dtiRatio / 50) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t("prequalDtiNote")}
              </p>
            </div>

            <Button variant="outline" size="sm" onClick={resetForm} className="w-full">
              <RotateCcw className="h-4 w-4 mr-1" />
              {t("reset")}
            </Button>
          </div>
        )}

        {monthlyIncome <= 0 && (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            {t("prequalPlaceholder")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
