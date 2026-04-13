
-- Add slug column
ALTER TABLE public.public_pools ADD COLUMN slug text;

-- Generate base slugs from names
UPDATE public.public_pools
SET slug = lower(
  regexp_replace(
    regexp_replace(
      regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
);

-- Deduplicate slugs within same city by appending row number to dupes
WITH dupes AS (
  SELECT id, city_id, slug,
    ROW_NUMBER() OVER (PARTITION BY city_id, slug ORDER BY created_at) as rn
  FROM public.public_pools
)
UPDATE public.public_pools p
SET slug = d.slug || '-' || d.rn
FROM dupes d
WHERE p.id = d.id AND d.rn > 1;

-- Make NOT NULL
ALTER TABLE public.public_pools ALTER COLUMN slug SET NOT NULL;

-- Unique index
CREATE UNIQUE INDEX idx_public_pools_city_slug ON public.public_pools (city_id, slug);
