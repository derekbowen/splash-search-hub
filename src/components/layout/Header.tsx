import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Public Pools", href: "/public-pools", internal: true },
    { label: "Rent a Private Pool", href: "https://www.poolrentalnearme.com", internal: false },
    { label: "Free Waivers", href: "https://www.rentalwaivers.com", internal: false },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <a href="https://www.poolrentalnearme.com" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">PoolRentalNearMe.com</span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
            link.internal ? (
              <Link key={link.label} to={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {link.label}
              </a>
            )
          )}
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) =>
              link.internal ? (
                <Link key={link.label} to={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  {link.label}
                </a>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
