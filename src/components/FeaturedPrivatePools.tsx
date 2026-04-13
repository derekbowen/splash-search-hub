import { useMemo } from "react";
import { privatePoolListings, type PrivatePoolListing } from "@/data/privatePoolListings";

/**
 * Featured Private Pools component — shows real PRNM marketplace listings
 * with actual photos. Displays pools relevant to the current state/city context,
 * or random featured pools if no match.
 */

interface FeaturedPrivatePoolsProps {
  /** Filter pools to this state abbreviation (e.g. "CA", "TX") */
  stateAbbr?: string;
  /** Max number of pools to show */
  count?: number;
  /** Section heading override */
  heading?: string;
  /** Optional subheading */
  subheading?: string;
}

function shuffleSeed(arr: PrivatePoolListing[], seed: number) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.abs((seed * (i + 1)) % (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const FeaturedPrivatePools = ({
  stateAbbr,
  count = 4,
  heading = "Skip the Crowds — Rent a Private Pool",
  subheading,
}: FeaturedPrivatePoolsProps) => {
  const pools = useMemo(() => {
    // Try state-specific pools first
    if (stateAbbr) {
      const stateMatch = privatePoolListings.filter(
        (p) => p.state.toUpperCase() === stateAbbr.toUpperCase()
      );
      if (stateMatch.length >= count) {
        return shuffleSeed(stateMatch, stateAbbr.charCodeAt(0)).slice(0, count);
      }
      // If not enough in-state, pad with others
      if (stateMatch.length > 0) {
        const others = privatePoolListings.filter(
          (p) => p.state.toUpperCase() !== stateAbbr.toUpperCase()
        );
        return [
          ...stateMatch.slice(0, count),
          ...shuffleSeed(others, stateAbbr.charCodeAt(0)).slice(0, count - stateMatch.length),
        ];
      }
    }
    // Random selection
    return shuffleSeed(privatePoolListings, 42).slice(0, count);
  }, [stateAbbr, count]);

  if (pools.length === 0) return null;

  return (
    <section className="py-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">{heading}</h2>
        {subheading && (
          <p className="text-muted-foreground mt-1">{subheading}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pools.map((pool) => (
          <a
            key={pool.bookingUrl}
            href={pool.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-shadow"
          >
            <div className="aspect-[3/2] overflow-hidden bg-muted">
              <img
                src={pool.imageUrl}
                alt={pool.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {pool.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {pool.city}, {pool.state}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-primary">
                  From ${pool.price}/hr
                </span>
                <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Book Now →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className="mt-4 text-center">
        <a
          href="https://www.poolrentalnearme.com/s"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary font-medium hover:underline"
        >
          Browse all {privatePoolListings.length} private pools →
        </a>
      </div>
    </section>
  );
};

export default FeaturedPrivatePools;
