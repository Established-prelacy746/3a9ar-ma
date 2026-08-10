"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { formatMAD } from "@/lib/utils";

export interface MapProperty {
  id: string;
  slug: string;
  title: string;
  price: string;
  latitude?: number | null;
  longitude?: number | null;
  plotAreaM2?: string | null;
}

interface PropertyMapProps {
  properties: MapProperty[];
  height?: number;
  center?: [number, number];
}

export function PropertyMap({ properties, height = 420, center = [31.6295, -7.9811] }: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const fittedRef = useRef(false);

  // Initialize map once — start zoomed out to show all Morocco
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { zoomControl: true, maxZoom: 15 }).setView(center, 6);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    clusterRef.current = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 60,
      disableClusteringAtZoom: 15,
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
      fittedRef.current = false;
    };
  }, []); // Only run once on mount

  // Update markers when properties change
  useEffect(() => {
    if (!mapRef.current || !clusterRef.current) return;

    // Clear existing markers
    clusterRef.current.clearLayers();

    const icon = L.divIcon({
      className: "",
      html: `<div class="ar3ar-marker"></div>`,
      iconSize: [12, 12],
    });

    const validProperties = properties.filter(p => p.latitude != null && p.longitude != null);

    // Spread properties around city center: scatter within ~3km radius
    const spread = (val: number, seed: string, range: number): number => {
      let hash = 0;
      for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
      const r1 = ((hash & 0xffff) / 0xffff);
      const r2 = (((hash >> 16) & 0xffff) / 0xffff);
      const angle = r1 * 2 * Math.PI;
      const radius = Math.sqrt(r2) * range;
      return val + (val > 0 ? radius * Math.cos(angle) : radius * Math.sin(angle));
    };

    // Add new markers
    validProperties.forEach((p) => {
      const lat = spread(p.latitude!, p.id + "lat", 0.02);
      const lng = spread(p.longitude!, p.id + "lng", 0.025);
      const marker = L.marker([lat, lng], { icon });
      marker.bindPopup(
        `<a href="/properties/${p.slug}" style="text-decoration:none;color:inherit">
          <strong>${p.title}</strong><br/>
          <span style="color:#059669;font-weight:600">${formatMAD(p.price)}</span>
          ${p.plotAreaM2 ? `<br/><small>${Number(p.plotAreaM2).toLocaleString()} m²</small>` : ""}
        </a>`,
      );
      clusterRef.current?.addLayer(marker);
    });

    // Fit bounds to show all markers — only on first load or when count changes significantly
    if (validProperties.length > 0) {
      const bounds = L.latLngBounds(
        validProperties.map(p => [
          spread(p.latitude!, p.id + "lat", 0.02),
          spread(p.longitude!, p.id + "lng", 0.025),
        ] as [number, number])
      );
      // Fit to all of Morocco on first load
      if (!fittedRef.current) {
        mapRef.current.fitBounds(bounds, { padding: [30, 30], maxZoom: 8 });
        fittedRef.current = true;
      }
    }
  }, [properties]); // Re-run when properties change

  return (
    <div
      ref={containerRef}
      style={{ height, width: "100%" }}
      className="z-0 rounded-xl"
      role="region"
      aria-label="Property locations map"
      aria-describedby="map-description"
    />
  );
}
