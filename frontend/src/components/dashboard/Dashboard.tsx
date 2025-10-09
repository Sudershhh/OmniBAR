import { useDashboardStats } from "@/hooks/useDashboard";
import { useRuns } from "@/hooks/useRuns";
import { Button } from "@/components/ui/button";
import {
  Activity,
  TrendingUp,
  CheckCircle2,
  Plus,
  Loader2,
} from "lucide-react";
import { Link } from "react-router";
import { StatsCard } from "./StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentRuns } from "./RecentRuns";

function Dashboard() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  const {
    data: runs,
    isLoading: runsLoading,
    refetch: refetchRuns,
  } = useRuns();

  const handleRefresh = () => {
    refetchRuns();
  };

  if (statsLoading || runsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load dashboard data</p>
        <Button onClick={handleRefresh} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

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
          value={stats?.totalRuns || 0}
          icon={Activity}
          description="All time evaluations"
        />
        <StatsCard
          title="Average Score"
          value={`${Math.round(stats?.averageScore || 0)}%`}
          icon={TrendingUp}
          description="Across all evaluations"
        />
        <StatsCard
          title="Success Rate"
          value={`${Math.round(stats?.successRate || 0)}%`}
          icon={CheckCircle2}
          description="Successful Evaluations"
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
          <RecentRuns runs={runs?.slice(0, 5) || []} />
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
