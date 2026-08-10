"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t bg-muted/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
        <p>{t("footer", { year: new Date().getFullYear() })}</p>
        <div className="flex gap-4">
          <Link href="/properties" className="hover:text-foreground">{t("properties")}</Link>
          <Link href="/auth/signin" className="hover:text-foreground">{t("signIn")}</Link>
        </div>
      </div>
    </footer>
  );
}
