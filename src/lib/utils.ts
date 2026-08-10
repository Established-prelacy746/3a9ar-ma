import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type NumericInput = number | string | { toString(): string };

export const MAD = (n: NumericInput) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(Number(n));

export function formatMAD(value: NumericInput | null | undefined) {
  if (value == null) return "—";
  return MAD(value);
}

export function formatPricePerM2(price: NumericInput, areaM2: NumericInput | null | undefined) {
  if (areaM2 == null || Number(areaM2) <= 0) return null;
  const perM2 = Number(price) / Number(areaM2);
  return `${new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 }).format(perM2)} MAD/m²`;
}

export function slugify(input: string): string {
  const normalized = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return normalized || "property";
}

export function generateReference(prefix: string, length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${out}`;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function isPast(date: Date | null | undefined): boolean {
  if (!date) return false;
  return date.getTime() < Date.now();
}

export function paginate(page: number, limit: number, total: number) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  return { skip: (safePage - 1) * limit, take: limit, page: safePage, totalPages, total };
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}
