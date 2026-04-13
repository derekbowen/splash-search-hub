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
import FeaturedPrivatePools from "@/components/FeaturedPrivatePools";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, Phone, Globe, Clock, ChevronDown, AlertTriangle, Heart, Users, ExternalLink, Shield } from "lucide-react";

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
        ogType="place"
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
              <div className="space-y-8">
                {/* Drowning Prevention Advocacy */}
                <div className="border-2 border-destructive/20 rounded-lg overflow-hidden">
                  <div className="bg-destructive/10 p-6 md:p-8">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle className="h-8 w-8 text-destructive shrink-0 mt-1" />
                      <div>
                        <h2 className="text-xl md:text-2xl font-extrabold text-foreground mb-2">
                          {city.city_name} Has No Public Swimming Pool
                        </h2>
                        <p className="text-muted-foreground font-medium">
                          Every child deserves access to water safety education. Without a public pool, {city.city_name} families are left without affordable options to learn to swim.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 space-y-6">
                    {/* Drowning Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-destructive/5 rounded-lg p-4 text-center">
                        <p className="text-3xl font-extrabold text-destructive">4,500+</p>
                        <p className="text-sm text-muted-foreground mt-1">Americans drown every year — it's the <strong>#1 cause of death</strong> for children ages 1–4</p>
                      </div>
                      <div className="bg-destructive/5 rounded-lg p-4 text-center">
                        <p className="text-3xl font-extrabold text-destructive">64%</p>
                        <p className="text-sm text-muted-foreground mt-1">of Black children, 45% of Hispanic children <strong>cannot swim</strong> — lack of pool access is the #1 reason</p>
                      </div>
                      <div className="bg-destructive/5 rounded-lg p-4 text-center">
                        <p className="text-3xl font-extrabold text-destructive">88%</p>
                        <p className="text-sm text-muted-foreground mt-1">of drowning deaths could be <strong>prevented</strong> with basic swim lessons and water safety education</p>
                      </div>
                    </div>

                    {/* The Case for a Pool */}
                    <div>
                      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-destructive" /> Why {city.city_name} Needs a Public Pool
                      </h3>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <p>
                          {city.city_name}{city.population ? `, with a population of ${city.population.toLocaleString()},` : ""} currently has <strong>zero public swimming pools</strong>. 
                          That means {city.city_name} families — especially those who can't afford private club memberships or backyard pools — 
                          have no affordable, accessible place to learn to swim.
                        </p>
                        <p>
                          According to the CDC, drowning is the <strong>leading cause of unintentional death for children ages 1–4</strong> and 
                          the <strong>second leading cause for ages 5–14</strong>. Research from the American Academy of Pediatrics shows that 
                          formal swim lessons reduce the risk of drowning by <strong>88%</strong>. But lessons require pools — and {city.city_name} doesn't have one.
                        </p>
                        <p>
                          Communities with public pools see measurable benefits: lower childhood drowning rates, improved physical fitness, 
                          reduced youth crime during summer months, stronger community bonds, and increased property values. A public pool 
                          isn't a luxury — it's critical infrastructure that <strong>saves lives</strong>.
                        </p>
                      </div>
                    </div>

                    {/* Take Action */}
                    <div className="bg-secondary/50 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" /> Take Action — Contact {city.city_name} City Leaders
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your voice matters. Contact your {city.city_name} city council members and mayor's office to advocate for a public swimming pool. 
                        Here's how to reach them:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button asChild className="w-full">
                          <a 
                            href={`https://www.google.com/search?q=${encodeURIComponent(city.city_name + " " + (state?.name || city.state_abbr) + " city council contact")}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Phone className="h-4 w-4 mr-2" /> Find {city.city_name} City Council
                          </a>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                          <a 
                            href={`https://www.google.com/search?q=${encodeURIComponent(city.city_name + " " + (state?.name || city.state_abbr) + " mayor office phone number")}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Globe className="h-4 w-4 mr-2" /> Find Mayor's Office
                          </a>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                          <a 
                            href={`https://www.google.com/search?q=${encodeURIComponent(city.city_name + " " + (state?.name || city.state_abbr) + " parks and recreation department")}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <MapPin className="h-4 w-4 mr-2" /> Parks & Recreation Dept
                          </a>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                          <a 
                            href={`mailto:?subject=Our%20city%20needs%20a%20public%20pool&body=${encodeURIComponent(
                              `Hi,\n\nI'm writing because ${city.city_name}, ${city.state_abbr} currently has NO public swimming pool. ` +
                              `Drowning is the #1 cause of death for children ages 1-4, and 88% of drowning deaths could be prevented with basic swim lessons.\n\n` +
                              (city.population ? `With a population of ${city.population.toLocaleString()}, our ` : `Our `) +
                              `community deserves access to affordable swimming and water safety education.\n\n` +
                              `I'm asking the city to explore funding options for a public aquatic facility. ` +
                              `This is about saving lives.\n\nThank you,\nA concerned ${city.city_name} resident\n\n` +
                              `Source: poolrentalnearme.com/public-pools/${city.state_slug}/${city.city_slug}`
                            )}`}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" /> Share Template Letter
                          </a>
                        </Button>
                      </div>
                    </div>

                    {/* What to Say */}
                    <div className="border rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" /> What to Tell Your City Leaders
                      </h3>
                      <div className="bg-muted/50 rounded p-4 text-sm text-muted-foreground italic space-y-2">
                        <p>"I'm a {city.city_name} resident and I'm concerned that our city has no public swimming pool. 
                        Drowning kills over 4,500 Americans every year — it's the #1 cause of death for young children.</p>
                        <p>{city.population ? `With ${city.population.toLocaleString()} residents, ${city.city_name}` : `${city.city_name}`} deserves 
                        a public aquatic facility where our children can learn water safety, where families can exercise affordably, 
                        and where our community can come together.</p>
                        <p>I'm asking the city council to include a public pool or aquatic center in future capital improvement plans. 
                        Federal grants, state recreation funds, and public-private partnerships can help fund this. 
                        <strong>This is about saving children's lives.</strong>"</p>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="font-semibold text-foreground">Sources & Resources:</p>
                      <p>• CDC — <a href="https://www.cdc.gov/drowning/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Drowning Prevention</a></p>
                      <p>• American Academy of Pediatrics — <a href="https://publications.aap.org/pediatrics/article/143/5/e20190850/37054/Prevention-of-Drowning" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Prevention of Drowning (2019)</a></p>
                      <p>• USA Swimming Foundation — <a href="https://www.usaswimming.org/utility/landing-pages/make-a-splash" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Make a Splash Initiative</a></p>
                      <p>• Stop Drowning Now — <a href="https://www.stopdrowningnow.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">stopdrowningnow.org</a></p>
                    </div>
                  </div>
                </div>

                {/* Still help find pools */}
                <div className="border rounded-lg p-6 text-center bg-muted/30">
                  <p className="text-sm font-medium mb-2">Know of a public pool in {city.city_name} we missed?</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild size="sm">
                      <a href={`https://www.google.com/maps/search/public+swimming+pool+${encodeURIComponent(city.city_name)}+${encodeURIComponent(city.state_abbr)}`} target="_blank" rel="noopener noreferrer">
                        <MapPin className="h-4 w-4 mr-1" /> Search Google Maps
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a href={`mailto:derek@poolrentalnearme.com?subject=Pool suggestion for ${city.city_name}, ${city.state_abbr}&body=Pool name:%0AAddress:%0AWebsite (if known):`}>Suggest a Pool</a>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              pools!.map((pool) => (
                <div key={pool.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                    <div>
                      <Link to={`/public-pools/${city.state_slug}/${city.city_slug}/${(pool as any).slug}`} className="hover:text-primary">
                        <h3 className="text-lg font-bold">{pool.name}</h3>
                      </Link>
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

      {/* Featured Private Pools */}
      <div className="container">
        <FeaturedPrivatePools
          stateAbbr={city.state_abbr}
          count={4}
          heading={`Private Pools Near ${city.city_name}`}
          subheading="No crowds, no lanes — just your own private pool by the hour."
        />
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
