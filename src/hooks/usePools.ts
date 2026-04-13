import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePoolsByCity = (cityId: string | undefined) => {
  return useQuery({
    queryKey: ["pools", cityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_pools")
        .select("*")
        .eq("city_id", cityId!)
        .eq("is_active", true)
        .order("rating", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!cityId,
    staleTime: 1000 * 60 * 30,
  });
};

export const usePoolBySlug = (cityId: string | undefined, poolSlug: string | undefined) => {
  return useQuery({
    queryKey: ["pool", cityId, poolSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_pools")
        .select("*")
        .eq("city_id", cityId!)
        .eq("slug", poolSlug!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!cityId && !!poolSlug,
    staleTime: 1000 * 60 * 30,
  });
};

export const useNearbyPools = (cityId: string | undefined, currentPoolId: string | undefined, limit = 6) => {
  return useQuery({
    queryKey: ["nearby-pools", cityId, currentPoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_pools")
        .select("*, cities!inner(city_name, city_slug, state_slug, state_abbr)")
        .eq("city_id", cityId!)
        .eq("is_active", true)
        .neq("id", currentPoolId!)
        .order("rating", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    },
    enabled: !!cityId && !!currentPoolId,
    staleTime: 1000 * 60 * 30,
  });
};

export const useRegionalPools = (stateSlug: string | undefined, citySlug: string | undefined, limit = 8) => {
  return useQuery({
    queryKey: ["regional-pools", stateSlug, citySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_pools")
        .select("*, cities!inner(city_name, city_slug, state_slug, state_abbr)")
        .eq("cities.state_slug", stateSlug!)
        .neq("cities.city_slug", citySlug!)
        .eq("is_active", true)
        .order("rating", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    },
    enabled: !!stateSlug && !!citySlug,
    staleTime: 1000 * 60 * 30,
  });
};
