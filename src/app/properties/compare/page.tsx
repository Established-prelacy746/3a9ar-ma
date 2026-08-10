import type { Metadata } from "next";
import { ComparePageClient } from "./compare-page-client";

export const metadata: Metadata = {
  title: "Comparer les propriétés",
  description: "Comparez les propriétés côte à côte sur 3A9AR.MA",
};

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ComparePageClient />
    </div>
  );
}
