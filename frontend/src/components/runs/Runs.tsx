import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import RunsTable from "@/components/runs/RunsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { EvaluationRun } from "@/types/evaluation";
import { sampleRuns } from "@/data/evaluation";

export default function RunsPage() {
  const navigate = useNavigate();
  const [runs] = useState<EvaluationRun[]>(sampleRuns);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);

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
          <Button className="gap-2" onClick={() => navigate("/evaluate")}>
            <Plus className="h-4 w-4" />
            New Evaluation
          </Button>
        </div>

        {/* Runs Table */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Loading runs...
          </div>
        ) : (
          <RunsTable runs={runs} />
        )}
      </div>
    </div>
  );
}
