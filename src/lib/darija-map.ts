/**
 * Darija (Moroccan Arabic) to formal Arabic/French mapping for real estate search.
 * Maps ~100 common Darija terms to their formal equivalents.
 */

export interface DarijaMapping {
  formalArabic?: string;
  french?: string;
  english?: string;
  category?: "type" | "amenity" | "room" | "number" | "action" | "location" | "condition";
}

const darijaMap: Record<string, DarijaMapping> = {
  // Property types
  apartmnet: { formalArabic: "شقة", french: "APPARTMENT", english: "APARTMENT", category: "type" },
  apartman: { formalArabic: "شقة", french: "APPARTMENT", english: "APARTMENT", category: "type" },
  dar: { formalArabic: "فيلا", french: "VILLA", english: "VILLA", category: "type" },
  "dar kbir": { formalArabic: "فيلا كبيرة", french: "GRANDE VILLA", english: "LARGE VILLA", category: "type" },
  "dar sghir": { formalArabic: "فيلا صغيرة", french: "PETITE VILLA", english: "SMALL VILLA", category: "type" },
  riad: { formalArabic: "رياض", french: "RIAD", english: "RIAD", category: "type" },
  machya: { formalArabic: "شقة", french: "APPARTMENT", english: "APARTMENT", category: "type" },
  villa: { formalArabic: "فيلا", french: "VILLA", english: "VILLA", category: "type" },
  studio: { formalArabic: "ستوديو", french: "STUDIO", english: "STUDIO", category: "type" },
  terrin: { formalArabic: "أرض", french: "TERRAIN", english: "LAND", category: "type" },
  tiran: { formalArabic: "أرض", french: "TERRAIN", english: "LAND", category: "type" },
  "tiran bnyan": { formalArabic: "أرض بناء", french: "TERRAIN CONSTRUCTIBLE", english: "BUILDABLE LAND", category: "type" },
  t9adsiya: { formalArabic: "تجزئة", french: "LOTISSEMENT", english: "SUBDIVISION", category: "type" },
  local: { formalArabic: "محل تجاري", french: "LOCAL COMMERCIAL", english: "COMMERCIAL SPACE", category: "type" },
  maghazin: { formalArabic: "محل تجاري", french: "MAGASIN", english: "SHOP", category: "type" },
  maghan: { formalArabic: "محل تجاري", french: "MAGASIN", english: "SHOP", category: "type" },
  bureaux: { formalArabic: "مكاتب", french: "BUREAUX", english: "OFFICES", category: "type" },
  bordar: { formalArabic: "ضيعة", french: "FERME", english: "FARM", category: "type" },
  ferme: { formalArabic: "ضيعة", french: "FERME", english: "FARM", category: "type" },
  duplex: { formalArabic: "دوبلكس", french: "DUPLEX", english: "DUPLEX", category: "type" },
  penthouse: { formalArabic: "بنتهاوس", french: "PENTHOUSE", english: "PENTHOUSE", category: "type" },
  entrapot: { formalArabic: "مستودع", french: "ENTREPOT", english: "WAREHOUSE", category: "type" },

  // Amenities
  syblya: { formalArabic: "مسبح", french: "PISCINE", english: "SWIMMING_POOL", category: "amenity" },
  piscine: { formalArabic: "مسبح", french: "PISCINE", english: "SWIMMING_POOL", category: "amenity" },
  psina: { formalArabic: "مسبح", french: "PISCINE", english: "SWIMMING_POOL", category: "amenity" },
  baraka: { formalArabic: "حديقة", french: "JARDIN", english: "GARDEN", category: "amenity" },
  jardn: { formalArabic: "حديقة", french: "JARDIN", english: "GARDEN", category: "amenity" },
  jardin: { formalArabic: "حديقة", french: "JARDIN", english: "GARDEN", category: "amenity" },
  teras: { formalArabic: "تراس", french: "TERRASSE", english: "TERRACE", category: "amenity" },
  tarras: { formalArabic: "تراس", french: "TERRASSE", english: "TERRACE", category: "amenity" },
  balkon: { formalArabic: "شرفة", french: "BALCON", english: "BALCONY", category: "amenity" },
  blkun: { formalArabic: "شرفة", french: "BALCON", english: "BALCONY", category: "amenity" },
  ascnsor: { formalArabic: "مصعد", french: "ASCENSEUR", english: "ELEVATOR", category: "amenity" },
  asnsor: { formalArabic: "مصعد", french: "ASCENSEUR", english: "ELEVATOR", category: "amenity" },
  klma: { formalArabic: "تكييف", french: "CLIMATISATION", english: "AIR_CONDITIONING", category: "amenity" },
  tkiif: { formalArabic: "تكييف", french: "CLIMATISATION", english: "AIR_CONDITIONING", category: "amenity" },
  mfarsh: { formalArabic: "مفروش", french: "MEUBLE", english: "FURNISHED", category: "amenity" },
  mfroush: { formalArabic: "مفروش", french: "MEUBLE", english: "FURNISHED", category: "amenity" },
  aman: { formalArabic: "أمن", french: "SECURITE", english: "SECURITY", category: "amenity" },
  sccurite: { formalArabic: "أمن", french: "SECURITE", english: "SECURITY", category: "amenity" },
  gardian: { formalArabic: "حارس", french: "GARDIEN", english: "CONCIERGE", category: "amenity" },
  alarrm: { formalArabic: "إنذار", french: "ALARME", english: "ALARM", category: "amenity" },
  khamya: { formalArabic: "قبو", french: "CAVE", english: "WINE_CELLAR", category: "amenity" },
  chamin: { formalArabic: "مدفأة", french: "CHEMINEE", english: "FIREPLACE", category: "amenity" },
  bbq: { formalArabic: "شواية", french: "BARBECUE", english: "BBQ", category: "amenity" },
  parking: { formalArabic: "موقف سيارات", french: "PARKING", english: "PARKING", category: "amenity" },
  garaj: { formalArabic: "جراج", french: "GARAGE", english: "GARAGE", category: "amenity" },
  garage: { formalArabic: "جراج", french: "GARAGE", english: "GARAGE", category: "amenity" },

  // Rooms
  saln: { formalArabic: "صالة", french: "SALON", english: "LIVING_ROOM", category: "room" },
  kulina: { formalArabic: "مطبخ", french: "CUISINE", english: "KITCHEN", category: "room" },
  mitwam: { formalArabic: "غرفة طعام", french: "SALLE_A_MANGER", english: "DINING_ROOM", category: "room" },
  "bit nnm": { formalArabic: "غرفة نوم", french: "CHAMBRE", english: "BEDROOM", category: "room" },
  bit: { formalArabic: "غرفة", french: "PIECE", english: "ROOM", category: "room" },
  dush: { formalArabic: "حمام", french: "SALLE_DE_BAIN", english: "BATHROOM", category: "room" },
  skouna: { formalArabic: "حمام", french: "SALLE_DE_BAIN", english: "BATHROOM", category: "room" },
  buandri: { formalArabic: "غرفة غسيل", french: "BUANDERIE", english: "LAUNDRY", category: "room" },
  dressing: { formalArabic: "خزانة ملابس", french: "DRESSING", english: "WALK_IN_CLOSET", category: "room" },

  // Numbers
  wahd: { formalArabic: "1", french: "1", english: "1", category: "number" },
  jouj: { formalArabic: "2", french: "2", english: "2", category: "number" },
  thlata: { formalArabic: "3", french: "3", english: "3", category: "number" },
  tlata: { formalArabic: "3", french: "3", english: "3", category: "number" },
  thlet: { formalArabic: "3", french: "3", english: "3", category: "number" },
  arba3: { formalArabic: "4", french: "4", english: "4", category: "number" },
  khmsa: { formalArabic: "5", french: "5", english: "5", category: "number" },

  // Room combinations
  "thlet dob": { formalArabic: "3 غرف نوم", french: "3 CHAMBRES", english: "3 BEDROOMS", category: "room" },
  "tlta dob": { formalArabic: "3 غرف نوم", french: "3 CHAMBRES", english: "3 BEDROOMS", category: "room" },
  "tlata dob": { formalArabic: "3 غرف نوم", french: "3 CHAMBRES", english: "3 BEDROOMS", category: "room" },
  "jouj dob": { formalArabic: "2 غرف نوم", french: "2 CHAMBRES", english: "2 BEDROOMS", category: "room" },
  "zouj dob": { formalArabic: "2 غرف نوم", french: "2 CHAMBRES", english: "2 BEDROOMS", category: "room" },
  "arba3 dob": { formalArabic: "4 غرف نوم", french: "4 CHAMBRES", english: "4 BEDROOMS", category: "room" },
  "khmsa dob": { formalArabic: "5 غرف نوم", french: "5 CHAMBRES", english: "5 BEDROOMS", category: "room" },
  "thlet skhouna": { formalArabic: "3 حمامات", french: "3 SALLES_DE_BAIN", english: "3 BATHROOMS", category: "room" },
  "jouj skhouna": { formalArabic: "2 حمامات", french: "2 SALLES_DE_BAIN", english: "2 BATHROOMS", category: "room" },
  "wahd skhouna": { formalArabic: "حمام واحد", french: "1 SALLE_DE_BAIN", english: "1 BATHROOM", category: "room" },

  // Actions
  "bghit nchri": { formalArabic: "أريد الشراء", french: "JE_VEUX_ACHETER", english: "I_WANT_TO_BUY", category: "action" },
  "bghit nl3b": { formalArabic: "أريد الكراء", french: "JE_VEUX_LOUER", english: "I_WANT_TO_RENT", category: "action" },
  "bghit nchuf": { formalArabic: "أريد الزيارة", french: "JE_VEUX_VISITER", english: "I_WANT_TO_VISIT", category: "action" },
  chhal: { formalArabic: "كم", french: "COMBIEN", english: "HOW_MUCH", category: "action" },
  shhal: { formalArabic: "كم", french: "COMBIEN", english: "HOW_MUCH", category: "action" },
  "rani m3ndi": { formalArabic: "لدي", french: "JAI", english: "I_HAVE", category: "action" },
  "3ndi": { formalArabic: "لدي", french: "JAI", english: "I_HAVE", category: "action" },
  tfham: { formalArabic: "تفاوض", french: "NEGOCIER", english: "NEGOTIATE", category: "action" },
  ntaf9: { formalArabic: "نتفق", french: "SENTENDRE", english: "AGREE", category: "action" },
  zwj: { formalArabic: "زوج", french: "COUPLE", english: "COUPLE", category: "action" },
  "a3yz nshuf": { formalArabic: "أريد الاطلاع", french: "JE_VEUX_VOIR", english: "I_WANT_TO_SEE", category: "action" },

  // Location
  mdina: { formalArabic: "مدينة", french: "VILLE", english: "CITY", category: "location" },
  dayera: { formalArabic: "حي", french: "QUARTIER", english: "NEIGHBORHOOD", category: "location" },
  hay: { formalArabic: "حي", french: "QUARTIER", english: "NEIGHBORHOOD", category: "location" },
  qarya: { formalArabic: "قرية", french: "VILLAGE", english: "VILLAGE", category: "location" },
  mghrib: { formalArabic: "المغرب", french: "MAROC", english: "MOROCCO", category: "location" },
  casa: { formalArabic: "الدار البيضاء", french: "CASABLANCA", english: "CASABLANCA", category: "location" },
  dariba: { formalArabic: "الدار البيضاء", french: "CASABLANCA", english: "CASABLANCA", category: "location" },
  marrakch: { formalArabic: "مراكش", french: "MARRAKECH", english: "MARRAKECH", category: "location" },
  rabat: { formalArabic: "الرباط", french: "RABAT", english: "RABAT", category: "location" },
  fes: { formalArabic: "فاس", french: "FES", english: "FES", category: "location" },
  tanga: { formalArabic: "طنجة", french: "TANGER", english: "TANGIER", category: "location" },
  agadir: { formalArabic: "أكادير", french: "AGADIR", english: "AGADIR", category: "location" },

  // Condition
  jdide: { formalArabic: "جديد", french: "NEUF", english: "NEW", category: "condition" },
  "9dime": { formalArabic: "قديم", french: "ANCIEN", english: "OLD", category: "condition" },
  yrannwa: { formalArabic: "يحتاج تجديد", french: "A_RENOVER", english: "TO_RENOVATE", category: "condition" },
  zwin: { formalArabic: "جميل", french: "BEAU", english: "BEAUTIFUL", category: "condition" },
  kbir_cond: { formalArabic: "كبير", french: "GRAND", english: "LARGE", category: "condition" },
  sghir: { formalArabic: "صغير", french: "PETIT", english: "SMALL", category: "condition" },
  rakhiss: { formalArabic: "رخيص", french: "PAS_CHER", english: "AFFORDABLE", category: "condition" },
  ghali: { formalArabic: "غالي", french: "CHER", english: "EXPENSIVE", category: "condition" },
  mzyan: { formalArabic: "جيد", french: "BON", english: "GOOD", category: "condition" },

  // Price-related
  l3a9d: { formalArabic: "الcontract", french: "CONTRAT", english: "CONTRACT", category: "action" },
  thmen: { formalArabic: "الثمن", french: "PRIX", english: "PRICE", category: "action" },
  s3r: { formalArabic: "السعر", french: "PRIX", english: "PRICE", category: "action" },
  loyer: { formalArabic: "الكراء", french: "LOYER", english: "RENT", category: "action" },

  // View / Surroundings
  bshmel: { formalArabic: "إطلالة", french: "VUE", english: "VIEW", category: "amenity" },
  "bshml b7r": { formalArabic: "إطلالة بحرية", french: "VUE_MER", english: "SEA_VIEW", category: "amenity" },
  "bshml psina": { formalArabic: "إطلالة على المسبح", french: "VUE_PISCINE", english: "POOL_VIEW", category: "amenity" },
  "bshml jbal": { formalArabic: "إطلالة جبلية", french: "VUE_MONTAGNE", english: "MOUNTAIN_VIEW", category: "amenity" },
  "qrba lmdina": { formalArabic: "قرب وسط المدينة", french: "PRES_DU_CENTRE", english: "NEAR_CENTER", category: "amenity" },
  "qrba b7r": { formalArabic: "قرب الشاطئ", french: "PRES_DE_LA_PLAGE", english: "NEAR_BEACH", category: "amenity" },
  "3la b7r": { formalArabic: "على الشاطئ", french: "FRANCHISE", english: "BEACHFRONT", category: "amenity" },
  b7r: { formalArabic: "البحر", french: "MER", english: "SEA", category: "amenity" },

  // Floor / level
  dyrj: { formalArabic: "طابق", french: "ETAGE", english: "FLOOR", category: "room" },
  ttabq: { formalArabic: "الطابق", french: "LETAGE", english: "THE_FLOOR", category: "room" },
  "ttabq lard": { formalArabic: "الطابق الأرضي", french: "REZ_DE_CHAUSSEE", english: "GROUND_FLOOR", category: "room" },
  sssol: { formalArabic: "الطابق السفلي", french: "SOUS_SOL", english: "BASEMENT", category: "room" },

  // Common phrases
  "bghit n3rf": { formalArabic: "أريد معرفة", french: "JE_VEUX_SAVOIR", english: "I_WANT_TO_KNOW", category: "action" },
  "ach 3ndkum": { formalArabic: "ماذا لديكم", french: "QUAVEZ_VOUS", english: "WHAT_DO_YOU_HAVE", category: "action" },
  "ach 3ndkm": { formalArabic: "ماذا لديكم", french: "QUAVEZ_VOUS", english: "WHAT_DO_YOU_HAVE", category: "action" },
  "kaynchi": { formalArabic: "هل يوجد", french: "Y_A_T_IL", english: "IS_THERE", category: "action" },
  "kayn shi": { formalArabic: "هل يوجد شيء", french: "Y_A_T_IL_QUELQUE_CHOSE", english: "IS_THERE_SOMETHING", category: "action" },
  "mchiti": { formalArabic: "ذهبنا", french: "NOUS_SOMMES_ALLES", english: "WE_WENT", category: "action" },
  "3tini": { formalArabic: " أعطني", french: "DONNEZ_MOI", english: "GIVE_ME", category: "action" },
  arini: { formalArabic: "أريني", french: "MONTREZ_MOI", english: "SHOW_ME", category: "action" },
  "slmi 3liya": { formalArabic: "اطمئن", french: "RASSUREZ_MOI", english: "REASSURE_ME", category: "action" },
  chouf: { formalArabic: "انظر", french: "VOIR", english: "SEE", category: "action" },
  "dir m3aya": { formalArabic: "تفاوض معي", french: "NEGOCIEZ_AVEC_MOI", english: "NEGOTIATE_WITH_ME", category: "action" },
  sawb: { formalArabic: "صواب", french: "CORRECT", english: "CORRECT", category: "action" },
  la: { formalArabic: "لا", french: "NON", english: "NO", category: "action" },
  iye: { formalArabic: "نعم", french: "OUI", english: "YES", category: "action" },
  nsallah: { formalArabic: "إن شاء الله", french: "INSHA_ALLAH", english: "GOD_WILLING", category: "action" },
  inshallah: { formalArabic: "إن شاء الله", french: "INSHA_ALLAH", english: "GOD_WILLING", category: "action" },
  mashallah: { formalArabic: "ما شاء الله", french: "MASHA_ALLAH", english: "MASHA_ALLAH", category: "action" },
  bismillah: { formalArabic: "بسم الله", french: "BISMILLAH", english: "BISMILLAH", category: "action" },
};

/**
 * Look up a Darija term and return formal equivalents.
 */
export function lookupDarija(term: string): DarijaMapping | null {
  const normalized = term.toLowerCase().trim();
  return darijaMap[normalized] ?? null;
}

/**
 * Expand a search query by replacing Darija terms with formal equivalents.
 * Returns an array of expanded terms for search.
 */
export function expandDarijaSearch(query: string): string[] {
  const words = query.toLowerCase().trim().split(/\s+/);
  const expanded: string[] = [];

  for (const word of words) {
    const mapping = darijaMap[word];
    if (mapping) {
      if (mapping.french) expanded.push(mapping.french);
      if (mapping.formalArabic) expanded.push(mapping.formalArabic);
      if (mapping.english) expanded.push(mapping.english);
    } else {
      expanded.push(word);
    }
  }

  return expanded;
}

/**
 * Check if a query contains any Darija terms.
 */
export function hasDarijaTerms(query: string): boolean {
  const words = query.toLowerCase().trim().split(/\s+/);
  return words.some((w) => w in darijaMap);
}

export { darijaMap };
