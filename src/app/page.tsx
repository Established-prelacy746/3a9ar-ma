import { propertyQuerySchema } from "@/lib/validations/property-query";
import { queryProperties } from "@/features/properties/server/property-queries";
import { HomeClient } from "./home-client";
import { HomeFeaturedClient } from "./home-featured-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await queryProperties(
    propertyQuerySchema.parse({ sort: "featured", limit: 6, featured: "true" }),
  );

  return (
    <div>
      <HomeClient />
      <HomeFeaturedClient items={featured.items as any} />
    </div>
  );
}
