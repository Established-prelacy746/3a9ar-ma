"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatMAD } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export interface PendingProperty {
  id: string;
  slug: string;
  title: string;
  price: string;
  type: string;
  owner: { name: string | null; email: string | null };
}

export function ModerationRow({ property }: { property: PendingProperty }) {
  const router = useRouter();
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const [action, setAction] = useState<"APPROVE" | "REJECT" | null>(null);

  async function moderate(actionType: "APPROVE" | "REJECT") {
    setBusy(true);
    setAction(actionType);
    try {
      await fetch(`/api/admin/listings/${property.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionType }),
      });
      router.refresh();
    } catch (error) {
      console.error("Moderation failed:", error);
    } finally {
      setBusy(false);
      setAction(null);
    }
  }

  return (
    <tr className="hover:bg-muted/50">
      <td className="px-6 py-3 font-medium">{property.title}</td>
      <td className="px-6 py-3 text-muted-foreground">{property.type.replaceAll("_", " ")}</td>
      <td className="px-6 py-3">{formatMAD(property.price)}</td>
      <td className="px-6 py-3 text-muted-foreground">
        {property.owner.name ?? property.owner.email ?? "—"}
      </td>
      <td className="px-6 py-3">
        <Badge variant="secondary">PENDING_REVIEW</Badge>
      </td>
      <td className="px-6 py-3">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="default" 
            disabled={busy} 
            onClick={() => moderate("APPROVE")}
          >
            {busy && action === "APPROVE" ? `${t("approving")}` : t("approveBtn")}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            disabled={busy} 
            onClick={() => moderate("REJECT")}
          >
            {busy && action === "REJECT" ? `${t("rejecting")}` : t("rejectBtn")}
          </Button>
        </div>
      </td>
    </tr>
  );
}
