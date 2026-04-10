import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStates = () => {
  return useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("states")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 30,
  });
};

export const useStateBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["state", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("states")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 30,
  });
};
