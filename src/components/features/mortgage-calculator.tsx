"use client";

import { useState, useMemo } from "react";
import { Calculator, CreditCard, TrendingDown, Banknote, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const BANKS = [
  { id: "attijariwafa", name: "ATTIJARIWAFA BANK", rate: 4.80 },
  { id: "bmce", name: "BMCE", rate: 4.85 },
  { id: "cih", name: "CIH", rate: 4.75 },
  { id: "bcp", name: "BCP", rate: 4.90 },
  { id: "agdir", name: "AGDIR", rate: 5.10 },
  { id: "banque_populaire", name: "Banque Populaire", rate: 5.00 },
];

const DURATIONS = [
  { value: 10, labelKey: "tenYears" },
  { value: 15, labelKey: "fifteenYears" },
  { value: 20, labelKey: "twentyYears" },
  { value: 25, labelKey: "twentyFiveYears" },
];

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export function MortgageCalculator({ initialPrice }: { initialPrice?: number }) {
  const { t, locale } = useI18n();
  const isAR = locale === "AR";

  const [propertyPrice, setPropertyPrice] = useState<number>(initialPrice ?? 1000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [durationYears, setDurationYears] = useState<number>(20);
  const [selectedBankId, setSelectedBankId] = useState<string>("cih");
  const [showAmortization, setShowAmortization] = useState(false);

  const selectedBank = BANKS.find((b) => b.id === selectedBankId) ?? BANKS[2];
  const annualRate = selectedBank.rate;
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = durationYears * 12;
  const loanAmount = propertyPrice * (1 - downPaymentPercent / 100);

  const calculation = useMemo(() => {
    if (loanAmount <= 0 || monthlyRate <= 0 || totalMonths <= 0) {
      return { monthlyPayment: 0, totalCost: 0, totalInterest: 0, amortization: [] };
    }

    const monthlyPayment =
      loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalCost = monthlyPayment * totalMonths;
    const totalInterest = totalCost - loanAmount;

    const amortization: AmortizationRow[] = [];
    let balance = loanAmount;

    for (let month = 1; month <= totalMonths; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance = Math.max(0, balance - principalPayment);

      amortization.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance,
      });
    }

    return { monthlyPayment, totalCost, totalInterest, amortization };
  }, [loanAmount, monthlyRate, totalMonths]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isAR ? "ar-MA" : "fr-MA", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const resetForm = () => {
    setPropertyPrice(initialPrice ?? 1000000);
    setDownPaymentPercent(20);
    setDurationYears(20);
    setSelectedBankId("cih");
    setShowAmortization(false);
  };

  return (
    <Card className="w-full" dir={isAR ? "rtl" : "ltr"}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          {t("mortgageTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="propertyPrice" className="flex items-center gap-1">
              {t("propertyPrice")} <span className="text-xs text-muted-foreground">({t("priceCurrency")})</span>
            </Label>
            <Input
              id="propertyPrice"
              type="number"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              min={0}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="downPayment" className="flex items-center gap-1">
              {t("downPayment")} <span className="text-xs text-muted-foreground">({t("percentSymbol")})</span>
            </Label>
            <Input
              id="downPayment"
              type="number"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
              min={0}
              max={100}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label>{t("loanDuration")}</Label>
            <Select value={String(durationYears)} onValueChange={(v) => setDurationYears(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map((d) => (
                  <SelectItem key={d.value} value={String(d.value)}>
                    {t(d.labelKey as any)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("selectBank")}</Label>
            <Select value={selectedBankId} onValueChange={setSelectedBankId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BANKS.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    <span className="flex items-center justify-between w-full">
                      <span>{bank.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{bank.rate}%</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 rounded-xl bg-muted/50 p-4">
          <div className="text-center">
            <p className="text-xs font-medium uppercase text-muted-foreground">{t("monthlyPayment")}</p>
            <p className="mt-1 text-xl font-bold text-primary">
              {formatCurrency(calculation.monthlyPayment)}
              <span className="text-xs font-normal text-muted-foreground"> {t("priceCurrency")}</span>
            </p>
          </div>
          <div className="text-center border-x">
            <p className="text-xs font-medium uppercase text-muted-foreground">{t("totalInterest")}</p>
            <p className="mt-1 text-xl font-bold text-orange-600">
              {formatCurrency(calculation.totalInterest)}
              <span className="text-xs font-normal text-muted-foreground"> {t("priceCurrency")}</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium uppercase text-muted-foreground">{t("totalCost")}</p>
            <p className="mt-1 text-xl font-bold">
              {formatCurrency(calculation.totalCost)}
              <span className="text-xs font-normal text-muted-foreground"> {t("priceCurrency")}</span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">{t("downPayment")}: {formatCurrency(loanAmount)} {t("priceCurrency")}</Label>
            <span className="text-xs text-muted-foreground">{t("bestRate")}: {selectedBank.name} ({annualRate}%)</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(100, (calculation.monthlyPayment / (propertyPrice / totalMonths)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={resetForm} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-1" />
            {t("reset")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAmortization(!showAmortization)}
            className="flex-1"
          >
            {showAmortization ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {t("amortizationSchedule")}
          </Button>
        </div>

        {showAmortization && calculation.amortization.length > 0 && (
          <div className="rounded-xl border overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-muted">
                  <tr>
                    <th className="p-2 text-left font-medium">Mois</th>
                    <th className="p-2 text-right font-medium">{t("monthlyPayment")}</th>
                    <th className="p-2 text-right font-medium">Capital</th>
                    <th className="p-2 text-right font-medium">Intérêts</th>
                    <th className="p-2 text-right font-medium">Solde</th>
                  </tr>
                </thead>
                <tbody>
                  {calculation.amortization.filter((_, i) => i % 12 === 0 || i === calculation.amortization.length - 1).map((row) => (
                    <tr key={row.month} className="border-t">
                      <td className="p-2">{row.month}</td>
                      <td className="p-2 text-right">{formatCurrency(row.payment)}</td>
                      <td className="p-2 text-right">{formatCurrency(row.principal)}</td>
                      <td className="p-2 text-right">{formatCurrency(row.interest)}</td>
                      <td className="p-2 text-right">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="rounded-xl border bg-muted/30 p-4">
          <h3 className="mb-3 text-sm font-semibold">{t("compareBanks")}</h3>
          <div className="space-y-2">
            {BANKS.sort((a, b) => a.rate - b.rate).map((bank) => {
              const bankMonthlyRate = bank.rate / 100 / 12;
              const bankMonthly =
                loanAmount > 0
                  ? (loanAmount * bankMonthlyRate * Math.pow(1 + bankMonthlyRate, totalMonths)) /
                    (Math.pow(1 + bankMonthlyRate, totalMonths) - 1)
                  : 0;
              const isSelected = bank.id === selectedBankId;

              return (
                <div
                  key={bank.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg p-3 transition-colors cursor-pointer",
                    isSelected ? "bg-primary/10 border border-primary/20" : "bg-muted/50 hover:bg-muted"
                  )}
                  onClick={() => setSelectedBankId(bank.id)}
                >
                  <div className="flex items-center gap-2">
                    <Banknote className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">{bank.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{bank.rate}%</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(bankMonthly)}/mois</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}