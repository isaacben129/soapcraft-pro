// ── MeasurementCell / PlanActualCell ──────────────

interface MeasurementCellProps {
  planned: number;
  actual?: number;
  unit: string;
  tolerance?: number;
}

export function MeasurementCell({
  planned,
  actual,
  unit,
  tolerance = 0.05,
}: MeasurementCellProps) {
  const variance = actual !== undefined ? ((actual - planned) / planned) * 100 : null;
  const isOverTolerance = variance !== null && Math.abs(variance) > tolerance * 100;

  return (
    <div className="flex items-baseline gap-2">
      <span className="tabular-nums text-foreground">
        {planned}
        <span className="text-muted-foreground text-xs ml-0.5">{unit}</span>
      </span>
      {actual !== undefined && (
        <>
          <span className="text-muted-foreground text-xs">→</span>
          <span
            className={`tabular-nums font-medium ${
              isOverTolerance ? "text-warning" : "text-foreground"
            }`}
          >
            {actual}
            <span className="text-muted-foreground text-xs ml-0.5">{unit}</span>
          </span>
          {variance !== null && (
            <span
              className={`text-xs tabular-nums ${
                isOverTolerance ? "text-warning" : "text-muted-foreground"
              }`}
            >
              ({variance > 0 ? "+" : ""}
              {variance.toFixed(1)}%)
            </span>
          )}
        </>
      )}
    </div>
  );
}
