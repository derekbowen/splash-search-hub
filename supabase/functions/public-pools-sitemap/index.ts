import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.0";

const corsHeaders = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=86400",
};

const BASE = "https://www.poolrentalnearme.com";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const [{ data: states }, { data: cities }, { data: pools }] = await Promise.all([
    supabase.from("states").select("slug, created_at").order("name"),
    supabase.from("cities").select("state_slug, city_slug, created_at").order("city_name"),
    supabase.from("public_pools").select("slug, city_id, updated_at, cities!inner(state_slug, city_slug)").eq("is_active", true).order("name"),
  ]);

  const today = new Date().toISOString().split("T")[0];

  let urls = `  <url>
    <loc>${BASE}/public-pools/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>\n`;

  for (const s of states ?? []) {
    const lastmod = s.created_at?.split("T")[0] ?? today;
    urls += `  <url>
    <loc>${BASE}/public-pools/${s.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  }

  for (const c of cities ?? []) {
    const lastmod = c.created_at?.split("T")[0] ?? today;
    urls += `  <url>
    <loc>${BASE}/public-pools/${c.state_slug}/${c.city_slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
  }

  for (const p of pools ?? []) {
    const city = (p as any).cities;
    if (!city) continue;
    const lastmod = p.updated_at?.split("T")[0] ?? today;
    urls += `  <url>
    <loc>${BASE}/public-pools/${city.state_slug}/${city.city_slug}/${p.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>\n`;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}</urlset>`;

  return new Response(xml, { headers: corsHeaders });
});
