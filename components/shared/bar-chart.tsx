// ── BarChart ─────────────────────────────────────
// Simple SVG bar chart — zero dependencies.
// Renders a horizontal bar chart with configurable data.

interface BarChartDatum {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartDatum[];
  height?: number;
  barHeight?: number;
  gap?: number;
  maxValue?: number;
  showValues?: boolean;
}

export function BarChart({
  data,
  height = 200,
  barHeight = 24,
  gap = 8,
  maxValue,
  showValues = true,
}: BarChartProps) {
  const computedMax = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  const totalHeight = data.length * (barHeight + gap) - gap;
  const chartHeight = Math.max(height, totalHeight);

  return (
    <svg
      width="100%"
      height={chartHeight}
      viewBox={`0 0 100 ${chartHeight}`}
      className="overflow-visible"
      role="img"
      aria-label="Bar chart"
    >
      {data.map((datum, i) => {
        const y = i * (barHeight + gap);
        const barWidth = (datum.value / computedMax) * 85;
        const color = datum.color || "var(--color-action)";

        return (
          <g key={datum.label}>
            {/* Label */}
            <text
              x="0"
              y={y + barHeight / 2 + 4}
              fontSize="8"
              fill="var(--color-muted-foreground)"
              fontFamily="var(--font-sans)"
            >
              {datum.label}
            </text>
            {/* Bar background */}
            <rect
              x="60"
              y={y}
              width="35"
              height={barHeight}
              rx="2"
              fill="var(--color-clay)"
              opacity="0.5"
            />
            {/* Bar fill */}
            <rect
              x="60"
              y={y}
              width={barWidth}
              height={barHeight}
              rx="2"
              fill={color}
              opacity="0.85"
            />
            {/* Value */}
            {showValues && (
              <text
                x={60 + barWidth + 4}
                y={y + barHeight / 2 + 4}
                fontSize="8"
                fill="var(--color-foreground)"
                fontFamily="var(--font-sans)"
                fontWeight="500"
              >
                {datum.value}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
