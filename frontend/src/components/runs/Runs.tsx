import { useNavigate } from "react-router";
import { useRuns } from "@/hooks/useRuns";
import { useRunsFiltering } from "@/hooks/useRunsFiltering";
import RunsTable from "@/components/runs/RunsTable";
import { RunsFilters } from "@/components/runs/RunsFilters";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, RefreshCw, AlertCircle } from "lucide-react";

export default function RunsPage() {
  const navigate = useNavigate();
  const { data: runs, isLoading, error, refetch, isRefetching } = useRuns();
  const { filters, setFilters, filteredRuns } = useRunsFiltering(runs || []);

  return (
    <div className="min-h-screen bg-background mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Runs History</h1>
            <p className="mt-2 text-muted-foreground">
              View and analyze all your evaluation runs
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button className="gap-2" onClick={() => navigate("/evaluate")}>
              <Plus className="h-4 w-4" />
              New Evaluation
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-destructive">
                  Failed to load runs
                </h3>
                <div className="mt-2 text-sm text-destructive">
                  {error instanceof Error
                    ? error.message
                    : "An unexpected error occurred"}
                </div>
                <div className="mt-3">
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading runs...
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <RunsFilters
              runs={runs || []}
              filters={filters}
              onFiltersChange={setFilters}
              filteredCount={filteredRuns.length}
            />
            <RunsTable runs={filteredRuns} />
          </>
        )}
      </div>
    </div>
  );
}
