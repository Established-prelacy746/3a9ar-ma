import { createHmac, timingSafeEqual } from "node:crypto";

export const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN ?? "";
export const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID ?? "";
export const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION ?? "v19.0";
export const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN ?? "";
export const WHATSAPP_BOT_NUMBER = process.env.WHATSAPP_BOT_WA_NUMBER ?? "";

const GRAPH_BASE = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;

function requireWhatsAppConfig() {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    throw new Error(
      "WhatsApp Cloud API is not configured: set WHATSAPP_TOKEN and WHATSAPP_PHONE_ID.",
    );
  }
}

export function verifyWhatsAppSignature(rawBody: string, signature: string | null): boolean {
  if (!signature || !WHATSAPP_TOKEN) return false;
  const expected = createHmac("sha256", WHATSAPP_TOKEN).update(rawBody).digest("hex");
  const received = signature.replace(/^sha256=/, "").toLowerCase();
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export interface WhatsAppTextMessage {
  messaging_product: "whatsapp";
  recipient_type?: "individual";
  to: string;
  type: "text";
  text: { body: string; preview_url?: boolean };
  context?: { message_id: string };
}

export async function sendWhatsAppMessage(message: WhatsAppTextMessage) {
  requireWhatsAppConfig();
  const res = await fetch(`${GRAPH_BASE}/${WHATSAPP_PHONE_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`WhatsApp Cloud API ${res.status}: ${body}`);
  }
  return res.json() as Promise<{ messages: { id: string }[] }>;
}

export function sendWhatsAppText(to: string, body: string, replyToMessageId?: string) {
  return sendWhatsAppMessage({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: { body, preview_url: true },
    context: replyToMessageId ? { message_id: replyToMessageId } : undefined,
  });
}

export interface DeepLinkContext {
  propertyId: string;
  title: string;
  priceMAD: number;
  slug: string;
  agentWhatsApp: string;
  url: string;
}

export function buildWhatsAppDeepLink(ctx: DeepLinkContext): string {
  const phone = ctx.agentWhatsApp.replace(/\D/g, "");
  // Sanitize title to prevent injection
  const sanitizedTitle = ctx.title.replace(/[*_~`[\]]/g, '\\$&');
  const text = [
    `*${sanitizedTitle}*`,
    `\u{1F4B0} ${new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 }).format(ctx.priceMAD)} MAD`,
    `\u{1F517} ${ctx.url}`,
    `\u{1F4AC} Ref: #${ctx.propertyId}`,
  ].join("\n");
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
