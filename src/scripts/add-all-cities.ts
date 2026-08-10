import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const regions: { code: string; name: string; nameAr: string }[] = [
  { code: "TAN", name: "Tanger-Tetouan-Al Hoceima", nameAr: "Tanger-Tetouan" },
  { code: "MKD", name: "Oriental", nameAr: "Oriental" },
  { code: "FES", name: "Fes-Meknes", nameAr: "Fes-Meknes" },
  { code: "RAB", name: "Rabat-Sale-Kenitra", nameAr: "Rabat-Sale-Kenitra" },
  { code: "BMK", name: "Beni Mellal-Khenifra", nameAr: "Beni Mellal-Khenifra" },
  { code: "CAS", name: "Casablanca-Settat", nameAr: "Casablanca-Settat" },
  { code: "MAR", name: "Marrakech-Safi", nameAr: "Marrakech-Safi" },
  { code: "DRA", name: "Draa-Tafilalet", nameAr: "Draa-Tafilalet" },
  { code: "AGA", name: "Souss-Massa", nameAr: "Souss-Massa" },
  { code: "GUE", name: "Guelmim-Oued Noun", nameAr: "Guelmim-Oued Noun" },
  { code: "LAAY", name: "Laayoune-Sakia El Hamra", nameAr: "Laayoune-Sakia El Hamra" },
  { code: "DAK", name: "Dakhla-Oued Ed-Dahab", nameAr: "Dakhla-Oued Ed-Dahab" },
];

const cities: [string, string, string, string, number, number][] = [
  ["TAN", "Tanger", "Tanger", "TAN", 35.7595, -5.834],
  ["TET", "Tetouan", "Tetouan", "TAN", 35.5889, -5.3626],
  ["HOCEIMA", "Al Hoceima", "Al Hoceima", "TAN", 35.2517, -3.9372],
  ["ASILAH", "Asilah", "Asilah", "TAN", 35.4656, -6.0341],
  ["FNIDEQ", "Fnideq", "Fnideq", "TAN", 35.8342, -5.3651],
  ["MARTIL", "Martil", "Martil", "TAN", 35.6163, -5.2769],
  ["OUEZZANE", "Ouazzane", "Ouazzane", "TAN", 34.7961, -5.5847],
  ["SIDI_KACEM2", "Sidi Kacem", "Sidi Kacem", "TAN", 34.2272, -5.6823],
  ["SIDI_SLIMANE", "Sidi Slimane", "Sidi Slimane", "TAN", 34.2625, -5.9264],
  ["LARACHE", "Larache", "Larache", "TAN", 35.1932, -6.156],
  ["IMZOUREN", "Imzouren", "Imzouren", "TAN", 35.1417, -3.865],
  ["OUED_LAOU", "Oued Laou", "Oued Laou", "TAN", 35.45, -5.6833],
  ["TARGHA2", "Targha", "Targha", "TAN", 35.4833, -5.6667],
  ["KHEMIS2", "Khemisset", "Khemisset", "TAN", 33.8244, -6.0664],
  ["MNASRA", "Mnasra", "Mnasra", "TAN", 33.7167, -6.3333],
  ["SIDI_SLIMANE2", "Sidi Slimane", "Sidi Slimane", "TAN", 34.2625, -5.9264],

  ["OJD", "Oujda", "Oujda", "MKD", 34.6814, -1.9086],
  ["NAD", "Nador", "Nador", "MKD", 35.1681, -2.9335],
  ["JERADA", "Jerada", "Jerada", "MKD", 34.3108, -3.1631],
  ["BERKANE", "Berkane", "Berkane", "MKD", 34.92, -2.32],
  ["SAIDIA", "Saidia", "Saidia", "MKD", 35.0814, -2.17],
  ["TAOURIRT", "Taourirt", "Taourirt", "MKD", 34.4072, -3.0],
  ["FIGUIG", "Figuig", "Figuig", "MKD", 32.11, -1.23],
  ["MIDELT", "Midelt", "Midelt", "MKD", 32.68, -4.73],
  ["MISOUR", "Missour", "Missour", "MKD", 33.05, -3.9833],
  ["TAFOUGHALT2", "Tafoughalt", "Tafoughalt", "MKD", 34.9333, -2.9333],
  ["AIN_BNI_MATHAR", "Ain Bni Mathar", "Ain Bni Mathar", "MKD", 34.0833, -2.0333],
  ["BENI_ANSAR", "Beni Ansar", "Beni Ansar", "MKD", 35.0833, -2.8833],
  ["ZARANGA2", "Zaranga", "Zaranga", "MKD", 33.4667, -7.3833],
  ["TENDRARA", "Tendrara", "Tendrara", "MKD", 33.0833, -2.0833],
  ["AIN_RICH", "Ain Rich", "Ain Rich", "MKD", 34.35, -3.3833],
  ["SAIDI_MOUSSA", "Saidi Moussa", "Saidi Moussa", "MKD", 34.4667, -1.6],
  ["OUED_AMLIL", "Oued Amlil", "Oued Amlil", "MKD", 33.9333, -3.7167],

  ["FES", "Fes", "Fes", "FES", 34.0181, -5.0078],
  ["MEK", "Meknes", "Meknes", "FES", 33.8935, -5.5473],
  ["IFRANE", "Ifrane", "Ifrane", "FES", 33.5272, -5.1109],
  ["TAOUNATE", "Taounate", "Taounate", "FES", 34.5371, -4.6398],
  ["MOULEY_YACOUB", "Moulay Yacoub", "Moulay Yacoub", "FES", 34.0833, -5.1667],
  ["AIN_LEUH", "Ain Leuh", "Ain Leuh", "FES", 33.2667, -5.1833],
  ["SEFROU", "Sefrou", "Sefrou", "FES", 33.9333, -4.8333],
  ["AZROU", "Azrou", "Azrou", "FES", 33.4333, -5.2167],
  ["AIN_TAOUJDATE", "Ain Taoujdate", "Ain Taoujdate", "FES", 34.0167, -5.0167],
  ["AIN_CHEGGAG", "Ain Cheggag", "Ain Cheggag", "FES", 33.8833, -4.85],
  ["TIMHADIT", "Timhadit", "Timhadit", "FES", 33.3167, -5.15],
  ["BOUMANE", "Boulemane", "Boulemane", "FES", 33.3667, -4.0667],
  ["ENJIL", "Enjil", "Enjil", "FES", 34.3333, -5.0833],
  ["SIDI_HARAZEM", "Sidi Harazem", "Sidi Harazem", "FES", 34.0667, -4.8333],
  ["IMOUZER", "Imouzzer Kandar", "Imouzzer Kandar", "FES", 33.6833, -4.8667],

  ["RAB", "Rabat", "Rabat", "RAB", 34.0209, -6.8416],
  ["SALE", "Sale", "Sale", "RAB", 34.0459, -6.8125],
  ["KENITRA", "Kenitra", "Kenitra", "RAB", 34.261, -6.5802],
  ["TEMARA", "Temara", "Temara", "RAB", 33.9267, -6.9124],
  ["TIFLET", "Tiflet", "Tiflet", "RAB", 33.8941, -6.3065],
  ["BOUKNADEL", "Bouknadel", "Bouknadel", "RAB", 34.1326, -6.7391],
  ["SKHIRATE", "Skhirate", "Skhirate", "RAB", 33.8612, -7.0306],
  ["TAMESNA", "Tamesna", "Tamesna", "RAB", 33.92, -6.96],
  ["SIDI_SLIMANE3", "Sidi Slimane", "Sidi Slimane", "RAB", 34.2625, -5.9264],
  ["AIN_ATIG", "Ain Atig", "Ain Atig", "RAB", 33.95, -6.85],
  ["SIDI_BOUZID", "Sidi Bouzid", "Sidi Bouzid", "RAB", 33.8667, -6.95],
  ["EL_MENZEH", "El Menzeh", "El Menzeh", "RAB", 33.95, -6.86],
  ["AIN_EL_HAYAT", "Ain el Hayat", "Ain el Hayat", "RAB", 33.9, -6.96],
  ["SIDI_TAIBI", "Sidi Taibi", "Sidi Taibi", "RAB", 34.0833, -6.7333],
  ["MEHDIA", "Mehdia", "Mehdia", "RAB", 34.25, -6.3833],
  ["SIDI_ALLAL_BAHRAOUI", "Sidi Allal El Bahraoui", "Sidi Allal El Bahraoui", "RAB", 34.05, -5.5667],

  ["BENIMELLAL", "Beni Mellal", "Beni Mellal", "BMK", 32.3373, -6.3498],
  ["KHOURIBGA", "Khouribga", "Khouribga", "BMK", 32.8811, -6.9063],
  ["KASBATADLA", "Kasba Tadla", "Kasba Tadla", "BMK", 32.6, -6.2667],
  ["KHENIFRA", "Khenifra", "Khenifra", "BMK", 32.9333, -5.6667],
  ["AZILAL", "Azilal", "Azilal", "BMK", 31.95, -6.5667],
  ["DEMNA", "Demnate", "Demnate", "BMK", 31.7333, -7.0],
  ["OUZAZATE", "Ouarzazate", "Ouarzazate", "BMK", 30.9197, -6.8933],
  ["ZAIDA", "Zaida", "Zaida", "BMK", 32.65, -5.3833],
  ["OUED_ZEM", "Oued Zem", "Oued Zem", "BMK", 32.8667, -6.5667],
  ["AIT_YAAZEM", "Ait Yaazem", "Ait Yaazem", "BMK", 31.7667, -7.25],
  ["SIDI_JOULANI", "Sidi Joulani", "Sidi Joulani", "BMK", 32.4667, -6.2],

  ["CAS", "Casablanca", "Casablanca", "CAS", 33.5731, -7.5898],
  ["MOHAMMEDIA", "Mohammedia", "Mohammedia", "CAS", 33.6869, -7.3831],
  ["SETTAT", "Settat", "Settat", "CAS", 33.001, -7.6168],
  ["ELJADIDA", "El Jadida", "El Jadida", "CAS", 33.2316, -8.5007],
  ["BERRECHID", "Berrechid", "Berrechid", "CAS", 33.2659, -7.5878],
  ["BENSLIMANE", "Benslimane", "Benslimane", "CAS", 33.6122, -7.1216],
  ["BOUZNIKA", "Bouznika", "Bouznika", "CAS", 33.7896, -7.1532],
  ["DARBOUAZZA", "Dar Bouazza", "Dar Bouazza", "CAS", 33.5346, -7.6999],
  ["SIDIRAHAL", "Sidi Rahal", "Sidi Rahal", "CAS", 33.4333, -7.5167],
  ["BOUSKOURA", "Bouskoura", "Bouskoura", "CAS", 33.4486, -7.6483],
  ["NOUACEUR", "Nouaceur", "Nouaceur", "CAS", 33.3667, -7.5667],
  ["AZEMMOUR", "Azemmour", "Azemmour", "CAS", 33.2833, -8.3333],
  ["OUALIDIA", "Oualidia", "Oualidia", "CAS", 32.8833, -9.0167],
  ["HAD_SOUALEM", "Had Soualem", "Had Soualem", "CAS", 33.45, -7.55],
  ["DEROUA", "Deroua", "Deroua", "CAS", 33.4167, -7.6167],
  ["ERRAHMA", "Errahma", "Errahma", "CAS", 33.4833, -7.6833],
  ["MANSOURIA", "El Mansouria", "El Mansouria", "CAS", 33.5667, -7.2833],
  ["BENI_YAKHLEF", "Beni Yakhlef", "Beni Yakhlef", "CAS", 33.5167, -7.4667],
  ["LAMHARZA", "Lamharza Essahel", "Lamharza Essahel", "CAS", 33.3833, -7.6333],
  ["SIDI_HAJJAJ", "Sidi Hajjaj", "Sidi Hajjaj", "CAS", 33.5833, -7.4333],
  ["OULD_RAHMOUNE", "Oulad Rahmoune", "Oulad Rahmoune", "CAS", 33.4833, -7.3833],
  ["AIN_HARROUDA", "Ain Harrouda", "Ain Harrouda", "CAS", 33.6333, -7.3333],
  ["AIN_CHOCK", "Ain Chock", "Ain Chock", "CAS", 33.55, -7.5667],
  ["ZEMAMRA", "Zemamra", "Zemamra", "CAS", 32.6167, -8.7167],

  ["MAR", "Marrakech", "Marrakech", "MAR", 31.6295, -7.9811],
  ["SAFI", "Safi", "Safi", "MAR", 32.2994, -9.2372],
  ["ESSAOUIRA", "Essaouira", "Essaouira", "MAR", 31.5085, -9.7595],
  ["CHICHAOUA", "Chichaoua", "Chichaoua", "MAR", 31.5333, -8.7667],
  ["EL_KELAA", "El Kelaa des Sraghna", "El Kelaa des Sraghna", "MAR", 32.05, -7.4],
  ["SIDI_BENNOUR", "Sidi Bennour", "Sidi Bennour", "MAR", 32.65, -8.4333],
  ["YOUSSOUFIA", "Youssoufia", "Youssoufia", "MAR", 32.0667, -8.5333],
  ["SETTI_FATMA", "Setti Fatma", "Setti Fatma", "MAR", 31.3333, -7.6333],
  ["AMIZMIZ", "Amizmiz", "Amizmiz", "MAR", 31.2167, -8.25],
  ["SIDI_GHANEM", "Sidi Ghanem", "Sidi Ghanem", "MAR", 31.55, -8.05],
  ["OURIKA", "Ourika", "Ourika", "MAR", 31.2167, -7.8167],
  ["GHMATE", "Ghmate", "Ghmate", "MAR", 31.5333, -7.7833],
  ["EL_GUERDANE", "El Guerdane", "El Guerdane", "MAR", 31.7333, -8.95],
  ["JAMAA_EL_KBIR", "Jamaa el Kbir", "Jamaa el Kbir", "MAR", 32.2167, -9.2],

  ["ERRACHIDIA", "Errachidia", "Errachidia", "DRA", 31.9314, -4.4278],
  ["TINGHIR", "Tinghir", "Tinghir", "DRA", 31.5167, -5.5333],
  ["TINEJDAD", "Tinejdad", "Tinejdad", "DRA", 31.5667, -5.2667],
  ["ZAGORA", "Zagora", "Zagora", "DRA", 30.3306, -5.8364],
  ["TIZNIT", "Tiznit", "Tiznit", "DRA", 29.7, -9.1333],
  ["BOUMALNE_DADES", "Boumalne Dades", "Boumalne Dades", "DRA", 31.45, -6.05],
  ["ARFOUD", "Arfoud", "Arfoud", "DRA", 31.4333, -4.2333],
  ["GOURAMA", "Gourrama", "Gourrama", "DRA", 32.0667, -4.1833],
  ["SKOURA", "Skoura", "Skoura", "DRA", 31.0667, -6.5667],
  ["M_HAMID", "Mhamid El Ghizlane", "Mhamid El Ghizlane", "DRA", 29.8167, -5.7167],
  ["SIDI_IFNI", "Sidi Ifni", "Sidi Ifni", "DRA", 29.3833, -9.7833],
  ["TAFRAOUT", "Tafraout", "Tafraout", "DRA", 29.7333, -8.9833],
  ["DRACHA", "Draa", "Draa", "DRA", 30.3, -5.9],

  ["AGA", "Agadir", "Agadir", "AGA", 30.4203, -9.5982],
  ["AIT_MELLOUL", "Ait Melloul", "Ait Melloul", "AGA", 30.35, -9.4833],
  ["INZEGANE", "Inzegane", "Inzegane", "AGA", 30.3667, -9.5333],
  ["TAROUDANT", "Taroudant", "Taroudant", "AGA", 30.4706, -8.8767],
  ["TIIZI_OUZZAL", "Tiizi Ouzzal", "Tiizi Ouzzal", "AGA", 31.0667, -8.15],
  ["IMINTANOUTE", "Imintanoute", "Imintanoute", "AGA", 30.9167, -8.8167],
  ["AOURIR", "Aourir", "Aourir", "AGA", 30.4667, -9.6333],
  ["TAGHAZOUT", "Taghazout", "Taghazout", "AGA", 30.55, -9.7],
  ["TAFETACHTE", "Tafetachte", "Tafetachte", "AGA", 30.35, -9.6],
  ["DRARGUA", "Drargua", "Drargua", "AGA", 30.3833, -9.45],
  ["MIRLEFT", "Mirleft", "Mirleft", "AGA", 29.6833, -9.8167],
  ["TAFRAOUT2", "Tafraoute", "Tafraoute", "AGA", 29.7333, -8.9833],
  ["IGLI", "Igli", "Igli", "AGA", 30.8167, -8.6333],

  ["GUELMIM", "Guelmim", "Guelmim", "GUE", 28.9833, -10.05],
  ["TAN_TAN", "Tan Tan", "Tan Tan", "GUE", 28.4333, -13.1833],
  ["SMARA", "Smara", "Smara", "GUE", 26.7333, -11.6833],
  ["BOUJDOUR", "Boujdour", "Boujdour", "GUE", 26.1333, -14.4833],
  ["ASSA", "Assa", "Assa", "GUE", 28.6167, -9.4333],

  ["LAAYOUNE", "Laayoune", "Laayoune", "LAAY", 27.1536, -13.2033],
  ["BIR_GANDOUS", "Bir Gandous", "Bir Gandous", "LAAY", 27.8833, -12.15],
  ["TICHLA", "Tichla", "Tichla", "LAAY", 26.6, -12.5167],

  ["DAKHLA", "Dakhla", "Dakhla", "DAK", 23.7176, -15.9364],
  ["BIR_ANZARANE", "Bir Anzarane", "Bir Anzarane", "DAK", 23.8833, -15.1333],
  ["AOUSSERD", "Aousserd", "Aousserd", "DAK", 22.55, -13.05],

  // Additional cities from Mubawab scrape errors
  ["SIDI_ABDALLAH_GHIAT", "Sidi Abdallah Ghiat", "Sidi Abdallah Ghiat", "MAR", 31.5167, -7.85],
  ["AIT_HADDOU", "Ait Haddou", "Ait Haddou", "MAR", 31.15, -7.95],
  ["RISLANE", "Rislane", "Rislane", "DRA", 31.6333, -4.2667],
  ["AL_OUATIA", "Al Ouatiala", "Al Ouatiala", "LAAY", 27.5167, -12.85],
  ["EL_MAADIA", "El Maadia", "El Maadia", "RAB", 33.9333, -6.8833],
  ["OUED_FRAS", "Oued Fras", "Oued Fras", "FES", 34.5833, -4.8667],
  ["AIT_DAOUD", "Ait Daoud", "Ait Daoud", "DRA", 31.7833, -6.9667],
  ["JOURF", "Jorf", "Jorf", "DRA", 31.1333, -4.3833],
  ["RIBATE_EL_KHEIR", "Ribat El Kheir", "Ribat El Kheir", "FES", 33.7667, -4.85],
];

async function main() {
  console.log("Adding all Morocco regions...");
  for (const r of regions) {
    await prisma.region.upsert({
      where: { code: r.code },
      update: { name: r.name, nameAr: r.nameAr },
      create: { code: r.code, name: r.name, nameAr: r.nameAr },
    });
  }
  console.log(`  ${regions.length} regions ready.`);

  console.log("Adding all Morocco cities...");
  let added = 0, updated = 0, skipped = 0;
  const seenCodes = new Set<string>();

  for (const [code, name, nameAr, regionCode, lat, lon] of cities) {
    if (seenCodes.has(code)) continue;
    seenCodes.add(code);

    try {
      const region = await prisma.region.findUnique({ where: { code: regionCode } });
      if (!region) { skipped++; continue; }

      const existing = await prisma.city.findUnique({ where: { code } });
      if (existing) {
        if (!existing.latitude || !existing.longitude) {
          await prisma.city.update({ where: { code }, data: { latitude: lat, longitude: lon } });
          updated++;
        }
        skipped++;
      } else {
        await prisma.city.create({
          data: { code, name, nameAr, regionId: region.id, latitude: lat, longitude: lon },
        });
        added++;
      }
    } catch (e: any) {
      console.log(`  ERROR ${name}: ${e.message?.slice(0, 80)}`);
    }
  }

  console.log(`\nDone: ${added} added, ${updated} coords updated, ${skipped} skipped.`);
  const total = await prisma.city.count();
  console.log(`Total cities in DB: ${total}`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
