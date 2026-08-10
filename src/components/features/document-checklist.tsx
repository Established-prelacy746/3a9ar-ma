"use client";

import { useState, useCallback } from "react";
import { Download, CheckCircle2, Circle, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useI18n, type TranslationKey } from "@/lib/i18n";

interface DocumentChecklistProps {
  transactionType: "SALE" | "RENT";
}

const SALE_DOCS: { key: TranslationKey; id: string }[] = [
  { key: "docCompromisDeVente", id: "compromis" },
  { key: "docCertificatUrbanisme", id: "certif_urb" },
  { key: "docTitreFoncierCert", id: "titre_foncier" },
  { key: "docPieceIdentite", id: "piece_id" },
  { key: "docJustificatifDomicile", id: "justif_dom" },
  { key: "docReleveCadastral", id: "releve_cad" },
  { key: "docAttestationNotariee", id: "attest_not" },
];

const RENT_DOCS: { key: TranslationKey; id: string }[] = [
  { key: "docContratDeBail", id: "contrat_bail" },
  { key: "docPieceIdentite", id: "piece_id" },
  { key: "docChequeCaution", id: "cheque_caution" },
  { key: "docAttestationTravail", id: "attest_trav" },
];

export function DocumentChecklist({ transactionType }: DocumentChecklistProps) {
  const { t, locale } = useI18n();
  const isAR = locale === "AR";
  const docs = transactionType === "SALE" ? SALE_DOCS : RENT_DOCS;

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const allChecked = docs.every((d) => checked[d.id]);
  const completedCount = docs.filter((d) => checked[d.id]).length;
  const total = docs.length;
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const checkAll = () => {
    const next: Record<string, boolean> = {};
    docs.forEach((d) => (next[d.id] = true));
    setChecked(next);
  };

  const uncheckAll = () => setChecked({});

  const downloadPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const title = transactionType === "SALE" ? t("docSaleChecklist") : t("docRentChecklist");

    doc.setFontSize(18);
    doc.text(title, 20, 25);

    doc.setFontSize(11);
    doc.text(t("docChecklistDesc"), 20, 35);

    let y = 50;
    docs.forEach((d, i) => {
      const label = t(d.key);
      const done = !!checked[d.id];
      const checkbox = done ? "[X]" : "[ ]";
      doc.text(`${checkbox}  ${label}`, 20, y);
      y += 10;
    });

    y += 5;
    doc.setFontSize(10);
    doc.text(`${t("docProgress")}: ${completedCount}/${total} (${percentage}%)`, 20, y);

    doc.save(`3a9ar-checklist-${transactionType.toLowerCase()}.pdf`);
  };

  const title =
    transactionType === "SALE" ? t("docSaleChecklist") : t("docRentChecklist");

  return (
    <div className="rounded-xl border bg-card p-6" dir={isAR ? "rtl" : "ltr"}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <Badge variant={allChecked ? "default" : "secondary"}>
          {allChecked ? t("docCompleted") : `${completedCount}/${total}`}
        </Badge>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{t("docChecklistDesc")}</p>

      <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            allChecked ? "bg-emerald-500" : "bg-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="space-y-2">
        {docs.map((doc) => {
          const done = !!checked[doc.id];
          return (
            <button
              key={doc.id}
              onClick={() => toggle(doc.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                done
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950"
                  : "hover:bg-muted/50"
              )}
            >
              {done ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "text-sm",
                  done && "text-emerald-700 line-through dark:text-emerald-400"
                )}
              >
                {t(doc.key)}
              </span>
            </button>
          );
        })}
      </div>

      {allChecked && (
        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          {t("docSuccess")}
        </p>
      )}

      {!allChecked && (
        <p className="mt-4 text-xs text-muted-foreground">{t("docTip")}</p>
      )}

      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={checkAll}>
          {t("docCheckAll")}
        </Button>
        <Button variant="outline" size="sm" onClick={uncheckAll}>
          {t("docUncheckAll")}
        </Button>
        <Button variant="outline" size="sm" onClick={downloadPdf} className="ml-auto">
          <Download className="mr-1 h-4 w-4" />
          {t("docDownloadPdf")}
        </Button>
      </div>
    </div>
  );
}
