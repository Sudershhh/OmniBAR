// hooks/useRuns.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { evaluationApi } from "@/api/endpoints";

export const useRuns = () => {
  return useQuery({
    queryKey: ["runs"],
    queryFn: evaluationApi.getRuns,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useRunById = (id: string) => {
  return useQuery({
    queryKey: ["runs", id],
    queryFn: () => evaluationApi.getRunById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRefreshRuns = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["runs"] });
  };
};
