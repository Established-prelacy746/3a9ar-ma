import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { QUEUE_NAMES } from "@/lib/queues";
import { sendWhatsAppText } from "@/lib/whatsapp";
import { db } from "@/lib/db";
import { routeInboundMessage } from "@/features/whatsapp/engine/lead-router";

export interface WhatsAppInboundJob {
  messageId: string;
  from: string;
  text: string;
  profileName?: string;
}

export interface WhatsAppOutboundJob {
  to: string;
  body: string;
  replyToMessageId?: string;
  leadId?: string;
}

export const whatsappWorker = new Worker(
  QUEUE_NAMES.WHATSAPP,
  async (job) => {
    switch (job.name) {
      case "wa.inbound": {
        const data = job.data as WhatsAppInboundJob;
        const result = await routeInboundMessage(data);
        if (result.leadId) {
          await db.whatsAppLog.updateMany({
            where: { messageId: data.messageId },
            data: { leadId: result.leadId },
          });
        }
        return result;
      }
      case "wa.outbound": {
        const data = job.data as WhatsAppOutboundJob;
        const res = await sendWhatsAppText(data.to, data.body, data.replyToMessageId);
        const messageId = res.messages?.[0]?.id;
        await db.whatsAppLog.create({
          data: {
            messageId: messageId ?? `out-${Date.now()}`,
            direction: "OUTBOUND",
            fromPhone: process.env.WHATSAPP_PHONE_ID ?? null,
            toPhone: data.to,
            payload: { body: data.body },
            status: "sent",
            leadId: data.leadId,
          },
        });
        return res;
      }
      case "wa.status":
        return { handled: true };
      default:
        return { skipped: job.name };
    }
  },
  { connection: redis, concurrency: 10 },
);

whatsappWorker.on("failed", (job, err) => {
  console.error(`[whatsapp-worker] job ${job?.id} (${job?.name}) failed:`, err.message);
});
