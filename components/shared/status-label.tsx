// ── StatusLabel ────────────────────────────────────

interface StatusLabelProps {
  status: "active" | "draft" | "complete" | "warning" | "error" | "pending" | "canceled" | "past_due";
  size?: "sm" | "md";
}

const statusConfig = {
  active: { label: "Active", color: "bg-sage text-sage-foreground" },
  draft: { label: "Draft", color: "bg-clay text-clay-foreground" },
  complete: { label: "Complete", color: "bg-sage text-sage-foreground" },
  warning: { label: "Warning", color: "bg-warning text-warning-foreground" },
  error: { label: "Error", color: "bg-destructive text-destructive-foreground" },
  pending: { label: "Pending", color: "bg-brass text-brass-foreground" },
  canceled: { label: "Canceled", color: "bg-muted text-muted-foreground" },
  past_due: { label: "Past Due", color: "bg-destructive text-destructive-foreground" },
};

export function StatusLabel({ status, size = "sm" }: StatusLabelProps) {
  const config = statusConfig[status];
  const padding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.color} ${padding}`}
    >
      {config.label}
    </span>
  );
}
