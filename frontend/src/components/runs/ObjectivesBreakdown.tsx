import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import type { EvaluationRun } from "@/types/evaluation";

interface ObjectivesBreakdownProps {
  objectives: EvaluationRun["objectives"];
}

export function ObjectivesBreakdown({ objectives }: ObjectivesBreakdownProps) {
  if (!objectives) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Objectives Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {objectives.stringEquality && (
          <div className="space-y-2 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {objectives.stringEquality.passed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">String Equality</span>
              </div>
              <Badge
                variant={
                  objectives.stringEquality.passed ? "default" : "destructive"
                }
              >
                {objectives.stringEquality.score}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {objectives.stringEquality.passed
                ? "Output matches expected result exactly"
                : "Output does not match expected result"}
            </p>
          </div>
        )}

        {objectives.llmJudge && (
          <div className="space-y-2 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {objectives.llmJudge.passed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">LLM Judge</span>
              </div>
              <Badge
                variant={objectives.llmJudge.passed ? "default" : "destructive"}
              >
                {objectives.llmJudge.score}%
              </Badge>
            </div>
            {objectives.llmJudge.reasoning && (
              <p className="text-sm text-muted-foreground">
                {objectives.llmJudge.reasoning}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
