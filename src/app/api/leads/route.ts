import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { leadCreateSchema } from "@/lib/validations/payments";
import { whatsappQueue } from "@/lib/queues";
import { sendWhatsAppText } from "@/lib/whatsapp";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const rl = await rateLimit(`lead:${ip}`, 10, 60);
  if (!rl.ok) return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });

  const body = await request.json().catch(() => null);
  const parsed = leadCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY", details: parsed.error.flatten() }, { status: 422 });
  }

  let property = null;
  if (parsed.data.propertyId) {
    property = await db.property.findUnique({
      where: { id: parsed.data.propertyId },
      include: { owner: { select: { id: true, name: true, whatsappNumber: true } } },
    });
    if (!property || property.listingStatus !== "ACTIVE") {
      return NextResponse.json({ error: "PROPERTY_NOT_FOUND" }, { status: 404 });
    }
  }

  const lead = await db.lead.create({
    data: {
      propertyId: property?.id,
      buyerName: parsed.data.buyerName,
      buyerPhone: parsed.data.buyerPhone,
      buyerMessage: parsed.data.buyerMessage,
      cityName: parsed.data.cityName,
      agentId: property?.ownerId,
      channel: "WEBSITE",
    },
  });

  if (property?.owner.whatsappNumber) {
    const intro = `\u{1F4A1} Nouveau lead depuis 3A9AR.MA\n\n${lead.buyerName ? `\u{1F464} ${lead.buyerName}\n` : ""}\u{1F4F1} ${lead.buyerPhone}${lead.buyerMessage ? `\n\n\u{1F4AC} ${lead.buyerMessage}` : ""}${property ? `\n\n\u{1F3E2} ${property.title}` : ""}`;
    await whatsappQueue.add("wa.outbound", {
      to: property.owner.whatsappNumber,
      body: intro,
      leadId: lead.id,
    });
  }

  return NextResponse.json({ leadId: lead.id }, { status: 201 });
}
