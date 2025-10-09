import { useState, useMemo } from "react";
import type {
  EvaluationRun,
  EvaluationObjective,
  ModelType,
  RunStatus,
} from "@/types/evaluation";
import type { FilterState } from "./RunsFilters";

export function useRunsFiltering(runs: EvaluationRun[]) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    status: "all",
    model: "all",
    objective: "all",
    scoreRange: "all",
    dateRange: "all",
  });

  const filteredRuns = useMemo(() => {
    return runs.filter((run) => {
      // Search query filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        const matchesSearch =
          run.prompt.toLowerCase().includes(searchLower) ||
          run.agent_response?.toLowerCase().includes(searchLower) ||
          run.expected_output?.toLowerCase().includes(searchLower) ||
          run.id.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== "all" && run.status !== filters.status) {
        return false;
      }

      // Model filter
      if (filters.model !== "all" && run.model !== filters.model) {
        return false;
      }

      // Objective filter
      if (filters.objective !== "all" && run.objective !== filters.objective) {
        return false;
      }

      // Score range filter
      if (filters.scoreRange !== "all") {
        const score = run.score;
        switch (filters.scoreRange) {
          case "high":
            if (score < 90) return false;
            break;
          case "medium":
            if (score < 70 || score >= 90) return false;
            break;
          case "low":
            if (score >= 70) return false;
            break;
        }
      }

      // Date range filter
      if (filters.dateRange !== "all") {
        const runDate = new Date(run.timestamp);
        const now = new Date();

        switch (filters.dateRange) {
          case "today":
            const startOfDay = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            );
            if (runDate < startOfDay) return false;
            break;
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (runDate < weekAgo) return false;
            break;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (runDate < monthAgo) return false;
            break;
        }
      }

      return true;
    });
  }, [runs, filters]);

  return {
    filters,
    setFilters,
    filteredRuns,
  };
}
