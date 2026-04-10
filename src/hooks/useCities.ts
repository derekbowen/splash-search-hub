import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCitiesByState = (stateSlug: string) => {
  return useQuery({
    queryKey: ["cities", stateSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .eq("state_slug", stateSlug)
        .order("city_name");
      if (error) throw error;
      return data;
    },
    enabled: !!stateSlug,
    staleTime: 1000 * 60 * 30,
  });
};

export const useCityBySlug = (stateSlug: string, citySlug: string) => {
  return useQuery({
    queryKey: ["city", stateSlug, citySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .eq("state_slug", stateSlug)
        .eq("city_slug", citySlug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!stateSlug && !!citySlug,
    staleTime: 1000 * 60 * 30,
  });
};

export const usePopularCities = (limit = 20) => {
  return useQuery({
    queryKey: ["popular-cities", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .order("population_score", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 30,
  });
};

export const useNearbyCities = (stateSlug: string, citySlug: string, lat: number | null, lon: number | null, limit = 8) => {
  return useQuery({
    queryKey: ["nearby-cities", stateSlug, citySlug, lat, lon],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .eq("state_slug", stateSlug)
        .neq("city_slug", citySlug)
        .limit(limit);
      if (error) throw error;
      // Sort by distance client-side
      if (lat != null && lon != null && data) {
        return data.sort((a, b) => {
          const distA = Math.sqrt(Math.pow((a.latitude ?? 0) - lat, 2) + Math.pow((a.longitude ?? 0) - lon, 2));
          const distB = Math.sqrt(Math.pow((b.latitude ?? 0) - lat, 2) + Math.pow((b.longitude ?? 0) - lon, 2));
          return distA - distB;
        });
      }
      return data;
    },
    enabled: !!stateSlug && !!citySlug,
    staleTime: 1000 * 60 * 30,
  });
};
