"use client";

import { useState } from "react";
import { Languages, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { translateText, type TranslationLang } from "@/lib/translation-dictionary";

interface TranslateListingProps {
  title: string;
  description: string;
  onTranslated?: (data: { title: string; description: string; lang: TranslationLang }) => void;
}

export function TranslateListing({ title, description, onTranslated }: TranslateListingProps) {
  const { t } = useI18n();
  const [targetLang, setTargetLang] = useState<TranslationLang>("EN");
  const [translatedTitle, setTranslatedTitle] = useState("");
  const [translatedDesc, setTranslatedDesc] = useState("");
  const [isTranslated, setIsTranslated] = useState(false);
  const [copied, setCopied] = useState(false);

  const sourceLang: TranslationLang = "FR";

  const handleTranslate = () => {
    const tTitle = translateText(title, sourceLang, targetLang);
    const tDesc = translateText(description, sourceLang, targetLang);
    setTranslatedTitle(tTitle);
    setTranslatedDesc(tDesc);
    setIsTranslated(true);
    onTranslated?.({ title: tTitle, description: tDesc, lang: targetLang });
  };

  const handleCopy = async () => {
    const text = `${translatedTitle}\n\n${translatedDesc}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langLabels: Record<TranslationLang, string> = { FR: "Français", EN: "English", AR: "العربية" };

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        <Languages className="h-4 w-4 text-primary" />
        {t("translateListingTitle")}
      </div>

      <div className="mb-3 flex gap-2">
        {(["EN", "AR"] as TranslationLang[]).map((lang) => (
          <Button
            key={lang}
            variant={targetLang === lang ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setTargetLang(lang);
              setIsTranslated(false);
            }}
          >
            {langLabels[lang]}
          </Button>
        ))}
        <Button size="sm" onClick={handleTranslate}>
          <Languages className="mr-1 h-3 w-3" />
          {t("translateBtn")}
        </Button>
      </div>

      {isTranslated && (
        <div className="space-y-3">
          <div className="rounded-lg bg-muted p-3">
            <p className="mb-1 text-xs font-medium text-muted-foreground">{t("translatedTitle")}</p>
            <p className="text-sm">{translatedTitle}</p>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <p className="mb-1 text-xs font-medium text-muted-foreground">{t("translatedDescription")}</p>
            <p className="whitespace-pre-line text-sm">{translatedDesc}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
            {copied ? t("copied") : t("copyTranslation")}
          </Button>
        </div>
      )}
    </div>
  );
}
