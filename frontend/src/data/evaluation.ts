import type { EvaluationRun } from "@/types/evaluation";

export const sampleRuns: EvaluationRun[] = [
  {
    id: "run-1",
    prompt: "Summarize the following paragraph in one sentence.",
    expectedOutput: "A concise summary of the provided paragraph.",
    agentResponse:
      "The text discusses the importance of climate change awareness.",
    objective: "llm-judge",
    model: "gpt-4",
    score: 92,
    status: "completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    objectives: {
      llmJudge: {
        passed: true,
        score: 92,
        reasoning: "Response was accurate and concise.",
      },
    },
  },
  {
    id: "run-2",
    prompt: "Translate 'Good morning' into French.",
    expectedOutput: "Bonjour",
    agentResponse: "Bonjour",
    objective: "string-equality",
    model: "claude-3-opus",
    score: 100,
    status: "completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    objectives: {
      stringEquality: {
        passed: true,
        score: 100,
      },
    },
  },
  {
    id: "run-3",
    prompt: "Generate a 3-sentence story about a robot who learns to paint.",
    expectedOutput: "A creative short story.",
    agentResponse:
      "A robot named Arto discovered colors and emotions through art.",
    objective: "combined",
    model: "gpt-3.5-turbo",
    score: 74,
    status: "completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    objectives: {
      stringEquality: {
        passed: false,
        score: 70,
      },
      llmJudge: {
        passed: true,
        score: 78,
        reasoning: "Response was imaginative but lacked structure.",
      },
    },
  },
  {
    id: "run-4",
    prompt: "Classify the sentiment of the text: 'I love this product!'",
    expectedOutput: "Positive",
    agentResponse: "",
    objective: "string-equality",
    model: "claude-3-sonnet",
    score: 0,
    status: "failed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
];
