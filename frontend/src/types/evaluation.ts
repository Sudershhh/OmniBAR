export type EvaluationObjective = "string-equality" | "llm-judge" | "combined";
export type ModelType =
  | "gpt-4"
  | "gpt-3.5-turbo"
  | "claude-3-opus"
  | "claude-3-sonnet";
export type RunStatus = "pending" | "running" | "completed" | "failed";

export interface EvaluationRun {
  id: string;
  prompt: string;
  expectedOutput?: string;
  agentResponse?: string;
  objective: EvaluationObjective;
  model: ModelType;
  score: number;
  status: RunStatus;
  timestamp: string;
  objectives?: {
    stringEquality?: {
      passed: boolean;
      score: number;
    };
    llmJudge?: {
      passed: boolean;
      score: number;
      reasoning?: string;
    };
  };
}
