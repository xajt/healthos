"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface WeightEntry {
  id: string;
  weight: number;
  loggedAt: string;
  notes?: string;
}

interface WeightTrackerProps {
  entries: WeightEntry[];
  targetWeight?: number;
  onAddWeight: (weight: number, notes?: string) => void;
  onDeleteEntry: (id: string) => void;
}

export function WeightTracker({
  entries,
  targetWeight,
  onAddWeight,
  onDeleteEntry,
}: WeightTrackerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    const weight = parseFloat(newWeight);
    if (isNaN(weight) || weight <= 0) return;
    onAddWeight(weight, notes || undefined);
    setNewWeight("");
    setNotes("");
    setShowAddModal(false);
  };

  // Calculate stats
  const latestWeight = entries[0]?.weight || 0;
  const previousWeight = entries[1]?.weight || latestWeight;
  const weightChange = latestWeight - previousWeight;
  const startWeight = entries[entries.length - 1]?.weight || latestWeight;
  const totalChange = latestWeight - startWeight;

  // Calculate progress to goal
  const progressToGoal = targetWeight
    ? Math.round(((startWeight - latestWeight) / (startWeight - targetWeight)) * 100)
    : null;

  // Format chart data
  const chartData = entries
    .slice()
    .reverse()
    .map((entry) => ({
      date: new Date(entry.loggedAt).toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "short",
      }),
      weight: entry.weight,
    }))
    .slice(-30); // Last 30 entries

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Aktualna waga</p>
          <p className="text-2xl font-bold text-zinc-900">{latestWeight} kg</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Zmiana tygodniowa</p>
          <p className={`text-2xl font-bold ${weightChange < 0 ? "text-green-600" : weightChange > 0 ? "text-red-500" : "text-zinc-900"}`}>
            {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)} kg
          </p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Całkowita zmiana</p>
          <p className={`text-2xl font-bold ${totalChange < 0 ? "text-green-600" : totalChange > 0 ? "text-red-500" : "text-zinc-900"}`}>
            {totalChange > 0 ? "+" : ""}{totalChange.toFixed(1)} kg
          </p>
        </div>
        {targetWeight && (
          <div className="bg-white rounded-xl border border-zinc-200 p-4">
            <p className="text-sm text-zinc-500">Cel: {targetWeight} kg</p>
            <p className="text-2xl font-bold text-zinc-900">
              {progressToGoal !== null ? `${Math.min(100, Math.max(0, progressToGoal))}%` : "-"}
            </p>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-zinc-900">Historia wagi</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            + Dodaj pomiar
          </button>
        </div>

        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis
                  dataKey="date"
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={["dataMin - 2", "dataMax + 2"]}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e4e4e7",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${value} kg`, "Waga"]}
                />
                {targetWeight && (
                  <ReferenceLine
                    y={targetWeight}
                    stroke="#22c55e"
                    strokeDasharray="5 5"
                    label={{
                      value: "Cel",
                      position: "right",
                      fill: "#22c55e",
                      fontSize: 12,
                    }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#18181b"
                  strokeWidth={2}
                  dot={{ fill: "#18181b", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-zinc-500">
            <div className="text-center">
              <p className="text-4xl mb-2">📊</p>
              <p>Brak danych do wyświetlenia</p>
              <p className="text-sm text-zinc-400">Dodaj pierwszy pomiar wagi</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="p-4 border-b border-zinc-100">
          <h3 className="font-semibold text-zinc-900">Ostatnie pomiary</h3>
        </div>
        <div className="divide-y divide-zinc-50">
          {entries.slice(0, 10).map((entry) => (
            <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-zinc-50">
              <div>
                <p className="font-medium text-zinc-900">{entry.weight} kg</p>
                <p className="text-sm text-zinc-500">
                  {new Date(entry.loggedAt).toLocaleDateString("pl-PL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {entry.notes && (
                  <p className="text-sm text-zinc-400 mt-1">{entry.notes}</p>
                )}
              </div>
              <button
                onClick={() => onDeleteEntry(entry.id)}
                className="p-2 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          {entries.length === 0 && (
            <div className="p-8 text-center text-zinc-500">
              <p>Brak zapisanych pomiarów</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Weight Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Dodaj pomiar wagi</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Waga (kg)
                </label>
                <input
                  type="number"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="np. 75.5"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  step="0.1"
                  min="20"
                  max="300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Notatki (opcjonalnie)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="np. Po treningu"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-zinc-200 rounded-xl text-zinc-600 font-medium hover:bg-zinc-50 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!newWeight}
                  className="flex-1 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  Zapisz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
