import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import WaveBg from "@/components/WaveBg";
import StickyCtaSidebar from "@/components/StickyCtaSidebar";
import StarRating from "@/components/StarRating";
import PoolTypeBadge from "@/components/PoolTypeBadge";
import { useCityBySlug, useNearbyCities } from "@/hooks/useCities";
import { useStateBySlug } from "@/hooks/useStates";
import { usePoolBySlug, useNearbyPools, useRegionalPools } from "@/hooks/usePools";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  MapPin, Phone, Globe, Clock, Navigation, DollarSign, Waves,
  ExternalLink, Sun, Droplets, Shield, Users, Car, TreePine,
  UtensilsCrossed, Camera, Thermometer, Info, ArrowRight, CheckCircle2
} from "lucide-react";

// ── helpers ──────────────────────────────────────────────

const getSeasonText = (state: string | null) => {
  const hot = ["CA", "AZ", "TX", "FL", "NV", "NM", "GA", "LA", "MS", "AL", "SC"];
  const cold = ["MN", "WI", "MI", "ND", "SD", "MT", "WY", "VT", "NH", "ME"];
  if (hot.includes(state || "")) return { season: "late May through September", climate: "warm" };
  if (cold.includes(state || "")) return { season: "mid-June through mid-August", climate: "cooler" };
  return { season: "Memorial Day through Labor Day", climate: "temperate" };
};

const getSwimmingTips = (poolType: string | null, city: string) => [
  { icon: Sun, title: "Best Time to Visit", text: `Weekday mornings are typically the least crowded at ${city} public pools. Arrive early for the best lane availability and a more relaxed experience.` },
  { icon: Droplets, title: "What to Bring", text: "Pack sunscreen (SPF 30+), a towel, swim goggles, water bottle, and a lock for the locker rooms. Most public pools don't allow glass containers on the pool deck." },
  { icon: Shield, title: "Pool Safety", text: "Always swim with a buddy, especially children. Follow posted pool rules, obey lifeguard instructions, and shower before entering the pool. Non-swimmers should stay in shallow areas." },
  { icon: Users, title: "Group Visits", text: `Planning a group outing? Many ${city} pools offer group rates and party packages. Call ahead to reserve lanes or pool areas for birthday parties, team events, or family reunions.` },
  ...(poolType?.toLowerCase().includes("indoor") ? [
    { icon: Thermometer, title: "Indoor Pool Perks", text: "Indoor pools offer year-round swimming regardless of weather. Water temperature is typically maintained between 78-82°F for comfortable lap swimming." }
  ] : [
    { icon: Sun, title: "Sun Protection", text: "For outdoor pools, apply waterproof sunscreen 15 minutes before swimming and reapply every 2 hours. Consider a UV-protective rash guard for extended sessions." }
  ]),
];

const getThingsToDo = (cityName: string, stateAbbr: string) => [
  { icon: UtensilsCrossed, title: `Dining Near ${cityName} Pools`, text: `After a swim, explore local restaurants and cafes near ${cityName}'s pools. Many pool-goers grab lunch at nearby family-friendly spots — check Google Maps for highly-rated restaurants within walking distance.` },
  { icon: TreePine, title: `Parks & Recreation in ${cityName}`, text: `Most public pools in ${cityName} are located within city parks that offer additional amenities like playgrounds, picnic areas, basketball courts, and walking trails — perfect for a full day out with the family.` },
  { icon: Camera, title: `${cityName} Attractions`, text: `Combine your pool visit with other ${cityName}, ${stateAbbr} attractions. Check local tourism sites for museums, nature centers, farmers markets, and seasonal events happening near the pool.` },
  { icon: Car, title: `Getting Around ${cityName}`, text: `Most ${cityName} pools have free parking available. Check the pool's website for specific parking instructions. Some pools are also accessible by public transit — search your local transit authority for routes.` },
];

// ── component ────────────────────────────────────────────

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
  const { data: regionalPools } = useRegionalPools(stateSlug, citySlug, 8);
  const { data: nearbyCities } = useNearbyCities(stateSlug || "", citySlug || "", city?.latitude ?? null, city?.longitude ?? null, 6);

  if (cityLoading || poolLoading) {
    return (
      <Layout>
        <div className="container py-12 space-y-4">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-10 w-96 bg-muted animate-pulse rounded" />
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />)}
          </div>
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
  const stateName = state?.name || city.state_abbr;
  const { season, climate } = getSeasonText(pool.state);
  const swimmingTips = getSwimmingTips(pool.pool_type, city.city_name);
  const thingsToDo = getThingsToDo(city.city_name, city.state_abbr);

  // ── SEO ──
  const title = `${pool.name} – Public Pool in ${city.city_name}, ${city.state_abbr} | Hours, Prices & Reviews`;
  const description = `${pool.name} in ${city.city_name}, ${city.state_abbr}${pool.rating ? ` – rated ${pool.rating.toFixed(1)}★` : ""}. Get hours, admission prices, amenities, directions & local tips for this public swimming pool.`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Public Pools", item: "https://www.poolrentalnearme.com/public-pools/" },
      { "@type": "ListItem", position: 2, name: stateName, item: `https://www.poolrentalnearme.com/public-pools/${stateSlug}/` },
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
      addressCountry: "US",
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
    priceRange: pool.price_notes || (pool.price_adult ? `$${pool.price_adult}` : "$"),
    amenityFeature: pool.amenities?.map(a => ({ "@type": "LocationFeatureSpecification", name: a, value: true })),
  };

  const faqs = [
    {
      q: `What are the hours for ${pool.name}?`,
      a: hoursArray.length > 0
        ? `${pool.name} hours: ${hoursArray.join("; ")}. Hours may vary seasonally — always call ahead or check the official website before visiting.`
        : `Hours for ${pool.name} have not been posted yet. Most public pools in ${city.city_name} are open ${season}. Check the pool's official website or call ${pool.phone || "the front desk"} for current hours.`,
    },
    {
      q: `How much does it cost to swim at ${pool.name}?`,
      a: pool.price_notes
        ? `${pool.price_notes} Many pools also offer season passes, family packages, and discounted rates for ${city.city_name} residents.`
        : pool.price_adult
          ? `Admission at ${pool.name}: Adults ${pool.price_adult}, Children ${pool.price_child || "varies"}. Contact the pool for information about season passes, group rates, and resident discounts.`
          : `Admission pricing for ${pool.name} has not been posted yet. Most public pools in ${city.state_abbr} charge $2–$8 per visit. Many offer season passes and discounted rates for residents. Contact ${pool.name} directly for current pricing.`,
    },
    {
      q: `Is ${pool.name} good for families with kids?`,
      a: pool.amenities?.length
        ? `Yes! ${pool.name} is a family-friendly facility offering ${pool.amenities.slice(0, 4).join(", ")}${pool.amenities.length > 4 ? " and more" : ""}. ${pool.rating ? `It has a ${pool.rating.toFixed(1)}-star rating from ${pool.review_count ?? 0} reviews.` : ""} Lifeguards are typically on duty during public swim sessions. Swim lessons are available at most ${city.city_name} pools.`
        : `${pool.name} is a public swimming facility in ${city.city_name} that welcomes families. ${pool.rating ? `It has a ${pool.rating.toFixed(1)}-star rating from ${pool.review_count ?? 0} reviews.` : ""} Contact the pool for details on children's programs, shallow areas, and family swim times.`,
    },
    {
      q: `What should I bring to ${pool.name}?`,
      a: `Bring a swimsuit, towel, sunscreen (SPF 30+), water bottle, and a lock for the lockers. Swim goggles and a swim cap are optional but recommended for lap swimming. Most public pools don't allow glass containers, inflatable toys larger than arm floaties, or outside food on the pool deck.`,
    },
    {
      q: `Can I rent a private pool near ${pool.name} instead?`,
      a: `Absolutely! If you want a private swimming experience without the crowds, PoolRentalNearMe.com connects you with backyard pool owners in ${city.city_name} who rent their pools by the hour — starting at just $25/hr. Perfect for birthday parties, date nights, or just a quiet swim. No membership fees, no commissions.`,
    },
    {
      q: `Are there other public pools near ${pool.name}?`,
      a: nearbyPools && nearbyPools.length > 0
        ? `Yes! Other public pools in ${city.city_name} include ${nearbyPools.slice(0, 3).map((p: any) => p.name).join(", ")}. Visit our ${city.city_name} public pools page for the complete list with ratings and directions.`
        : `Check our ${city.city_name} public pools page for a full list of swimming options in the area, including neighboring cities.`,
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
        ogImage={pool.image_url || undefined}
        ogType="place"
      />

      {/* ━━━ Hero ━━━ */}
      <section className="relative bg-prnm-light-blue py-10 md:py-14">
        <WaveBg />
        <div className="container relative z-10">
          <nav className="text-sm text-muted-foreground mb-4 flex flex-wrap items-center gap-1">
            <Link to="/public-pools" className="hover:text-primary">Public Pools</Link>
            <span>/</span>
            <Link to={`/public-pools/${stateSlug}`} className="hover:text-primary">{stateName}</Link>
            <span>/</span>
            <Link to={`/public-pools/${stateSlug}/${citySlug}`} className="hover:text-primary">{city.city_name}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{pool.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-4xl font-extrabold text-foreground">{pool.name}</h1>
                <PoolTypeBadge type={pool.pool_type} />
              </div>
              <StarRating rating={pool.rating} reviewCount={pool.review_count} />
              {fullAddress && (
                <p className="flex items-center gap-1.5 text-muted-foreground mt-2">
                  <MapPin className="h-4 w-4 shrink-0" /> {fullAddress}
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

      {/* ━━━ Main Content ━━━ */}
      <section className="container py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-10">

            {/* Image */}
            <div className="rounded-lg overflow-hidden border bg-gradient-to-br from-blue-100 to-cyan-50">
              {pool.image_url ? (
                <img
                  src={pool.image_url}
                  alt={`${pool.name} public swimming pool in ${city.city_name}, ${city.state_abbr}`}
                  className="w-full h-64 md:h-96 object-cover"
                  loading="eager"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-64 md:h-96 flex flex-col items-center justify-center text-muted-foreground">
                  <Waves className="h-16 w-16 mb-3 text-primary/40" />
                  <p className="text-lg font-medium">{pool.name}</p>
                  <p className="text-sm">{city.city_name}, {city.state_abbr}</p>
                </div>
              )}
            </div>

            {/* ── About ── */}
            <article className="prose prose-sm max-w-none">
              <h2 className="text-xl font-bold mb-3">About {pool.name}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {pool.description || `${pool.name} is a public swimming pool located in ${city.city_name}, ${city.state_abbr}.`}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Located at {pool.address || city.city_name}, this {pool.pool_type?.toLowerCase() || "public"} pool serves
                the {city.city_name} community{city.population ? ` (population ${city.population.toLocaleString()})` : ""} with
                swimming opportunities during {season}. {pool.rating ? `With a ${pool.rating.toFixed(1)}-star rating from ${pool.review_count ?? 0} reviews, it's one of the top-rated pools in the area.` : ""}
              </p>
              {pool.amenities && pool.amenities.length > 0 && (
                <p className="text-muted-foreground leading-relaxed">
                  {pool.name} features {pool.amenities.join(", ").toLowerCase()}
                  {pool.amenities.length > 3 ? " — making it one of the most well-equipped public pools in " + city.city_name : ""}.
                  Whether you're looking for lap swimming, recreational splash time, or swim lessons, this facility has you covered.
                </p>
              )}
            </article>

            {/* ── Quick Facts ── */}
            <div className="bg-secondary/50 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" /> Quick Facts – {pool.name}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div><span className="font-semibold block text-foreground">Pool Type</span><span className="text-muted-foreground">{pool.pool_type || "Public Pool"}</span></div>
                <div><span className="font-semibold block text-foreground">Rating</span><span className="text-muted-foreground">{pool.rating ? `${pool.rating.toFixed(1)} ★ (${pool.review_count} reviews)` : "Not yet rated"}</span></div>
                <div><span className="font-semibold block text-foreground">City</span><span className="text-muted-foreground">{city.city_name}, {city.state_abbr}</span></div>
                <div><span className="font-semibold block text-foreground">Admission</span><span className="text-muted-foreground">{pool.price_notes || pool.price_adult || "Contact for pricing"}</span></div>
                <div><span className="font-semibold block text-foreground">Season</span><span className="text-muted-foreground capitalize">{season}</span></div>
                <div><span className="font-semibold block text-foreground">Phone</span><span className="text-muted-foreground">{pool.phone || "Not listed"}</span></div>
              </div>
            </div>

            {/* ── Details Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-5">
                <h3 className="font-bold flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-primary" /> Hours of Operation
                </h3>
                {hoursArray.length > 0 ? (
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {hoursArray.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>Hours have not been posted yet. Most {city.city_name} pools operate {season}.</p>
                    {pool.website && (
                      <a href={pool.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                        Check official website <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-5">
                <h3 className="font-bold flex items-center gap-2 mb-3">
                  <DollarSign className="h-5 w-5 text-primary" /> Admission & Pricing
                </h3>
                {pool.price_notes ? (
                  <p className="text-sm text-muted-foreground">{pool.price_notes}</p>
                ) : pool.price_adult || pool.price_child ? (
                  <div className="text-sm text-muted-foreground space-y-1">
                    {pool.price_adult && <p>Adult: {pool.price_adult}</p>}
                    {pool.price_child && <p>Child: {pool.price_child}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Pricing not yet listed. Most public pools in {city.state_abbr} charge $2–$8 per visit. Many offer season passes and discounted rates for local residents.</p>
                )}
              </div>

              <div className="border rounded-lg p-5">
                <h3 className="font-bold flex items-center gap-2 mb-3">
                  <Phone className="h-5 w-5 text-primary" /> Contact Information
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  {pool.phone && <p>Phone: <a href={`tel:${pool.phone}`} className="text-primary hover:underline">{pool.phone}</a></p>}
                  {pool.website && (
                    <p>Website: <a href={pool.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Visit site <ExternalLink className="h-3 w-3" /></a></p>
                  )}
                  {fullAddress && <p>Address: {fullAddress}</p>}
                  {!pool.phone && !pool.website && <p>Contact information not yet available. Check local government websites for {city.city_name} parks & recreation contact info.</p>}
                </div>
              </div>

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
                  <p className="text-sm text-muted-foreground">Amenities not yet listed. Contact {pool.name} directly for information about available facilities.</p>
                )}
              </div>
            </div>

            {/* ── Map ── */}
            {pool.latitude && pool.longitude && (
              <div className="border rounded-lg overflow-hidden">
                <h3 className="font-bold p-5 pb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Location & Directions
                </h3>
                <div className="px-5 pb-3 text-sm text-muted-foreground">
                  <p>{pool.name} is located at {fullAddress}. {pool.google_maps_url ? "Click the link below for turn-by-turn directions." : ""}</p>
                </div>
                <div className="w-full h-64 bg-muted flex items-center justify-center border-t">
                  <a
                    href={pool.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${pool.latitude},${pool.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    <Navigation className="h-5 w-5" /> Open in Google Maps →
                  </a>
                </div>
              </div>
            )}

            {/* ━━━ Swimming Tips ━━━ */}
            <div>
              <h2 className="text-xl font-bold mb-2">Tips for Visiting {pool.name}</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Planning a trip to {pool.name}? Here's everything you need to know for a great experience at this {city.city_name} public pool.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {swimmingTips.map((tip, i) => (
                  <div key={i} className="border rounded-lg p-5">
                    <h3 className="font-semibold flex items-center gap-2 mb-2 text-sm">
                      <tip.icon className="h-4 w-4 text-primary" /> {tip.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ━━━ CTA Banner ━━━ */}
            <div className="bg-primary rounded-lg p-6 md:p-8 text-primary-foreground">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Want a Private Pool Instead? 🏊</h2>
              <p className="mb-4 text-primary-foreground/90">
                Skip the crowds at {pool.name}. Rent a private backyard pool in {city.city_name} for as little as $25/hr on PoolRentalNearMe.com — perfect for parties, date nights, or just a quiet swim.
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                {["No lines or crowds", "Private backyard access", "Free digital waivers", "Book in minutes"].map(perk => (
                  <span key={perk} className="flex items-center gap-1 text-sm">
                    <CheckCircle2 className="h-4 w-4" /> {perk}
                  </span>
                ))}
              </div>
              <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
                <a href={city.prnm_url || `https://www.poolrentalnearme.com/s?address=${encodeURIComponent(city.city_name + ", " + city.state_abbr)}`} target="_blank" rel="noopener noreferrer">
                  Browse Private Pools in {city.city_name} <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </div>

            {/* ━━━ Things to Do ━━━ */}
            <div>
              <h2 className="text-xl font-bold mb-2">Things to Do Near {pool.name}</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Make the most of your visit to {city.city_name} — here's what's nearby.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {thingsToDo.map((item, i) => (
                  <div key={i} className="border rounded-lg p-5">
                    <h3 className="font-semibold flex items-center gap-2 mb-2 text-sm">
                      <item.icon className="h-4 w-4 text-primary" /> {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ━━━ Local Swimming Guide ━━━ */}
            <article className="prose prose-sm max-w-none">
              <h2 className="text-xl font-bold mb-3">Swimming in {city.city_name}, {city.state_abbr} – A Local Guide</h2>
              <p className="text-muted-foreground leading-relaxed">
                {city.city_name} is home to {city.pool_count || "several"} public swimming {(city.pool_count ?? 0) === 1 ? "pool" : "pools"}, offering
                residents and visitors affordable aquatic recreation during the {climate} {city.state_abbr} {season.includes("year") ? "year" : "summer months"}.
                {pool.name} is {pool.rating && pool.rating >= 4.3 ? "one of the highest-rated options" : "a popular choice"} in the city,
                known for its {pool.amenities?.slice(0, 2).join(" and ").toLowerCase() || "community-focused atmosphere"}.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Public pools in {city.city_name} are managed by the city's Parks & Recreation department and typically offer
                recreational swim, lap swimming, swim lessons, and water safety programs. Many pools also host community events,
                swim teams, and water aerobics classes. For the most up-to-date information on schedules and programming,
                contact your local parks department or visit the pool's official website.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Looking for a more private swimming experience? <a href={`https://www.poolrentalnearme.com/s?address=${encodeURIComponent(city.city_name + ", " + city.state_abbr)}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">PoolRentalNearMe.com</a> offers
                hourly rentals of private backyard pools in {city.city_name} and surrounding areas — no membership required, no commissions for hosts.
              </p>
            </article>

            {/* ━━━ Other Pools in City ━━━ */}
            {nearbyPools && nearbyPools.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-2">Other Public Pools in {city.city_name}</h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Explore more swimming options in {city.city_name}, {city.state_abbr}.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {nearbyPools.map((np: any) => (
                    <Link
                      key={np.id}
                      to={`/public-pools/${stateSlug}/${citySlug}/${np.slug}`}
                      className="border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all group"
                    >
                      <h3 className="font-semibold text-sm group-hover:text-primary">{np.name}</h3>
                      <StarRating rating={np.rating} reviewCount={np.review_count} />
                      <div className="flex items-center gap-2 mt-1">
                        {np.pool_type && <PoolTypeBadge type={np.pool_type} />}
                      </div>
                      {np.address && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {np.address}</p>}
                    </Link>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to={`/public-pools/${stateSlug}/${citySlug}`} className="text-primary hover:underline font-medium text-sm inline-flex items-center gap-1">
                    View all {city.city_name} public pools <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* ━━━ Regional Pools ━━━ */}
            {regionalPools && regionalPools.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-2">Public Pools Across {stateName}</h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Explore top-rated public pools in other {stateName} cities.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {regionalPools.map((rp: any) => {
                    const rpCity = (rp as any).cities;
                    return (
                      <Link
                        key={rp.id}
                        to={`/public-pools/${rpCity.state_slug}/${rpCity.city_slug}/${rp.slug}`}
                        className="border rounded-lg p-3 hover:border-primary hover:shadow-sm transition-all group text-sm"
                      >
                        <span className="font-semibold group-hover:text-primary">{rp.name}</span>
                        <span className="text-muted-foreground block text-xs">{rpCity.city_name}, {rpCity.state_abbr}</span>
                        <StarRating rating={rp.rating} reviewCount={rp.review_count} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ━━━ Nearby Cities ━━━ */}
            {nearbyCities && nearbyCities.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-2">Public Pools in Nearby Cities</h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Find more swimming options near {city.city_name}.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {nearbyCities.map((nc) => (
                    <Link
                      key={nc.id}
                      to={`/public-pools/${nc.state_slug}/${nc.city_slug}`}
                      className="border rounded-lg p-3 hover:border-primary hover:shadow-sm transition-all text-sm"
                    >
                      <span className="font-semibold">{nc.city_name}, {nc.state_abbr}</span>
                      {(nc.pool_count ?? 0) > 0 && <Badge variant="secondary" className="ml-2 text-xs">{nc.pool_count} pools</Badge>}
                    </Link>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to={`/public-pools/${stateSlug}`} className="text-primary hover:underline font-medium text-sm inline-flex items-center gap-1">
                    Browse all {stateName} cities <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* ━━━ Internal Links Block ━━━ */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-bold mb-4">Explore More on PoolRentalNearMe.com</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <Link to="/public-pools" className="text-primary hover:underline flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" /> All Public Pools by State
                </Link>
                <Link to={`/public-pools/${stateSlug}`} className="text-primary hover:underline flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" /> {stateName} Public Pools
                </Link>
                <Link to={`/public-pools/${stateSlug}/${citySlug}`} className="text-primary hover:underline flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" /> {city.city_name} Public Pools
                </Link>
                <a href="https://www.poolrentalnearme.com/become-a-host" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" /> List Your Pool – Earn $500+/mo
                </a>
                <a href={`https://www.poolrentalnearme.com/s?address=${encodeURIComponent(city.city_name)}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" /> Rent a Private Pool in {city.city_name}
                </a>
                <a href="https://www.rentalwaivers.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" /> Free Pool Waivers
                </a>
              </div>
            </div>

            {/* ━━━ FAQ ━━━ */}
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold mb-2">{pool.name} – Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Common questions about visiting {pool.name} in {city.city_name}, {city.state_abbr}.
              </p>
              <Accordion type="single" collapsible>
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* ━━━ Sidebar ━━━ */}
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
