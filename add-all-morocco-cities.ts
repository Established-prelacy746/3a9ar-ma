import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Morocco's 12 administrative regions
const regions: { code: string; name: string; nameAr: string }[] = [
  { code: "TAN", name: "Tanger-Tétouan-Al Hoceïma", nameAr: "طنجة-تطوان-الحسيمة" },
  { code: "MKD", name: "Oriental", nameAr: "الجهة الشرقية" },
  { code: "FES", name: "Fès-Meknès", nameAr: "فاس-مكناس" },
  { code: "RAB", name: "Rabat-Salé-Kénitra", nameAr: "الرباط-سلا-القنيطرة" },
  { code: "BMK", name: "Béni Mellal-Khénifra", nameAr: "بني ملال-خنيفرة" },
  { code: "CAS", name: "Casablanca-Settat", nameAr: "الدار البيضاء-سطات" },
  { code: "MAR", name: "Marrakech-Safi", nameAr: "مراكش-آسفي" },
  { code: "DRA", name: "Drâa-Tafilalet", nameAr: "درعة-تافيلالت" },
  { code: "AGA", name: "Souss-Massa", nameAr: "سوس-ماسة" },
  { code: "GUE", name: "Guelmim-Oued Noun", nameAr: "كلميم-وادي نون" },
  { code: "LAAY", name: "Laâyoune-Sakia El Hamra", nameAr: "العيون-الساقية الحمراء" },
  { code: "DAK", name: "Dakhla-Oued Ed-Dahab", nameAr: "الداخلة-وادي الذهب" },
];

// All Moroccan cities/towns mapped to their region
// Format: [code, name, nameAr, regionCode, lat, lon]
const cities: [string, string, string, string, number, number][] = [
  // === Tanger-Tétouan-Al Hoceïma ===
  ["TAN", "Tanger", "طنجة", "TAN", 35.7595, -5.834],
  ["TET", "Tétouan", "تطوان", "TAN", 35.5889, -5.3626],
  ["HOCEIMA", "Al Hoceïma", "الحسيمة", "TAN", 35.2517, -3.9372],
  ["ASILAH", "Asilah", "الصويرة", "TAN", 35.4656, -6.0341],
  ["FNIDEQ", "Fnideq", "الفنيدق", "TAN", 35.8342, -5.3651],
  ["MARTIL", "Martil", "مارتيل", "TAN", 35.6163, -5.2769],
  ["KHEMIS", "Khemisset", "الخميسات", "TAN", 33.8244, -6.0664],
  ["OUEZZANE", "Ouazzane", "ورزازات", "TAN", 34.7961, -5.5847],
  ["SIDI_KACEM", "Sidi Kacem", "سيدي قاسم", "TAN", 34.2272, -5.6823],
  ["SIDI_SLIMANE", "Sidi Slimane", "سيدي سليمان", "TAN", 34.2625, -5.9264],
  ["LARACHE", "Larache", "العرائش", "TAN", 35.1932, -6.1560],
  ["AL HOCEIMA", "Al Hoceima", "الحسيمة", "TAN", 35.2517, -3.9372],
  ["IMZOUREN", "Imzouren", "امزورن", "TAN", 35.1417, -3.8650],
  ["BNI BOUKHTAR", "Bni Boukhtour", "بني بوعكثور", "TAN", 35.0667, -5.1667],
  ["TARGHA", "Targha", "تارغا", "TAN", 35.4833, -5.6667],
  ["ZARHLAT", "Zarhlat", "زرحلات", "TAN", 35.1333, -5.5000],

  // === Oriental ===
  ["OJD", "Oujda", "وجدة", "MKD", 34.6814, -1.9086],
  ["NAD", "Nador", "الناظور", "MKD", 35.1681, -2.9335],
  ["JERADA", "Jerada", "جرادة", "MKD", 34.3108, -3.1631],
  ["BERKANE", "Berkane", "بركان", "MKD", 34.9200, -2.3200],
  ["SAIDIA", "Saïdia", "السعيدية", "MKD", 35.0814, -2.1700],
  ["TAOURIRT", "Taourirt", "تاوريرت", "MKD", 34.4072, -3.0000],
  ["FIGUIG", "Figuig", "فكيك", "MKD", 32.1100, -1.2300],
  ["GUERBESSA", "Guerbessa", "الكرعة", "MKD", 32.8000, -1.0500],
  ["TAFOUGHALT", "Tafoughalt", "تافوغالت", "MKD", 34.9333, -2.9333],
  ["AIN_BNI_MATHAR", "Aïn Bni Mathar", "عين بني مضار", "MKD", 34.0833, -2.0333],
  ["OUED_AMLIL", "Oued Amlil", "وادي أمليل", "MKD", 33.9333, -3.7167],
  ["MIDELT", "Midelt", "ميدلت", "MKD", 32.6800, -4.7300],
  ["MISOUR", "Missour", "مسور", "MKD", 33.0500, -3.9833],
  ["AIN_EL_AIMAN", "Aïn Aïman", "عين عائمان", "MKD", 33.2833, -4.5667],
  ["ZAGO", "Zago", "زاكو", "MKD", 33.6333, -3.6000],
  ["TENDRARA", "Tendrara", "تندارة", "MKD", 33.0833, -2.0833],

  // === Fès-Meknès ===
  ["FES", "Fès", "فاس", "FES", 34.0181, -5.0078],
  ["MEK", "Meknès", "مكناس", "FES", 33.8935, -5.5473],
  ["IFRANE", "Ifrane", "إفران", "FES", 33.5272, -5.1109],
  ["TAOUNATE", "Taounate", "تاونات", "FES", 34.5371, -4.6398],
  ["MOULEY YACOUB", "Moulay Yacoub", "مولاي يعقوب", "FES", 34.0833, -5.1667],
  ["AIN_LEUH", "Aïn Leuh", "عين لوح", "FES", 33.2667, -5.1833],
  ["Boulmane", "Boulemane", "بولمان", "FES", 33.3667, -4.0667],
  ["IMOUZZER", "Imouzzer Kandar", "اموزار كاندار", "FES", 33.6833, -4.8667],
  ["SÉFROU", "Sefrou", "صفرو", "FES", 33.9333, -4.8333],
  ["RIBATE_EL_KHEIR", "Ribat El Kheir", " ribat الخير", "FES", 33.7667, -4.8500],
  ["TICHILA", "Tichilla", "تيشيلة", "FES", 33.4167, -4.4333],
  ["AZROU", "Azrou", "أزرو", "FES", 33.4333, -5.2167],
  ["TIMHADIT", "Timhadit", "تمحاديت", "FES", 33.3167, -5.1500],
  ["ENJIL", "Enjil", "نجيل", "FES", 34.3333, -5.0833],
  ["OUED_FRAS", "Oued Fras", "وادي فرس", "FES", 34.5833, -4.8667],
  ["MISOUR", "Missour", "مسور", "FES", 33.0500, -3.9833],
  ["AIN_TAOUJDATE", "Ain Taoujdate", "عين توجوجت", "FES", 34.0167, -5.0167],
  ["SIDI_HARAZEM", "Sidi Harazem", "سيدي حرازم", "FES", 34.0667, -4.8333],

  // === Rabat-Salé-Kénitra ===
  ["RAB", "Rabat", "الرباط", "RAB", 34.0209, -6.8416],
  ["SALE", "Salé", "سلا", "RAB", 34.0459, -6.8125],
  ["KENITRA", "Kénitra", "القنيطرة", "RAB", 34.2610, -6.5802],
  ["TEMARA", "Témara", "تمارة", "RAB", 33.9267, -6.9124],
  ["TIFLET", "Tiflet", "تيفلت", "RAB", 33.8941, -6.3065],
  ["BOUKNDEL", "Bouknadel", "بوعكادل", "RAB", 34.1326, -6.7391],
  ["SKHIRATE", "Skhirate", "الصخيرات", "RAB", 33.8612, -7.0306],
  ["TAMESNA", "Tamesna", "تمسنا", "RAB", 33.9200, -6.9600],
  ["SIDI_KACEM", "Sidi Kacem", "سيدي قاسم", "RAB", 34.2272, -5.6823],
  ["SIDI_SLIMANE", "Sidi Slimane", "سيدي سليمان", "RAB", 34.2625, -5.9264],
  ["KHENICHET", "Khenichet", "خنيشة", "RAB", 34.4833, -5.9167],
  ["SIDI_ALLAL_EL_Bahraoui", "Sidi Allal El Bahraoui", "سيدي علال البخاروي", "RAB", 34.0500, -5.5667],
  ["AIN_ATIK", "Ain Atig", "عين عتيق", "RAB", 33.9500, -6.8500],
  ["SIDI_BOUZID", "Sidi Bouzid", "سيدي بوزيد", "RAB", 33.8667, -6.9500],
  ["MEHDES", "Mehdes", "المهدس", "RAB", 33.9333, -6.9167],

  // === Béni Mellal-Khénifra ===
  ["BENIMELLAL", "Béni Mellal", "بني ملال", "BMK", 32.3373, -6.3498],
  ["KHOURIBGA", "Khouribga", "خريبكة", "BMK", 32.8811, -6.9063],
  ["KASBATADLA", "Kasba Tadla", "قصبة تادلة", "BMK", 32.6000, -6.2667],
  ["KHENIFRA", "Khenifra", "خنيفرة", "BMK", 32.9333, -5.6667],
  ["AZILAL", "Azilal", "أزيلال", "BMK", 31.9500, -6.5667],
  ["DEMNA", "Demnate", "دمت", "BMK", 31.7333, -7.0000],
  ["OUZAZATE", "Ouarzazate", "ورزازات", "BMK", 30.9197, -6.8933],
  ["ZAIDA", "Zaïda", "زايدة", "BMK", 32.6500, -5.3833],
  ["BENI_MELLAL", "Béni Mellal", "بني ملال", "BMK", 32.3373, -6.3498],
  ["FOUM_ZGUID", "Foum Zguid", "فم زكيد", "BMK", 30.4833, -6.8833],
  ["SIDI_JOULANI", "Sidi Joulani", "سيدي جولاني", "BMK", 32.4667, -6.2000],
  ["AIT_YAAZEM", "Ait Yaazem", "أيت يعزم", "BMK", 31.7667, -7.2500],
  ["BENI_MHEMED", "Béni Mhamed", "بني محمد", "BMK", 32.4500, -6.0333],
  ["OUED_ZEM", "Oued Zem", "وادي زم", "BMK", 32.8667, -6.5667],
  ["SIDI_SLIMANE_ECHCHARA", "Sidi Slimane Echchara", "سيدي سليمان الشراعة", "BMK", 32.8000, -6.6000],

  // === Casablanca-Settat ===
  ["CAS", "Casablanca", "الدار البيضاء", "CAS", 33.5731, -7.5898],
  ["MOHAMMEDIA", "Mohammedia", "المحمدية", "CAS", 33.6869, -7.3831],
  ["SETTAT", "Settat", "سطات", "CAS", 33.0010, -7.6168],
  ["ELJADIDA", "El Jadida", "الجديدة", "CAS", 33.2316, -8.5007],
  ["BERRECHID", "Berrechid", "برشيد", "CAS", 33.2659, -7.5878],
  ["BENSLIMANE", "Benslimane", "بنسليمان", "CAS", 33.6122, -7.1216],
  ["BOUZNIKA", "Bouznika", "بوزنيقة", "CAS", 33.7896, -7.1532],
  ["DARBOUAZZA", "Dar Bouazza", "دار بوعزة", "CAS", 33.5346, -7.6999],
  ["SIDIRAHAL", "Sidi Rahal", "سيدي رحال", "CAS", 33.4333, -7.5167],
  ["BOUSKOURA", "Bouskoura", "بسكورة", "CAS", 33.4486, -7.6483],
  ["NOUACEUR", "Nouaceur", "نوصر", "CAS", 33.3667, -7.5667],
  ["MOULAY_RCHID", "Moulay Rachid", "مولاي رشيد", "CAS", 33.5833, -7.5833],
  ["AIN_SBAA", "Ain Sebaâ", "عين السبع", "CAS", 33.6167, -7.5333],
  ["HAY_MOHAMMADI", "Hay Mohammadi", "حي محمدي", "CAS", 33.5667, -7.5667],
  ["ANFA", "Anfa", "أنفا", "CAS", 33.5700, -7.6300],
  ["MAARIF", "Maarif", "المعاريف", "CAS", 33.5833, -7.6000],
  ["GAUTHIER", "Gauthier", "غوتيي", "CAS", 33.5667, -7.6167],
  ["SIDI_MAAROUF", "Sidi Maarouf", "سيدي معروف", "CAS", 33.5333, -7.6000],
  ["BEN_MSIK", "Ben M'sik", "بن مسيك", "CAS", 33.5500, -7.5333],
  ["AIN_CHOCK", "Ain Chock", "عين الشق", "CAS", 33.5500, -7.5667],
  ["OULFA", "Oulfa", "الolfا", "CAS", 33.5500, -7.6000],
  ["SEFROU", "Sefrou", "صفرو", "CAS", 33.9333, -4.8333],
  ["MEKNASA", "Meknassa", "مكناسة", "CAS", 33.0500, -7.5167],
  ["ZEMAMRA", "Zemamra", "زمامرة", "CAS", 32.6167, -8.7167],
  ["LMISSAH", "Lmissah", "لمصاحة", "CAS", 32.7833, -8.4333],

  // === Marrakech-Safi ===
  ["MAR", "Marrakech", "مراكش", "MAR", 31.6295, -7.9811],
  ["SAFI", "Safi", "آسفي", "MAR", 32.2994, -9.2372],
  ["ESSAOUIRA", "Essaouira", "الصويرة", "MAR", 31.5085, -9.7595],
  ["CHICHAOUA", "Chichaoua", "شيشاوة", "MAR", 31.5333, -8.7667],
  ["EL_KELAA_DES_SAGHROUA", "El Kelaâ des Sraghna", "قلعة السراغنة", "MAR", 32.0500, -7.4000],
  ["SIDI_BENNOUR", "Sidi Bennour", "سيدي بنور", "MAR", 32.6500, -8.4333],
  ["YOUSSOUFIA", "Youssoufia", "اليوسفية", "MAR", 32.0667, -8.5333],
  ["RHAZER", "Rhazer", " rzazer", "MAR", 32.3167, -9.1333],
  ["SETTI_FATMA", "Setti Fatma", "ستي فاطمة", "MAR", 31.3333, -7.6333],
  ["AMIZMIZ", "Amizmiz", "أميزميز", "MAR", 31.2167, -8.2500],
  ["TAOUISSANT", "Taouissant", "TAOUISSANT", "MAR", 31.4833, -7.8833],
  ["OUED_EMMAN", "Oued Emman", "وادي أمان", "MAR", 31.7500, -8.5333],
  ["AIT_HRIZ", "Ait Hriz", "أيت حريز", "MAR", 31.1000, -8.9667],
  ["EL_GUERDANE", "El Guerdane", "الكردان", "MAR", 31.7333, -8.9500],
  ["BOUZNIKA", "Bouznika", "بوزنيقة", "MAR", 33.7896, -7.1532],

  // === Drâa-Tafilalet ===
  ["OUARZAZATE", "Ouarzazate", "ورزازات", "DRA", 30.9197, -6.8933],
  ["ERRACHIDIA", "Errachidia", "الراشيدية", "DRA", 31.9314, -4.4278],
  ["TINGHIR", "Tinghir", "تنغير", "DRA", 31.5167, -5.5333],
  ["TINEJDAD", "Tinejdad", "تنجداد", "DRA", 31.5667, -5.2667],
  ["GUELMIM", "Guelmim", "كلميم", "DRA", 28.9833, -10.0500],
  ["ZAGORA", "Zagora", "زاكورة", "DRA", 30.3306, -5.8364],
  ["TIZNIT", "Tiznit", "تيزنيت", "DRA", 29.7000, -9.1333],
  ["DRACHA", "Drâa", "درعة", "DRA", 30.3000, -5.9000],
  ["BOUMALNE_DADÈS", "Boumalne Dadès", "بومالن دادس", "DRA", 31.4500, -6.0500],
  ["TINEGHIR", "Tineghir", "تنغير", "DRA", 31.5167, -5.5333],
  ["MELNIIA", "Mellilja", "مليلجة", "DRA", 31.6167, -5.5000],
  ["IMELGHAS", "Imelghas", "أملش", "DRA", 31.5167, -5.1667],
  ["AIT_DAOUD", "Ait Daoud", "أيت داود", "DRA", 31.7833, -6.9667],
  ["AIT_BAHLOUL", "Ait Bahellou", "أيت بهلو", "DRA", 31.6667, -5.4333],
  ["JOURF", "Jorf", "جرف", "DRA", 31.1333, -4.3833],
  ["SIDI_IFNI", "Sidi Ifni", "سيدي إيفني", "DRA", 29.3833, -9.7833],
  ["TAFRAOUT", "Tafraout", "تافراوت", "DRA", 29.7333, -8.9833],
  ["MIDELT", "Midelt", "ميدلت", "DRA", 32.6800, -4.7300],
  ["MISOUR", "Missour", "مسور", "DRA", 33.0500, -3.9833],

  // === Souss-Massa ===
  ["AGA", "Agadir", "أكادير", "AGA", 30.4203, -9.5982],
  ["AIT_MELLOUL", "Ait Melloul", "أيت ملول", "AGA", 30.3500, -9.4833],
  ["INZEGANE", "Inzegane", "إنزكان", "AGA", 30.3667, -9.5333],
  ["TAROUDANT", "Taroudant", "تارودانت", "AGA", 30.4706, -8.8767],
  ["TAFOUGHALT", "Tafouhalt", "تافوغالت", "AGA", 30.1333, -9.0667],
  ["TIIZI_OUZZAL", "Tiizi Ouzzzal", "تيزي وزال", "AGA", 31.0667, -8.1500],
  ["IMINTANOUTE", "Imintanoute", "إيمينتانوت", "AGA", 30.9167, -8.8167],
  ["TIZNIT", "Tiznit", "تيزنيت", "AGA", 29.7000, -9.1333],
  ["SEMSOU", "Semsou", "سمسوم", "AGA", 30.2500, -9.3167],
  ["IGLI", "Igli", "إكلي", "AGA", 30.8167, -8.6333],
  ["TIAROUST", "Tiaroust", "تيروست", "AGA", 30.6667, -8.6000],
  ["AIT_SOUAB", "Ait Souab", "أيت صواب", "AGA", 30.3333, -8.4000],
  ["TAFETACHTE", "Tafetachte", "تفتاشت", "AGA", 30.3500, -9.6000],
  ["AOURIR", "Aourir", "أورير", "AGA", 30.4667, -9.6333],
  ["TAGHAZOUT", "Taghazout", "تغازوت", "AGA", 30.5500, -9.7000],
  ["AGLU", "Tafraoute", "تافراوت", "AGA", 29.7333, -8.9833],

  // === Guelmim-Oued Noun ===
  ["GUELMIM", "Guelmim", "كلميم", "GUE", 28.9833, -10.0500],
  ["SMARA", "Smara", "سمارة", "GUE", 26.7333, -11.6833],
  ["TAN-TAN", "Tan-Tan", "تان طان", "GUE", 28.4333, -13.1833],
  ["LAAYOUNE", "Laâyoune", "العيون", "GUE", 27.1536, -13.2033],
  ["BOUJDOUR", "Boujdour", "بوجدور", "GUE", 26.1333, -14.4833],
  ["ESSEMARA", "Es Semara", "الصامرة", "GUE", 26.7333, -11.6833],
  ["ASSA", "Assa", "آسا", "GUE", 28.6167, -9.4333],
  ["GUELTAT_SIDI_Youssef", "Goultat Sidi Youssef", "قلعة سيدي يوسف", "GUE", 28.6000, -10.0333],

  // === Laâyoune-Sakia El Hamra ===
  ["LAAYOUNE", "Laâyoune", "العيون", "LAAY", 27.1536, -13.2033],
  ["BIR_GANDOUS", "Bir Gandous", "بئر كندوز", "LAAY", 27.8833, -12.1500],
  ["TICHLA", "Tichla", "تيشلا", "LAAY", 26.6000, -12.5167],
  ["BUIZAKRANE", "Bouizarkane", "بويزكران", "LAAY", 27.5500, -12.9167],
  ["JARF_LJIR", "Jarf Ljir", "جرف الجير", "LAAY", 27.5000, -13.1667],
  ["OUED_DAHAB", "Oued Ed-Dahab", "وادي الذهب", "LAAY", 24.0000, -15.0000],

  // === Dakhla-Oued Ed-Dahab ===
  ["DAKHLA", "Dakhla", "الداخلة", "DAK", 23.7176, -15.9364],
  ["BIR_ANZARANE", "Bir Anzarane", "بئر أنزران", "DAK", 23.8833, -15.1333],
  ["AOUSSERD", "Aousserd", "أوسرد", "DAK", 22.5500, -13.0500],
  ["BOUJEADOR", "Boujdor", "بوجدور", "DAK", 26.1333, -14.4833],

  // Additional commonly-scraped cities
  ["MANSOURIA", "El Mansouria", "المنصورية", "CAS", 33.5667, -7.2833],
  ["HAD_SOUALEM", "Had Soualem", "حد سوالم", "CAS", 33.4500, -7.5500],
  ["DEROUA", "Deroua", "دروة", "CAS", 33.4167, -7.6167],
  ["ERRAHMA", "Errahma", "الرحمة", "CAS", 33.4833, -7.6833],
  ["AIN_CHEGGAG", "Ain Cheggag", "عين شكاك", "FES", 33.8833, -4.8500],
  ["ZAOUIA", "Zaouia", "الزاوية", "CAS", 33.5500, -7.4833],
  ["MIRLEFT", "Mirleft", "مرLfت", "AGA", 29.6833, -9.8167],
  ["EL_MENZEH", "El Menzeh", "المنزه", "RAB", 33.9500, -6.8667],
  ["OURIKA", "Ourika", "أوريكا", "MAR", 31.2167, -7.8167],
  ["SIDI_ABDALLAH_GHIAT", "Sidi Abdallah Ghiat", "سيدي عبد الله غيات", "MAR", 31.5167, -7.8500],
  ["SKOURA", "Skoura", "سكونة", "DRA", 31.0667, -6.5667],
  ["EL_MHAMID_EL_GHIZLANE", "M'hamid El Ghizlane", "محمد الغزلان", "DRA", 29.8167, -5.7167],
  ["ARFOUD", "Arfoud", "أرفود", "DRA", 31.4333, -4.2333],
  ["RISLANE", "Rislane", "ريسلاين", "DRA", 31.6333, -4.2667],
  ["GOURAMA", "Gourrama", "غرامة", "DRA", 32.0667, -4.1833],
  ["AL_OUATIA", "Al Ouati'a", "الوطية", "LAAY", 27.5167, -12.8500],
  ["SIDI_GHANEM", "Sidi Ghanem", "سيدي غانم", "MAR", 31.5500, -8.0500],
  ["AIT_HADDOU", "Ait Hadou", "أيت حدو", "MAR", 31.1500, -7.9500],
  ["BENI_ANSAR", "Beni Ansar", "بني أنصار", "MKD", 35.0833, -2.8833],
  ["AL_HOCEIMA", "Al Hoceïma", "الحسيمة", "TAN", 35.2517, -3.9372],
  ["AIT_MELLIL", "Ait Mellil", "أيتمليل", "AGA", 30.3500, -9.4833],
  ["OUED_LAOU", "Oued Laou", "وادي لو", "TAN", 35.4500, -5.6833],
  ["TAFOUGHALT", "Tafoughalt", "تافوغالت", "TAN", 34.9333, -2.9333],
  ["JAMAA_EL_KBIR", "Jamaa el Kbir", "الجامع الكبير", "MAR", 32.2167, -9.2000],
  ["SIDI_HAJJAJ", "Sidi Hajjaj", "سيدي حجاج", "CAS", 33.5833, -7.4333],
  ["OULD_RAHMOUNE", "Oulad Rahmoune", "أولاد رحمون", "CAS", 33.4833, -7.3833],
  ["OULD_DLALA", "Ould Dlala", "أولاد دلال", "CAS", 33.3833, -7.5167],
  ["LAMHARZA_ESSAHEL", "Lamharza Essahel", "لمرزى الصهيل", "CAS", 33.3833, -7.6333],
  ["GHMATE", "Ghmate", "غمات", "MAR", 31.5333, -7.7833],
  ["MELHA", "Mellaha", "ملحه", "CAS", 33.6333, -7.3167],
  ["ZARANGA", "Zaranga", "زارانقة", "CAS", 33.4667, -7.3833],
  ["AIN_EL_HAYAT", "Ain el Hayat", "عين الحياة", "RAB", 33.9000, -6.9667],
  ["BENI_YAKHLEF", "Béni Yakhlef", "بني يخلف", "CAS", 33.5167, -7.4667],
  ["DRARGUA", "Drargua", "درڭار", "AGA", 30.3833, -9.4500],
  ["NOUN", "Noun", "نون", "GUE", 29.1667, -10.1833],
  ["TAFRAOUT", "Tafraoute", "تافراوت", "AGA", 29.7333, -8.9833],
  ["AZEMMOUR", "Azemmour", "أزمور", "CAS", 33.2833, -8.3333],
  ["OUALIDIA", "Oualidial", "الواضية", "CAS", 32.8833, -9.0167],
  ["EL_MANSOURIA", "El Mansouria", "المنصورية", "CAS", 33.5667, -7.2833],
  ["SIDI_TAIBI", "Sidi Taibi", "سيدي الطيبي", "RAB", 34.0833, -6.7333],
  ["MEHDIA", "Mehdia", "المهدية", "RAB", 34.2500, -6.3833],
  ["AIN_HARROUDA", "Ain Harrouda", "عينالحرودة", "CAS", 33.6333, -7.3333],
  ["SIDI_BOUZID", "Sidi Bouzid", "سيدي بوزيد", "CAS", 33.4500, -7.5167],
  ["AIN_TRIP", "Ain Tiri", "عين تيري", "CAS", 33.4833, -7.6333],
  ["EL_MAADIA", "El Maadia", "المعدية", "RAB", 33.9333, -6.8833],
];

async function main() {
  console.log("Adding all Morocco regions...");

  // Ensure all regions exist
  for (const r of regions) {
    await prisma.region.upsert({
      where: { code: r.code },
      update: { name: r.name, nameAr: r.nameAr },
      create: { code: r.code, name: r.name, nameAr: r.nameAr },
    });
  }
  console.log(`  ${regions.length} regions ready.`);

  console.log("Adding all Morocco cities...");

  let added = 0;
  let updated = 0;
  let skipped = 0;

  for (const [code, name, nameAr, regionCode, lat, lon] of cities) {
    try {
      const region = await prisma.region.findUnique({ where: { code: regionCode } });
      if (!region) {
        console.log(`  SKIP ${name}: region ${regionCode} not found`);
        skipped++;
        continue;
      }

      const existing = await prisma.city.findUnique({ where: { code } });
      if (existing) {
        // Update coordinates if missing
        if (!existing.latitude || !existing.longitude) {
          await prisma.city.update({
            where: { code },
            data: { latitude: lat, longitude: lon },
          });
          updated++;
        } else {
          skipped++;
        }
      } else {
        await prisma.city.create({
          data: {
            code,
            name,
            nameAr,
            regionId: region.id,
            latitude: lat,
            longitude: lon,
          },
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

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
