import { apiClient } from "./client";
import type {
  EvaluationRequest,
  EvaluationResponse,
  EvaluationRun,
  DashboardStats,
} from "../types/evaluation";

export const evaluationApi = {
  // Submit new evaluation
  submitEvaluation: async (
    data: EvaluationRequest
  ): Promise<EvaluationResponse> => {
    const response = await apiClient.post<EvaluationResponse>(
      "/evaluate",
      data
    );
    return response.data;
  },

  // Get all evaluation runs
  getRuns: async (): Promise<EvaluationRun[]> => {
    const response = await apiClient.get<EvaluationRun[]>("/runs");
    return response.data;
  },

  // Get specific run by ID
  getRunById: async (id: string): Promise<EvaluationRun> => {
    const response = await apiClient.get<EvaluationRun>(`/runs/${id}`);
    return response.data;
  },

  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>("/dashboard/stats");
    return response.data;
  },
};
