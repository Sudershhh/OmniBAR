import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
    </div>
  );
}

export default Dashboard;
