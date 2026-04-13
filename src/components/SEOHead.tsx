import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  ogImage?: string;
  ogType?: string;
  geoRegion?: string;
  geoPlacename?: string;
}

const DEFAULT_OG_IMAGE = "https://www.poolrentalnearme.com/og-public-pools.png";

const SEOHead = ({
  title,
  description,
  canonical,
  jsonLd,
  ogImage,
  ogType = "website",
  geoRegion,
  geoPlacename,
}: SEOHeadProps) => {
  const image = ogImage || DEFAULT_OG_IMAGE;
  // Ensure canonical has trailing slash for consistency
  const canonicalUrl = canonical && !canonical.endsWith("/") ? `${canonical}/` : canonical;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="PoolRentalNearMe.com" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large" />

      {/* Geo tags for local SEO */}
      {geoRegion && <meta name="geo.region" content={geoRegion} />}
      {geoPlacename && <meta name="geo.placename" content={geoPlacename} />}

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
