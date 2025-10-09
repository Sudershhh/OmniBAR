// hooks/useEvaluations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { evaluationApi } from "@/api/endpoints";
import type {
  EvaluationRequest,
  EvaluationResponse,
} from "../types/evaluation";

export const useSubmitEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EvaluationRequest) =>
      evaluationApi.submitEvaluation(data),
    onSuccess: (data: EvaluationResponse) => {
      // Invalidate and refetch runs list
      queryClient.invalidateQueries({ queryKey: ["runs"] });
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });

      console.log("✅ Evaluation submitted successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Evaluation submission failed:", error);
    },
  });
};
