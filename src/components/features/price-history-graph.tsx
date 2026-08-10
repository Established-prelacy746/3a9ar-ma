"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

interface PriceHistoryEntry {
  id: string;
  price: number;
  recordedAt: string;
  source: string | null;
}

interface PriceHistoryGraphProps {
  propertyId: string;
}

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `${(price / 1_000).toFixed(0)}K`;
  return price.toFixed(0);
}

export function PriceHistoryGraph({ propertyId }: PriceHistoryGraphProps) {
  const { t } = useI18n();
  const [data, setData] = useState<PriceHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/price-history/${propertyId}`)
      .then((res) => res.json())
      .then((d) => { if (d.history) setData(d.history); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [propertyId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (data.length < 2) return null;

  const chartData = data
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
    .map((entry) => ({
      date: new Date(entry.recordedAt).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
      price: Number(entry.price),
      source: entry.source,
    }));

  const firstPrice = chartData[0]?.price ?? 0;
  const lastPrice = chartData[chartData.length - 1]?.price ?? 0;
  const changePercent = firstPrice > 0 ? (((lastPrice - firstPrice) / firstPrice) * 100).toFixed(1) : "0";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          {t("priceHistory")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("priceEvolution")}</span>
          <span className={`font-semibold ${Number(changePercent) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {Number(changePercent) >= 0 ? "+" : ""}{changePercent}%
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis
                tickFormatter={formatPrice}
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
                width={50}
              />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`${Number(value).toLocaleString()} MAD`, t("price")]}
                labelFormatter={(label) => `${t("dateLabel")}: ${label}`}
                contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var-border))" }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#059669"
                strokeWidth={2}
                dot={{ r: 4, fill: "#059669" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t("lowest")}: {formatPrice(Math.min(...chartData.map((d) => d.price)))} MAD</span>
          <span>{t("highest")}: {formatPrice(Math.max(...chartData.map((d) => d.price)))} MAD</span>
        </div>
      </CardContent>
    </Card>
  );
}
