export type ParsedIntent = {
  transactionType?: "SALE" | "RENT";
  cityCode?: string;
  cityName?: string;
  budgetMin?: number;
  budgetMax?: number;
  propertyRef?: string;
  keywords: string[];
};

const CITY_ALIASES: Record<string, { code: string; name: string }> = {
  casablanca: { code: "CAS", name: "Casablanca" },
  casa: { code: "CAS", name: "Casablanca" },
  "الدار البيضاء": { code: "CAS", name: "Casablanca" },
  "دار البيضاء": { code: "CAS", name: "Casablanca" },
  marrakech: { code: "MAR", name: "Marrakech" },
  marrakesh: { code: "MAR", name: "Marrakech" },
  مراكش: { code: "MAR", name: "Marrakech" },
  fes: { code: "FES", name: "Fès" },
  fèz: { code: "FES", name: "Fès" },
  فاس: { code: "FES", name: "Fès" },
  rabat: { code: "RAB", name: "Rabat" },
  الرباط: { code: "RAB", name: "Rabat" },
  sale: { code: "SALE", name: "Salé" },
  salé: { code: "SALE", name: "Salé" },
  سلا: { code: "SALE", name: "Salé" },
  tanger: { code: "TAN", name: "Tanger" },
  tangier: { code: "TAN", name: "Tanger" },
  طنجة: { code: "TAN", name: "Tanger" },
  tetouan: { code: "TET", name: "Tétouan" },
  تطوان: { code: "TET", name: "Tétouan" },
  agadir: { code: "AGA", name: "Agadir" },
  "أكادير": { code: "AGA", name: "Agadir" },
  "اغادير": { code: "AGA", name: "Agadir" },
  oujda: { code: "OJD", name: "Oujda" },
  وجدة: { code: "OJD", name: "Oujda" },
  nador: { code: "NAD", name: "Nador" },
  الناظور: { code: "NAD", name: "Nador" },
  meknes: { code: "MEK", name: "Meknès" },
  مكناس: { code: "MEK", name: "Meknès" },
  mohammedia: { code: "MOHAMMEDIA", name: "Mohammedia" },
  المحمدية: { code: "MOHAMMEDIA", name: "Mohammedia" },
};

const NUM_UNIT: Record<string, number> = {
  million: 1_000_000,
  m: 1_000_000,
  mio: 1_000_000,
  mdh: 1_000_000,
  مليار: 1_000_000_000,
  مليون: 1_000_000,
  ألف: 1_000,
  k: 1_000,
  kdh: 1_000,
  dh: 1,
  dirhams: 1,
  درهم: 1,
};

export function parseIntent(text: string): ParsedIntent {
  const lower = text.toLowerCase();
  const keywords: string[] = [];

  const propertyRef = /#([A-Za-z0-9]{6,12})/i.exec(text)?.[1];

  const rentWords = ["kra", "kar", "كراء", "لوكار", "loyer", "louer", "rent", "temporaire", "location"];
  const saleWords = ["nb", "buy", "sale", "acheter", "achat", "a vendre", "بيع", "شراء", "نبيع", "مبيعة"];

  const transactionType = rentWords.some((w) => lower.includes(w))
    ? "RENT"
    : saleWords.some((w) => lower.includes(w))
      ? "SALE"
      : undefined;

  let cityCode: string | undefined;
  let cityName: string | undefined;
  for (const [alias, info] of Object.entries(CITY_ALIASES)) {
    if (lower.includes(alias)) {
      cityCode = info.code;
      cityName = info.name;
      break;
    }
  }

  const budgets = extractBudgets(lower);
  const budgetMin = budgets.length > 0 ? Math.min(...budgets) : undefined;
  const budgetMax = budgets.length > 1 ? Math.max(...budgets) : budgetMin;

  if (transactionType) keywords.push(transactionType);
  if (cityName) keywords.push(cityName);

  return { transactionType, cityCode, cityName, budgetMin, budgetMax, propertyRef, keywords };
}

function extractBudgets(lower: string): number[] {
  const amounts: number[] = [];
  const regex = /(\d+(?:[.,]\d{1,3})?)\s*(million|mio|mdh|kdh|k\b|m\b|dh|ألف|مليون|درهم)?/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(lower)) !== null) {
    const numberPart = parseFloat(match[1].replace(",", "."));
    const unit = (match[2] ?? "").toLowerCase();
    const multiplier = NUM_UNIT[unit] ?? (unit === "k" ? 1_000 : 1);
    amounts.push(numberPart * multiplier);
  }
  return amounts.filter((a) => a > 0 && a < 1_000_000_000);
}
