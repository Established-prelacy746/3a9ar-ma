import { MeiliSearch } from "meilisearch";

export const meilisearch = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST ?? "http://localhost:7700",
  apiKey: process.env.MEILISEARCH_MASTER_KEY,
});

export const PROPERTIES_INDEX = "properties";

export const MEILISEARCH_ENABLED = Boolean(process.env.MEILISEARCH_HOST);

export interface PropertySearchDoc {
  id: string;
  title: string;
  description: string;
  city: string;
  region: string;
  priceMAD: number;
  category: string;
  type: string;
  transactionType: string;
  isFeatured: boolean;
  latitude?: number | null;
  longitude?: number | null;
  _geo?: { lat: number; lng: number };
}

export async function upsertPropertyIndex(doc: PropertySearchDoc) {
  if (!MEILISEARCH_ENABLED) return;
  const index = meilisearch.index(PROPERTIES_INDEX);
  await index.updateSettings({
    filterableAttributes: ["category", "type", "transactionType", "city", "region", "isFeatured"],
    sortableAttributes: ["priceMAD"],
    searchableAttributes: ["title", "description", "city", "region"],
  });
  await index.addDocuments([{ ...doc, _geo: doc.latitude && doc.longitude ? { lat: doc.latitude, lng: doc.longitude } : undefined }]);
}

export async function deletePropertyIndex(id: string) {
  if (!MEILISEARCH_ENABLED) return;
  await meilisearch.index(PROPERTIES_INDEX).deleteDocument(id);
}
