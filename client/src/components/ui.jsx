import React from "react";

export function ClayCard({ className = "", children }) {
  return (
    <div
      className={`rounded-[28px] bg-white border border-white shadow-[0_10px_30px_-10px_rgba(76,29,149,0.12)] ${className}`}
    >
      {children}
    </div>
  );
}

export function CircularProgress({
  percentage,
  size = 64,
  stroke = 7,
  trackColor,
  barColor,
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={barColor}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

/**
 * Lightweight multi-series line chart, no chart library dependency.
 * series: [{ name, color, data: number[] }]
 * labels: string[] (x-axis labels, same length as each series' data)
 */
export function LineChart({ series, labels, height = 220, maxValue = 100 }) {
  const width = 640;
  const padLeft = 34;
  const padRight = 10;
  const padTop = 10;
  const padBottom = 26;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const xStep = labels.length > 1 ? plotWidth / (labels.length - 1) : 0;
  const yFor = (value) => padTop + plotHeight - (value / maxValue) * plotHeight;
  const xFor = (i) => padLeft + i * xStep;

  const gridLines = [0, 25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {gridLines.map((g) => (
        <g key={g}>
          <line
            x1={padLeft}
            x2={width - padRight}
            y1={yFor(g)}
            y2={yFor(g)}
            stroke="#f1f5f9"
            strokeWidth={1}
          />
          <text x={0} y={yFor(g) + 3} fontSize={10} fill="#94a3b8">
            {g}%
          </text>
        </g>
      ))}

      {labels.map((label, i) => (
        <text key={label + i} x={xFor(i)} y={height - 6} fontSize={10} fill="#94a3b8" textAnchor="middle">
          {label}
        </text>
      ))}

      {series.map((s) => {
        const points = s.data.map((v, i) => `${xFor(i)},${yFor(v)}`).join(" ");
        return (
          <g key={s.name}>
            <polyline points={points} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            {s.data.map((v, i) => (
              <circle key={i} cx={xFor(i)} cy={yFor(v)} r={2.5} fill={s.color} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
