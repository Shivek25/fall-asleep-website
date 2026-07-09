interface DataPoint {
  date: string;
  value: number;
}

interface Props {
  data: DataPoint[];
}

export default function TrendChart({ data }: Props) {
  if (data.length === 0) return null;

  const width = 320;
  const height = 120;
  const padding = { top: 16, right: 16, bottom: 24, left: 28 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = 5;
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const xStep = data.length > 1 ? chartW / (data.length - 1) : chartW / 2;

  const points = data.map((d, i) => ({
    x: padding.left + i * xStep,
    y: padding.top + chartH - ((d.value - minVal) / range) * chartH,
    label: d.date,
    value: d.value,
  }));

  // Build SVG path
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Area fill
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  return (
    <div class="trend" role="img" aria-label={`Sleep quality trend: ${data.length} entries, average ${(data.reduce((s, d) => s + d.value, 0) / data.length).toFixed(1)} out of 5`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        style={{ maxWidth: `${width}px`, height: 'auto' }}
      >
        {/* Y-axis labels */}
        {[1, 3, 5].map((v) => {
          const y = padding.top + chartH - ((v - minVal) / range) * chartH;
          return (
            <g key={v}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartW}
                y2={y}
                stroke="rgba(255,255,255,0.04)"
                stroke-dasharray="2 4"
              />
              <text
                x={padding.left - 6}
                y={y + 3}
                text-anchor="end"
                fill="var(--color-drift-text-dim)"
                font-size="9"
                font-family="var(--font-drift)"
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* Area gradient */}
        <defs>
          <linearGradient id="trend-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--color-drift-accent)" stop-opacity="0.25" />
            <stop offset="100%" stop-color="var(--color-drift-accent)" stop-opacity="0" />
          </linearGradient>
        </defs>

        {/* Area */}
        <path d={areaPath} fill="url(#trend-grad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="var(--color-drift-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />

        {/* Dots */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="var(--color-drift-accent)"
            stroke="var(--color-drift-bg)"
            stroke-width="1.5"
          />
        ))}

        {/* X-axis labels (first, mid, last) */}
        {data.length > 0 && [0, data.length > 2 ? Math.floor(data.length / 2) : -1, data.length - 1]
          .filter((i, idx, arr) => i >= 0 && arr.indexOf(i) === idx)
          .map((i) => (
            <text
              key={i}
              x={points[i].x}
              y={height - 4}
              text-anchor="middle"
              fill="var(--color-drift-text-dim)"
              font-size="8"
              font-family="var(--font-drift)"
            >
              {new Date(data[i].date + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </text>
          ))}
      </svg>

      <style>{`
        .trend {
          display: flex;
          justify-content: center;
          padding: 0.75rem;
          background: var(--color-drift-surface);
          border-radius: var(--radius-drift-md);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
      `}</style>
    </div>
  );
}
