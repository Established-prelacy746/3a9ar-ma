import type { PromotionTier } from "@prisma/client";
import { db } from "@/lib/db";
import { addDays, generateReference } from "@/lib/utils";
import { generateInvoicePdf } from "@/lib/invoice";
import { upsertPropertyIndex } from "@/lib/meilisearch";

export const TIER_DEFAULT_PRICES: Record<PromotionTier, Record<number, number>> = {
  FEATURED: { 7: 150, 14: 250, 30: 450 },
  TOP_BANNER: { 30: 1500 },
};

export async function resolvePackagePrice(
  tier: PromotionTier,
  durationDays: number,
): Promise<number> {
  const plan = await db.packagePlan.findFirst({
    where: { type: tier, durationDays, isActive: true },
  });
  if (plan) return Number(plan.priceMAD);
  return TIER_DEFAULT_PRICES[tier][durationDays] ?? 0;
}

export async function applyPromotion(paymentId: string): Promise<boolean> {
  return db.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id: paymentId },
      include: { promotion: true },
    });

    if (!payment || payment.status !== "COMPLETED") return false;
    if (payment.promotion) return true; // idempotent

    const metadata = (payment.metadata ?? {}) as {
      propertyId?: string;
      tier?: PromotionTier;
      durationDays?: number;
    };

    if (!metadata.propertyId) return false;

    const property = await tx.property.findUnique({ where: { id: metadata.propertyId } });
    if (!property) return false;

    const tier = metadata.tier ?? "FEATURED";
    const durationDays = metadata.durationDays ?? 7;
    const expiresAt = addDays(new Date(), durationDays);
    const rank = Math.floor(Date.now() / 1000) % 1_000_000;

    await tx.property.update({
      where: { id: property.id },
      data: {
        isFeatured: true,
        featuredExpiresAt: expiresAt,
        featuredRank: rank,
      },
    });

    const promotion = await tx.promotion.create({
      data: {
        propertyId: property.id,
        agentId: payment.agentId,
        tier,
        durationDays,
        startsAt: new Date(),
        expiresAt,
        paymentId: payment.id,
        pricePaid: payment.amount,
        currency: payment.currency,
      },
    });

    const invoice = await tx.invoice.create({
      data: {
        number: generateReference("INV", 10),
        paymentId: payment.id,
        agentId: payment.agentId,
        amount: payment.amount,
        currency: payment.currency,
      },
    });

    const agent = await tx.user.findUnique({ where: { id: payment.agentId } });
    const pdf = generateInvoicePdf({
      invoiceNumber: invoice.number,
      issueDate: new Date(),
      agentName: agent?.name ?? "Agent",
      agencyName: agent?.agencyName,
      agentPhone: agent?.phone,
      itemLabel: `${tier === "TOP_BANNER" ? "Top Banner" : "Featured Listing"} - ${durationDays} days`,
      propertyTitle: property.title,
      amountMAD: Number(payment.amount),
      paymentReference: payment.reference,
      provider: payment.provider,
    });

    await tx.auditLog.create({
      data: {
        actorId: payment.agentId,
        actorRole: "AGENT",
        action: "PROMOTION_APPLIED",
        entityType: "Promotion",
        entityId: promotion.id,
        metadata: { paymentId: payment.id, tier, durationDays, expiresAt: expiresAt.toISOString() },
      },
    });

    try {
      await upsertPropertyIndex({
        id: property.id,
        title: property.title,
        description: property.description,
        city: property.cityId,
        region: property.regionId,
        priceMAD: Number(property.price),
        category: property.category,
        type: property.type,
        transactionType: property.transactionType,
        isFeatured: true,
        latitude: property.latitude,
        longitude: property.longitude,
      });
    } catch {
      // non-fatal: index sync is eventually consistent via the sweep job
    }

    void invoice;
    return true;
  });
}

export async function sweepExpiredPromotions(): Promise<number> {
  const expired = await db.property.findMany({
    where: {
      isFeatured: true,
      OR: [{ featuredExpiresAt: { lt: new Date() } }, { featuredExpiresAt: null }],
    },
    select: { id: true },
  });

  if (expired.length === 0) return 0;

  await db.$transaction([
    db.property.updateMany({
      where: { id: { in: expired.map((p) => p.id) } },
      data: { isFeatured: false, featuredRank: 0, featuredExpiresAt: null },
    }),
    db.promotion.updateMany({
      where: { status: "ACTIVE", expiresAt: { lt: new Date() } },
      data: { status: "EXPIRED" },
    }),
  ]);

  return expired.length;
}
