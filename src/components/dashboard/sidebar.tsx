"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Users, Star, ShieldCheck, Bookmark, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function DashboardSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const { t } = useI18n();

  const links: { href: string; label: string; icon: LucideIcon }[] = [
    { href: "/agent", label: t("overview"), icon: LayoutDashboard },
    { href: "/agent/listings", label: t("myListings"), icon: Building2 },
    { href: "/agent/promote", label: t("promoteVedette"), icon: Star },
    { href: "/agent/leads", label: t("leadsLabel"), icon: Users },
    { href: "/agent/saved-searches", label: t("savedSearches"), icon: Bookmark },
  ];

  if (role === "ADMIN") {
    links.unshift({ href: "/admin", label: t("adminConsole"), icon: ShieldCheck });
  }

  return (
    <aside className="h-fit rounded-xl border bg-card p-4 md:sticky md:top-24">
      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
              pathname === href && "bg-primary/10 font-medium text-primary",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
