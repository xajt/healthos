"use client";

import { useState } from "react";

interface WaterEntry {
  id: string;
  amount: number; // in ml
  loggedAt: string;
}

interface WaterTrackerProps {
  entries: WaterEntry[];
  targetMl: number;
  onAddWater: (amount: number) => void;
  onDeleteEntry: (id: string) => void;
}

const QUICK_AMOUNTS = [
  { ml: 200, label: "Szklanka" },
  { ml: 250, label: "Kubek" },
  { ml: 330, label: "Puszka" },
  { ml: 500, label: "Butelka" },
  { ml: 750, label: "Duża butelka" },
  { ml: 1000, label: "1 litr" },
];

export function WaterTracker({
  entries,
  targetMl,
  onAddWater,
  onDeleteEntry,
}: WaterTrackerProps) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

  const totalMl = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const percentage = Math.min(100, Math.round((totalMl / targetMl) * 100));
  const remaining = Math.max(0, targetMl - totalMl);

  const handleCustomSubmit = () => {
    const amount = parseInt(customAmount);
    if (isNaN(amount) || amount <= 0) return;
    onAddWater(amount);
    setCustomAmount("");
    setShowCustomModal(false);
  };

  // Water level visualization
  const waterLevel = Math.min(100, percentage);

  return (
    <div className="space-y-6">
      {/* Main Progress */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-zinc-900">Nawodnienie</h3>
            <p className="text-sm text-zinc-500">Cel: {targetMl} ml dziennie</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-zinc-900">{totalMl}</p>
            <p className="text-sm text-zinc-500">ml</p>
          </div>
        </div>

        {/* Water glass visualization */}
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-32 bg-zinc-100 rounded-b-3xl rounded-t-lg overflow-hidden border-2 border-zinc-200">
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-500"
              style={{ height: `${waterLevel}%` }}
            >
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full opacity-60" />
                <div className="absolute top-4 right-3 w-1 h-1 bg-white rounded-full opacity-40" />
                <div className="absolute top-8 left-4 w-1.5 h-1.5 bg-white rounded-full opacity-50" />
              </div>
            </div>
            {/* Glass shine */}
            <div className="absolute top-0 left-2 w-1 h-full bg-white/20 rounded" />
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-zinc-600">Postęp</span>
                <span className="font-medium text-zinc-900">{percentage}%</span>
              </div>
              <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {remaining > 0 ? (
              <p className="text-sm text-zinc-600">
                Jeszcze <strong className="text-zinc-900">{remaining} ml</strong> do celu
              </p>
            ) : (
              <p className="text-sm text-green-600 font-medium">
                Cel osiągnięty! Świetna robota!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4">
        <h4 className="text-sm font-medium text-zinc-700 mb-3">Szybkie dodawanie</h4>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_AMOUNTS.map((item) => (
            <button
              key={item.ml}
              onClick={() => onAddWater(item.ml)}
              className="flex flex-col items-center gap-1 p-3 bg-zinc-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <span className="text-xl">💧</span>
              <span className="text-xs font-medium">{item.ml} ml</span>
              <span className="text-xs text-zinc-400">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setShowCustomModal(true)}
            className="flex flex-col items-center gap-1 p-3 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors"
          >
            <span className="text-xl">✏️</span>
            <span className="text-xs font-medium">Inna</span>
            <span className="text-xs text-zinc-400">ilość</span>
          </button>
        </div>
      </div>

      {/* Today's Log */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="p-4 border-b border-zinc-100">
          <h4 className="font-medium text-zinc-900">Dzisiejsze spożycie</h4>
        </div>
        <div className="divide-y divide-zinc-50 max-h-48 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="p-6 text-center text-zinc-500">
              <p>Brak zapisanych pomiarów</p>
              <p className="text-sm text-zinc-400">Kliknij powyżej, aby dodać wodę</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="p-3 flex items-center justify-between hover:bg-zinc-50">
                <div className="flex items-center gap-3">
                  <span className="text-lg">💧</span>
                  <div>
                    <p className="font-medium text-zinc-900">{entry.amount} ml</p>
                    <p className="text-xs text-zinc-500">
                      {new Date(entry.loggedAt).toLocaleTimeString("pl-PL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  className="p-1.5 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Custom Amount Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Wpisz ilość</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Ilość (ml)
                </label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="np. 350"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  min="1"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-3 border border-zinc-200 rounded-xl text-zinc-600 font-medium hover:bg-zinc-50 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleCustomSubmit}
                  disabled={!customAmount}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  Dodaj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
