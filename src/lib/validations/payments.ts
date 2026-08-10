import { z } from "zod";

export const promotionTierSchema = z.enum(["FEATURED", "TOP_BANNER"]);

export const checkoutCreateSchema = z.object({
  propertyId: z.string().min(1),
  tier: promotionTierSchema,
  durationDays: z.coerce.number().int().min(1).max(365),
  provider: z.enum(["CMI", "STRIPE"]),
});

export type CheckoutCreateInput = z.infer<typeof checkoutCreateSchema>;

export const cmiCallbackSchema = z
  .object({
    clientid: z.string().optional(),
    oid: z.string().optional(),
    amount: z.string().optional(),
    currency: z.string().optional(),
    ProcReturnCode: z.string().optional(),
    Response: z.string().optional(),
    HASH: z.string().optional(),
    HASHPARAMS: z.string().optional(),
    HASHPARAMSVAL: z.string().optional(),
    ErrorCode: z.string().optional(),
    ErrorText: z.string().optional(),
  })
  .passthrough();

export const leadCreateSchema = z.object({
  propertyId: z.string().min(1).optional(),
  buyerName: z.string().trim().max(120).optional(),
  buyerPhone: z.string().trim().min(8).max(20).regex(
    /^[\d\s+\-()]+$/,
    "Invalid phone number format"
  ),
  buyerMessage: z.string().trim().max(2000).optional(),
  cityName: z.string().trim().max(80).optional(),
});
