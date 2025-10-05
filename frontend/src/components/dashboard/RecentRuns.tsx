import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { EvaluationRun } from "@/types/evaluation";

export function RecentRuns({ runs }: { runs: EvaluationRun[] }) {
  const navigate = useNavigate();

  const getScoreColor = (score: number) => {
    if (score >= 90)
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    if (score >= 70)
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prompt</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Objective</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No evaluations yet. Create your first evaluation to get started.
              </TableCell>
            </TableRow>
          ) : (
            runs.map((run) => (
              <TableRow
                key={run.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/runs/${run.id}`)}
              >
                <TableCell className="font-medium">
                  {truncateText(run.prompt, 60)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{run.model}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {run.objective.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getScoreColor(run.score)}>
                    {run.score}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(run.timestamp), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
