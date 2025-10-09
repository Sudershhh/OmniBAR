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
import { getScoreColor, truncateText } from "@/utils/runs";

interface RunsTableProps {
  runs: EvaluationRun[];
}

export default function RunsTable({ runs }: RunsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Prompt</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Objective</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
                No evaluations found
              </TableCell>
            </TableRow>
          ) : (
            runs.map((run) => (
              <TableRow
                key={run.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/runs/${run.id}`)}
              >
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(run.timestamp), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="font-medium">
                  {truncateText(run.prompt, 50)}
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
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
