import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import WaveBg from "@/components/WaveBg";
import StickyCtaSidebar from "@/components/StickyCtaSidebar";
import StarRating from "@/components/StarRating";
import PoolTypeBadge from "@/components/PoolTypeBadge";
import { useCityBySlug, useNearbyCities } from "@/hooks/useCities";
import { useStateBySlug } from "@/hooks/useStates";
import { usePoolsByCity } from "@/hooks/usePools";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, Phone, Globe, Clock, ChevronDown } from "lucide-react";

const CityPage = () => {
  const { stateSlug, citySlug } = useParams<{ stateSlug: string; citySlug: string }>();
  const { data: city, isLoading: cityLoading } = useCityBySlug(stateSlug || "", citySlug || "");
  const { data: state } = useStateBySlug(stateSlug || "");
  const { data: pools, isLoading: poolsLoading } = usePoolsByCity(city?.id);
  const { data: nearbyCities } = useNearbyCities(stateSlug || "", citySlug || "", city?.latitude ?? null, city?.longitude ?? null);

  if (cityLoading) {
    return <Layout><div className="container py-12"><div className="h-8 w-64 bg-muted animate-pulse rounded" /></div></Layout>;
  }

  if (!city) {
    return <Layout><div className="container py-12"><h1 className="text-2xl font-bold">City not found</h1></div></Layout>;
  }

  const bestPool = pools?.length ? pools.reduce((best, p) => (p.rating ?? 0) > (best.rating ?? 0) ? p : best, pools[0]) : null;

  const faqs = [
    {
      q: `How many public pools are in ${city.city_name}?`,
      a: `There ${(pools?.length ?? 0) === 1 ? "is" : "are"} currently ${pools?.length ?? 0} public swimming pool${(pools?.length ?? 0) !== 1 ? "s" : ""} listed in ${city.city_name}, ${city.state_abbr}.`,
    },
    {
      q: `What is the best rated pool in ${city.city_name}?`,
      a: bestPool ? `${bestPool.name} is the highest rated pool in ${city.city_name} with a ${bestPool.rating?.toFixed(1)} star rating from ${bestPool.review_count ?? 0} reviews.` : `We're still collecting ratings for pools in ${city.city_name}.`,
    },
    {
      q: `Are public pools in ${city.city_name} free?`,
      a: `Public pool admission varies. Many municipal pools charge $2–$8 per visit, with some offering free admission for residents. Check individual pool listings above for specific pricing.`,
    },
    {
      q: `Can I rent a private pool in ${city.city_name}?`,
      a: `Yes! PoolRentalNearMe.com connects you with private pool owners in ${city.city_name} who rent their backyard pools by the hour. No commissions — just $9/month for hosts. Browse private pools →`,
    },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Public Pools", item: "https://www.poolrentalnearme.com/public-pools/" },
      { "@type": "ListItem", position: 2, name: state?.name || city.state_abbr, item: `https://www.poolrentalnearme.com/public-pools/${city.state_slug}/` },
      { "@type": "ListItem", position: 3, name: city.city_name, item: `https://www.poolrentalnearme.com/public-pools/${city.state_slug}/${city.city_slug}/` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const poolsJsonLd = (pools ?? []).map((pool) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: pool.name,
    address: { "@type": "PostalAddress", streetAddress: pool.address, addressLocality: pool.city, addressRegion: pool.state, postalCode: pool.zip },
    geo: pool.latitude && pool.longitude ? { "@type": "GeoCoordinates", latitude: pool.latitude, longitude: pool.longitude } : undefined,
    aggregateRating: pool.rating ? { "@type": "AggregateRating", ratingValue: pool.rating, reviewCount: pool.review_count ?? 1 } : undefined,
    telephone: pool.phone || undefined,
  }));

  const allJsonLd = [breadcrumbJsonLd, faqJsonLd, ...poolsJsonLd];

  return (
    <Layout>
      <SEOHead
        title={city.meta_title || `Public Swimming Pools in ${city.city_name}, ${city.state_abbr} | PoolRentalNearMe.com`}
        description={city.meta_description || `Find public pools in ${city.city_name}, ${city.state_abbr}. See hours, prices & ratings.`}
        canonical={`https://www.poolrentalnearme.com/public-pools/${city.state_slug}/${city.city_slug}/`}
        jsonLd={allJsonLd}
      />

      {/* Hero */}
      <section className="relative bg-prnm-light-blue py-12 md:py-16">
        <WaveBg />
        <div className="container relative z-10">
          <nav className="text-sm text-muted-foreground mb-4">
            <Link to="/public-pools" className="hover:text-primary">Public Pools</Link>
            <span className="mx-2">/</span>
            <Link to={`/public-pools/${city.state_slug}`} className="hover:text-primary">{state?.name || city.state_abbr}</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{city.city_name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
            Public Swimming Pools in {city.city_name}, {city.state_abbr}
          </h1>
          <p className="text-muted-foreground">
            Found {pools?.length ?? 0} public pools in {city.city_name}. See hours, prices & ratings below.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="container py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Pool listings */}
          <div className="flex-1 space-y-6">
            {poolsLoading ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />)
            ) : (pools?.length ?? 0) === 0 ? (
              <div className="border rounded-lg p-8 text-center">
                <p className="text-lg font-semibold mb-2">We're still adding pools for {city.city_name}</p>
                <p className="text-muted-foreground mb-4">Know a public pool here? Let us know!</p>
                <Button asChild variant="outline">
                  <a href={`mailto:derek@poolrentalnearme.com?subject=Pool suggestion for ${city.city_name}`}>Suggest a Pool</a>
                </Button>
              </div>
            ) : (
              pools!.map((pool) => (
                <div key={pool.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-bold">{pool.name}</h3>
                      <StarRating rating={pool.rating} reviewCount={pool.review_count} />
                    </div>
                    <PoolTypeBadge type={pool.pool_type} />
                  </div>

                  {pool.address && (
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {pool.address}, {pool.city}, {pool.state} {pool.zip}
                    </p>
                  )}
                  {pool.phone && (
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                      <Phone className="h-4 w-4 shrink-0" />
                      <a href={`tel:${pool.phone}`} className="hover:text-primary">{pool.phone}</a>
                    </p>
                  )}

                  {pool.hours_json && (
                    <Collapsible className="mt-3">
                      <CollapsibleTrigger className="flex items-center gap-1 text-sm font-medium text-primary">
                        <Clock className="h-4 w-4" /> Hours <ChevronDown className="h-3 w-3" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 text-sm text-muted-foreground space-y-1">
                        {(Array.isArray(pool.hours_json) ? pool.hours_json : []).map((h: string, i: number) => (
                          <p key={i}>{String(h)}</p>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {pool.price_notes && (
                    <p className="text-sm text-muted-foreground mt-2">💰 {pool.price_notes}</p>
                  )}
                  {!pool.price_notes && (pool.price_adult || pool.price_child) && (
                    <p className="text-sm text-muted-foreground mt-2">
                      💰 Adult: {pool.price_adult || "N/A"} | Child: {pool.price_child || "N/A"}
                    </p>
                  )}

                  {pool.amenities && pool.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {pool.amenities.map((a) => (
                        <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                      ))}
                    </div>
                  )}

                  {pool.description && (
                    <p className="text-sm text-muted-foreground mt-3">{pool.description}</p>
                  )}

                  <div className="flex gap-3 mt-4">
                    {pool.google_maps_url && (
                      <Button asChild size="sm"><a href={pool.google_maps_url} target="_blank" rel="noopener noreferrer">Get Directions</a></Button>
                    )}
                    {pool.website && (
                      <Button asChild size="sm" variant="outline"><a href={pool.website} target="_blank" rel="noopener noreferrer"><Globe className="h-4 w-4 mr-1" />Website</a></Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sticky Sidebar (desktop) */}
          <div className="hidden lg:block w-80 shrink-0">
            <StickyCtaSidebar cityName={city.city_name} prnmUrl={city.prnm_url || undefined} />
          </div>
        </div>
      </section>

      {/* Mobile bottom CTA */}
      <div className="lg:hidden">
        <StickyCtaSidebar cityName={city.city_name} prnmUrl={city.prnm_url || undefined} />
      </div>

      {/* Nearby Cities */}
      {nearbyCities && nearbyCities.length > 0 && (
        <section className="bg-muted/50 py-12">
          <div className="container">
            <h2 className="text-xl font-bold mb-6">Public Pools in Nearby Cities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {nearbyCities.map((c) => (
                <Link key={c.id} to={`/public-pools/${c.state_slug}/${c.city_slug}`} className="border rounded-lg p-4 bg-background hover:border-primary hover:shadow-md transition-all">
                  <span className="font-semibold text-sm">{c.city_name}, {c.state_abbr}</span>
                  {(c.pool_count ?? 0) > 0 && <Badge variant="secondary" className="ml-2 text-xs">{c.pool_count}</Badge>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="container py-12 max-w-3xl">
        <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </Layout>
  );
};

export default CityPage;
