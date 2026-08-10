import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const cityCoords: Record<string, [number, number]> = {
  AGA: [30.4203, -9.5982],
  ASILAH: [35.4656, -6.0341],
  BENIMELLAL: [32.3373, -6.3498],
  BENSLIMANE: [33.6122, -7.1216],
  BERRECHID: [33.2659, -7.5878],
  BOUKNADEL: [34.1326, -6.7391],
  BOUSKOURA: [33.4486, -7.6483],
  BOUZNIKA: [33.7896, -7.1532],
  CAS: [33.5731, -7.5898],
  DARBOUAZZA: [33.5346, -7.6999],
  ELJADIDA: [33.2316, -8.5007],
  ESSAOUIRA: [31.5085, -9.7595],
  FES: [34.0181, -5.0078],
  FNIDEQ: [35.8342, -5.3651],
  IFRANE: [33.5272, -5.1109],
  KASBATADLA: [32.6, -6.2667],
  KENITRA: [34.261, -6.5802],
  KHOURIBGA: [32.8811, -6.9063],
  MAR: [31.6295, -7.9811],
  MARTIL: [35.6163, -5.2769],
  MEK: [33.8935, -5.5473],
  MOHAMMEDIA: [33.6869, -7.3831],
  NAD: [35.1681, -2.9335],
  OJD: [34.6814, -1.9086],
  RAB: [34.0209, -6.8416],
  SAFI: [32.2994, -9.2372],
  SALE: [34.0459, -6.8125],
  SETTAT: [33.001, -7.6168],
  SKHIRATE: [33.8612, -7.0306],
  TAN: [35.7595, -5.834],
  TAOUNATE: [34.5371, -4.6398],
  TEMARA: [33.9267, -6.9124],
  TET: [35.5889, -5.3626],
  TIFLET: [33.8941, -6.3065],
};

const regions = [
  {
    code: "CAS",
    name: "Casablanca-Settat",
    nameAr: "الدار البيضاء-سطات",
    cities: [
      { code: "CAS", name: "Casablanca", nameAr: "الدار البيضاء", neighborhoods: [
        { code: "ANFA", name: "Anfa", nameAr: "أنفا" },
        { code: "MAARIF", name: "Maarif", nameAr: "المعاريف" },
        { code: "GAUTHIER", name: "Gauthier", nameAr: "غوتيي" },
        { code: "BEN_MSIK", name: "Ben M'sik", nameAr: "بن مسيك" },
        { code: "SIDI_MAAROUF", name: "Sidi Maarouf", nameAr: "سيدي معروف" },
      ] },
      { code: "MOHAMMEDIA", name: "Mohammedia", nameAr: "المحمدية", neighborhoods: [] },
    ],
  },
  {
    code: "MAR",
    name: "Marrakech-Safi",
    nameAr: "مراكش-آسفي",
    cities: [
      { code: "MAR", name: "Marrakech", nameAr: "مراكش", neighborhoods: [
        { code: "GUELIZ", name: "Gueliz", nameAr: "كليز" },
        { code: "HIVERNAGE", name: "Hivernage", nameAr: "الحي الشتوي" },
        { code: "PALMERAIE", name: "Palmeraie", nameAr: "النخيل" },
        { code: "MEDINA", name: "Médina", nameAr: "المدينة القديمة" },
        { code: "OURIKA", name: "Route d'Ourika", nameAr: "طريق أوريكا" },
      ] },
    ],
  },
  {
    code: "FES",
    name: "Fès-Meknès",
    nameAr: "فاس-مكناس",
    cities: [
      { code: "FES", name: "Fès", nameAr: "فاس", neighborhoods: [
        { code: "VILLE_NOUVELLE", name: "Ville Nouvelle", nameAr: "المدينة الجديدة" },
        { code: "ROUTE_IMAOUAREN", name: "Route d'Imaouaren", nameAr: "طريق إيموازارن" },
      ] },
      { code: "MEK", name: "Meknès", nameAr: "مكناس", neighborhoods: [] },
    ],
  },
  {
    code: "RAB",
    name: "Rabat-Salé-Kénitra",
    nameAr: "الرباط-سلا-القنيطرة",
    cities: [
      { code: "RAB", name: "Rabat", nameAr: "الرباط", neighborhoods: [
        { code: "AGDAL", name: "Agdal", nameAr: "أكدال" },
        { code: "HAY_RIAO", name: "Hay Riad", nameAr: "حي الرياض" },
        { code: "SUISSE", name: "Souissi", nameAr: "السويسي" },
      ] },
      { code: "SALE", name: "Salé", nameAr: "سلا", neighborhoods: [] },
    ],
  },
  {
    code: "TAN",
    name: "Tanger-Tétouan-Al Hoceïma",
    nameAr: "طنجة-تطوان-الحسيمة",
    cities: [
      { code: "TAN", name: "Tanger", nameAr: "طنجة", neighborhoods: [
        { code: "MALABATA", name: "Malabata", nameAr: "ملاباطا" },
        { code: "GUEZIRA", name: "El Guezira", nameAr: "الجزيرة" },
      ] },
      { code: "TET", name: "Tétouan", nameAr: "تطوان", neighborhoods: [] },
    ],
  },
  {
    code: "AGA",
    name: "Souss-Massa",
    nameAr: "سوس-ماسة",
    cities: [
      { code: "AGA", name: "Agadir", nameAr: "أكادير", neighborhoods: [
        { code: "TALBORJT", name: "Talborjt", nameAr: "تالبورجت" },
        { code: "HAY_MOHAMMADI", name: "Hay Mohammadi", nameAr: "حي محمدي" },
      ] },
    ],
  },
  {
    code: "MKD",
    name: "Oriental",
    nameAr: "الجهة الشرقية",
    cities: [
      { code: "OJD", name: "Oujda", nameAr: "وجدة", neighborhoods: [] },
      { code: "NAD", name: "Nador", nameAr: "الناظور", neighborhoods: [] },
    ],
  },
];

const amenities = [
  { slug: "elevator", label: "Elevator", labelAr: "مصعد", icon: "move-up" },
  { slug: "pool", label: "Swimming Pool", labelAr: "مسبح", icon: "waves" },
  { slug: "terrace", label: "Terrace", labelAr: "تراس", icon: "sun" },
  { slug: "parking", label: "Parking", labelAr: "موقف سيارات", icon: "car" },
  { slug: "security", label: "Security Guard", labelAr: "حراسة", icon: "shield" },
  { slug: "furnished", label: "Furnished", labelAr: "مفروشة", icon: "sofa" },
  { slug: "garden", label: "Garden", labelAr: "حديقة", icon: "tree" },
  { slug: "air_conditioning", label: "Air Conditioning", labelAr: "تكييف", icon: "snowflake" },
  { slug: "central_heating", label: "Central Heating", labelAr: "تدفئة مركزية", icon: "flame" },
];

const packages = [
  { name: "Featured 7 days", type: "FEATURED", priceMAD: "150", durationDays: 7, listingCredits: null },
  { name: "Featured 14 days", type: "FEATURED", priceMAD: "250", durationDays: 14, listingCredits: null },
  { name: "Featured 30 days", type: "FEATURED", priceMAD: "450", durationDays: 30, listingCredits: null },
  { name: "Top Banner 30 days", type: "TOP_BANNER", priceMAD: "1500", durationDays: 30, listingCredits: null },
  { name: "Agent Starter", type: "AGENT_SUBSCRIPTION", priceMAD: "99", durationDays: 30, listingCredits: 5 },
  { name: "Agent Pro", type: "AGENT_SUBSCRIPTION", priceMAD: "249", durationDays: 30, listingCredits: 20 },
  { name: "Agency", type: "AGENT_SUBSCRIPTION", priceMAD: "599", durationDays: 30, listingCredits: 100 },
];

async function main() {
  console.log("Seeding base data...");

  for (const region of regions) {
    await prisma.region.upsert({
      where: { code: region.code },
      update: { name: region.name, nameAr: region.nameAr },
      create: { code: region.code, name: region.name, nameAr: region.nameAr },
    });
    for (const city of region.cities) {
      await prisma.city.upsert({
        where: { code: city.code },
        update: {
          name: city.name,
          nameAr: city.nameAr,
          regionId: (await prisma.region.findUniqueOrThrow({ where: { code: region.code } })).id,
          latitude: cityCoords[city.code]?.[0] ?? null,
          longitude: cityCoords[city.code]?.[1] ?? null,
        },
        create: {
          code: city.code,
          name: city.name,
          nameAr: city.nameAr,
          regionId: (await prisma.region.findUniqueOrThrow({ where: { code: region.code } })).id,
          latitude: cityCoords[city.code]?.[0] ?? null,
          longitude: cityCoords[city.code]?.[1] ?? null,
        },
      });
      for (const nb of city.neighborhoods) {
        const c = await prisma.city.findUniqueOrThrow({ where: { code: city.code } });
        await prisma.neighborhood.upsert({
          where: { code: nb.code },
          update: { name: nb.name, nameAr: nb.nameAr, cityId: c.id },
          create: { code: nb.code, name: nb.name, nameAr: nb.nameAr, cityId: c.id },
        });
      }
    }
  }

  for (const a of amenities) {
    await prisma.amenity.upsert({
      where: { slug: a.slug },
      update: { label: a.label, labelAr: a.labelAr, icon: a.icon },
      create: { slug: a.slug, label: a.label, labelAr: a.labelAr, icon: a.icon },
    });
  }

  for (const p of packages) {
    await prisma.packagePlan.upsert({
      where: { id: `${p.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: { priceMAD: p.priceMAD, durationDays: p.durationDays ?? undefined, listingCredits: p.listingCredits ?? undefined },
      create: {
        id: `${p.name.toLowerCase().replace(/\s+/g, "-")}`,
        name: p.name,
        type: p.type as never,
        priceMAD: p.priceMAD,
        durationDays: p.durationDays ?? undefined,
        listingCredits: p.listingCredits ?? undefined,
        isActive: true,
      },
    });
  }

  const adminPassword = await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD ?? "ChangeMe!2024", 12);
  const agentPassword = await bcrypt.hash("Agent@12345", 12);

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_SEED_EMAIL ?? "admin@ar3ar.ma" },
    update: {},
    create: {
      email: process.env.ADMIN_SEED_EMAIL ?? "admin@ar3ar.ma",
      name: "Platform Super Admin",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      isVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "agent.demo@ar3ar.ma" },
    update: {},
    create: {
      email: "agent.demo@ar3ar.ma",
      name: "Karim Alami",
      phone: "212661000000",
      whatsappNumber: "212661000000",
      whatsappOptIn: true,
      passwordHash: agentPassword,
      role: Role.AGENT,
      isVerified: true,
      agencyName: "Alami Immobilier",
    },
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
