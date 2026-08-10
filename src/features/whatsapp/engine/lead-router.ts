import { db } from "@/lib/db";
import { sendWhatsAppText, buildWhatsAppDeepLink, WHATSAPP_BOT_NUMBER } from "@/lib/whatsapp";
import { formatMAD } from "@/lib/utils";
import { parseIntent, type ParsedIntent } from "@/features/whatsapp/engine/intent-parser";

export interface InboundMessage {
  messageId: string;
  from: string;
  text: string;
  profileName?: string;
}

export interface RouteResult {
  leadId: string | null;
  intent: ParsedIntent;
  reply: string;
}

export async function routeInboundMessage(msg: InboundMessage): Promise<RouteResult> {
  const intent = parseIntent(msg.text);

  await db.whatsAppLog.create({
    data: {
      messageId: msg.messageId,
      direction: "INBOUND",
      fromPhone: msg.from,
      toPhone: WHATSAPP_BOT_NUMBER || null,
      payload: { text: msg.text, profileName: msg.profileName, intent },
      status: "processed",
    },
  });

  let targetAgentId: string | undefined;
  let propertyRef: { id: string; slug: string } | null = null;

  if (intent.propertyRef) {
    propertyRef = await db.property.findFirst({
      where: { slug: intent.propertyRef },
      select: { id: true, slug: true },
    });
  }

  const recommendations = await findRecommendations(intent);

  if (propertyRef) {
    const property = await db.property.findUnique({
      where: { id: propertyRef.id },
      include: { owner: { select: { id: true, name: true, whatsappNumber: true } } },
    });
    if (property?.owner.whatsappNumber) targetAgentId = property.owner.id;
  } else if (recommendations.length > 0) {
    const owner = await db.user.findFirst({
      where: {
        id: { in: recommendations.map((r) => r.ownerId) },
        whatsappOptIn: true,
        whatsappNumber: { not: null },
      },
      select: { id: true },
    });
    targetAgentId = owner?.id;
  }

  const lead = await db.lead.create({
    data: {
      propertyId: propertyRef?.id ?? recommendations[0]?.id,
      buyerPhone: msg.from,
      buyerName: msg.profileName,
      buyerMessage: msg.text,
      agentId: targetAgentId,
      channel: "WHATSAPP",
      cityName: intent.cityName,
      budgetMAD: intent.budgetMax ?? null,
      sourceRef: msg.messageId,
    },
  });

  const reply = buildReply(msg, intent, recommendations, propertyRef);

  await sendWhatsAppText(msg.from, reply, msg.messageId);

  if (targetAgentId) {
    const agent = await db.user.findUnique({ where: { id: targetAgentId } });
    if (agent?.whatsappNumber) {
      const notice = [
        `\u{1F4A1} Lead WhatsApp reçu`,
        `\u{1F464} ${msg.profileName ?? "Anonyme"} · ${msg.from}`,
        `\u{1F4AC} "${msg.text.slice(0, 300)}"`,
        recommendations[0] ? `\u{1F3E2} ${recommendations[0].title} — ${formatMAD(recommendations[0].price)}` : "",
        `\u{1F517} /agent/leads/${lead.id}`,
      ]
        .filter(Boolean)
        .join("\n");
      await sendWhatsAppText(agent.whatsappNumber, notice);
    }
  }

  return { leadId: lead.id, intent, reply };
}

async function findRecommendations(intent: ParsedIntent) {
  const where: Record<string, unknown> = { listingStatus: "ACTIVE" };
  if (intent.transactionType) where.transactionType = intent.transactionType;
  if (intent.cityCode) where.city = { code: intent.cityCode };
  if (intent.budgetMin != null || intent.budgetMax != null) {
    const price: Record<string, number> = {};
    if (intent.budgetMax != null) price.lte = intent.budgetMax;
    if (intent.budgetMin != null) price.gte = intent.budgetMin * 0.6;
    where.price = price;
  }

  return db.property.findMany({
    where,
    include: {
      owner: { select: { id: true, whatsappNumber: true } },
      city: { select: { name: true } },
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 3,
  });
}

function buildReply(
  msg: InboundMessage,
  intent: ParsedIntent,
  recommendations: Awaited<ReturnType<typeof findRecommendations>>,
  propertyRef: { id: string; slug: string } | null,
): string {
  if (propertyRef) {
    const p = recommendations[0];
    if (p) {
      const link = buildWhatsAppDeepLink({
        propertyId: p.id,
        title: p.title,
        priceMAD: Number(p.price),
        slug: p.slug,
        agentWhatsApp: p.owner.whatsappNumber ?? WHATSAPP_BOT_NUMBER,
        url: `${process.env.APP_URL ?? "http://localhost:3000"}/properties/${p.slug}`,
      });
      return [
        `Merci ${msg.profileName ? `${msg.profileName} ` : ""}! Voici le bien que vous cherchez :`,
        ``,
        `\u{1F3E2} *${p.title}*`,
        `\u{1F4B0} ${formatMAD(p.price)}${p.city?.name ? ` · ${p.city.name}` : ""}`,
        ``,
        `Contactez directement l'agent : ${link}`,
        ``,
        `Réf: #${p.slug}`,
      ].join("\n");
    }
    return `Merci ! Ce bien n'est plus disponible, mais n'hésitez pas à me préciser votre ville et budget pour d'autres options.`;
  }

  if (recommendations.length === 0) {
    return [
      `Bonjour${msg.profileName ? ` ${msg.profileName}` : ""} 👋`,
      `Je suis le bot d'3A9AR.MA 🇲🇦`,
      `Dites-moi ce que vous cherchez, par exemple :`,
      `"Appartement à Casablanca pour 1.5 million"`,
      `"Terrain agricole à Marrakech"`,
      `ou "Ferme à vendre à Fès"`,
    ].join("\n");
  }

  const header = `Voici ${recommendations.length} biens correspondants à votre recherche :`;
  const body = recommendations
    .map((p, i) => {
      const link = buildWhatsAppDeepLink({
        propertyId: p.id,
        title: p.title,
        priceMAD: Number(p.price),
        slug: p.slug,
        agentWhatsApp: p.owner.whatsappNumber ?? WHATSAPP_BOT_NUMBER,
        url: `${process.env.APP_URL ?? "http://localhost:3000"}/properties/${p.slug}`,
      });
      return `${i + 1}. *${p.title}* · ${formatMAD(p.price)}${p.city?.name ? ` · ${p.city.name}` : ""}\n   ${link}`;
    })
    .join("\n\n");
  return [header, "", body, "", "Pour affiner, précisez ville, type et budget."].join("\n");
}
