"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeightTrendWidgetProps {
  data: Array<{ date: string; weight: number }>;
}

export function WeightTrendWidget({ data }: WeightTrendWidgetProps) {
  const minWeight = Math.min(...data.map((d) => d.weight)) - 2;
  const maxWeight = Math.max(...data.map((d) => d.weight)) + 2;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#6B7280" }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
          />
          <YAxis
            domain={[minWeight, maxWeight]}
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
            formatter={(value) => [`${value} kg`, "Waga"]}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#1A1A1A"
            strokeWidth={2}
            dot={{ fill: "#1A1A1A", strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: "#1A1A1A" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Demo data for development
export const demoWeightData = [
  { date: "01.02", weight: 78.5 },
  { date: "04.02", weight: 78.2 },
  { date: "07.02", weight: 78.0 },
  { date: "10.02", weight: 77.8 },
  { date: "13.02", weight: 77.5 },
  { date: "16.02", weight: 77.6 },
  { date: "19.02", weight: 77.3 },
  { date: "22.02", weight: 77.1 },
  { date: "25.02", weight: 76.9 },
];
