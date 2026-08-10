export const TRANSACTION_OPTIONS = [
  { value: "SALE", label: "Lbi3 / Sale", labelAr: "بيع" },
  { value: "RENT", label: "Kra / Rent", labelAr: "كراء" },
] as const;

export const RENT_PERIOD_OPTIONS = [
  { value: "LONG_TERM", label: "Long-term (Karawi)", labelAr: "كرائي" },
  { value: "SEASONAL", label: "Seasonal (Mouassami)", labelAr: "موسمي" },
] as const;

export const CATEGORY_OPTIONS = [
  { value: "RESIDENTIAL", label: "Dyor / Residential", labelAr: "دور / سكني" },
  { value: "COMMERCIAL", label: "Commercial", labelAr: "تجاري" },
  { value: "LAND", label: "Aradi / Land", labelAr: "أراضي" },
] as const;

export const PROPERTY_TYPE_OPTIONS = [
  { value: "APARTMENT", label: "Apartment / Chakka", labelAr: "شقة" },
  { value: "VILLA", label: "Villa", labelAr: "فيلا" },
  { value: "RIAD", label: "Riad", labelAr: "رياض" },
  { value: "BUREAUX", label: "Offices / Bureaux", labelAr: "مكاتب" },
  { value: "MAGASIN", label: "Shop / Magasin", labelAr: "محل تجاري" },
  { value: "FERME", label: "Farm / Ferme", labelAr: "ضيعات" },
  { value: "LOTISSEMENT", label: "Subdivision / Lotissement", labelAr: "تجزئة" },
  { value: "TERRAIN_CONSTRUCTIBLE", label: "Buildable Land", labelAr: "أرض قابلة للبناء" },
  { value: "TERRAIN_AGRICOLE", label: "Agricultural Land", labelAr: "أرض فلاحية" },
] as const;

export const LEGAL_STATUS_OPTIONS = [
  { value: "TITRE_FONCIER", label: "Titre Foncier (Mouhafada)", labelAr: "محفظة" },
  { value: "MELKIA", label: "Melkia", labelAr: "ملكية" },
  { value: "ADOULAIRE", label: "Adoulaire", labelAr: "عدولية" },
  { value: "NON_TITRE", label: "Non-titré", labelAr: "غير محفظ" },
] as const;

export const SORT_OPTIONS = [
  { value: "featured", label: "Vedette first", labelAr: "المميزة أولاً" },
  { value: "newest", label: "Newest", labelAr: "الأحدث" },
  { value: "price_asc", label: "Price (low → high)", labelAr: "السعر تصاعدي" },
  { value: "price_desc", label: "Price (high → low)", labelAr: "السعر تنازلي" },
  { value: "price_per_m2_asc", label: "Price / m² (low → high)", labelAr: "السعر للمتر مربع" },
] as const;

export const DENSITY_OPTIONS = [
  { value: "R+0", label: "R+0" },
  { value: "R+1", label: "R+1" },
  { value: "R+2", label: "R+2" },
  { value: "R+3", label: "R+3" },
  { value: "R+5", label: "R+5" },
] as const;
