// ── ActivityRow ──────────────────────────────

interface ActivityRowProps {
  action: string;
  entityType: string;
  entityName: string;
  timestamp: Date | string;
  userId?: string;
}

function formatDistanceToNow(timestamp: Date | string): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const diffSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  const unit = units.find((item) => diffSeconds >= item.seconds);
  if (!unit) return "just now";

  const value = Math.floor(diffSeconds / unit.seconds);
  return `${value} ${unit.label}${value === 1 ? "" : "s"} ago`;
}

export function ActivityRow({
  action,
  entityType,
  entityName,
  timestamp,
  userId,
}: ActivityRowProps) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border last:border-0">
      <div className="w-2 h-2 rounded-full bg-muted mt-2 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          <span className="font-medium">{action}</span>{" "}
          <span className="text-muted-foreground">{entityType}</span>{" "}
          <span className="font-medium">{entityName}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatDistanceToNow(timestamp)}
          {userId && <span> · by {userId}</span>}
        </p>
      </div>
    </div>
  );
}
