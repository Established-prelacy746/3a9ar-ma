import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const guard = await requireRole(["ADMIN"]);
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "UNAUTHORIZED" ? 401 : 403 });
  }

  const body = await request.json().catch(() => null);
  const action = body?.action as "APPROVE" | "REJECT" | undefined;
  if (!action || (action !== "APPROVE" && action !== "REJECT")) {
    return NextResponse.json({ error: "INVALID_ACTION" }, { status: 422 });
  }

  const property = await db.property.findUnique({ where: { id: params.id } });
  if (!property) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  // Validate state transition
  if (property.listingStatus !== "PENDING_REVIEW") {
    return NextResponse.json(
      { error: "INVALID_STATE", message: "Property is not pending review" },
      { status: 409 }
    );
  }

  await db.property.update({
    where: { id: property.id },
    data: {
      listingStatus: action === "APPROVE" ? "ACTIVE" : "REJECTED",
      publishedAt: action === "APPROVE" ? new Date() : null,
    },
  });

  await db.auditLog.create({
    data: {
      actorId: guard.session.user.id,
      actorRole: "ADMIN",
      action: action === "APPROVE" ? "LISTING_APPROVED" : "LISTING_REJECTED",
      entityType: "Property",
      entityId: property.id,
    },
  });

  return NextResponse.json({ ok: true });
}
