import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { formatMAD } from "@/lib/utils";
import { PropertyDetailClient } from "@/components/properties/property-detail-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const property = await db.property.findUnique({
    where: { slug: params.id },
    include: { city: true },
  });
  if (!property) return { title: "Property not found" };
  const ogImageUrl = `/api/og?title=${encodeURIComponent(property.title)}&price=${Number(property.price).toLocaleString()}&city=${encodeURIComponent(property.city.name)}`;
  return {
    title: property.title,
    description: `${formatMAD(property.price)} · ${property.type.replaceAll("_", " ")} — ${property.description.slice(0, 160)}`,
    openGraph: {
      title: property.title,
      description: `${formatMAD(property.price)} · ${property.city.name}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: property.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description: `${formatMAD(property.price)} · ${property.city.name}`,
      images: [ogImageUrl],
    },
  };
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await db.property.findUnique({
    where: { slug: params.id },
    include: {
      owner: { select: { id: true, name: true, whatsappNumber: true, agencyName: true } },
      region: true,
      city: true,
      neighborhood: true,
      amenities: { include: { amenity: true } },
    },
  });

  if (!property || property.listingStatus !== "ACTIVE") notFound();

  return (
    <PropertyDetailClient
      property={{
        id: property.id,
        slug: property.slug,
        title: property.title,
        description: property.description,
        price: Number(property.price),
        transactionType: property.transactionType,
        rentPeriod: property.rentPeriod,
        isFeatured: property.isFeatured,
        plotAreaM2: property.plotAreaM2 != null ? Number(property.plotAreaM2) : null,
        builtAreaM2: property.builtAreaM2 != null ? Number(property.builtAreaM2) : null,
        rooms: property.rooms,
        bathrooms: property.bathrooms,
        floorLevel: property.floorLevel,
        density: property.density,
        legalStatus: property.legalStatus,
        coverImage: property.coverImage,
        latitude: property.latitude,
        longitude: property.longitude,
        rentFrequency: property.rentFrequency,
        city: { name: property.city.name, nameAr: property.city.nameAr },
        region: { name: property.region.name, nameAr: property.region.nameAr },
        neighborhood: property.neighborhood ? { id: property.neighborhood.id, name: property.neighborhood.name, nameAr: property.neighborhood.nameAr } : null,
        owner: property.owner,
        amenities: property.amenities.map((a) => ({ amenity: { id: a.amenity.id, label: a.amenity.label } })),
      }}
    />
  );
}
