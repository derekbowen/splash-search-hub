import { Button } from "@/components/ui/button";

interface StickyCtaSidebarProps {
  cityName: string;
  prnmUrl?: string;
}

const StickyCtaSidebar = ({ cityName, prnmUrl }: StickyCtaSidebarProps) => {
  const browseUrl = prnmUrl || `https://www.poolrentalnearme.com/s?address=${encodeURIComponent(cityName)}`;

  return (
    <div className="bg-primary text-primary-foreground rounded-lg p-6 sticky top-20">
      <h3 className="text-xl font-bold mb-3">Skip the Crowds 🏊</h3>
      <p className="text-sm mb-4">Rent a private pool in {cityName} from $25/hr</p>
      <ul className="text-sm space-y-2 mb-6">
        <li>✓ No lines, no waiting</li>
        <li>✓ Private backyard access</li>
        <li>✓ Perfect for parties & gatherings</li>
        <li>✓ Free digital waivers included</li>
      </ul>
      <Button asChild size="lg" className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
        <a href={browseUrl} target="_blank" rel="noopener noreferrer">
          Browse Private Pools in {cityName} →
        </a>
      </Button>
      <div className="mt-4 space-y-2 text-xs">
        <a href="https://www.rentalwaivers.com" target="_blank" rel="noopener noreferrer" className="block underline text-primary-foreground/70 hover:text-primary-foreground">
          Need a pool waiver? Get one free →
        </a>
        <a href={prnmUrl || "https://www.poolrentalnearme.com/become-a-host"} target="_blank" rel="noopener noreferrer" className="block underline text-primary-foreground/70 hover:text-primary-foreground">
          Own a pool? Earn $500+/month →
        </a>
      </div>
    </div>
  );
};

export default StickyCtaSidebar;
