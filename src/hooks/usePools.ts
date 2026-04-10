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
