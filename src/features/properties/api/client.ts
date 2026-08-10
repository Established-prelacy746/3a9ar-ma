import type { PropertyQuery } from "@/lib/validations/property-query";
import type { PropertiesResponse } from "@/types/property";

export async function fetchProperties(query: PropertyQuery): Promise<PropertiesResponse> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value == null || value === "" || value === false) return;
    params.set(key, String(value));
  });
  const res = await fetch(`/api/properties?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch properties (${res.status})`);
  return res.json();
}

export interface MapPropertyItem {
  id: string;
  slug: string;
  title: string;
  price: string;
  latitude: number | null;
  longitude: number | null;
  plotAreaM2: string | null;
}

export async function fetchMapProperties(query?: Partial<PropertyQuery>): Promise<MapPropertyItem[]> {
  const params = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value == null || value === "" || value === false) return;
      params.set(key, String(value));
    });
  }
  const res = await fetch(`/api/properties/map?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch map properties (${res.status})`);
  return res.json();
}

export interface LocationOption {
  id: string;
  code: string;
  name: string;
  nameAr: string;
}

export interface CityOption extends LocationOption {
  regionId: string;
  neighborhoods: LocationOption[];
}

export interface LocationTree {
  regions: (LocationOption & { cities: CityOption[] })[];
}

export async function fetchLocations(withNeighborhoods = true): Promise<LocationTree> {
  const res = await fetch(`/api/locations?neighborhoods=${withNeighborhoods}`);
  if (!res.ok) throw new Error("Failed to fetch locations");
  return res.json();
}
