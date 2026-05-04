import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PRNM = "https://www.poolrentalnearme.com";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      window.location.href = `${PRNM}/s?location=${encodeURIComponent(q)}`;
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container flex h-14 items-center gap-4">
        {/* Logo — matches .com style */}
        <Link to="/public-pools" className="flex items-center gap-2 shrink-0">
          <img
            src="https://www.poolrentalnearme.com/static/media/prnm-logo.d4c07064.png"
            alt="Pool Rental Near Me"
            className="h-8 w-auto"
            onError={(e) => {
              // fallback if image fails
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center hidden">
            <span className="text-primary-foreground font-bold text-xs">🏊</span>
          </div>
        </Link>

        {/* Search bar — desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Find pools near you..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-full border bg-muted/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </form>

        {/* Right nav — clean like .com */}
        <nav className="hidden md:flex items-center gap-1 ml-auto">
          <Link to="/public-pools" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
            Public Pools
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-1">
                More <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem asChild>
                <a href={`${PRNM}/s`} target="_blank" rel="noopener noreferrer">Find a Pool</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={`${PRNM}/p/howitworksforguests`} target="_blank" rel="noopener noreferrer">How It Works</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href={`${PRNM}/l/new`} target="_blank" rel="noopener noreferrer">List Your Pool</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://bookmypool.com" target="_blank" rel="noopener noreferrer">BookMyPool.com</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://www.rentalwaivers.com" target="_blank" rel="noopener noreferrer">RentalWaivers.com</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://poolhostpro.com" target="_blank" rel="noopener noreferrer">PoolHostPro.com</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href={`${PRNM}/p/all-locations`} target="_blank" rel="noopener noreferrer">Locations</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <a href={`${PRNM}/signup`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
            Sign up
          </a>
          <a href={`${PRNM}/login`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
            Log in
          </a>
        </nav>

        {/* Mobile hamburger */}
        <Button variant="ghost" size="icon" className="md:hidden ml-auto" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white p-4 space-y-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Find pools near you..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-full border bg-muted/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            <Link to="/public-pools" className="text-sm font-medium py-2 px-3 rounded-md hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Public Pools</Link>
            <a href={`${PRNM}/s`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium py-2 px-3 rounded-md hover:bg-gray-50 text-gray-600">Find a Pool</a>
            <a href={`${PRNM}/l/new`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium py-2 px-3 rounded-md hover:bg-gray-50 text-gray-600">List Your Pool</a>
            <a href="https://bookmypool.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium py-2 px-3 rounded-md hover:bg-gray-50 text-gray-600">BookMyPool.com</a>
            <a href="https://www.rentalwaivers.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium py-2 px-3 rounded-md hover:bg-gray-50 text-gray-600">RentalWaivers.com</a>
            <div className="border-t my-2" />
            <div className="flex gap-2">
              <a href={`${PRNM}/signup`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-sm font-medium py-2 rounded-md border hover:bg-gray-50">Sign up</a>
              <a href={`${PRNM}/login`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-sm font-medium py-2 rounded-md border hover:bg-gray-50">Log in</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
