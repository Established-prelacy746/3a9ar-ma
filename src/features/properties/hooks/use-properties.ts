"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProperties, fetchLocations, type CityOption, type LocationTree } from "@/features/properties/api/client";
import type { PropertyQuery } from "@/lib/validations/property-query";
import type { PropertiesResponse } from "@/types/property";

export const propertiesKey = (query: PropertyQuery) => ["properties", query] as const;

export function useProperties(
  query: PropertyQuery,
  options?: { initialData?: PropertiesResponse },
) {
  return useQuery<PropertiesResponse>({
    queryKey: propertiesKey(query),
    queryFn: () => fetchProperties(query),
    placeholderData: (previous) => previous ?? options?.initialData,
    staleTime: 30_000,
  });
}

export function useLocations() {
  return useQuery<LocationTree>({
    queryKey: ["locations", "tree"],
    queryFn: () => fetchLocations(true),
    staleTime: 60 * 60 * 1000,
  });
}

export function useInvalidateProperties() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["properties"] });
}

export function findCity(cities: CityOption[] | undefined, code?: string) {
  return cities?.find((c) => c.code === code);
}
