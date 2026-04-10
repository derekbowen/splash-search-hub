import { Button } from "@/components/ui/button";

interface CtaBannerProps {
  cityName?: string;
  stateName?: string;
  prnmUrl?: string;
}

const CtaBanner = ({ cityName, stateName, prnmUrl }: CtaBannerProps) => {
  const location = cityName || stateName || "";
  const browseUrl = prnmUrl || (stateName
    ? `https://www.poolrentalnearme.com/s?address=${encodeURIComponent(stateName)}`
    : "https://www.poolrentalnearme.com");

  return (
    <section className="bg-primary text-primary-foreground py-12 px-4">
      <div className="container text-center max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Why Fight for a Lane? Rent a Private Pool From $25/hr
        </h2>
        <div className="flex flex-wrap justify-center gap-4 text-sm mb-6">
          <span>✓ No crowds</span>
          <span>✓ Private access</span>
          <span>✓ Perfect for parties</span>
          <span>✓ Free digital waivers</span>
        </div>
        <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
          <a href={browseUrl} target="_blank" rel="noopener noreferrer">
            Browse Private Pools {location ? `in ${location}` : ""} →
          </a>
        </Button>
        <p className="mt-4 text-sm text-primary-foreground/70">
          <a href="https://www.rentalwaivers.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-foreground">
            Free pool waivers at RentalWaivers.com
          </a>
        </p>
      </div>
    </section>
  );
};

export default CtaBanner;
