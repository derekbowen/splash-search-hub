
CREATE TABLE public.states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  abbreviation TEXT NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  population INTEGER,
  pool_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state_id UUID REFERENCES public.states(id) ON DELETE CASCADE NOT NULL,
  city_name TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  state_slug TEXT NOT NULL,
  state_abbr TEXT NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  population INTEGER,
  population_score INTEGER,
  exclusivity_score INTEGER,
  state_density_score INTEGER,
  priority_score FLOAT,
  priority_tier TEXT,
  prnm_url TEXT,
  swimply_has_page BOOLEAN DEFAULT false,
  prnm_exclusive BOOLEAN DEFAULT false,
  pool_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.public_pools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  website TEXT,
  google_maps_url TEXT,
  google_place_id TEXT UNIQUE,
  rating FLOAT,
  review_count INTEGER,
  latitude FLOAT,
  longitude FLOAT,
  pool_type TEXT,
  hours_json JSONB,
  amenities TEXT[],
  price_adult TEXT,
  price_child TEXT,
  price_notes TEXT,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_pools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for states" ON public.states FOR SELECT USING (true);
CREATE POLICY "Public read access for cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Public read access for public_pools" ON public.public_pools FOR SELECT USING (true);

CREATE INDEX idx_states_slug ON public.states(slug);
CREATE INDEX idx_cities_state_id ON public.cities(state_id);
CREATE INDEX idx_cities_city_slug ON public.cities(city_slug);
CREATE INDEX idx_cities_state_slug ON public.cities(state_slug);
CREATE INDEX idx_cities_state_city_slug ON public.cities(state_slug, city_slug);
CREATE INDEX idx_cities_priority_score ON public.cities(priority_score DESC);
CREATE INDEX idx_cities_population_score ON public.cities(population_score DESC);
CREATE INDEX idx_cities_lat_lon ON public.cities(latitude, longitude);
CREATE INDEX idx_public_pools_city_id ON public.public_pools(city_id);
CREATE INDEX idx_public_pools_rating ON public.public_pools(rating DESC);
CREATE INDEX idx_public_pools_lat_lon ON public.public_pools(latitude, longitude);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_public_pools_updated_at
  BEFORE UPDATE ON public.public_pools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
