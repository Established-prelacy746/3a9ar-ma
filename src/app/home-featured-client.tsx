"use client";

import Link from "next/link";
import { Sparkles, MessageCircle } from "lucide-react";
import { PropertyCard } from "@/components/properties/property-card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import type { PropertyCardData } from "@/types/property";
import { AgentLeaderboard } from "@/components/features/agent-leaderboard";

export function HomeFeaturedClient({ items }: { items: PropertyCardData[] }) {
  const { t } = useI18n();

  return (
    <>
      <section className="container py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Sparkles className="h-5 w-5 text-amber-500" />
              {t("vedette")}
            </h2>
            <p className="text-sm text-muted-foreground">{t("featuredListingsDesc")}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/properties">{t("viewAll")}</Link>
          </Button>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-xl border bg-card py-16 text-center">
            <p className="text-muted-foreground">{t("noFeaturedYet")}</p>
            <Button asChild variant="outline">
              <Link href="/properties">{t("browseAllProperties")}</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Agent Leaderboard Preview */}
      <section className="container py-16">
        <AgentLeaderboard compact />
      </section>

      <section className="border-t bg-gradient-to-br from-emerald-50 to-secondary/40 py-16 dark:from-emerald-950/20">
        <div className="container flex flex-col items-center gap-6 text-center">
          <div className="rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/30">
            <MessageCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="max-w-2xl text-3xl font-bold">
            {t("whatsappTitle")}
          </h2>
          <p className="max-w-xl text-lg text-muted-foreground">
            {t("whatsappDesc")}
          </p>
          <a
            href={`https://wa.me/${process.env.WHATSAPP_BOT_WA_NUMBER ?? "212000000000"}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 shadow-lg">
              <MessageCircle className="mr-2 h-4 w-4" /> {t("chatOnWhatsApp")}
            </Button>
          </a>
        </div>
      </section>
    </>
  );
}
