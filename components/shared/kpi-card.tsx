// ── KPICard ──────────────────────────────────────
// A single KPI stat card for the dashboard.

interface KPICardProps {
  label: string;
  value: string | number;
  change?: string;
  changeDirection?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

export function KPICard({
  label,
  value,
  change,
  changeDirection = "neutral",
  icon,
}: KPICardProps) {
  const changeColors = {
    up: "text-success",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  const changeIcons = {
    up: "↑",
    down: "↓",
    neutral: "→",
  };

  return (
    <div className="bg-card border border-border rounded-lg px-5 py-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground tracking-tight">
            {value}
          </p>
        </div>
        {icon && (
          <div className="w-9 h-9 rounded-md bg-action/10 flex items-center justify-center text-action">
            {icon}
          </div>
        )}
      </div>
      {change && (
        <p className={`mt-2 text-xs font-medium ${changeColors[changeDirection]}`}>
          {changeIcons[changeDirection]} {change}
        </p>
      )}
    </div>
  );
}
