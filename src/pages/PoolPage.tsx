import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import WaveBg from "@/components/WaveBg";
import StickyCtaSidebar from "@/components/StickyCtaSidebar";
import StarRating from "@/components/StarRating";
import PoolTypeBadge from "@/components/PoolTypeBadge";
import { useCityBySlug } from "@/hooks/useCities";
import { useStateBySlug } from "@/hooks/useStates";
import { usePoolBySlug, useNearbyPools } from "@/hooks/usePools";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin, Phone, Globe, Clock, Navigation, DollarSign, Waves, ExternalLink } from "lucide-react";

const PoolPage = () => {
  const { stateSlug, citySlug, poolSlug } = useParams<{
    stateSlug: string;
    citySlug: string;
    poolSlug: string;
  }>();

  const { data: city, isLoading: cityLoading } = useCityBySlug(stateSlug || "", citySlug || "");
  const { data: state } = useStateBySlug(stateSlug || "");
  const { data: pool, isLoading: poolLoading } = usePoolBySlug(city?.id, poolSlug);
  const { data: nearbyPools } = useNearbyPools(city?.id, pool?.id);

  if (cityLoading || poolLoading) {
    return (
      <Layout>
        <div className="container py-12 space-y-4">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-10 w-96 bg-muted animate-pulse rounded" />
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
        </div>
      </Layout>
    );
  }

  if (!pool || !city) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Pool not found</h1>
          <p className="text-muted-foreground mb-6">This pool listing may have been removed or the URL is incorrect.</p>
          <Button asChild>
            <Link to={`/public-pools/${stateSlug}/${citySlug}`}>← Back to {citySlug} pools</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const poolUrl = `https://www.poolrentalnearme.com/public-pools/${stateSlug}/${citySlug}/${poolSlug}/`;
  const fullAddress = [pool.address, pool.city, pool.state, pool.zip].filter(Boolean).join(", ");
  const hoursArray = Array.isArray(pool.hours_json) ? pool.hours_json.map(String) : [];

  // SEO
  const title = `${pool.name} – Public Pool in ${city.city_name}, ${city.state_abbr} | Hours, Prices & Info`;
  const description = pool.description
    ? pool.description.slice(0, 155)
    : `${pool.name} in ${city.city_name}, ${city.state_abbr}. Get hours, admission prices, amenities, ratings & directions for this public swimming pool.`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Public Pools", item: "https://www.poolrentalnearme.com/public-pools/" },
      { "@type": "ListItem", position: 2, name: state?.name || city.state_abbr, item: `https://www.poolrentalnearme.com/public-pools/${stateSlug}/` },
      { "@type": "ListItem", position: 3, name: city.city_name, item: `https://www.poolrentalnearme.com/public-pools/${stateSlug}/${citySlug}/` },
      { "@type": "ListItem", position: 4, name: pool.name, item: poolUrl },
    ],
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "PublicSwimmingPool",
    name: pool.name,
    description: pool.description || `Public swimming pool in ${city.city_name}, ${city.state_abbr}`,
    url: poolUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: pool.address || undefined,
      addressLocality: pool.city || city.city_name,
      addressRegion: pool.state || city.state_abbr,
      postalCode: pool.zip || undefined,
    },
    geo: pool.latitude && pool.longitude ? {
      "@type": "GeoCoordinates",
      latitude: pool.latitude,
      longitude: pool.longitude,
    } : undefined,
    aggregateRating: pool.rating ? {
      "@type": "AggregateRating",
      ratingValue: pool.rating,
      bestRating: 5,
      reviewCount: pool.review_count ?? 1,
    } : undefined,
    telephone: pool.phone || undefined,
    image: pool.image_url || undefined,
    ...(hoursArray.length > 0 ? { openingHours: hoursArray } : {}),
  };

  const faqs = [
    {
      q: `What are the hours for ${pool.name}?`,
      a: hoursArray.length > 0
        ? `${pool.name} hours: ${hoursArray.join("; ")}. Hours may vary seasonally — check before visiting.`
        : `Hours for ${pool.name} are not yet listed. Check the pool's website or call for current operating hours.`,
    },
    {
      q: `How much does it cost to swim at ${pool.name}?`,
      a: pool.price_notes
        ? pool.price_notes
        : pool.price_adult
          ? `Admission at ${pool.name}: Adults ${pool.price_adult}, Children ${pool.price_child || "varies"}. Contact the pool for seasonal passes and group rates.`
          : `Admission pricing for ${pool.name} is not yet listed. Many public pools charge $2–$8 per visit. Contact the pool directly for current rates.`,
    },
    {
      q: `Is ${pool.name} a good pool for families?`,
      a: pool.amenities?.length
        ? `Yes! ${pool.name} offers amenities including ${pool.amenities.slice(0, 4).join(", ")}${pool.amenities.length > 4 ? " and more" : ""}. ${pool.rating ? `It has a ${pool.rating.toFixed(1)}-star rating.` : ""}`
        : `${pool.name} is a public swimming facility in ${city.city_name}. ${pool.rating ? `It has a ${pool.rating.toFixed(1)}-star rating from ${pool.review_count ?? 0} reviews.` : "Contact the pool for details on family-friendly amenities."}`,
    },
    {
      q: `Can I rent a private pool near ${pool.name} instead?`,
      a: `Yes! If you want a private swimming experience, PoolRentalNearMe.com has backyard pools for rent by the hour near ${city.city_name}. No crowds, no lines — starting at $25/hr.`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const allJsonLd = [breadcrumbJsonLd, localBusinessJsonLd, faqJsonLd];

  return (
    <Layout>
      <SEOHead
        title={title}
        description={description}
        canonical={poolUrl}
        jsonLd={allJsonLd}
      />

      {/* Hero */}
      <section className="relative bg-prnm-light-blue py-10 md:py-14">
        <WaveBg />
        <div className="container relative z-10">
          <nav className="text-sm text-muted-foreground mb-4 flex flex-wrap items-center gap-1">
            <Link to="/public-pools" className="hover:text-primary">Public Pools</Link>
            <span>/</span>
            <Link to={`/public-pools/${stateSlug}`} className="hover:text-primary">{state?.name || city.state_abbr}</Link>
            <span>/</span>
            <Link to={`/public-pools/${stateSlug}/${citySlug}`} className="hover:text-primary">{city.city_name}</Link>
            <span>/</span>
            <span className="text-foreground">{pool.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-4xl font-extrabold text-foreground">{pool.name}</h1>
                <PoolTypeBadge type={pool.pool_type} />
              </div>
              <StarRating rating={pool.rating} reviewCount={pool.review_count} />
              {fullAddress && (
                <p className="flex items-center gap-1.5 text-muted-foreground mt-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {fullAddress}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {pool.google_maps_url && (
                <Button asChild>
                  <a href={pool.google_maps_url} target="_blank" rel="noopener noreferrer">
                    <Navigation className="h-4 w-4 mr-1" /> Get Directions
                  </a>
                </Button>
              )}
              {pool.website && (
                <Button asChild variant="outline">
                  <a href={pool.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-1" /> Official Website
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="container py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-8">

            {/* Image */}
            {pool.image_url && (
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={pool.image_url}
                  alt={`${pool.name} in ${city.city_name}, ${city.state_abbr}`}
                  className="w-full h-64 md:h-96 object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Description */}
            {pool.description && (
              <div>
                <h2 className="text-xl font-bold mb-3">About {pool.name}</h2>
                <p className="text-muted-foreground leading-relaxed">{pool.description}</p>
              </div>
            )}

            {/* Details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hours */}
              <div className="border rounded-lg p-5">
                <h3 className="font-bold flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-primary" /> Hours of Operation
                </h3>
                {hoursArray.length > 0 ? (
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {hoursArray.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Hours not yet listed. Check the pool's website or call for current hours.</p>
                )}
              </div>

              {/* Pricing */}
              <div className="border rounded-lg p-5">
                <h3 className="font-bold flex items-center gap-2 mb-3">
                  <DollarSign className="h-5 w-5 text-primary" /> Admission Prices
                </h3>
                {pool.price_notes ? (
                  <p className="text-sm text-muted-foreground">{pool.price_notes}</p>
                ) : pool.price_adult || pool.price_child ? (
                  <div className="text-sm text-muted-foreground space-y-1">
                    {pool.price_adult && <p>Adult: {pool.price_adult}</p>}
                    {pool.price_child && <p>Child: {pool.price_child}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Pricing not yet listed. Contact the pool for current admission rates.</p>
                )}
              </div>

              {/* Contact */}
              <div className="border rounded-lg p-5">
                <h3 className="font-bold flex items-center gap-2 mb-3">
                  <Phone className="h-5 w-5 text-primary" /> Contact Information
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  {pool.phone && (
                    <p>
                      Phone: <a href={`tel:${pool.phone}`} className="text-primary hover:underline">{pool.phone}</a>
                    </p>
                  )}
                  {pool.website && (
                    <p>
                      Website: <a href={pool.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                        Visit site <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  )}
                  {fullAddress && <p>Address: {fullAddress}</p>}
                  {!pool.phone && !pool.website && (
                    <p>Contact information not yet available.</p>
                  )}
                </div>
              </div>

              {/* Amenities */}
              <div className="border rounded-lg p-5">
                <h3 className="font-bold flex items-center gap-2 mb-3">
                  <Waves className="h-5 w-5 text-primary" /> Amenities & Features
                </h3>
                {pool.amenities && pool.amenities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {pool.amenities.map((a) => (
                      <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Amenities not yet listed for this pool.</p>
                )}
              </div>
            </div>

            {/* Map embed placeholder */}
            {pool.latitude && pool.longitude && (
              <div className="border rounded-lg overflow-hidden">
                <h3 className="font-bold p-5 pb-3">Location</h3>
                <div className="w-full h-64 bg-muted flex items-center justify-center">
                  <a
                    href={pool.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${pool.latitude},${pool.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <MapPin className="h-5 w-5" />
                    View on Google Maps →
                  </a>
                </div>
              </div>
            )}

            {/* Other pools in this city */}
            {nearbyPools && nearbyPools.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Other Public Pools in {city.city_name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {nearbyPools.map((np: any) => (
                    <Link
                      key={np.id}
                      to={`/public-pools/${stateSlug}/${citySlug}/${np.slug}`}
                      className="border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-sm">{np.name}</h3>
                      <StarRating rating={np.rating} reviewCount={np.review_count} />
                      {np.pool_type && <PoolTypeBadge type={np.pool_type} />}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible>
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger>{faq.q}</AccordionTrigger>
                    <AccordionContent>{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80 shrink-0">
            <StickyCtaSidebar cityName={city.city_name} prnmUrl={city.prnm_url || undefined} />
          </div>
        </div>
      </section>

      {/* Mobile CTA */}
      <div className="lg:hidden">
        <StickyCtaSidebar cityName={city.city_name} prnmUrl={city.prnm_url || undefined} />
      </div>
    </Layout>
  );
};

export default PoolPage;
