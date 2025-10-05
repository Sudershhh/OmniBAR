import { Link, useLocation } from "react-router";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "New Evaluation", href: "/evaluate" },
  { name: "Runs History", href: "/runs" },
];

export function Header() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Activity className="h-6 w-6" />
              <span className="text-lg font-semibold tracking-tight">
                OmniBAR
              </span>
            </Link>

            <nav className="hidden md:flex md:gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-muted-foreground">
              AI Evaluation Platform
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
