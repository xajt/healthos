"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface CalorieHistoryWidgetProps {
  data: Array<{
    day: string;
    consumed: number;
    target: number;
  }>;
}

export function CalorieHistoryWidget({ data }: CalorieHistoryWidgetProps) {
  const avgCalories = Math.round(
    data.reduce((sum, d) => sum + d.consumed, 0) / data.length
  );

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: "#6B7280" }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6B7280" }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "14px",
            }}
            formatter={(value, name) => [
              `${value} kcal`,
              name === "consumed" ? "Spożyte" : "Cel",
            ]}
          />
          <ReferenceLine
            y={data[0]?.target}
            stroke="#9CA3AF"
            strokeDasharray="5 5"
          />
          <Bar
            dataKey="consumed"
            fill="#1A1A1A"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-4 mt-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-zinc-900 rounded-sm" />
          <span className="text-zinc-600">Spożyte</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-zinc-400" style={{ borderTop: "2px dashed #9CA3AF" }} />
          <span className="text-zinc-600">Cel</span>
        </div>
      </div>

      <div className="text-center mt-3">
        <span className="text-2xl font-bold text-zinc-900">{avgCalories}</span>
        <span className="text-sm text-zinc-500 ml-1">kcal średnia</span>
      </div>
    </div>
  );
}

// Demo data
export const demoCalorieData = [
  { day: "Pon", consumed: 2100, target: 2200 },
  { day: "Wt", consumed: 1950, target: 2200 },
  { day: "Śr", consumed: 2300, target: 2200 },
  { day: "Czw", consumed: 2150, target: 2200 },
  { day: "Pt", consumed: 2400, target: 2200 },
  { day: "Sob", consumed: 2500, target: 2200 },
  { day: "Ndz", consumed: 1800, target: 2200 },
];
