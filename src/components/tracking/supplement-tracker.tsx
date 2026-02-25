"use client";

import { useState } from "react";

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "any";
  notes?: string;
}

interface SupplementLog {
  supplementId: string;
  loggedAt: string;
}

interface SupplementTrackerProps {
  supplements: Supplement[];
  todayLogs: SupplementLog[];
  onLogSupplement: (supplementId: string) => void;
  onRemoveLog: (supplementId: string) => void;
  onAddSupplement: (supplement: Omit<Supplement, "id">) => void;
  onDeleteSupplement: (id: string) => void;
}

const TIME_OF_DAY_LABELS = {
  morning: "Rano",
  afternoon: "Południe",
  evening: "Wieczór",
  any: "Dowolnie",
};

const TIME_OF_DAY_ICONS = {
  morning: "🌅",
  afternoon: "☀️",
  evening: "🌙",
  any: "🕐",
};

export function SupplementTracker({
  supplements,
  todayLogs,
  onLogSupplement,
  onRemoveLog,
  onAddSupplement,
  onDeleteSupplement,
}: SupplementTrackerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSupplement, setNewSupplement] = useState({
    name: "",
    dosage: "",
    timeOfDay: "any" as Supplement["timeOfDay"],
    notes: "",
  });

  const loggedIds = new Set(todayLogs.map((log) => log.supplementId));
  const totalSupplements = supplements.length;
  const takenSupplements = supplements.filter((s) => loggedIds.has(s.id)).length;
  const progressPercentage = totalSupplements > 0 ? Math.round((takenSupplements / totalSupplements) * 100) : 0;

  // Group supplements by time of day
  const groupedSupplements = supplements.reduce((acc, supplement) => {
    const time = supplement.timeOfDay;
    if (!acc[time]) acc[time] = [];
    acc[time].push(supplement);
    return acc;
  }, {} as Record<Supplement["timeOfDay"], Supplement[]>);

  const handleAddSupplement = () => {
    if (!newSupplement.name.trim()) return;
    onAddSupplement(newSupplement);
    setNewSupplement({ name: "", dosage: "", timeOfDay: "any", notes: "" });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-zinc-900">Suplementy</h3>
            <p className="text-sm text-zinc-500">
              {takenSupplements} z {totalSupplements} przyjętych dzisiaj
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            + Dodaj
          </button>
        </div>

        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Supplement List by Time */}
      {supplements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center">
          <div className="text-4xl mb-3">💊</div>
          <p className="text-zinc-500">Brak zdefiniowanych suplementów</p>
          <p className="text-sm text-zinc-400 mt-1">
            Dodaj suplementy, które regularnie przyjmujesz
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {(["morning", "afternoon", "evening", "any"] as const).map((timeOfDay) => {
            const group = groupedSupplements[timeOfDay];
            if (!group || group.length === 0) return null;

            return (
              <div key={timeOfDay} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
                <div className="p-3 bg-zinc-50 border-b border-zinc-100 flex items-center gap-2">
                  <span>{TIME_OF_DAY_ICONS[timeOfDay]}</span>
                  <span className="text-sm font-medium text-zinc-700">
                    {TIME_OF_DAY_LABELS[timeOfDay]}
                  </span>
                </div>
                <div className="divide-y divide-zinc-50">
                  {group.map((supplement) => {
                    const isTaken = loggedIds.has(supplement.id);

                    return (
                      <div
                        key={supplement.id}
                        className={`p-4 flex items-center gap-3 ${
                          isTaken ? "bg-green-50/50" : ""
                        }`}
                      >
                        <button
                          onClick={() =>
                            isTaken
                              ? onRemoveLog(supplement.id)
                              : onLogSupplement(supplement.id)
                          }
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isTaken
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-zinc-300 hover:border-green-400"
                          }`}
                        >
                          {isTaken && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${isTaken ? "text-zinc-400 line-through" : "text-zinc-900"}`}>
                            {supplement.name}
                          </p>
                          <p className="text-sm text-zinc-500">{supplement.dosage}</p>
                          {supplement.notes && (
                            <p className="text-xs text-zinc-400 mt-1">{supplement.notes}</p>
                          )}
                        </div>

                        <button
                          onClick={() => onDeleteSupplement(supplement.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Recommendation */}
      {supplements.length > 0 && progressPercentage < 100 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <p className="font-medium text-zinc-900">Przypomnienie</p>
              <p className="text-sm text-zinc-600 mt-1">
                Pamiętaj o regularnym przyjmowaniu suplementów. Najlepiej brać je o tej samej porze każdego dnia.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Dodaj suplement</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Nazwa
                </label>
                <input
                  type="text"
                  value={newSupplement.name}
                  onChange={(e) => setNewSupplement({ ...newSupplement, name: e.target.value })}
                  placeholder="np. Witamina D3"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Dawkowanie
                </label>
                <input
                  type="text"
                  value={newSupplement.dosage}
                  onChange={(e) => setNewSupplement({ ...newSupplement, dosage: e.target.value })}
                  placeholder="np. 2000 IU"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Pora przyjęcia
                </label>
                <select
                  value={newSupplement.timeOfDay}
                  onChange={(e) => setNewSupplement({ ...newSupplement, timeOfDay: e.target.value as Supplement["timeOfDay"] })}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                >
                  <option value="morning">Rano</option>
                  <option value="afternoon">Południe</option>
                  <option value="evening">Wieczór</option>
                  <option value="any">Dowolnie</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Notatki (opcjonalnie)
                </label>
                <input
                  type="text"
                  value={newSupplement.notes}
                  onChange={(e) => setNewSupplement({ ...newSupplement, notes: e.target.value })}
                  placeholder="np. Brać z posiłkiem"
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
                  onClick={handleAddSupplement}
                  disabled={!newSupplement.name.trim()}
                  className="flex-1 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
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
