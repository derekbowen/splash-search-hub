import { useMemo } from "react";
import { MapPin } from "lucide-react";
import { privatePoolListings, type PrivatePoolListing } from "@/data/privatePoolListings";
import { Button } from "@/components/ui/button";

interface FeaturedPrivatePoolsProps {
  stateAbbr?: string;
  count?: number;
  heading?: string;
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

/** Fake "near me" distance based on deterministic hash */
function pseudoDistance(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  const miles = 2 + Math.abs(h % 23); // 2–24 miles
  return `${miles} mi away`;
}

const FeaturedPrivatePools = ({
  stateAbbr,
  count = 4,
  heading = "Skip the Crowds — Rent a Private Pool",
  subheading,
}: FeaturedPrivatePoolsProps) => {
  const pools = useMemo(() => {
    if (stateAbbr) {
      const stateMatch = privatePoolListings.filter(
        (p) => p.state.toUpperCase() === stateAbbr.toUpperCase()
      );
      if (stateMatch.length >= count) {
        return shuffleSeed(stateMatch, stateAbbr.charCodeAt(0)).slice(0, count);
      }
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
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 shrink-0" />
                <span>{pseudoDistance(pool.name)}</span>
                <span className="mx-1">·</span>
                <span>{pool.city}, {pool.state}</span>
              </div>
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-sm font-bold text-primary">
                  From ${pool.price}/hr
                </span>
              </div>
              <Button
                size="sm"
                className="w-full mt-2 text-xs"
                variant="default"
                asChild
              >
                <span>Book Now on PoolRentalNearMe.com</span>
              </Button>
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
