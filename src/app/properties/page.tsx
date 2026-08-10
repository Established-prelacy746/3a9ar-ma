import { propertyQuerySchema } from "@/lib/validations/property-query";
import { queryProperties } from "@/features/properties/server/property-queries";
import { SearchClient } from "@/components/properties/search-client";

export const dynamic = "force-dynamic";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const parsed = propertyQuerySchema.safeParse(searchParams);
  const query = parsed.success ? parsed.data : propertyQuerySchema.parse({});
  const initial = await queryProperties(query);

  return <SearchClient initial={initial} initialQuery={query} />;
}
