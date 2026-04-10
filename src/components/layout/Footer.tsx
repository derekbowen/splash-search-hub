import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Linkedin, Twitter } from "lucide-react";

const PRNM = "https://www.poolrentalnearme.com";

const Footer = () => {
  return (
    <footer className="bg-prnm-dark text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <h3 className="text-lg font-bold mb-2">PoolRentalNearMe.com</h3>
            <p className="text-sm text-primary-foreground/70 mb-4">
              The #1 pool rental marketplace. No commissions — just $9/month for hosts.
            </p>
            <div className="flex gap-3 mb-4">
              <a href="https://www.facebook.com/poolrentalnearme" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="https://www.instagram.com/poolrentalnearme" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="https://x.com/poolrentalnearm" target="_blank" rel="noopener noreferrer" aria-label="X" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="https://www.youtube.com/@poolrentalnearme" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors"><Youtube className="h-5 w-5" /></a>
              <a href="https://www.linkedin.com/company/poolrentalnearme/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href="https://www.tiktok.com/@poolrental" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.81.11v-3.5a6.37 6.37 0 00-.81-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.81a8.24 8.24 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.22z"/></svg>
              </a>
              <a href="https://www.pinterest.com/derekbowencorp/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
              </a>
            </div>
            <div className="flex gap-2">
              <a href="https://apps.apple.com/us/app/pool-rental-near-me/id6737762373" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/50 hover:text-primary-foreground border border-primary-foreground/20 rounded px-2 py-1 transition-colors">📱 App Store</a>
              <a href="https://play.google.com/store/apps/details?id=com.poolrentalnearme.app.prod" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/50 hover:text-primary-foreground border border-primary-foreground/20 rounded px-2 py-1 transition-colors">▶️ Google Play</a>
            </div>
          </div>

          {/* Get Started */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Get Started</h4>
            <div className="flex flex-col gap-1.5">
              <a href={`${PRNM}/s`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Search Listings</a>
              <a href={`${PRNM}/p/howitworksforguests`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">How It Works</a>
              <a href={`${PRNM}/l/new`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">List Your Pool Free</a>
              <a href={`${PRNM}/p/make-money`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Start a Business</a>
              <a href={`${PRNM}/p/swimply-alternative-vs-pool-rental-near-me`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Swimply Alternative</a>
              <a href="https://amenities.poolrentalnearme.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Host Amenities</a>
            </div>
          </div>

          {/* Become a Host */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Become a Host</h4>
            <div className="flex flex-col gap-1.5">
              <a href={`${PRNM}/l/new`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">List Your Pool Free</a>
              <a href={`${PRNM}/p/hosting`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">How Hosting Works</a>
              <a href={`${PRNM}/p/all-locations`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Find Locations</a>
              <a href="https://hostpro.poolrentalnearme.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Host Pro Tools</a>
              <a href={`${PRNM}/p/learningacademy`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Learning Academy</a>
              <a href="https://connect.poolrentalnearme.com" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Host Connect</a>
              <a href={`${PRNM}/p/hoa-pool-rental-defense-kit`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">HOA Defense Kit</a>
            </div>
          </div>

          {/* Guests & Company */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Guests</h4>
            <div className="flex flex-col gap-1.5">
              <a href="https://help.poolrentalnearme.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Help Center</a>
              <a href="https://www.rentalwaivers.com" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Sign a Waiver</a>
              <a href="https://go.poolrentalnearme.com/radio" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">PRNM Radio</a>
              <a href="https://pool-rental-near-me-store.printify.me" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Store</a>
            </div>

            <h4 className="font-semibold text-sm mt-4 mb-3">Company</h4>
            <div className="flex flex-col gap-1.5">
              <a href={`${PRNM}/p/about`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">About</a>
              <a href={`${PRNM}/p/blog`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Blog</a>
              <a href="https://www.careers-page.com/10000-solutions-llc" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Careers</a>
              <a href={`${PRNM}/p/investors`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Investors</a>
              <a href={`${PRNM}/terms-of-service`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Terms</a>
              <a href={`${PRNM}/privacy-policy`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Privacy</a>
            </div>
          </div>

          {/* Popular Markets */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Popular Markets</h4>
            <div className="flex flex-col gap-1.5">
              <a href={`${PRNM}/p/las-vegas-search-page`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Las Vegas, NV</a>
              <a href={`${PRNM}/s`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Phoenix, AZ</a>
              <a href={`${PRNM}/s`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Houston, TX</a>
              <a href={`${PRNM}/s`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Miami, FL</a>
              <a href={`${PRNM}/p/newyork`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">New York, NY</a>
              <a href={`${PRNM}/s`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Austin, TX</a>
              <a href={`${PRNM}/p/losangeles`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Los Angeles, CA</a>
              <a href={`${PRNM}/p/riverside`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Riverside, CA</a>
              <a href={`${PRNM}/p/privatepoolrentalssandiego`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">San Diego, CA</a>
              <a href={`${PRNM}/p/sacramentobestprivatepools`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Sacramento, CA</a>
            </div>
          </div>
        </div>

        {/* Public Pools internal link */}
        <div className="mt-8 pt-6 border-t border-primary-foreground/10">
          <h4 className="font-semibold text-sm mb-3">Public Pool Directory</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            <Link to="/public-pools" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">All States</Link>
            <Link to="/public-pools/california" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">California</Link>
            <Link to="/public-pools/texas" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Texas</Link>
            <Link to="/public-pools/florida" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Florida</Link>
            <Link to="/public-pools/new-york" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">New York</Link>
            <Link to="/public-pools/arizona" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Arizona</Link>
            <Link to="/public-pools/colorado" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Colorado</Link>
            <Link to="/public-pools/illinois" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">Illinois</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-primary-foreground/50">
            © 2026 PRNM Corp. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/50">
            A 10,000 Solutions LLC company.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
