export type TranslationLang = "FR" | "EN" | "AR";

const dict: Record<string, Record<TranslationLang, string>> = {
  // Property types
  apartment: { FR: "Appartement", EN: "Apartment", AR: "شقة" },
  villa: { FR: "Villa", EN: "Villa", AR: "فيلا" },
  riad: { FR: "Riad", EN: "Riad", AR: "رياض" },
  terrain: { FR: "Terrain", EN: "Land", AR: "أرض" },
  bureaux: { FR: "Bureaux", EN: "Offices", AR: "مكاتب" },
  magasin: { FR: "Magasin", EN: "Shop", AR: "محل تجاري" },
  ferme: { FR: "Ferme", EN: "Farm", AR: "ضيعة" },
  lotissement: { FR: "Lotissement", EN: "Subdivision", AR: "تجزئة" },
  studio: { FR: "Studio", EN: "Studio", AR: "ستوديو" },
  duplex: { FR: "Duplex", EN: "Duplex", AR: "دوبلكس" },
  penthouse: { FR: "Penthouse", EN: "Penthouse", AR: "بنتهاوس" },
  local_commercial: { FR: "Local commercial", EN: "Commercial space", AR: "محل تجاري" },
  bureau: { FR: "Bureau", EN: "Office", AR: "مكتب" },
  terrain_constructible: { FR: "Terrain constructible", EN: "Buildable land", AR: "أرض قابلة للبناء" },
  terrain_agricole: { FR: "Terrain agricole", EN: "Agricultural land", AR: "أرض فلاحية" },
  entrepot: { FR: "Entrepôt", EN: "Warehouse", AR: "مستودع" },
  parking: { FR: "Parking", EN: "Parking", AR: "موقف سيارات" },
  garage: { FR: "Garage", EN: "Garage", AR: "جراج" },

  // Transaction types
  vente: { FR: "Vente", EN: "Sale", AR: "بيع" },
  location: { FR: "Location", EN: "Rent", AR: "كراء" },
  achat: { FR: "Achat", EN: "Purchase", AR: "شراء" },

  // Amenities
  piscine: { FR: "Piscine", EN: "Swimming pool", AR: "مسبح" },
  jardin: { FR: "Jardin", EN: "Garden", AR: "حديقة" },
  terrasse: { FR: "Terrasse", EN: "Terrace", AR: "تراس" },
  balcon: { FR: "Balcon", EN: "Balcony", AR: "شرفة" },
  ascenseur: { FR: "Ascenseur", EN: "Elevator", AR: "مصعد" },
  parking_place: { FR: "Parking", EN: "Parking", AR: "موقف سيارات" },
  climatisation: { FR: "Climatisation", EN: "Air conditioning", AR: "تكييف" },
  chauffage: { FR: "Chauffage", EN: "Heating", AR: "تدفئة" },
  meuble: { FR: "Meublé", EN: "Furnished", AR: "مفروش" },
  securite: { FR: "Sécurité", EN: "Security", AR: "أمن" },
  gardien: { FR: "Gardien", EN: "Concierge", AR: "حارس" },
  alarme: { FR: "Alarme", EN: "Alarm", AR: "إنذار" },
  cameras: { FR: "Caméras", EN: "Cameras", AR: "كاميرات" },
  cave: { FR: "Cave", EN: "Wine cellar", AR: "قبو" },
  grenier: { FR: "Grenier", EN: "Attic", AR: "علية" },
  cheminee: { FR: "Cheminée", EN: "Fireplace", AR: "مدفأة" },
  bbq: { FR: "Barbecue", EN: "BBQ", AR: "شواية" },
  salon: { FR: "Salon", EN: "Living room", AR: "صالة" },
  cuisine: { FR: "Cuisine", EN: "Kitchen", AR: "مطبخ" },
  salle_de_bain: { FR: "Salle de bain", EN: "Bathroom", AR: "حمام" },
  chambre: { FR: "Chambre", EN: "Bedroom", AR: "غرفة" },
  bureau_etude: { FR: "Bureau d'étude", EN: "Study room", AR: "غرفة دراسة" },
  buanderie: { FR: "Buanderie", EN: "Laundry room", AR: "غرفة غسيل" },
  dressing: { FR: "Dressing", EN: "Walk-in closet", AR: "خزانة ملابس" },

  // Location & surroundings
  vue_mer: { FR: "Vue mer", EN: "Sea view", AR: "إطلالة بحرية" },
  vue_piscine: { FR: "Vue piscine", EN: "Pool view", AR: "إطلالة على المسبح" },
  vue_montagne: { FR: "Vue montagne", EN: "Mountain view", AR: "إطلالة جبلية" },
  proche_plage: { FR: "Proche de la plage", EN: "Near the beach", AR: "قرب الشاطئ" },
  proche_centre: { FR: "Proche du centre", EN: "Near city center", AR: "قرب وسط المدينة" },
  proche_ecole: { FR: "Proche école", EN: "Near school", AR: "قرب المدرسة" },
  proche_hopital: { FR: "Proche hôpital", EN: "Near hospital", AR: "قرب المستشفى" },
  proche_mosquee: { FR: "Proche mosquée", EN: "Near mosque", AR: "قرب المسجد" },
  quartier_calme: { FR: "Quartier calme", EN: "Quiet neighborhood", AR: "حي هادئ" },
  quartier_animé: { FR: "Quartier animé", EN: "Lively neighborhood", AR: "حي نشط" },
  acces_facile: { FR: "Accès facile", EN: "Easy access", AR: "وصول سهل" },
  transport_commun: { FR: "Transport en commun", EN: "Public transport", AR: "نقل عام" },

  // Property condition
  neuf: { FR: "Neuf", EN: "New", AR: "جديد" },
  a_renover: { FR: "À rénover", EN: "To renovate", AR: "يحتاج تجديد" },
  bon_etat: { FR: "Bon état", EN: "Good condition", AR: "حالة جيدة" },
  tres_bon_etat: { FR: "Très bon état", EN: "Very good condition", AR: "حالة ممتازة" },
  excellent_etat: { FR: "Excellent état", EN: "Excellent condition", AR: "حالة ممتازة" },
  a_finir: { FR: "À finir", EN: "To finish", AR: "يحتاج إكمال" },

  // Rooms
  salle_a_manger: { FR: "Salle à manger", EN: "Dining room", AR: "غرفة طعام" },
  piece: { FR: "Pièce", EN: "Room", AR: "غرفة" },
  chambres: { FR: "Chambres", EN: "Bedrooms", AR: "غرف نوم" },
  salles_de_bain: { FR: "Salles de bain", EN: "Bathrooms", AR: "حمامات" },
  etage: { FR: "Étage", EN: "Floor", AR: "طابق" },
  sous_sol: { FR: "Sous-sol", EN: "Basement", AR: "طابق سفلي" },
  rez_de_chaussee: { FR: "Rez-de-chaussée", EN: "Ground floor", AR: "طابق أرضي" },

  // Legal / Documents
  titre_foncier: { FR: "Titre Foncier", EN: "Land title", AR: "شهادة عقارية" },
  melkia: { FR: "Melkia", EN: "Melkia", AR: "ملكية" },
  adoulaire: { FR: "Adoulaire", EN: "Adoulaire", AR: "عدولية" },
  non_titre: { FR: "Sans titre", EN: "No title", AR: "بدون عنوان" },
  certificat_attribution: { FR: "Certificat d'attribution", EN: "Attribution certificate", AR: "شهادة استخلاف" },
  compromis: { FR: "Compromis", EN: "Sale agreement", AR: "اتفاقية البيع" },
  notaire: { FR: "Notaire", EN: "Notary", AR: "محامي" },
  etat_civil: { FR: "État civil", EN: "Civil status", AR: "الوضع المدني" },

  // Price / Financial
  prix: { FR: "Prix", EN: "Price", AR: "السعر" },
  cher: { FR: "Cher", EN: "Expensive", AR: "غالي" },
  pas_cher: { FR: "Pas cher", EN: "Affordable", AR: "رخيص" },
  negotiable: { FR: "Négociable", EN: "Negotiable", AR: "قابل للتفاوض" },
  budget: { FR: "Budget", EN: "Budget", AR: "الميزانية" },
  mensualite: { FR: "Mensualité", EN: "Monthly payment", AR: "القسط الشهري" },
  credit: { FR: "Crédit", EN: "Loan", AR: "قرض" },
  apport: { FR: "Apport", EN: "Down payment", AR: "الدفعة المقدمة" },
  loyer: { FR: "Loyer", EN: "Rent", AR: "الكراء" },
  charges: { FR: "Charges", EN: "Fees", AR: "الرسوم" },
  taxe_fonciere: { FR: "Taxe foncière", EN: "Property tax", AR: "الضريبة العقارية" },
  copropriete: { FR: "Copropriété", EN: "Co-ownership", AR: "الملكية المشتركة" },

  // Description keywords
  lumineux: { FR: "Lumineux", EN: "Bright", AR: "مضيء" },
  spacieux: { FR: "Spacieux", EN: "Spacious", AR: "واسع" },
  coquet: { FR: "Coquet", EN: "Charming", AR: "جذاب" },
  moderne: { FR: "Moderne", EN: "Modern", AR: "عصري" },
  traditionnel: { FR: "Traditionnel", EN: "Traditional", AR: "تقليدي" },
  luxe: { FR: "Luxe", EN: "Luxury", AR: "فاخر" },
  simple: { FR: "Simple", EN: "Simple", AR: "بسيط" },
  entretenu: { FR: "Entretenu", EN: "Well-maintained", AR: "محفوظ" },
  grand: { FR: "Grand", EN: "Large", AR: "كبير" },
  petit: { FR: "Petit", EN: "Small", AR: "صغير" },
  cozy: { FR: "Cozy", EN: "Cozy", AR: "مريح" },
  plein_air: { FR: "Plein air", EN: "Outdoor", AR: "في الهواء الطلق" },

  // Numbers
  un: { FR: "1", EN: "1", AR: "1" },
  deux: { FR: "2", EN: "2", AR: "2" },
  trois: { FR: "3", EN: "3", AR: "3" },
  quatre: { FR: "4", EN: "4", AR: "4" },
  cinq: { FR: "5", EN: "5", AR: "5" },

  // Common actions
  visiter: { FR: "Visiter", EN: "Visit", AR: "زيارة" },
  acheter: { FR: "Acheter", EN: "Buy", AR: "شراء" },
  louer: { FR: "Louer", EN: "Rent", AR: "كراء" },
  vendre: { FR: "Vendre", EN: "Sell", AR: "بيع" },
  planifier: { FR: "Planifier", EN: "Schedule", AR: "جدولة" },
  rendez_vous: { FR: "Rendez-vous", EN: "Appointment", AR: "موعد" },
  negociation: { FR: "Négociation", EN: "Negotiation", AR: "تفاوض" },

  // Neighborhoods / areas
  quartier: { FR: "Quartier", EN: "Neighborhood", AR: "حي" },
  ville: { FR: "Ville", EN: "City", AR: "مدينة" },
  region: { FR: "Région", EN: "Region", AR: "جهة" },
  centre_ville: { FR: "Centre-ville", EN: "City center", AR: "وسط المدينة" },
  peripherie: { FR: "Périphérie", EN: "Outskirts", AR: "ضواحي" },
  campagne: { FR: "Campagne", EN: "Countryside", AR: "ريف" },
  bord_de_mer: { FR: "Bord de mer", EN: "Waterfront", AR: "ساحل البحر" },
  zone_industrielle: { FR: "Zone industrielle", EN: "Industrial zone", AR: "منطقة صناعية" },
  zone_commerciale: { FR: "Zone commerciale", EN: "Commercial zone", AR: "منطقة تجارية" },
  zone_residentielle: { FR: "Zone résidentielle", EN: "Residential zone", AR: "منطقة سكنية" },

  // Utilities
  eau: { FR: "Eau", EN: "Water", AR: "ماء" },
  electricite: { FR: "Électricité", EN: "Electricity", AR: "كهرباء" },
  gaz: { FR: "Gaz", EN: "Gas", AR: "غاز" },
  telephone: { FR: "Téléphone", EN: "Phone", AR: "هاتف" },
  internet: { FR: "Internet", EN: "Internet", AR: "إنترنت" },
  fibre_optique: { FR: "Fibre optique", EN: "Fiber optic", AR: "ألياف بصرية" },

  // Documents
  piece_identite: { FR: "Pièce d'identité", EN: "ID document", AR: "وثيقة الهوية" },
  justificatif_domicile: { FR: "Justificatif de domicile", EN: "Proof of address", AR: "إثبات العنوان" },
  attestation_travail: { FR: "Attestation de travail", EN: "Employment certificate", AR: "شهادة العمل" },
  bulletin_salaire: { FR: "Bulletin de salaire", EN: "Payslip", AR: "كشف راتب" },
  releve_bancaire: { FR: "Relevé bancaire", EN: "Bank statement", AR: "كشف حساب بنكي" },

  // Seasons / rental
  saisonnier: { FR: "Saisonnier", EN: "Seasonal", AR: "موسمي" },
  longue_duree: { FR: "Longue durée", EN: "Long term", AR: "طويل الأمد" },
  courte_duree: { FR: "Courte durée", EN: "Short term", AR: "قصير الأمد" },
  hiver: { FR: "Hiver", EN: "Winter", AR: "شتاء" },
  ete: { FR: "Été", EN: "Summer", AR: "صيف" },
  vacances: { FR: "Vacances", EN: "Vacation", AR: "إجازة" },

  // Building details
  superficie: { FR: "Superficie", EN: "Area", AR: "المساحة" },
  surface_habitable: { FR: "Surface habitable", EN: "Living area", AR: "المساحة المعيشة" },
  surface_terrain: { FR: "Surface terrain", EN: "Plot area", AR: "مساحة الأرض" },
  nb_pieces: { FR: "Nombre de pièces", EN: "Number of rooms", AR: "عدد الغرف" },
  nb_chambres: { FR: "Nombre de chambres", EN: "Number of bedrooms", AR: "عدد غرف النوم" },
  nb_sdb: { FR: "Nombre de salles de bain", EN: "Number of bathrooms", AR: "عدد الحمامات" },
  nb_etages: { FR: "Nombre d'étages", EN: "Number of floors", AR: "عدد الطوابق" },
  annee_construction: { FR: "Année de construction", EN: "Year built", AR: "سنة البناء" },
  orientation: { FR: "Orientation", EN: "Orientation", AR: "الاتجاه" },
  nord: { FR: "Nord", EN: "North", AR: "شمال" },
  sud: { FR: "Sud", EN: "South", AR: "جنوب" },
  est: { FR: "Est", EN: "East", AR: "شرق" },
  ouest: { FR: "Ouest", EN: "West", AR: "غرب" },

  // Additional common terms
  ref: { FR: "Référence", EN: "Reference", AR: "مرجع" },
  statut: { FR: "Statut", EN: "Status", AR: "الوضع" },
  description: { FR: "Description", EN: "Description", AR: "الوصف" },
  photos: { FR: "Photos", EN: "Photos", AR: "صور" },
  plan: { FR: "Plan", EN: "Floor plan", AR: "مخطط" },
  localisation: { FR: "Localisation", EN: "Location", AR: "الموقع" },
  contact: { FR: "Contact", EN: "Contact", AR: "التواصل" },
  disponibilite: { FR: "Disponibilité", EN: "Availability", AR: "التوفر" },
  disponible: { FR: "Disponible", EN: "Available", AR: "متاح" },
  loue: { FR: "Loué", EN: "Rented", AR: "مؤجّر" },
  vendu: { FR: "Vendu", EN: "Sold", AR: "مباع" },
  reserve: { FR: "Réservé", EN: "Reserved", AR: "محجوز" },

  // User actions
  envoyer: { FR: "Envoyer", EN: "Send", AR: "إرسال" },
  appeler: { FR: "Appeler", EN: "Call", AR: "اتصال" },
  sauvegarder: { FR: "Sauvegarder", EN: "Save", AR: "حفظ" },
  partager: { FR: "Partager", EN: "Share", AR: "مشاركة" },
  imprimer: { FR: "Imprimer", EN: "Print", AR: "طباعة" },
  telecharger: { FR: "Télécharger", EN: "Download", AR: "تحميل" },
  comparer: { FR: "Comparer", EN: "Compare", AR: "مقارنة" },
  filtrer: { FR: "Filtrer", EN: "Filter", AR: "تصفية" },
  trier: { FR: "Trier", EN: "Sort", AR: "ترتيب" },
  reinitialiser: { FR: "Réinitialiser", EN: "Reset", AR: "إعادة ضبط" },
};

/**
 * Translate a single term from one language to another.
 * Returns null if the term is not found.
 */
export function translateTerm(term: string, from: TranslationLang, to: TranslationLang): string | null {
  const normalized = term.toLowerCase().trim();
  const entry = dict[normalized];
  if (!entry) return null;
  return entry[to] ?? null;
}

/**
 * Translate a full text (space-separated tokens) from one language to another.
 * Unrecognized tokens are kept as-is.
 */
export function translateText(text: string, from: TranslationLang, to: TranslationLang): string {
  return text
    .split(/\s+/)
    .map((word) => {
      const clean = word.replace(/[.,!?;:]+$/g, "");
      const suffix = word.slice(clean.length);
      const translated = translateTerm(clean, from, to);
      return translated !== null ? translated + suffix : word;
    })
    .join(" ");
}

/**
 * Return the translation map for UI display.
 */
export function getTranslationMap(): typeof dict {
  return dict;
}
