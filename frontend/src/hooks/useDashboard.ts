// hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { evaluationApi } from "@/api/endpoints";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: evaluationApi.getDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
  });
};
