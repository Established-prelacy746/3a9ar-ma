import type { PaymentProvider, PromotionTier } from "@prisma/client";
import { db } from "@/lib/db";
import { generateReference } from "@/lib/utils";
import {
  buildCmiForm,
  CMI_CALLBACK_URL,
  CMI_CLIENT_ID,
  CMI_FAIL_URL,
  CMI_GATEWAY_URL,
  CMI_OK_URL,
  type CmiFormParams,
} from "@/lib/cmi";
import { madToStripeMinorUnits, stripe } from "@/lib/stripe";
import { resolvePackagePrice } from "@/features/payments/server/promotion.service";

export interface CheckoutInput {
  agentId: string;
  propertyId: string;
  tier: PromotionTier;
  durationDays: number;
  provider: PaymentProvider;
}

export type CheckoutResult =
  | { type: "CMI"; gatewayUrl: string; formParams: CmiFormParams; paymentId: string }
  | { type: "STRIPE"; checkoutUrl: string; sessionId: string; paymentId: string };

export async function createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const property = await db.property.findUnique({
    where: { id: input.propertyId },
    include: { owner: { select: { id: true } } },
  });

  if (!property || property.listingStatus !== "ACTIVE") {
    throw new Error("PROPERTY_NOT_ACTIVE");
  }
  if (property.ownerId !== input.agentId) {
    throw new Error("PROPERTY_NOT_OWNED");
  }

  const amountMAD = await resolvePackagePrice(input.tier, input.durationDays);
  const reference = generateReference("PAY", 10);
  const oid = `AR3${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const payment = await db.payment.create({
    data: {
      reference,
      agentId: input.agentId,
      propertyId: input.propertyId,
      amount: amountMAD,
      currency: "MAD",
      provider: input.provider,
      status: "PENDING",
      metadata: {
        propertyId: input.propertyId,
        tier: input.tier,
        durationDays: input.durationDays,
      },
    },
  });

  if (input.provider === "CMI") {
    const formParams = buildCmiForm({
      clientid: CMI_CLIENT_ID,
      storetype: "3d_pay",
      amount: amountMAD.toFixed(2),
      oid,
      okUrl: CMI_OK_URL,
      failUrl: CMI_FAIL_URL,
      callbackUrl: CMI_CALLBACK_URL,
      cancelUrl: CMI_FAIL_URL,
      currency: "504", // MAD ISO code
      language: "fr",
      rnd: Math.random().toString(36).slice(2),
      hashAlgorithm: "ver3",
      hash: "",
    });

    await db.payment.update({
      where: { id: payment.id },
      data: { providerRef: oid, checkoutUrl: CMI_GATEWAY_URL },
    });

    return { type: "CMI", gatewayUrl: CMI_GATEWAY_URL, formParams, paymentId: payment.id };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: undefined,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: madToStripeMinorUnits(amountMAD),
          product_data: {
            name: `${input.tier === "TOP_BANNER" ? "Top Banner" : "Featured Listing"} · ${property.title}`,
            description: `${input.durationDays} days visibility on 3A9AR.MA. Original price: ${amountMAD.toFixed(2)} MAD.`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      paymentId: payment.id,
      propertyId: input.propertyId,
      agentId: input.agentId,
      tier: input.tier,
      durationDays: String(input.durationDays),
      amountMAD: String(amountMAD),
      currency: "MAD",
    },
    success_url: `${process.env.APP_URL ?? "http://localhost:3000"}/agent/promote?status=ok`,
    cancel_url: `${process.env.APP_URL ?? "http://localhost:3000"}/agent/promote?status=cancel`,
  });

  await db.payment.update({
    where: { id: payment.id },
    data: { providerRef: session.id, checkoutUrl: session.url },
  });

  return { type: "STRIPE", checkoutUrl: session.url ?? "", sessionId: session.id, paymentId: payment.id };
}
