import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Search,
  Filter,
  X,
  Calendar,
  Cpu,
  Target,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import type {
  EvaluationRun,
  EvaluationObjective,
  ModelType,
  RunStatus,
} from "@/types/evaluation";

export interface FilterState {
  searchQuery: string;
  status: RunStatus | "all";
  model: ModelType | "all";
  objective: EvaluationObjective | "all";
  scoreRange: "all" | "high" | "medium" | "low";
  dateRange: "all" | "today" | "week" | "month";
}

interface RunsFiltersProps {
  runs: EvaluationRun[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  filteredCount: number;
}

export function RunsFilters({
  runs,
  filters,
  onFiltersChange,
  filteredCount,
}: RunsFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchQuery: "",
      status: "all",
      model: "all",
      objective: "all",
      scoreRange: "all",
      dateRange: "all",
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "searchQuery") return value !== "";
    return value !== "all";
  });

  const uniqueModels = Array.from(new Set(runs.map((run) => run.model)));
  const uniqueObjectives = Array.from(
    new Set(runs.map((run) => run.objective))
  );
  const uniqueStatuses = Array.from(new Set(runs.map((run) => run.status)));

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search prompts, responses, or run IDs..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter("searchQuery", e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle and Active Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                      <Badge
                        variant="secondary"
                        className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
                      >
                        {
                          Object.values(filters).filter(
                            (v) => v !== "all" && v !== ""
                          ).length
                        }
                      </Badge>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="gap-1"
                >
                  <X className="h-3 w-3" />
                  Clear all
                </Button>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredCount} of {runs.length} evaluations
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {filters.status !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {filters.status}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => updateFilter("status", "all")}
                  />
                </Badge>
              )}
              {filters.model !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Model: {filters.model}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => updateFilter("model", "all")}
                  />
                </Badge>
              )}
              {filters.objective !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Objective: {filters.objective.replace("-", " ")}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => updateFilter("objective", "all")}
                  />
                </Badge>
              )}
              {filters.scoreRange !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Score: {filters.scoreRange}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => updateFilter("scoreRange", "all")}
                  />
                </Badge>
              )}
              {filters.dateRange !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Date: {filters.dateRange}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => updateFilter("dateRange", "all")}
                  />
                </Badge>
              )}
            </div>
          )}

          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <CollapsibleContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    Status
                  </div>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      updateFilter("status", value as RunStatus | "all")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {uniqueStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            {status === "completed" && (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            )}
                            {status === "failed" && (
                              <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            {status === "running" && (
                              <Clock className="h-3 w-3 text-blue-500" />
                            )}
                            {status === "pending" && (
                              <Clock className="h-3 w-3 text-yellow-500" />
                            )}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Cpu className="h-4 w-4" />
                    Model
                  </div>
                  <Select
                    value={filters.model}
                    onValueChange={(value) =>
                      updateFilter("model", value as ModelType | "all")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All models" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Models</SelectItem>
                      {uniqueModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Target className="h-4 w-4" />
                    Objective
                  </div>
                  <Select
                    value={filters.objective}
                    onValueChange={(value) =>
                      updateFilter(
                        "objective",
                        value as EvaluationObjective | "all"
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All objectives" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Objectives</SelectItem>
                      {uniqueObjectives.map((objective) => (
                        <SelectItem key={objective} value={objective}>
                          {objective.replace("-", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Target className="h-4 w-4" />
                    Score Range
                  </div>
                  <Select
                    value={filters.scoreRange}
                    onValueChange={(value) =>
                      updateFilter(
                        "scoreRange",
                        value as FilterState["scoreRange"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All scores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Scores</SelectItem>
                      <SelectItem value="high">High (90-100)</SelectItem>
                      <SelectItem value="medium">Medium (70-89)</SelectItem>
                      <SelectItem value="low">Low (0-69)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    Date Range
                  </div>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) =>
                      updateFilter(
                        "dateRange",
                        value as FilterState["dateRange"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}
