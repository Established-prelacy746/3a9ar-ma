"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function ContactAgentForm({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const { t } = useI18n();
  const [state, setState] = useState<{ status: "idle" | "loading" | "success" | "error"; message?: string }>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState({ status: "loading" });

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        buyerName: String(form.get("name") ?? ""),
        buyerPhone: String(form.get("phone") ?? ""),
        buyerMessage: String(form.get("message") ?? ""),
      }),
    });

    if (res.ok) {
      setState({ status: "success", message: t("requestSent") });
      router.refresh();
    } else {
      setState({ status: "error", message: t("requestError") });
    }
  }

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border bg-emerald-50 p-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        <p className="font-medium">{state.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("fullName")}</Label>
        <Input id="name" name="name" placeholder={t("yourName")} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">{t("phoneLabel")}</Label>
        <Input id="phone" name="phone" type="tel" placeholder={t("phonePlaceholder")} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{t("messageLabel")}</Label>
        <Textarea id="message" name="message" placeholder={t("messagePlaceholder")} rows={4} />
      </div>
      <Button type="submit" className="w-full" disabled={state.status === "loading"}>
        {state.status === "loading" ? t("sending") : t("contactAgent")}
      </Button>
      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
    </form>
  );
}
