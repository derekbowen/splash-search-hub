import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import WaveBg from "@/components/WaveBg";
import CtaBanner from "@/components/CtaBanner";
import { useStateBySlug, useStates } from "@/hooks/useStates";
import { useCitiesByState } from "@/hooks/useCities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

const StatePage = () => {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const { data: state, isLoading: stateLoading } = useStateBySlug(stateSlug || "");
  const { data: cities, isLoading: citiesLoading } = useCitiesByState(stateSlug || "");
  const { data: allStates } = useStates();
  const [sort, setSort] = useState<"alpha" | "pools" | "population">("alpha");

  const sortedCities = useMemo(() => {
    if (!cities) return [];
    const copy = [...cities];
    switch (sort) {
      case "pools": return copy.sort((a, b) => (b.pool_count ?? 0) - (a.pool_count ?? 0));
      case "population": return copy.sort((a, b) => (b.population ?? 0) - (a.population ?? 0));
      default: return copy;
    }
  }, [cities, sort]);

  const nearbyStates = useMemo(() => {
    if (!allStates || !state?.latitude || !state?.longitude) return [];
    return allStates
      .filter((s) => s.id !== state.id && s.latitude && s.longitude)
      .sort((a, b) => {
        const distA = Math.sqrt(Math.pow((a.latitude ?? 0) - state.latitude!, 2) + Math.pow((a.longitude ?? 0) - state.longitude!, 2));
        const distB = Math.sqrt(Math.pow((b.latitude ?? 0) - state.latitude!, 2) + Math.pow((b.longitude ?? 0) - state.longitude!, 2));
        return distA - distB;
      })
      .slice(0, 6);
  }, [allStates, state]);

  if (stateLoading) {
    return <Layout><div className="container py-12"><div className="h-8 w-64 bg-muted animate-pulse rounded mb-4" /></div></Layout>;
  }

  if (!state) {
    return <Layout><div className="container py-12"><h1 className="text-2xl font-bold">State not found</h1></div></Layout>;
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Public Pools", item: "https://www.poolrentalnearme.com/public-pools/" },
      { "@type": "ListItem", position: 2, name: state.name, item: `https://www.poolrentalnearme.com/public-pools/${state.slug}/` },
    ],
  };

  return (
    <Layout>
      <SEOHead
        title={state.meta_title || `Public Swimming Pools in ${state.name} | PoolRentalNearMe.com`}
        description={state.meta_description || `Find public and community swimming pools across ${state.name}. Hours, prices, ratings & directions.`}
        canonical={`https://www.poolrentalnearme.com/public-pools/${state.slug}/`}
        jsonLd={breadcrumbJsonLd}
      />

      <section className="relative bg-prnm-light-blue py-12 md:py-16">
        <WaveBg />
        <div className="container relative z-10">
          <nav className="text-sm text-muted-foreground mb-4">
            <Link to="/public-pools" className="hover:text-primary">Public Pools</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{state.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
            Public Swimming Pools in {state.name}
          </h1>
          <p className="text-muted-foreground">
            Find {state.pool_count ?? 0} public and community pools across {state.name}
          </p>
        </div>
      </section>

      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Cities in {state.name}</h2>
          <div className="flex gap-2">
            <Button variant={sort === "alpha" ? "default" : "outline"} size="sm" onClick={() => setSort("alpha")}>A-Z</Button>
            <Button variant={sort === "pools" ? "default" : "outline"} size="sm" onClick={() => setSort("pools")}>Pools</Button>
            <Button variant={sort === "population" ? "default" : "outline"} size="sm" onClick={() => setSort("population")}>Population</Button>
          </div>
        </div>

        {citiesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-28 bg-muted animate-pulse rounded-lg" />)}
          </div>
        ) : sortedCities.length === 0 ? (
          <p className="text-muted-foreground">No cities found for this state yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sortedCities.map((city) => (
              <Link
                key={city.id}
                to={`/public-pools/${city.state_slug}/${city.city_slug}`}
                className="group border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{city.city_name}</h3>
                    {city.population && (
                      <p className="text-xs text-muted-foreground">Pop. {city.population.toLocaleString()}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {city.prnm_exclusive && (
                      <span className="text-xs flex items-center gap-0.5 text-orange-600"><Flame className="h-3 w-3" /> Featured</span>
                    )}
                    {city.priority_tier === "TIER 1" && (
                      <Badge variant="secondary" className="text-xs">Tier 1</Badge>
                    )}
                  </div>
                </div>
                {(city.pool_count ?? 0) > 0 && (
                  <Badge variant="secondary" className="mt-2 text-xs">{city.pool_count} pools</Badge>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Private Pools in this state */}
      <div className="container">
        <FeaturedPrivatePools
          stateAbbr={state.abbreviation}
          count={4}
          heading={`Private Pools for Rent in ${state.name}`}
          subheading={`Skip the crowds — book a private backyard pool from $25/hr.`}
        />
      </div>

      <CtaBanner stateName={state.name} />

      {nearbyStates.length > 0 && (
        <section className="container py-12">
          <h2 className="text-xl font-bold mb-6">Explore Nearby States</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {nearbyStates.map((s) => (
              <Link key={s.id} to={`/public-pools/${s.slug}`} className="border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all">
                <span className="font-semibold">{s.name}</span>
                {(s.pool_count ?? 0) > 0 && <Badge variant="secondary" className="ml-2 text-xs">{s.pool_count} pools</Badge>}
              </Link>
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default StatePage;
