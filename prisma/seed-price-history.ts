import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedPriceHistory() {
  console.log("Seeding price history data...");

  const properties = await prisma.property.findMany({
    where: { listingStatus: "ACTIVE" },
    select: { id: true, price: true, createdAt: true },
    take: 50,
  });

  for (const property of properties) {
    const basePrice = Number(property.price);
    const historyEntries = [];
    const monthsBack = 6 + Math.floor(Math.random() * 12); // 6-18 months

    for (let i = monthsBack; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);

      // Simulate price changes: -10% to +15% variation
      const variation = 1 + (Math.random() * 0.25 - 0.10);
      const price = Math.round(basePrice * variation);

      historyEntries.push({
        propertyId: property.id,
        price,
        recordedAt: date,
        source: i === 0 ? "listed" : "estimated",
      });
    }

    await prisma.priceHistory.createMany({
      data: historyEntries,
      skipDuplicates: true,
    });
  }

  console.log(`Seeded price history for ${properties.length} properties`);
}

async function seedNeighborhoodScores() {
  console.log("Seeding neighborhood scores...");

  const neighborhoods = await prisma.neighborhood.findMany({
    select: { id: true },
    take: 30,
  });

  for (const neighborhood of neighborhoods) {
    await prisma.neighborhoodScore.upsert({
      where: { neighborhoodId: neighborhood.id },
      create: {
        neighborhoodId: neighborhood.id,
        safety: 2 + Math.floor(Math.random() * 4),
        schools: 2 + Math.floor(Math.random() * 4),
        transport: 2 + Math.floor(Math.random() * 4),
        shopping: 2 + Math.floor(Math.random() * 4),
        nightlife: 2 + Math.floor(Math.random() * 4),
        greenery: 2 + Math.floor(Math.random() * 4),
        noise: 2 + Math.floor(Math.random() * 4),
        totalReviews: Math.floor(Math.random() * 50),
      },
      update: {},
    });
  }

  console.log(`Seeded scores for ${neighborhoods.length} neighborhoods`);
}

async function main() {
  try {
    await seedPriceHistory();
    await seedNeighborhoodScores();
    console.log("Done!");
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
