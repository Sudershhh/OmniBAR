import { Button } from "@/components/ui/button";
import { Activity, TrendingUp, CheckCircle2, Plus } from "lucide-react";
import { Link } from "react-router";
import { StatsCard } from "./StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentRuns } from "./RecentRuns";
import { sampleRuns } from "@/data/evaluation";

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            AI agent testing and benchmarking platform
          </p>
        </div>
        <Link to="/evaluate">
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            New Evaluation
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Runs"
          value={0}
          icon={Activity}
          description="All time evaluations"
        />
        <StatsCard
          title="Average Score"
          value={"0%"}
          icon={TrendingUp}
          description="Across all evaluations"
        />
        <StatsCard
          title="Success Rate"
          value={"0%"}
          icon={CheckCircle2}
          description="Evaluations scoring ≥70%"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Evaluations</CardTitle>
          <Link to="/runs">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <RecentRuns runs={sampleRuns} />
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
