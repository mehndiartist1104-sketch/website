import type { SiteConfigData } from "@/lib/types";

export function LocalBusinessJsonLd({ config }: { config: SiteConfigData }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config.studioName,
    description: config.tagline,
    url: baseUrl,
    ...(config.showPhone ? { telephone: config.phone } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: config.address,
    },
    image: config.heroImageUrls.length > 0 ? config.heroImageUrls : config.heroImageUrl,
    sameAs: [config.instagramUrl],
    priceRange: "₹₹",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
