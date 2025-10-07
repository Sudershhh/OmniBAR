import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { EvaluationRun } from "@/types/evaluation";

interface RunsTableProps {
  runs: EvaluationRun[];
}

export default function RunsTable({ runs }: RunsTableProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRuns = runs.filter((run) =>
    run.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="space-y-4 ">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search prompts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
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
            {filteredRuns.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  {searchQuery
                    ? "No runs match your search"
                    : "No evaluations yet"}
                </TableCell>
              </TableRow>
            ) : (
              filteredRuns.map((run) => (
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

      {/* Footer Info */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredRuns.length} of {runs.length} evaluations
      </div>
    </div>
  );
}
