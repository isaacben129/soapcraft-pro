// ── LedgerRow ──────────────────────────────────────
// A row for ledger-style data tables with plan/actual comparison.

interface LedgerRowProps {
  label: string;
  planned?: number | string;
  actual?: number | string;
  unit?: string;
  variant?: "default" | "warning" | "danger";
  className?: string;
}

export function LedgerRow({
  label,
  planned,
  actual,
  unit = "",
  variant = "default",
  className = "",
}: LedgerRowProps) {
  const variantStyles = {
    default: "",
    warning: "text-warning",
    danger: "text-destructive",
  };

  return (
    <div
      className={`flex items-center justify-between py-2 border-b border-border last:border-0 ${className}`}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        {planned !== undefined && (
          <span className="text-sm tabular-nums text-muted-foreground">
            {planned}
            {unit && <span className="ml-1 text-xs">{unit}</span>}
          </span>
        )}
        {actual !== undefined && (
          <span className={`text-sm font-medium tabular-nums ${variantStyles[variant]}`}>
            {actual}
            {unit && <span className="ml-1 text-xs">{unit}</span>}
          </span>
        )}
      </div>
    </div>
  );
}
