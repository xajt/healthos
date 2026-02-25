"use client";

import { useState } from "react";

interface MoodEntry {
  id: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 1 | 2 | 3 | 4 | 5;
  stress: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

interface MoodTrackerProps {
  entries: MoodEntry[];
  onAddEntry: (entry: Omit<MoodEntry, "id">) => void;
  onDeleteEntry: (id: string) => void;
}

const MOOD_EMOJIS = {
  1: "😢",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😄",
};

const MOOD_LABELS = {
  1: "Bardzo źle",
  2: "Źle",
  3: "Średnio",
  4: "Dobrze",
  5: "Świetnie",
};

const ENERGY_LABELS = {
  1: "Wyczerpany",
  2: "Zmęczony",
  3: "Średnio",
  4: "Energiczny",
  5: "Pełen energii",
};

const STRESS_LABELS = {
  1: "Zrelaksowany",
  2: "Spokojny",
  3: "Średnio",
  4: "Spięty",
  5: "Bardzo zestresowany",
};

export function MoodTracker({ entries, onAddEntry, onDeleteEntry }: MoodTrackerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    mood: 3 as 1 | 2 | 3 | 4 | 5,
    energy: 3 as 1 | 2 | 3 | 4 | 5,
    stress: 3 as 1 | 2 | 3 | 4 | 5,
    notes: "",
  });

  const handleSubmit = () => {
    onAddEntry({
      date: new Date().toISOString(),
      mood: newEntry.mood,
      energy: newEntry.energy,
      stress: newEntry.stress,
      notes: newEntry.notes || undefined,
    });
    setShowAddModal(false);
    setNewEntry({ mood: 3, energy: 3, stress: 3, notes: "" });
  };

  // Calculate averages
  const avgMood = entries.length > 0
    ? (entries.reduce((sum, e) => sum + e.mood, 0) / entries.length).toFixed(1)
    : "-";
  const avgEnergy = entries.length > 0
    ? (entries.reduce((sum, e) => sum + e.energy, 0) / entries.length).toFixed(1)
    : "-";
  const avgStress = entries.length > 0
    ? (entries.reduce((sum, e) => sum + e.stress, 0) / entries.length).toFixed(1)
    : "-";

  // Get today's entry
  const today = new Date().toDateString();
  const todayEntry = entries.find((e) => new Date(e.date).toDateString() === today);

  // Last 7 days mood data for visualization
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const entry = entries.find((e) => new Date(e.date).toDateString() === date.toDateString());
    return {
      day: date.toLocaleDateString("pl-PL", { weekday: "short" }),
      mood: entry?.mood || null,
    };
  }).reverse();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-zinc-200 p-4 text-center">
          <p className="text-sm text-zinc-500">Nastrój</p>
          <p className="text-3xl">{MOOD_EMOJIS[Math.round(Number(avgMood)) as 1|2|3|4|5] || "❓"}</p>
          <p className="text-sm font-medium text-zinc-900">{avgMood}/5</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 text-center">
          <p className="text-sm text-zinc-500">Energia</p>
          <p className="text-3xl">⚡</p>
          <p className="text-sm font-medium text-zinc-900">{avgEnergy}/5</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 text-center">
          <p className="text-sm text-zinc-500">Stres</p>
          <p className="text-3xl">🧘</p>
          <p className="text-sm font-medium text-zinc-900">{avgStress}/5</p>
        </div>
      </div>

      {/* Today's Check-in */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-zinc-900">Dzisiejszy nastrój</h3>
          {!todayEntry && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              Sprawdź się
            </button>
          )}
        </div>

        {todayEntry ? (
          <div className="text-center py-4">
            <p className="text-5xl mb-2">{MOOD_EMOJIS[todayEntry.mood]}</p>
            <p className="font-medium text-zinc-900">{MOOD_LABELS[todayEntry.mood]}</p>
            <div className="flex justify-center gap-4 mt-4 text-sm text-zinc-500">
              <span>⚡ Energia: {todayEntry.energy}/5</span>
              <span>🧘 Stres: {todayEntry.stress}/5</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-zinc-500">
            <p>Jeszcze nie sprawdziłeś swojego nastroju dzisiaj</p>
          </div>
        )}
      </div>

      {/* Week Overview */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4">
        <h3 className="font-semibold text-zinc-900 mb-4">Ostatnie 7 dni</h3>
        <div className="flex justify-between">
          {last7Days.map((day, i) => (
            <div key={i} className="text-center">
              <p className="text-xs text-zinc-500 mb-1">{day.day}</p>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                day.mood ? "bg-amber-100" : "bg-zinc-100"
              }`}>
                {day.mood ? (
                  <span className="text-lg">{MOOD_EMOJIS[day.mood]}</span>
                ) : (
                  <span className="text-zinc-300">-</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="p-4 border-b border-zinc-100">
          <h3 className="font-semibold text-zinc-900">Historia</h3>
        </div>
        <div className="divide-y divide-zinc-50 max-h-64 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="p-6 text-center text-zinc-500">
              <p>Brak zapisanych wpisów</p>
            </div>
          ) : (
            entries.slice(0, 10).map((entry) => (
              <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-zinc-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{MOOD_EMOJIS[entry.mood]}</span>
                  <div>
                    <p className="font-medium text-zinc-900">{MOOD_LABELS[entry.mood]}</p>
                    <p className="text-sm text-zinc-500">
                      {new Date(entry.date).toLocaleDateString("pl-PL", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {entry.notes && (
                      <p className="text-xs text-zinc-400 mt-1">{entry.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-zinc-500 text-right">
                    <p>⚡ {entry.energy}</p>
                    <p>🧘 {entry.stress}</p>
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
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Mood Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Jak się czujesz?</h3>

            <div className="space-y-6">
              {/* Mood */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Nastrój
                </label>
                <div className="flex justify-between gap-1">
                  {([1, 2, 3, 4, 5] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setNewEntry({ ...newEntry, mood: m })}
                      className={`flex-1 py-3 rounded-lg text-2xl transition-all ${
                        newEntry.mood === m
                          ? "bg-amber-100 scale-110"
                          : "bg-zinc-100 hover:bg-zinc-200"
                      }`}
                    >
                      {MOOD_EMOJIS[m]}
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-zinc-500 mt-1">
                  {MOOD_LABELS[newEntry.mood]}
                </p>
              </div>

              {/* Energy */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Poziom energii
                </label>
                <div className="flex gap-2">
                  {([1, 2, 3, 4, 5] as const).map((e) => (
                    <button
                      key={e}
                      onClick={() => setNewEntry({ ...newEntry, energy: e })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        newEntry.energy === e
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-zinc-500 mt-1">
                  {ENERGY_LABELS[newEntry.energy]}
                </p>
              </div>

              {/* Stress */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Poziom stresu
                </label>
                <div className="flex gap-2">
                  {([1, 2, 3, 4, 5] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setNewEntry({ ...newEntry, stress: s })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        newEntry.stress === s
                          ? "bg-purple-100 text-purple-700"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-zinc-500 mt-1">
                  {STRESS_LABELS[newEntry.stress]}
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Notatki (opcjonalnie)
                </label>
                <input
                  type="text"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  placeholder="Co wpłynęło na Twój nastrój?"
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
