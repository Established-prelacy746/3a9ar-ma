"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Building2, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useI18n, type Locale } from "@/lib/i18n";

const links = [
  { href: "/", key: "home" as const },
  { href: "/properties", key: "properties" as const },
];

const languages: { code: Locale; label: string }[] = [
  { code: "FR", label: "FR" },
  { code: "EN", label: "EN" },
  { code: "AR", label: "عربي" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Building2 className="h-6 w-6 text-primary" />
          <span>
            3A9AR<span className="text-accent">.ma</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                pathname === l.href && "bg-muted font-medium",
              )}
            >
              {t(l.key)}
            </Link>
          ))}

          {/* Language Switcher */}
          <div className="ml-2 flex items-center gap-0.5 rounded-md border bg-muted/50 p-0.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code)}
                className={cn(
                  "rounded px-2 py-1 text-xs font-medium transition-colors",
                  locale === lang.code
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {status === "authenticated" ? (
            <div className="ml-2 flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={session.user.role === "ADMIN" ? "/admin" : "/agent"}>
                  <LayoutDashboard className="mr-1 h-4 w-4" />
                  {t("dashboard")}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" className="ml-2">
              <Link href="/auth/signin">{t("signIn")}</Link>
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="flex items-center justify-center rounded-md p-2 hover:bg-muted md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                  pathname === l.href && "bg-muted font-medium",
                )}
              >
                {t(l.key)}
              </Link>
            ))}

            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-1 border-t pt-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLocale(lang.code)}
                  className={cn(
                    "rounded px-3 py-1.5 text-xs font-medium transition-colors",
                    locale === lang.code
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {status === "authenticated" ? (
              <div className="mt-2 flex flex-col gap-2 border-t pt-2">
                <Button asChild variant="outline" size="sm" className="w-full justify-start">
                  <Link href={session.user.role === "ADMIN" ? "/admin" : "/agent"}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {t("dashboard")}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("signOut")}
                </Button>
              </div>
            ) : (
              <Button asChild size="sm" className="mt-2 w-full">
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                  {t("signIn")}
                </Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
