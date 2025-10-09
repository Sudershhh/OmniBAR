interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const getScoreColor = () => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = () => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-8">
      <div className="mb-2 text-sm font-medium text-muted-foreground">
        Overall Score
      </div>
      <div className={`text-6xl font-bold ${getScoreColor()}`}>{score}</div>
      <div className="mt-2 text-sm text-muted-foreground">
        {getScoreLabel()}
      </div>
    </div>
  );
}
