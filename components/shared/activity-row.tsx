// ── ActivityRow ──────────────────────────────

import { formatDistanceToNow } from "date-fns";

interface ActivityRowProps {
  action: string;
  entityType: string;
  entityName: string;
  timestamp: Date;
  userId?: string;
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
          {formatDistanceToNow(timestamp, { addSuffix: true })}
          {userId && <span> · by {userId}</span>}
        </p>
      </div>
    </div>
  );
}
