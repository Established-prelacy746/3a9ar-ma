"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PropertyFilters } from "@/types/property";

const initialFilters: PropertyFilters = {
  transaction: undefined,
  rentPeriod: undefined,
  category: undefined,
  type: undefined,
  legalStatus: undefined,
  region: undefined,
  city: undefined,
  neighborhood: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  minArea: undefined,
  maxArea: undefined,
  minBuiltArea: undefined,
  maxBuiltArea: undefined,
  minRooms: undefined,
  minBathrooms: undefined,
  maxFloors: undefined,
  density: undefined,
  minParking: undefined,
  hasElevator: undefined,
  hasPool: undefined,
  hasTerrace: undefined,
  hasSecurity: undefined,
  furnished: undefined,
  bbox: undefined,
  featured: undefined,
  q: undefined,
  sort: "featured",
};

interface FilterStore {
  filters: PropertyFilters;
  page: number;
  limit: number;
  isFilterOpen: boolean;
  setFilter: <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => void;
  setFilters: (patch: Partial<PropertyFilters>) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  toggleFilterPanel: () => void;
  reset: () => void;
}

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      filters: initialFilters,
      page: 1,
      limit: 24,
      isFilterOpen: false,
      setFilter: (key, value) =>
        set((state) => ({ filters: { ...state.filters, [key]: value }, page: 1 })),
      setFilters: (patch) =>
        set((state) => ({ filters: { ...state.filters, ...patch }, page: 1 })),
      setPage: (page) => set({ page }),
      setLimit: (limit) => set({ limit, page: 1 }),
      toggleFilterPanel: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
      reset: () => set({ filters: { ...initialFilters }, page: 1 }),
    }),
    { name: "ar3ar-filters" },
  ),
);
