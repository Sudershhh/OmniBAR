import { useState } from "react";
import { useNavigate } from "react-router";
import { useSubmitEvaluation } from "@/hooks/useEvaluations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Play, XCircle } from "lucide-react";
import type {
  EvaluationFormData,
  EvaluationObjective,
  ModelType,
} from "@/types/evaluation";

export default function Evaluate() {
  const navigate = useNavigate();
  const submitEvaluation = useSubmitEvaluation();

  const [formData, setFormData] = useState<EvaluationFormData>({
    prompt: "",
    expectedOutput: "",
    objective: "llm-judge",
    model: "gpt-4",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.prompt.trim()) {
      newErrors.prompt = "Prompt is required";
    }

    if (
      (formData.objective === "string-equality" ||
        formData.objective === "combined") &&
      !formData.expectedOutput?.trim()
    ) {
      newErrors.expectedOutput =
        "Expected output is required for string equality evaluation";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await submitEvaluation.mutateAsync({
        prompt: formData.prompt,
        expectedOutput: formData.expectedOutput || undefined,
        objective: formData.objective,
        model: formData.model,
        iterations: 1,
      });

      // Navigate to the new run detail page
      navigate(`/runs/${result.run_id}`);
    } catch (error) {
      console.error("Evaluation failed:", error);
      // Error handling is done in the mutation
    }
  };

  const handleReset = () => {
    setFormData({
      prompt: "",
      expectedOutput: "",
      objective: "llm-judge",
      model: "gpt-4",
    });
    setErrors({});
  };

  const isPending = submitEvaluation.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          New Evaluation
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Test your AI agent's performance with custom prompts and evaluation
          criteria
        </p>
      </div>

      {/* Status Messages */}
      {submitEvaluation.isError && (
        <div className="rounded-md bg-destructive/15 p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-destructive" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">
                Evaluation Failed
              </h3>
              <div className="mt-2 text-sm text-destructive">
                {submitEvaluation.error?.message ||
                  "An unexpected error occurred"}
              </div>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Prompt Configuration</CardTitle>
          <CardDescription>
            Enter the prompt you want to evaluate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">
              Prompt <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="prompt"
              placeholder="What is the capital of France?"
              value={formData.prompt}
              onChange={(e) =>
                setFormData({ ...formData, prompt: e.target.value })
              }
              className="min-h-[120px] font-mono text-sm"
              disabled={isPending}
            />
            {errors.prompt && (
              <p className="text-sm text-destructive">{errors.prompt}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedOutput">Expected Output (Optional)</Label>
            <Textarea
              id="expectedOutput"
              placeholder="Paris"
              value={formData.expectedOutput}
              onChange={(e) =>
                setFormData({ ...formData, expectedOutput: e.target.value })
              }
              className="min-h-[80px] font-mono text-sm"
              disabled={isPending}
            />
            {errors.expectedOutput && (
              <p className="text-sm text-destructive">
                {errors.expectedOutput}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Required for string equality evaluation. Used as reference for LLM
              judge.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Settings</CardTitle>
          <CardDescription>
            Configure how the evaluation should be performed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Objective */}
            <div className="space-y-2">
              <Label htmlFor="objective">Evaluation Objective</Label>
              <Select
                value={formData.objective}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    objective: value as EvaluationObjective,
                  })
                }
                disabled={isPending}
              >
                <SelectTrigger id="objective">
                  <SelectValue placeholder="Select objective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string-equality">
                    String Equality
                  </SelectItem>
                  <SelectItem value="llm-judge">LLM Judge</SelectItem>
                  <SelectItem value="combined">Combined</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {formData.objective === "string-equality" &&
                  "Exact match comparison"}
                {formData.objective === "llm-judge" &&
                  "Subjective quality assessment"}
                {formData.objective === "combined" &&
                  "Both exact match and quality assessment"}
              </p>
            </div>

            {/* Model */}
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select
                value={formData.model}
                onValueChange={(value) =>
                  setFormData({ ...formData, model: value as ModelType })
                }
                disabled={isPending}
              >
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-3.5-turbo-16k">
                    GPT-3.5 Turbo 16K
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button type="submit" size="lg" disabled={isPending} className="gap-2">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Running Evaluation...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Evaluation
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleReset}
          disabled={isPending}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
