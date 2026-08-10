"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bookmark,
  Plus,
  Bell,
  BellOff,
  Trash2,
  Pencil,
  X,
  Check,
  Search,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface SavedSearch {
  id: string;
  name: string;
  filters: Record<string, unknown>;
  notifyEmail: boolean;
  notifyWhatsApp: boolean;
  createdAt: string;
  lastNotifiedAt?: string | null;
}

interface SavedSearchesProps {
  currentFilters?: Record<string, unknown>;
  onSaveFromSearch?: () => void;
  variant?: "inline" | "page";
}

function summarizeFilters(filters: Record<string, unknown>, t: (k: TranslationKey) => string): string {
  const parts: string[] = [];
  if (filters.transaction) parts.push(filters.transaction === "SALE" ? t("sale") : t("rent"));
  if (filters.type) parts.push(String(filters.type).replaceAll("_", " "));
  if (filters.city) parts.push(String(filters.city));
  if (filters.region) parts.push(String(filters.region));
  if (filters.minPrice) parts.push(`> ${Number(filters.minPrice).toLocaleString()} MAD`);
  if (filters.maxPrice) parts.push(`< ${Number(filters.maxPrice).toLocaleString()} MAD`);
  if (filters.minRooms) parts.push(`${t("minRooms")}: ${filters.minRooms}`);
  if (filters.category) parts.push(String(filters.category));
  return parts.slice(0, 4).join(" · ") || t("allFilters");
}

export function SavedSearches({ currentFilters, variant = "page" }: SavedSearchesProps) {
  const { t } = useI18n();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchSearches = useCallback(async () => {
    try {
      const res = await fetch("/api/saved-searches");
      if (res.ok) {
        const data = await res.json();
        setSearches(data.searches ?? []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSearches();
  }, [fetchSearches]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const filters = currentFilters ?? {};
      if (editId) {
        const res = await fetch(`/api/saved-searches/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), notifyEmail, notifyWhatsApp }),
        });
        if (res.ok) {
          setSearches((prev) =>
            prev.map((s) =>
              s.id === editId ? { ...s, name: name.trim(), notifyEmail, notifyWhatsApp } : s,
            ),
          );
        }
      } else {
        const res = await fetch("/api/saved-searches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), filters, notifyEmail, notifyWhatsApp }),
        });
        if (res.ok) {
          const data = await res.json();
          setSearches((prev) => [data.search, ...prev]);
        }
      }
      setShowDialog(false);
      setEditId(null);
      setName("");
      setNotifyEmail(true);
      setNotifyWhatsApp(false);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/saved-searches/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSearches((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleAlerts = async (id: string, field: "notifyEmail" | "notifyWhatsApp", value: boolean) => {
    try {
      const res = await fetch(`/api/saved-searches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) {
        setSearches((prev) =>
          prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
        );
      }
    } catch {
      // ignore
    }
  };

  const openEdit = (search: SavedSearch) => {
    setEditId(search.id);
    setName(search.name);
    setNotifyEmail(search.notifyEmail);
    setNotifyWhatsApp(search.notifyWhatsApp);
    setShowDialog(true);
  };

  const openNew = () => {
    setEditId(null);
    setName("");
    setNotifyEmail(true);
    setNotifyWhatsApp(false);
    setShowDialog(true);
  };

  if (variant === "inline") {
    return (
      <>
        <Button variant="outline" size="sm" onClick={openNew}>
          <Bookmark className="mr-1.5 h-4 w-4" />
          {t("saveSearch")}
        </Button>

        {showDialog && (
          <SaveSearchDialog
            name={name}
            setName={setName}
            notifyEmail={notifyEmail}
            setNotifyEmail={setNotifyEmail}
            notifyWhatsApp={notifyWhatsApp}
            setNotifyWhatsApp={setNotifyWhatsApp}
            onSave={handleSave}
            onClose={() => { setShowDialog(false); setEditId(null); }}
            saving={saving}
            isEdit={!!editId}
            t={t}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("savedSearches")}</h1>
          <p className="text-sm text-muted-foreground">{t("savedSearchesDesc")}</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-1.5 h-4 w-4" />
          {t("newSavedSearch")}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : searches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium">{t("noSavedSearches")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("noSavedSearchesDesc")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {searches.map((search) => (
            <Card key={search.id} className="relative">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="truncate">{search.name}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => openEdit(search)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => handleDelete(search.id)}
                      disabled={deleting === search.id}
                    >
                      {deleting === search.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {summarizeFilters(search.filters as Record<string, unknown>, t)}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {search.notifyEmail ? (
                      <Bell className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <BellOff className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <Switch
                      checked={search.notifyEmail}
                      onCheckedChange={(v) => handleToggleAlerts(search.id, "notifyEmail", v)}
                      className="h-5 w-9"
                    />
                    <Label className="text-xs">{t("email")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={search.notifyWhatsApp}
                      onCheckedChange={(v) => handleToggleAlerts(search.id, "notifyWhatsApp", v)}
                      className="h-5 w-9"
                    />
                    <Label className="text-xs">{t("push")}</Label>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {t("created")} {new Date(search.createdAt).toLocaleDateString()}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showDialog && (
        <SaveSearchDialog
          name={name}
          setName={setName}
          notifyEmail={notifyEmail}
          setNotifyEmail={setNotifyEmail}
          notifyWhatsApp={notifyWhatsApp}
          setNotifyWhatsApp={setNotifyWhatsApp}
          onSave={handleSave}
          onClose={() => { setShowDialog(false); setEditId(null); }}
          saving={saving}
          isEdit={!!editId}
          t={t}
        />
      )}
    </div>
  );
}

function SaveSearchDialog({
  name,
  setName,
  notifyEmail,
  setNotifyEmail,
  notifyWhatsApp,
  setNotifyWhatsApp,
  onSave,
  onClose,
  saving,
  isEdit,
  t,
}: {
  name: string;
  setName: (v: string) => void;
  notifyEmail: boolean;
  setNotifyEmail: (v: boolean) => void;
  notifyWhatsApp: boolean;
  setNotifyWhatsApp: (v: boolean) => void;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
  isEdit: boolean;
  t: (k: TranslationKey) => string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="mx-4 w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">
            {isEdit ? t("editSavedSearch") : t("saveCurrentSearch")}
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search-name">{t("searchName")}</Label>
            <Input
              id="search-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("searchNamePlaceholder")}
              autoFocus
            />
          </div>
          <div className="space-y-3">
            <Label>{t("notifications")}</Label>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{t("notifyEmail")}</span>
              </div>
              <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{t("pushNotifications")}</span>
              </div>
              <Switch checked={notifyWhatsApp} onCheckedChange={setNotifyWhatsApp} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button className="flex-1" onClick={onSave} disabled={!name.trim() || saving}>
              {saving ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-1.5 h-4 w-4" />
              )}
              {isEdit ? t("update") : t("save")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
