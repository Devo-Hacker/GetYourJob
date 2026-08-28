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
