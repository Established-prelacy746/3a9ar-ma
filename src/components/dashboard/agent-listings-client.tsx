"use client";

import Link from "next/link";
import { formatMAD } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

const STATUS_STYLE: Record<string, "default" | "secondary" | "success" | "destructive" | "outline"> = {
  ACTIVE: "success",
  PENDING_REVIEW: "secondary",
  DRAFT: "secondary",
  REJECTED: "destructive",
  SOLD: "default",
  RENTED: "default",
  ARCHIVED: "outline",
};

interface Listing {
  id: string;
  slug: string;
  title: string;
  type: string;
  price: number;
  listingStatus: string;
  isFeatured: boolean;
  createdAt: Date;
  city: { name: string };
}

export function AgentListingsClient({ listings }: { listings: Listing[] }) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("myListings")}</h1>
        <p className="text-sm text-muted-foreground">{listings.length} {t("resultsLabel").toLowerCase()}</p>
      </div>

      <Card>
        <div className="px-6 py-4">
          <h2 className="text-base font-semibold">{t("allListings")}</h2>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                  <th className="px-6 py-3">{t("titleHeader")}</th>
                  <th className="px-6 py-3">{t("typeHeader")}</th>
                  <th className="px-6 py-3">{t("priceHeader")}</th>
                  <th className="px-6 py-3">{t("statusHeader")}</th>
                  <th className="px-6 py-3">{t("featuredHeader")}</th>
                  <th className="px-6 py-3">{t("createdHeader")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {listings.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/50">
                    <td className="px-6 py-3">
                      <Link href={`/properties/${p.slug}`} className="font-medium hover:text-primary">
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{p.type.replaceAll("_", " ")}</td>
                    <td className="px-6 py-3 font-medium">{formatMAD(p.price)}</td>
                    <td className="px-6 py-3">
                      <Badge variant={STATUS_STYLE[p.listingStatus]}>{p.listingStatus}</Badge>
                    </td>
                    <td className="px-6 py-3">
                      {p.isFeatured ? (
                        <Badge variant="featured">{t("vedette")}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{p.createdAt.toISOString().slice(0, 10)}</td>
                  </tr>
                ))}
                {listings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                      {t("noListings")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
