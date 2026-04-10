

## PRNM Public Pools Directory — Implementation Plan

### Overview
Build a programmatic SEO directory of public swimming pools across the US, designed to capture "public pool near me" traffic and funnel visitors to PoolRentalNearMe.com's private pool marketplace. 331 cities across 38 states, with full Supabase backend.

---

### Phase 1: Database Setup (Supabase)
- Create **states**, **cities**, and **public_pools** tables with the exact schema specified
- Enable RLS with public read-only policies (directory is public content)
- Add database indexes on slugs, foreign keys, and lat/lon for geo queries

### Phase 2: Branding & Global Layout
- **Design system**: PRNM blue (#1a73e8), dark (#1a1a2e), accent (#0d47a1), light blue bg (#e8f0fe), Inter font
- **Header**: "PoolRentalNearMe.com" text logo → main site, center nav with "Public Pools" | "Rent a Private Pool" | "Free Waivers", mobile hamburger menu (matching the screenshot reference)
- **Footer**: 3-column layout — brand + tagline, quick links (Browse Public Pools, Become a Pool Host, Free Pool Waivers, Pool Host Academy), legal links (Terms, Privacy, Contact). Bottom bar with © 2026 PRNM Corp / 10,000 Solutions LLC
- **SVG wave patterns** for hero backgrounds instead of stock photos

### Phase 3: Hub Page (`/public-pools/`)
- Hero with H1, subtitle, search bar that filters/navigates to states or cities
- **States grid**: 50 state cards (4-col desktop, 2-col mobile) with name, abbreviation, pool count badge, sortable by alpha/pool count
- **Popular Cities** section: top 20 cities by population score
- **CTA Banner**: full-width PRNM blue — "Why Fight for a Lane? Rent a Private Pool From $25/hr" with benefits list and buttons
- **FAQ Accordion**: 5 questions with strategic pivots to private pool rentals
- SEO: meta tags, Schema.org WebSite + SearchAction markup

### Phase 4: State Pages (`/public-pools/[state-slug]/`)
- Hero with breadcrumbs, H1, pool count subtitle
- **Cities grid**: all cities in state as cards with pool count, population, tier badge, PRNM exclusive "🔥 Featured" badge
- Sortable by pool count, alphabetical, population
- **CTA sidebar/banner** linking to PRNM state search
- **Nearby States** section (4-6 geographically adjacent states)
- SEO: dynamic meta from DB, Schema.org BreadcrumbList

### Phase 5: City Pages (`/public-pools/[state-slug]/[city-slug]/`) — The Money Pages
- Hero with breadcrumbs, H1, pool count
- **Pool listing cards**: name, star rating + review count, pool type badge (color-coded), address, phone (clickable), collapsible hours, pricing, amenity pill badges, description, "Get Directions" + "Visit Website" buttons
- Empty state with feedback prompt if no pools yet
- **Sticky CTA sidebar** (desktop) / **bottom CTA** (mobile): blue card with "Skip the Crowds 🏊", bullet benefits, "Browse Private Pools in [City]" button → prnm_url, secondary links to RentalWaivers.com and host signup
- **Nearby Cities** section: 6-8 closest cities by lat/lon
- **City-specific FAQ**: dynamic answers (pool count, best-rated pool, pricing, private pool CTA)
- SEO: dynamic meta from DB, Schema.org BreadcrumbList + LocalBusiness + FAQPage, canonical URLs

### Phase 6: SEO & Performance
- Schema.org structured data on all page types
- Auto-generated sitemap component listing all pages with priorities (hub=1.0, states=0.8, cities=0.6)
- React Helmet for dynamic meta tags per page
- Lazy loading images, minimal JS, mobile-first responsive design
- Supabase query optimization with proper caching

### Phase 7: Data Import Preparation
- CSV parsing utility to seed states and cities tables from your 331-city dataset
- The public_pools table will be seeded separately (via your Google Places API script)

