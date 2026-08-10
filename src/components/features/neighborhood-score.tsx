"use client";

import { useState, useEffect } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { Star, TrendingUp, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

interface NeighborhoodScoreData {
  id: string;
  neighborhoodId: string;
  safety: number;
  schools: number;
  transport: number;
  shopping: number;
  nightlife: number;
  greenery: number;
  noise: number;
  avgPriceM2: number | null;
  totalReviews: number;
}

interface NeighborhoodScoreProps {
  neighborhoodId: string;
}

const SCORE_KEYS = ["safety", "schools", "transport", "shopping", "nightlife", "greenery", "noise"] as const;

const LABEL_KEYS: Record<string, { FR: string; EN: string; AR: string }> = {
  safety: { FR: "Sécurité", EN: "Safety", AR: "الأمان" },
  schools: { FR: "Écoles", EN: "Schools", AR: "المدارس" },
  transport: { FR: "Transport", EN: "Transport", AR: "المواصلات" },
  shopping: { FR: "Shopping", EN: "Shopping", AR: "التسوق" },
  nightlife: { FR: "Vie nocturne", EN: "Nightlife", AR: "الحياة الليلية" },
  greenery: { FR: "Espaces verts", EN: "Greenery", AR: "المساحات الخضراء" },
  noise: { FR: "Bruit", EN: "Noise", AR: "الضوضاء" },
};

function scoreToColor(score: number): string {
  if (score >= 4) return "text-emerald-600";
  if (score >= 3) return "text-yellow-600";
  return "text-red-500";
}

function scoreLabel(score: number, locale: "FR" | "EN" | "AR"): string {
  const labels = {
    FR: ["Mauvais", "Passable", "Moyen", "Bon", "Excellent"],
    EN: ["Poor", "Fair", "Average", "Good", "Excellent"],
    AR: ["سيء", "مقبول", "متوسط", "جيد", "ممتاز"],
  };
  return labels[locale][score - 1] ?? "";
}

export function NeighborhoodScore({ neighborhoodId }: NeighborhoodScoreProps) {
  const { t, locale } = useI18n();
  const [data, setData] = useState<NeighborhoodScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/neighborhood-score/${neighborhoodId}`)
      .then((res) => res.json())
      .then((d) => { if (d.score) setData(d.score); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [neighborhoodId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const radarData = SCORE_KEYS.map((key) => ({
    subject: LABEL_KEYS[key]?.[locale] ?? key,
    value: key === "noise" ? 6 - data[key] : data[key], // invert noise: lower = better
    fullMark: 5,
  }));

  const avgScore = (
    SCORE_KEYS.reduce((sum, k) => sum + (k === "noise" ? 6 - data[k] : data[k]), 0) / SCORE_KEYS.length
  ).toFixed(1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-primary" />
          {t("neighborhoodScore")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{avgScore}</span>
            <span className="text-sm text-muted-foreground">/5</span>
          </div>
          <Badge variant={Number(avgScore) >= 3.5 ? "default" : "secondary"}>
            {scoreLabel(Math.round(Number(avgScore)), locale)}
          </Badge>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={6} tick={{ fontSize: 10 }} />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#059669"
                fill="#059669"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          {SCORE_KEYS.map((key) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-muted-foreground">{LABEL_KEYS[key]?.[locale] ?? key}</span>
              <span className={`font-semibold ${scoreToColor(key === "noise" ? 6 - data[key] : data[key])}`}>
                {key === "noise" ? 6 - data[key] : data[key]}/5
              </span>
            </div>
          ))}
        </div>

        {data.avgPriceM2 && (
          <div className="flex items-center gap-2 border-t pt-3 text-sm">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">{t("avgPriceM2")}:</span>
            <span className="font-semibold">{Number(data.avgPriceM2).toLocaleString()} MAD/m²</span>
          </div>
        )}

        {data.totalReviews > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            {data.totalReviews} {t("neighborhoodReviews")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
