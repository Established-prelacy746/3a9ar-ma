"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const PropertyMap = dynamic(() => import("@/components/properties/property-map").then((m) => m.PropertyMap), {
  ssr: false,
  loading: () => <Skeleton className="h-[360px] w-full rounded-xl" />,
});

export function PropertyDetailMap({ lat, lng, title, price, slug }: { lat: number; lng: number; title: string; price: number; slug: string }) {
  return (
    <PropertyMap
      properties={[{ id: slug, slug, title, price: String(price), latitude: lat, longitude: lng }]}
      height={360}
      center={[lat, lng]}
    />
  );
}
