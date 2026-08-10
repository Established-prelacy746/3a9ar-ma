import type { PropertyCategory, PropertyType, TransactionType } from "@prisma/client";
import type { RawListingCard, ScrapedListing } from "./types";

export function parsePrice(text: string | undefined): number | undefined {
  if (!text) return undefined;
  const cleaned = text.replace(/[^\d.,\s]/g, "").trim();
  if (!cleaned) return undefined;
  const num = parseFloat(cleaned.replace(/[\s\u00A0]/g, "").replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(num) || num <= 0) return undefined;
  if (num >= 999_999_999_999) return undefined;
  return num;
}

export function detectTransaction(url: string | undefined, title?: string): TransactionType {
  const haystack = `${url ?? ""} ${title ?? ""}`.toLowerCase();
  if (/(a-louer|location|rent|louer)/.test(haystack)) return "RENT";
  if (/(a-vendre|vente|sale|sell)/.test(haystack)) return "SALE";
  return "SALE";
}

export type CategoryTypeGuess = {
  category: PropertyCategory;
  type: PropertyType;
};

export function detectCategoryAndType(url: string | undefined, title?: string): CategoryTypeGuess {
  const haystack = `${url ?? ""} ${title ?? ""}`.toLowerCase();

  if (/\briad\b|\bryad\b/.test(haystack) && !/\bappartement\b|\bmaison\b|\bville\b|\bvilla\b|\bterrain\b|\bimmeuble\b/.test(haystack)) return { category: "RESIDENTIAL", type: "RIAD" };
  if (/ferme|ferm/.test(haystack)) return { category: "LAND", type: "FERME" };
  if (/lotissement/.test(haystack)) return { category: "LAND", type: "LOTISSEMENT" };
  if (/terrain-agricole|agricole/.test(haystack))
    return { category: "LAND", type: "TERRAIN_AGRICOLE" };
  if (/terrain/.test(haystack)) return { category: "LAND", type: "TERRAIN_CONSTRUCTIBLE" };
  if (/bureaux|bureau/.test(haystack)) return { category: "COMMERCIAL", type: "BUREAUX" };
  if (/local|commercial|commerce|boutique|magasin/.test(haystack))
    return { category: "COMMERCIAL", type: "MAGASIN" };
  if (/villa|villas/.test(haystack)) return { category: "RESIDENTIAL", type: "VILLA" };
  if (/maison|appartement|apartment/.test(haystack))
    return { category: "RESIDENTIAL", type: "APARTMENT" };

  return { category: "RESIDENTIAL", type: "APARTMENT" };
}

function inferNumeric(
  parts: string[],
  patterns: { label: string; regex: RegExp; limit?: number }[],
): number | undefined {
  for (const { label, regex, limit } of patterns) {
    if (!parts.some((p) => p.toLowerCase().includes(label))) continue;
    for (const part of parts) {
      const m = regex.exec(part);
      if (m) {
        const v = parseInt(m[1], 10);
        if (limit != null && v > limit) return undefined;
        if (Number.isFinite(v) && v > 0) return v;
      }
    }
  }
  return undefined;
}

function inferFurnished(parts: string[]): boolean {
  return parts.some((p) => /meuble|furnished|decor|équipé/.test(p.toLowerCase()));
}

export type NormalizeContext = {
  url: string;
  sourceUrl: string;
};

const REAL_ESTATE_URL_SEGMENTS = [
  "appartements", "terrains", "villas", "maisons", "riads", "bureaux",
  "magasins", "locaux", "fermes", "lotissements", "immeubles",
];

const MUBAWAB_LISTING_PATH_RE = /^\/(?:fr|ar|en)\/(?:p?a)\/\d+\//;

function isRealEstateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();
    if (MUBAWAB_LISTING_PATH_RE.test(path)) return true;
    return REAL_ESTATE_URL_SEGMENTS.some((seg) => path.includes(seg));
  } catch {
    return false;
  }
}

const NON_REAL_ESTATE_TITLE_RE =
  /\b(?:bmw|porsche|mercedes|audi|volkswagen|toyota|hyundai|renault|peugeot|dacia|kia|ford|nissan|honda|suzuki|lexus|jaguar|land\s*rover|range\s*rover|cayenne|macan|tiguan|polo|golf|clio|duster|sandero|suv|berline|citadine|voiture|vehicule|scooter|moto|yamaha|harley|ducati|kawasaki|can-am|quad|atv|nacelle|chargeuse|bulldozer|excavateur|pelle|grue|bobcat|mini[- ]chargeuse|mini[- ]dumper|tractopelle|engin|machinisme|echafaudage|compacteur|concasseur|touret|compresseur|groupe\s*electrogene|perceuse|meuleuse|tronconneuse|scie|visseuse|ponceuse|aspirateur|nettoyeur|imprimante|scanner|manette|télécommande|iptv|dron?e|gopro|console|playstation|xbox|nintendo|wii|pc\s*gaming|clavier|souris|casque|enceinte|barre\s*de\s*son|téléviseur|écran|moniteur|ipad|iphone|samsung|galaxy|macbook|dell|lenovo|tablette|laptop|ordinateur|poussette|caftan|rob[eé]|bott[eé]|sac |bijou|montre|parfum|cosmétique|jouet|tapis|ménag|meuble|canapé|frigo|vélo|caravane|carrelage|peinture|plomberie|électrogen|opel|seat|skoda|citroen|fiat|alfa|maserati|ferrari|lamborghini|bentley|rolls|bugatti|mustang|camaro|corvette|tesla|chariot|dumper|defender|velar|range rover|vente.*tv|billets?\s*match|agence de voyage|mobilier|salon\s*marocain|vente\s*urgen|ville\s*à\s*vendre|café\s*à\s*vendre)\b/i;

const REAL_ESTATE_TITLE_RE =
  /\b(?:appartement|villa|terrain|maison|riad|bureau|magasin|local|immeuble|ferme|lotissement|duplex|studio|penthouse|patio|jardin|terrasse|balcon|garage|parking|cave|grenier|chambre|salle|séjour|salon|cuisine|sdb|salle\s*de\s*bain|surface|m²|m2|chambres|étage|vue\s*mer|piscine|meublé|non\s*meublé|locataire|propriétaire|investissement|occasion|neuf|louer|acheter|vente|vendre|à\s*vendre|en\s*vente|location|hectare|titre|titré|résidence)\b/i;

function isNonRealEstateTitle(title: string | undefined): boolean {
  if (!title) return false;
  if (NON_REAL_ESTATE_TITLE_RE.test(title)) return true;
  if (!REAL_ESTATE_TITLE_RE.test(title)) return true;
  return false;
}

export function normalizeCard(card: RawListingCard, ctx: NormalizeContext): Partial<ScrapedListing> | null {
  if (!card.externalId) return null;

  const url = card.href ?? ctx.sourceUrl;
  if (!isRealEstateUrl(url)) return null;
  if (isNonRealEstateTitle(card.title)) return null;

  const parts = (card.title ?? "").split(/[,·|]/).map((s) => s.trim()).filter(Boolean);
  const { category, type } = detectCategoryAndType(url, card.title);
  const transactionType = detectTransaction(url, card.title);
  const price = parsePrice(card.priceText);

  const plotAreaM2 =
    card.plotAreaM2 ??
    inferNumeric(parts, [{ label: "m²", regex: /(\d{2,})\s*m/i }]) ??
    inferNumeric(parts, [{ label: "m2", regex: /(\d{2,})\s*m2/i }]);

  const rooms =
    card.rooms ??
    inferNumeric(parts, [{ label: "chambres", regex: /(\d+)\s*chambres/i }]);
  const bathrooms =
    card.bathrooms ??
    inferNumeric(parts, [{ label: "sdb", regex: /(\d+)\s*sdb/i }]);
  const floorLevel = inferNumeric(parts, [{ label: "étage", regex: /(\d+)\s*(er|e|ième)?\s*étage/i }, { label: "etage", regex: /(\d+)\s*(er|e|ième)?\s*etage/i }]);

  return {
    externalId: card.externalId,
    externalUrl: url,
    title: card.title?.slice(0, 200) ?? "Bien immobilier",
    description: parts.join(", "),
    price,
    transactionType,
    rentFrequency: transactionType === "RENT" ? "monthly" : undefined,
    category,
    type,
    location: card.location ?? parts[parts.length - 1] ?? "",
    plotAreaM2,
    rooms,
    bathrooms,
    floorLevel,
    furnished: inferFurnished(parts),
    images: card.image ? [card.image] : [],
  };
}
