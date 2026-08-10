import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { paymentQueue } from "@/lib/queues";

export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature ?? "", STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${(err as Error).message}` }, { status: 400 });
  }

  await db.auditLog.create({
    data: {
      action: "STRIPE_WEBHOOK_RECEIVED",
      entityType: "StripeEvent",
      entityId: event.id,
      metadata: { type: event.type },
    },
  });

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const paymentId = invoice.metadata?.paymentId as string | undefined;
      if (paymentId) {
        const payment = await db.payment.findUnique({ where: { id: paymentId } });
        if (payment && payment.status === "PENDING") {
          await paymentQueue.add("payment.complete", { paymentId: payment.id });
        }
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailed(intent.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata ?? {};
  const paymentId = metadata.paymentId;
  if (!paymentId) return;

  // Use transaction to prevent race conditions
  await db.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { id: paymentId } });
    if (!payment) return;
    
    const wasPending = payment.status === "PENDING";
    
    // Only update if still pending (idempotency)
    if (!wasPending) return;

    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "COMPLETED",
        paidAt: new Date(),
        rawCallback: { sessionId: session.id, amount_total: session.amount_total, currency: session.currency },
      },
    });

    // Queue promotion activation
    await paymentQueue.add("payment.complete", { paymentId: payment.id });
  });
}

async function handlePaymentFailed(intentId: string) {
  const payment = await db.payment.findFirst({ where: { providerRef: intentId } });
  if (!payment) return;
  await db.payment.update({
    where: { id: payment.id },
    data: { status: "FAILED", failureReason: "STRIPE_PAYMENT_FAILED" },
  });
}
