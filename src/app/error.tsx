"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t("somethingWentWrong")}</h1>
        <p className="text-muted-foreground">
          {t("sorryError")}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>
        )}
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} size="lg">
          {t("tryAgain")}
        </Button>
        <Button onClick={() => (window.location.href = "/")} variant="outline" size="lg">
          {t("goHome")}
        </Button>
      </div>
    </div>
  );
}
