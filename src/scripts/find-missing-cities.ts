import * as cheerio from "cheerio";
import { db } from "../lib/db";

async function findMissingCities() {
  const cities = await db.city.findMany({ select: { name: true } });
  const knownCities = new Set(cities.map((c) => c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")));

  const categories = [
    "https://www.mubawab.ma/fr/sc/appartements-a-vendre",
    "https://www.mubawab.ma/fr/sc/terrains-a-vendre",
    "https://www.mubawab.ma/fr/sc/maisons-a-vendre",
    "https://www.mubawab.ma/fr/sc/riads-a-vendre",
    "https://www.mubawab.ma/fr/sc/locaux-a-vendre",
  ];

  const allLocations = new Map<string, number>();

  for (const url of categories) {
    for (let page = 1; page <= 5; page++) {
      const pageUrl = page === 1 ? url : `${url}:p:${page}`;
      try {
        const res = await fetch(pageUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml",
            "Accept-Language": "fr-FR,fr;q=0.9",
          },
        });
        if (!res.ok) continue;
        const html = await res.text();
        const $ = cheerio.load(html);

        $(".listingBox").each((_, el) => {
          const location = $(el).find(".listingH3").text().trim();
          if (location) {
            const cityPart = location.split(",").pop()?.trim() || location;
            const normalized = cityPart.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (!knownCities.has(normalized)) {
              allLocations.set(cityPart, (allLocations.get(cityPart) || 0) + 1);
            }
          }
        });
      } catch {}
    }
  }

  console.log(`\n=== Missing cities (${allLocations.size}) ===`);
  const sorted = [...allLocations.entries()].sort((a, b) => b[1] - a[1]);
  for (const [name, count] of sorted) {
    console.log(`  ${name} (${count} listings)`);
  }
}

findMissingCities().catch(console.error);
