import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.0";

const HEADERS_XML = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=86400",
  "Access-Control-Allow-Origin": "*",
};

const BASE = "https://www.poolrentalnearme.com";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const stateSlug = url.searchParams.get("state");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // If no state param → return sitemap index
  if (!stateSlug) {
    const { data: states } = await supabase
      .from("states")
      .select("slug, created_at")
      .order("name");

    const today = new Date().toISOString().split("T")[0];
    const fnUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/public-pools-sitemap`;

    let sitemaps = `  <sitemap>
    <loc>${BASE}/sitemap-hub.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>\n`;

    for (const s of states ?? []) {
      const lastmod = s.created_at?.split("T")[0] ?? today;
      sitemaps += `  <sitemap>
    <loc>${fnUrl}?state=${s.slug}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>\n`;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}</sitemapindex>`;

    return new Response(xml, { headers: HEADERS_XML });
  }

  // Child sitemap for a specific state
  const today = new Date().toISOString().split("T")[0];

  const [{ data: state }, { data: cities }, { data: pools }] = await Promise.all([
    supabase.from("states").select("slug, created_at").eq("slug", stateSlug).maybeSingle(),
    supabase.from("cities").select("state_slug, city_slug, created_at").eq("state_slug", stateSlug).order("city_name"),
    supabase.from("public_pools")
      .select("slug, updated_at, cities!inner(state_slug, city_slug)")
      .eq("cities.state_slug", stateSlug)
      .eq("is_active", true)
      .order("name"),
  ]);

  if (!state) {
    return new Response("Not found", { status: 404 });
  }

  // State page URL
  let urls = `  <url>
    <loc>${BASE}/public-pools/${state.slug}/</loc>
    <lastmod>${state.created_at?.split("T")[0] ?? today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;

  // City pages
  for (const c of cities ?? []) {
    const lastmod = c.created_at?.split("T")[0] ?? today;
    urls += `  <url>
    <loc>${BASE}/public-pools/${c.state_slug}/${c.city_slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
  }

  // Pool pages
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

  return new Response(xml, { headers: HEADERS_XML });
});
