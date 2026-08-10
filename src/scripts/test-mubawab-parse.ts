import { readFileSync } from "node:fs";
import { parseListingCards } from "@/features/scraper/mubawab-parser";
import { normalizeCard } from "@/features/scraper/normalizer";

const html = readFileSync("C:/Users/OIHI/AppData/Local/Temp/opencode/mubawab_test.html", "utf8");
const cards = parseListingCards(html);

for (const card of cards) {
  const ctx = { url: card.href ?? "", sourceUrl: "" };
  const result = normalizeCard(card, ctx);
  if (!result) {
    console.log("NULL:", card.externalId, "|", card.title?.substring(0, 80), "|", card.priceText);
  }
}
console.log("\nTotal:", cards.length, "cards,", cards.filter(c => normalizeCard(c, { url: c.href ?? "", sourceUrl: "" })).length, "normalized OK");
