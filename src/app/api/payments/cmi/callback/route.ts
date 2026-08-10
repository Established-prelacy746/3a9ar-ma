import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyCmiCallback } from "@/lib/cmi";
import { paymentQueue } from "@/lib/queues";

const OK_URL = `${process.env.APP_URL ?? "http://localhost:3000"}/agent/promote?status=ok`;
const FAIL_URL = `${process.env.APP_URL ?? "http://localhost:3000"}/agent/promote?status=fail`;

function parseParams(search: URLSearchParams): Record<string, string> {
  const out: Record<string, string> = {};
  search.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

export async function GET(request: Request) {
  const params = parseParams(new URL(request.url).searchParams);
  const valid = verifyCmiCallback(params);
  if (!valid) return NextResponse.redirect(FAIL_URL + "&reason=bad_hash");

  await reconcile(params);
  const success = params["ProcReturnCode"] === "00";
  return NextResponse.redirect(success ? OK_URL : FAIL_URL);
}

export async function POST(request: Request) {
  const raw = await request.text();
  const params = parseParams(new URLSearchParams(raw));

  const valid = verifyCmiCallback(params);
  if (!valid) {
    await db.auditLog.create({
      data: {
        action: "CMI_CALLBACK_INVALID_HASH",
        entityType: "Payment",
        entityId: params["oid"] ?? null,
        metadata: { params },
      },
    });
    return new Response("OK", { status: 200 });
  }

  await reconcile(params);
  return new Response("OK", { status: 200 });
}

async function reconcile(params: Record<string, string>) {
  const oid = params["oid"];
  if (!oid) return;

  const payment = await db.payment.findFirst({ where: { providerRef: oid } });
  if (!payment) return;

  const success = params["ProcReturnCode"] === "00";
  const wasPending = payment.status === "PENDING";

  await db.payment.update({
    where: { id: payment.id },
    data: {
      status: success ? "COMPLETED" : "FAILED",
      paidAt: success ? new Date() : null,
      rawCallback: params,
      failureReason: success ? null : params["ErrorText"] ?? params["ErrorCode"] ?? null,
    },
  });

  await db.auditLog.create({
    data: {
      action: "CMI_CALLBACK_RECEIVED",
      entityType: "Payment",
      entityId: payment.id,
      metadata: { oid, procReturnCode: params["ProcReturnCode"] },
    },
  });

  if (success && wasPending) {
    await paymentQueue.add("payment.complete", { paymentId: payment.id });
  }
}
