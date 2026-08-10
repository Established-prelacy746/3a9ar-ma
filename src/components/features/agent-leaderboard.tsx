"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy, Star, Clock, FileText, BadgeCheck, ChevronRight, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";

const REGIONS = [
  { value: "ALL", labelKey: "all" as const },
  { value: "CASABLANCA_SETTAT", labelKey: "regionCasablancaSettat" as const },
  { value: "MARRAKECH_SAFI", labelKey: "regionMarrakechSafi" as const },
  { value: "RABAT_SALE_KENITRA", labelKey: "regionRabatSaleKenitra" as const },
  { value: "FES_MEKNES", labelKey: "regionFesMeknes" as const },
  { value: "TANGER_TETOUAN", labelKey: "regionTangerTetouan" as const },
  { value: "SOUSS_MASSA", labelKey: "regionSoussMassa" as const },
  { value: "ORIENTAL", labelKey: "regionOriental" as const },
];

interface AgentData {
  rank: number;
  agentId: string;
  name: string;
  agency: string | null;
  isVerified: boolean;
  image: string | null;
  listingCount: number;
  recentLeads: number;
  responseTime: string;
  rating: number;
}

interface AgentLeaderboardProps {
  compact?: boolean;
}

export function AgentLeaderboard({ compact = false }: AgentLeaderboardProps) {
  const { t } = useI18n();
  const [region, setRegion] = useState("ALL");
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (region !== "ALL") params.set("region", region);
        const res = await fetch(`/api/agents/leaderboard?${params}`);
        const data = await res.json();
        setAgents(data.agents ?? []);
      } catch {
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, [region]);

  const displayAgents = compact ? agents.slice(0, 5) : agents;

  const rankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-lg">🥇</span>;
    if (rank === 2) return <span className="text-lg">🥈</span>;
    if (rank === 3) return <span className="text-lg">🥉</span>;
    return <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold">{rank}</span>;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-amber-500" />
            {t("leaderboardTitle")}
          </CardTitle>
          {!compact && (
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {t(r.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border p-4 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-muted" />
                  <div className="h-3 w-20 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : displayAgents.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border bg-muted/30 py-12 text-center">
            <Users className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("noAgentsYet")}</p>
          </div>
        ) : (
          displayAgents.map((agent) => (
            <div
              key={agent.agentId}
              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex-shrink-0">{rankBadge(agent.rank)}</div>

              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                {agent.image ? (
                  <img src={agent.image} alt={agent.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-muted-foreground">
                    {agent.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold truncate">{agent.name}</span>
                  {agent.isVerified && (
                    <BadgeCheck className="h-4 w-4 flex-shrink-0 text-blue-500" />
                  )}
                </div>
                {agent.agency && (
                  <p className="text-xs text-muted-foreground truncate">{agent.agency}</p>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
                <span className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  {agent.listingCount}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  {agent.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {agent.responseTime}
                </span>
              </div>
            </div>
          ))
        )}

        {compact && agents.length > 5 && (
          <Button asChild variant="ghost" className="w-full">
            <Link href="/agents">
              {t("viewAll")} <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
