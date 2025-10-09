export type EvaluationObjective = "string-equality" | "llm-judge" | "combined";
export type ModelType =
  | "gpt-4"
  | "gpt-3.5-turbo"
  | "claude-3-opus"
  | "claude-3-sonnet";
export type RunStatus = "pending" | "running" | "completed" | "failed";

// Frontend form data
export interface EvaluationFormData {
  prompt: string;
  expectedOutput?: string;
  objective: EvaluationObjective;
  model: ModelType;
}

// API Request/Response types
export interface EvaluationRequest {
  prompt: string;
  expectedOutput?: string;
  objective: "string-equality" | "llm-judge" | "combined";
  model: ModelType;
  iterations?: number;
}

export interface EvaluationResponse {
  run_id: string;
  status: string;
  score: number;
  agent_response?: string;
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
  timestamp: string;
  error_message?: string;
}

// Unified EvaluationRun interface (matches backend response)
export interface EvaluationRun {
  id: string;
  prompt: string;
  expected_output?: string;
  agent_response?: string;
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
  error_message?: string;
}

export interface DashboardStats {
  totalRuns: number;
  averageScore: number;
  successRate: number;
}
