import type { Metadata } from "next";
import { Inter, Tajawal } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/session-provider";
import { I18nProvider } from "@/lib/i18n";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CompareBar } from "@/components/features/compare-bar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-tajawal" });

export const metadata: Metadata = {
  title: {
    default: "3A9AR.MA - Moroccan Real Estate Platform | عقار",
    template: "%s | 3A9AR.MA",
  },
  description:
    "Buy, rent and sell property in Morocco: apartments, villas, riads, commercial and land (aradi) with legal title verification. عقار، الدار البيضاء، مراكش",
  keywords: ["immobilier maroc", "عقار", "مغرب", "بيع", "كراء", "أراضي", "رياض", "الدار البيضاء", "مراكش"],
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: "3A9AR.MA",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.variable} ${tajawal.variable} font-sans`}>
        <AuthProvider>
          <QueryProvider>
            <I18nProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <CompareBar />
            </I18nProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
