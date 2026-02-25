"use client";

import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface SleepEntry {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  duration: number; // in hours
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

interface SleepTrackerProps {
  entries: SleepEntry[];
  onAddEntry: (entry: Omit<SleepEntry, "id">) => void;
  onDeleteEntry: (id: string) => void;
}

const QUALITY_LABELS = {
  1: "Bardzo źle",
  2: "Źle",
  3: "Średnio",
  4: "Dobrze",
  5: "Świetnie",
};

const QUALITY_COLORS = {
  1: "bg-red-100 text-red-700",
  2: "bg-orange-100 text-orange-700",
  3: "bg-yellow-100 text-yellow-700",
  4: "bg-green-100 text-green-700",
  5: "bg-emerald-100 text-emerald-700",
};

export function SleepTracker({ entries, onAddEntry, onDeleteEntry }: SleepTrackerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    bedTime: "23:00",
    wakeTime: "07:00",
    quality: 4 as 1 | 2 | 3 | 4 | 5,
    notes: "",
  });

  const handleSubmit = () => {
    // Calculate duration
    const [bedH, bedM] = newEntry.bedTime.split(":").map(Number);
    const [wakeH, wakeM] = newEntry.wakeTime.split(":").map(Number);

    let duration = (wakeH + wakeM / 60) - (bedH + bedM / 60);
    if (duration < 0) duration += 24; // Crossed midnight

    onAddEntry({
      date: new Date().toISOString(),
      bedTime: newEntry.bedTime,
      wakeTime: newEntry.wakeTime,
      duration: Math.round(duration * 10) / 10,
      quality: newEntry.quality,
      notes: newEntry.notes || undefined,
    });

    setShowAddModal(false);
    setNewEntry({ bedTime: "23:00", wakeTime: "07:00", quality: 4, notes: "" });
  };

  // Calculate stats
  const avgDuration = entries.length > 0
    ? (entries.reduce((sum, e) => sum + e.duration, 0) / entries.length).toFixed(1)
    : "0";
  const avgQuality = entries.length > 0
    ? (entries.reduce((sum, e) => sum + e.quality, 0) / entries.length).toFixed(1)
    : "0";

  // Chart data - last 7 entries
  const chartData = entries
    .slice(0, 7)
    .reverse()
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString("pl-PL", { weekday: "short" }),
      duration: entry.duration,
      quality: entry.quality,
    }));

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Średni sen</p>
          <p className="text-2xl font-bold text-zinc-900">{avgDuration}h</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Średnia jakość</p>
          <p className="text-2xl font-bold text-zinc-900">{avgQuality}/5</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Ostatnia noc</p>
          <p className="text-2xl font-bold text-zinc-900">
            {entries[0]?.duration || 0}h
          </p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Cel: 8h</p>
          <p className="text-2xl font-bold text-zinc-900">
            {entries[0]?.duration && entries[0].duration >= 7.5 ? "✓" : "✗"}
          </p>
        </div>
      </div>

      {/* Duration Chart */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-zinc-900">Czas snu</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            + Dodaj
          </button>
        </div>

        {chartData.length > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
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
                  domain={[0, 12]}
                  tickFormatter={(v) => `${v}h`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e4e4e7",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${value}h`, "Sen"]}
                />
                <Area
                  type="monotone"
                  dataKey="duration"
                  stroke="#818cf8"
                  fill="#c7d2fe"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-zinc-500">
            <div className="text-center">
              <p className="text-4xl mb-2">😴</p>
              <p>Brak danych o śnie</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="p-4 border-b border-zinc-100">
          <h3 className="font-semibold text-zinc-900">Ostatnie noce</h3>
        </div>
        <div className="divide-y divide-zinc-50">
          {entries.length === 0 ? (
            <div className="p-6 text-center text-zinc-500">
              <p>Brak zapisanych pomiarów</p>
            </div>
          ) : (
            entries.slice(0, 7).map((entry) => (
              <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-zinc-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <span className="text-lg">😴</span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">{entry.duration}h snu</p>
                    <p className="text-sm text-zinc-500">
                      {entry.bedTime} → {entry.wakeTime}
                    </p>
                    {entry.notes && (
                      <p className="text-xs text-zinc-400 mt-1">{entry.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${QUALITY_COLORS[entry.quality]}`}>
                    {QUALITY_LABELS[entry.quality]}
                  </span>
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sleep Tips */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">💡</span>
          </div>
          <div>
            <p className="font-medium text-zinc-900">Porada</p>
            <p className="text-sm text-zinc-600 mt-1">
              Dla najlepszego jakości snu staraj się kłaść i wstawać o tej samej porze każdego dnia.
              Optymalna długość snu dla dorosłych to 7-9 godzin.
            </p>
          </div>
        </div>
      </div>

      {/* Add Sleep Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Dodaj sen</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Pójście spać
                  </label>
                  <input
                    type="time"
                    value={newEntry.bedTime}
                    onChange={(e) => setNewEntry({ ...newEntry, bedTime: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Pobudka
                  </label>
                  <input
                    type="time"
                    value={newEntry.wakeTime}
                    onChange={(e) => setNewEntry({ ...newEntry, wakeTime: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Jakość snu
                </label>
                <div className="flex gap-2">
                  {([1, 2, 3, 4, 5] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => setNewEntry({ ...newEntry, quality: q })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        newEntry.quality === q
                          ? QUALITY_COLORS[q]
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Notatki (opcjonalnie)
                </label>
                <input
                  type="text"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  placeholder="np. Kawa przed snem..."
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
                  className="flex-1 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
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
