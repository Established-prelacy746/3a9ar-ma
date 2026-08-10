import { z } from "zod";

export const transactionTypeSchema = z.enum(["SALE", "RENT"]);
export const rentPeriodSchema = z.enum(["LONG_TERM", "SEASONAL"]);
export const categorySchema = z.enum(["RESIDENTIAL", "COMMERCIAL", "LAND"]);
export const propertyTypeSchema = z.enum([
  "APARTMENT",
  "VILLA",
  "RIAD",
  "BUREAUX",
  "MAGASIN",
  "FERME",
  "LOTISSEMENT",
  "TERRAIN_CONSTRUCTIBLE",
  "TERRAIN_AGRICOLE",
]);
export const legalStatusSchema = z.enum(["TITRE_FONCIER", "MELKIA", "ADOULAIRE", "NON_TITRE"]);
export const sortSchema = z.enum([
  "featured",
  "newest",
  "price_asc",
  "price_desc",
  "area_desc",
  "price_per_m2_asc",
]);

const boolCoerce = z
  .enum(["true", "false", "1", "0"])
  .transform((v) => v === "true" || v === "1");

export const propertyQuerySchema = z.object({
  q: z.string().trim().max(200).optional(),
  transaction: transactionTypeSchema.optional(),
  rentPeriod: rentPeriodSchema.optional(),
  category: categorySchema.optional(),
  type: propertyTypeSchema.optional(),
  legalStatus: legalStatusSchema.optional(),
  region: z.string().trim().optional(),
  city: z.string().trim().optional(),
  neighborhood: z.string().trim().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minArea: z.coerce.number().nonnegative().optional(),
  maxArea: z.coerce.number().nonnegative().optional(),
  minBuiltArea: z.coerce.number().nonnegative().optional(),
  maxBuiltArea: z.coerce.number().nonnegative().optional(),
  minRooms: z.coerce.number().int().nonnegative().optional(),
  minBathrooms: z.coerce.number().int().nonnegative().optional(),
  maxFloors: z.coerce.number().int().nonnegative().optional(),
  density: z.string().trim().max(10).optional(),
  minParking: z.coerce.number().int().nonnegative().optional(),
  hasElevator: boolCoerce.optional(),
  hasPool: boolCoerce.optional(),
  hasTerrace: boolCoerce.optional(),
  hasSecurity: boolCoerce.optional(),
  furnished: boolCoerce.optional(),
  bbox: z.string().regex(/^-?[\d.]+,-?[\d.]+,-?[\d.]+,-?[\d.]+$/).optional(),
  featured: boolCoerce.optional(),
  sort: sortSchema.default("featured"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(24),
});

export type PropertyQuery = z.infer<typeof propertyQuerySchema>;

export function parseBbox(bbox: string) {
  const [swLat, swLng, neLat, neLng] = bbox.split(",").map(Number);
  return { swLat, swLng, neLat, neLng };
}
