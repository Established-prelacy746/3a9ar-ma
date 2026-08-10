"use client";

import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface CityPrice {
  cityId: string;
  cityName: string;
  cityNameAr: string;
  latitude: number;
  longitude: number;
  avgPriceM2: number;
  propertyCount: number;
}

interface AreaPriceHeatmapProps {
  height?: number;
  center?: [number, number];
}

function priceToColor(price: number, min: number, max: number): string {
  const ratio = max > min ? (price - min) / (max - min) : 0.5;
  if (ratio < 0.33) return "#22c55e"; // green = cheap
  if (ratio < 0.66) return "#eab308"; // yellow = mid
  return "#ef4444"; // red = expensive
}

function priceToRadius(price: number, min: number, max: number): number {
  const ratio = max > min ? (price - min) / (max - min) : 0.5;
  return 12000 + ratio * 25000;
}

export function AreaPriceHeatmap({ height = 400, center = [31.6295, -7.9811] }: AreaPriceHeatmapProps) {
  const { t, locale } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const circlesRef = useRef<L.Circle[]>([]);
  const [cityPrices, setCityPrices] = useState<CityPrice[]>([]);

  useEffect(() => {
    fetch("/api/area-prices")
      .then((res) => res.json())
      .then((d) => { if (d.cities) setCityPrices(d.cities); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      maxZoom: 15,
      minZoom: 5,
    }).setView(center, 6);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || cityPrices.length === 0) return;

    circlesRef.current.forEach((c) => c.remove());
    circlesRef.current = [];

    const prices = cityPrices.map((c) => c.avgPriceM2);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    cityPrices.forEach((city) => {
      const color = priceToColor(city.avgPriceM2, minPrice, maxPrice);
      const radius = priceToRadius(city.avgPriceM2, minPrice, maxPrice);

      const circle = L.circle([city.latitude, city.longitude], {
        radius,
        color,
        fillColor: color,
        fillOpacity: 0.25,
        weight: 2,
      }).addTo(mapRef.current!);

      const label = locale === "AR" ? city.cityNameAr : city.cityName;
      circle.bindPopup(`
        <div style="text-align:center">
          <strong>${label}</strong><br/>
          <span style="color:#059669;font-weight:600">${Number(city.avgPriceM2).toLocaleString()} MAD/m²</span><br/>
          <small>${city.propertyCount} ${t("listingsLabel").toLowerCase()}</small>
        </div>
      `);

      circlesRef.current.push(circle);
    });
  }, [cityPrices, locale, t]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          {t("areaPriceHeatmap")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-green-500" /> {t("affordable")}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-yellow-500" /> {t("midRange")}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-red-500" /> {t("premium")}
          </span>
        </div>
        <div
          ref={containerRef}
          style={{ height, width: "100%" }}
          className="z-0 rounded-xl"
          aria-label="Area price heatmap"
        />
      </CardContent>
    </Card>
  );
}
