import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-prnm-dark text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2">PoolRentalNearMe.com</h3>
            <p className="text-sm text-primary-foreground/70 mb-4">
              The #1 pool rental marketplace. No commissions.
            </p>
            <div className="flex flex-col gap-1">
              <a href="https://www.poolrentalnearme.com" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Browse Private Pools
              </a>
              <a href="https://www.poolrentalnearme.com" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                List Your Pool
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Quick Links</h3>
            <div className="flex flex-col gap-1">
              <Link to="/public-pools" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Browse Public Pools
              </Link>
              <a href="https://www.poolrentalnearme.com/become-a-host" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Become a Pool Host
              </a>
              <a href="https://www.rentalwaivers.com" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Free Pool Waivers
              </a>
              <a href="https://www.poolrentalnearme.com/academy" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Pool Host Academy
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Legal</h3>
            <div className="flex flex-col gap-1">
              <a href="https://www.poolrentalnearme.com/terms" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Terms of Service
              </a>
              <a href="https://www.poolrentalnearme.com/privacy" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="mailto:derek@poolrentalnearme.com" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Contact Us
              </a>
            </div>
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
