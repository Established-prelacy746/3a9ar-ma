import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// Stripe does not settle in MAD. Map MAD -> EUR for checkout and persist the
// original MAD amount in metadata for reconciliation. Rate is env-configured.
export function madToStripeMinorUnits(mad: number, rate: number = Number(process.env.STRIPE_MAD_TO_EUR_RATE ?? "0.0025")): number {
  return Math.round(mad * rate * 100);
}

export function stripeMinorUnitsToMAD(minorUnits: number, rate: number = Number(process.env.STRIPE_MAD_TO_EUR_RATE ?? "0.0025")): number {
  return Math.round((minorUnits / 100 / rate) * 100) / 100;
}
