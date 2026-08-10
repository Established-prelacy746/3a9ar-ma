import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyWhatsAppSignature, WHATSAPP_VERIFY_TOKEN } from "@/lib/whatsapp";
import { whatsappQueue } from "@/lib/queues";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

interface WhatsAppWebhookPayload {
  entry: Array<{
    changes: Array<{
      value: {
        messaging_product: string;
        contacts?: Array<{ profile?: { name?: string }; wa_id: string }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          text?: { body: string };
          type?: string;
        }>;
        statuses?: Array<{
          id: string;
          status: string;
          timestamp: string;
        }>;
      };
      field: string;
    }>;
    id: string;
  }>;
}

export async function GET(request: Request) {
  // Rate limit webhook verification attempts
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rl = await rateLimit(`webhook:whatsapp:${ip}`, 5, 60);
  if (!rl.ok) {
    return new Response("Rate limited", { status: 429 });
  }

  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN && challenge) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Verification failed", { status: 403 });
}

export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifyWhatsAppSignature(raw, signature)) {
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 401 });
  }

  let payload: WhatsAppWebhookPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const jobPromises: Promise<unknown>[] = [];

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;

      for (const status of value.statuses ?? []) {
        await db.whatsAppLog.updateMany({
          where: { messageId: status.id },
          data: { status: status.status },
        });
      }

      for (const message of value.messages ?? []) {
        if (message.type === "text" && message.text?.body) {
          const contact = value.contacts?.find((c) => c.wa_id === message.from);
          jobPromises.push(
            whatsappQueue.add("wa.inbound", {
              messageId: message.id,
              from: message.from,
              text: message.text.body,
              profileName: contact?.profile?.name,
              timestamp: message.timestamp,
            }),
          );
        }
      }
    }
  }

  const results = await Promise.allSettled(jobPromises);

  // Log any failed queue operations
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(`WhatsApp queue job ${index} failed:`, result.reason);
    }
  });

  // Always acknowledge within 5s to prevent Meta retries.
  return NextResponse.json({ received: true });
}
