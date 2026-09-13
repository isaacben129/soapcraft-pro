// ── AttentionRow ─────────────────────────────────
// A row that draws attention to something that needs focus.

interface AttentionRowProps {
  title: string;
  description?: string;
  variant?: "info" | "warning" | "danger";
  action?: React.ReactNode;
}

const variantStyles = {
  info: "border-l border-info bg-info/5",
  warning: "border-l border-warning bg-warning/5",
  danger: "border-l border-destructive bg-destructive/5",
};

export function AttentionRow({
  title,
  description,
  variant = "info",
  action,
}: AttentionRowProps) {
  return (
    <div
      className={`border-l ${variantStyles[variant]} rounded-r-lg px-4 py-3 flex items-start justify-between gap-4`}
    >
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
