"use client";

import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

interface WhatsAppQuickInquiryProps {
  agentPhone: string;
  propertyTitle: string;
  propertyPrice?: number;
  propertySlug: string;
}

const QUICK_MESSAGES = [
  "interested",
  "negotiable",
  "visit",
  "neighborhood",
] as const;

type QuickMessageKey = (typeof QUICK_MESSAGES)[number];

export function WhatsAppQuickInquiry({
  agentPhone,
  propertyTitle,
  propertyPrice,
  propertySlug,
}: WhatsAppQuickInquiryProps) {
  const { t } = useI18n();

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const propertyUrl = `${appUrl}/properties/${propertySlug}`;

  const getMessage = (key: QuickMessageKey): string => {
    const priceStr = propertyPrice ? `\n💰 ${propertyPrice.toLocaleString()} MAD` : "";
    const linkStr = `\n🔗 ${propertyUrl}`;

    switch (key) {
      case "interested":
        return `${t("waQuickInterested")}\n*${propertyTitle}*${priceStr}${linkStr}`;
      case "negotiable":
        return `${t("waQuickNegotiable")}\n*${propertyTitle}*${priceStr}${linkStr}`;
      case "visit":
        return `${t("waQuickVisit")}\n*${propertyTitle}*${linkStr}`;
      case "neighborhood":
        return `${t("waQuickNeighborhood")}\n*${propertyTitle}*${linkStr}`;
    }
  };

  const sendQuickMessage = (key: QuickMessageKey) => {
    const message = getMessage(key);
    const phone = agentPhone.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const phone = agentPhone.replace(/\D/g, "");
  const fullMessage = `${t("waQuickInterested")}\n*${propertyTitle}*${propertyPrice ? `\n💰 ${propertyPrice.toLocaleString()} MAD` : ""}\n🔗 ${propertyUrl}`;
  const defaultWaLink = `https://wa.me/${phone}?text=${encodeURIComponent(fullMessage)}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <MessageCircle className="h-4 w-4 text-emerald-600" />
        {t("waQuickTitle")}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {QUICK_MESSAGES.map((key) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            className="justify-start text-left text-xs"
            onClick={() => sendQuickMessage(key)}
          >
            <Send className="mr-1.5 h-3 w-3 shrink-0 text-emerald-600" />
            {t(`waQuick${key.charAt(0).toUpperCase() + key.slice(1)}` as any)}
          </Button>
        ))}
      </div>

      <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
        <a href={defaultWaLink} target="_blank" rel="noreferrer">
          <MessageCircle className="mr-2 h-4 w-4" />
          {t("waQuickSendDefault")}
        </a>
      </Button>
    </div>
  );
}
