import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import WaveBg from "@/components/WaveBg";
import CtaBanner from "@/components/CtaBanner";
import FeaturedPrivatePools from "@/components/FeaturedPrivatePools";
import { useStates } from "@/hooks/useStates";
import { usePopularCities } from "@/hooks/useCities";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, MapPin } from "lucide-react";

const faqs = [
  {
    q: "How much do public pools cost?",
    a: "Most public pools charge between $2–$8 for daily admission, with discounts for children, seniors, and residents. Some municipal pools are free. For a more private experience, you can rent a private backyard pool from $25/hr on PoolRentalNearMe.com.",
  },
  {
    q: "Do public pools require reservations?",
    a: "Some public pools, especially during peak summer months, may require advance reservations or have capacity limits. Private pools on PoolRentalNearMe.com guarantee your time slot with no crowds.",
  },
  {
    q: "What should I bring to a public pool?",
    a: "Bring a swimsuit, towel, sunscreen, water bottle, and any required ID or membership cards. Most pools have rules about outside food and inflatables — check ahead.",
  },
  {
    q: "Are there alternatives to crowded public pools?",
    a: "Yes! PoolRentalNearMe.com connects you with private pool owners who rent their backyard pools by the hour. Enjoy private access, no crowds, and a perfect setting for parties and gatherings.",
  },
  {
    q: "How do I rent a private pool?",
    a: "Visit PoolRentalNearMe.com, search by your location, browse available pools, and book instantly. No commissions for hosts — just $9/month. Guests pay per hour, starting from $25/hr.",
  },
];

const PublicPoolsHub = () => {
  const { data: states, isLoading: statesLoading } = useStates();
  const { data: popularCities } = usePopularCities();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"alpha" | "pools">("alpha");
  const navigate = useNavigate();

  const filteredStates = useMemo(() => {
    if (!states) return [];
    let filtered = states.filter(
      (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.abbreviation.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "pools") {
      filtered = [...filtered].sort((a, b) => (b.pool_count ?? 0) - (a.pool_count ?? 0));
    }
    return filtered;
  }, [states, search, sort]);

  // Also search cities
  const matchedCities = useMemo(() => {
    if (!popularCities || search.length < 2) return [];
    return popularCities.filter((c) =>
      c.city_name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 5);
  }, [popularCities, search]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PoolRentalNearMe.com - Public Pools Directory",
    url: "https://www.poolrentalnearme.com/public-pools/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.poolrentalnearme.com/public-pools/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Layout>
      <SEOHead
        title="Public Swimming Pools in the US | Find Pools Near You | PoolRentalNearMe.com"
        description="Find public, community & municipal swimming pools across all 50 states. Hours, prices, ratings & directions. Or rent a private backyard pool from $25/hr."
        canonical="https://www.poolrentalnearme.com/public-pools/"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="relative bg-prnm-light-blue py-16 md:py-24">
        <WaveBg />
        <div className="container relative z-10 text-center max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
            Public Swimming Pools in the United States
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Find public, community, and municipal pools near you — or skip the crowds and rent a private backyard pool.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by city or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-base"
            />
            {matchedCities.length > 0 && search.length >= 2 && (
              <div className="absolute top-full mt-1 w-full bg-background border rounded-md shadow-lg z-20">
                {matchedCities.map((c) => (
                  <button
                    key={c.id}
                    className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2 text-sm"
                    onClick={() => {
                      navigate(`/public-pools/${c.state_slug}/${c.city_slug}`);
                      setSearch("");
                    }}
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {c.city_name}, {c.state_abbr}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* States Grid */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Browse by State</h2>
          <div className="flex gap-2">
            <Button variant={sort === "alpha" ? "default" : "outline"} size="sm" onClick={() => setSort("alpha")}>
              A-Z
            </Button>
            <Button variant={sort === "pools" ? "default" : "outline"} size="sm" onClick={() => setSort("pools")}>
              By Pool Count
            </Button>
          </div>
        </div>
        {statesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredStates.map((state) => (
              <Link
                key={state.id}
                to={`/public-pools/${state.slug}`}
                className="group border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{state.name}</h3>
                    <span className="text-xs text-muted-foreground">{state.abbreviation}</span>
                  </div>
                  {(state.pool_count ?? 0) > 0 && (
                    <Badge variant="secondary" className="text-xs">{state.pool_count} pools</Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Popular Cities */}
      {popularCities && popularCities.length > 0 && (
        <section className="bg-muted/50 py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Popular Cities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularCities.map((city) => (
                <Link
                  key={city.id}
                  to={`/public-pools/${city.state_slug}/${city.city_slug}`}
                  className="group border rounded-lg p-4 bg-background hover:border-primary hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{city.city_name}</h3>
                  <span className="text-xs text-muted-foreground">{city.state_abbr}</span>
                  {(city.pool_count ?? 0) > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">{city.pool_count} pools</Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Private Pools */}
      <div className="container">
        <FeaturedPrivatePools count={4} heading="Why Wait? Rent a Private Pool Instead" subheading="Real pools from real hosts — book by the hour, no membership needed." />
      </div>

      {/* CTA */}
      <CtaBanner />

      {/* FAQ */}
      <section className="container py-12 max-w-3xl">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
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

export default PublicPoolsHub;
