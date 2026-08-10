import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { checkoutCreateSchema } from "@/lib/validations/payments";
import { createCheckout } from "@/features/payments/server/payment.service";

export async function POST(request: Request) {
  const guard = await requireRole(["AGENT", "ADMIN"]);
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "UNAUTHORIZED" ? 401 : 403 });
  }

  const rl = await rateLimit(`checkout:${guard.session.user.id}`, 15, 60);
  if (!rl.ok) return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });

  const body = await request.json().catch(() => null);
  const parsed = checkoutCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY", details: parsed.error.flatten() }, { status: 422 });
  }

  try {
    const result = await createCheckout({
      agentId: guard.session.user.id,
      propertyId: parsed.data.propertyId,
      tier: parsed.data.tier,
      durationDays: parsed.data.durationDays,
      provider: "STRIPE",
    });

    if (result.type !== "STRIPE") {
      return NextResponse.json({ error: "INVALID_PROVIDER" }, { status: 500 });
    }

    return NextResponse.json({
      provider: "STRIPE",
      checkoutUrl: result.checkoutUrl,
      sessionId: result.sessionId,
      paymentId: result.paymentId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "CHECKOUT_FAILED";
    const status = message === "PROPERTY_NOT_ACTIVE" || message === "PROPERTY_NOT_OWNED" ? 422 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
