import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useRunById } from "@/hooks/useRuns";
import { ScoreDisplay } from "./ScoreDisplay";
import { ObjectivesBreakdown } from "./ObjectivesBreakdown";
import { CodeBlock } from "./Codeblock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Play,
  Calendar,
  Cpu,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function RunDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isJsonOpen, setIsJsonOpen] = useState(false);

  const {
    data: run,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useRunById(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading evaluation...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>Failed to load evaluation</p>
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate("/runs")}>
              Back to Runs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="min-h-screen bg-background mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Evaluation not found</p>
          <Button variant="outline" onClick={() => navigate("/runs")}>
            Back to Runs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Evaluation Results
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Run ID: {run.id}
              </p>
            </div>
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
              <Play className="h-4 w-4" />
              Run Again
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {format(new Date(run.timestamp), "PPpp")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline">{run.model}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Objective:
                </span>
                <Badge variant="secondary">
                  {run.objective.replace("-", " ")}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge
                  variant={
                    run.status === "completed"
                      ? "default"
                      : run.status === "failed"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {run.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <ScoreDisplay score={run.score} />

        <ObjectivesBreakdown objectives={run.objectives} />

        <div className="grid gap-6 lg:grid-cols-2">
          <CodeBlock title="Prompt" content={run.prompt} />
          {run.agent_response && (
            <CodeBlock title="Agent Response" content={run.agent_response} />
          )}
        </div>

        {run.expected_output && (
          <CodeBlock title="Expected Output" content={run.expected_output} />
        )}

        {run.error_message && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive">{run.error_message}</p>
            </CardContent>
          </Card>
        )}

        <Collapsible open={isJsonOpen} onOpenChange={setIsJsonOpen}>
          <Card>
            <CardHeader>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <CardTitle>Raw JSON</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {isJsonOpen ? "Hide" : "Show"}
                  </span>
                </Button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                  <code className="font-mono">
                    {JSON.stringify(run, null, 2)}
                  </code>
                </pre>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </div>
  );
}
