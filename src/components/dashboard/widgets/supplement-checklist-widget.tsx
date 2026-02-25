"use client";

import { useState } from "react";

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timeOfDay: "morning" | "afternoon" | "evening";
  taken: boolean;
}

interface SupplementChecklistWidgetProps {
  supplements: Supplement[];
  onToggle?: (id: string, taken: boolean) => void;
}

const timeIcons = {
  morning: "🌅",
  afternoon: "☀️",
  evening: "🌙",
};

const timeLabels = {
  morning: "Rano",
  afternoon: "Popołudnie",
  evening: "Wieczór",
};

export function SupplementChecklistWidget({
  supplements: initialSupplements,
  onToggle,
}: SupplementChecklistWidgetProps) {
  const [supplements, setSupplements] = useState(initialSupplements);

  const handleToggle = (id: string) => {
    setSupplements((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, taken: !s.taken } : s
      )
    );
    const supplement = supplements.find((s) => s.id === id);
    if (supplement) {
      onToggle?.(id, !supplement.taken);
    }
  };

  const takenCount = supplements.filter((s) => s.taken).length;
  const progressPercentage = (takenCount / supplements.length) * 100;

  // Group by time of day
  const grouped = supplements.reduce((acc, s) => {
    if (!acc[s.timeOfDay]) acc[s.timeOfDay] = [];
    acc[s.timeOfDay].push(s);
    return acc;
  }, {} as Record<string, Supplement[]>);

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-sm font-medium text-zinc-900">
          {takenCount}/{supplements.length}
        </span>
      </div>

      {/* Grouped Supplements */}
      <div className="space-y-4">
        {(["morning", "afternoon", "evening"] as const).map((time) => {
          const items = grouped[time];
          if (!items || items.length === 0) return null;

          return (
            <div key={time}>
              <div className="flex items-center gap-2 mb-2">
                <span>{timeIcons[time]}</span>
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  {timeLabels[time]}
                </span>
              </div>
              <div className="space-y-2">
                {items.map((supplement) => (
                  <button
                    key={supplement.id}
                    onClick={() => handleToggle(supplement.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      supplement.taken
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                        supplement.taken
                          ? "bg-green-500 border-green-500"
                          : "border-zinc-300"
                      }`}
                    >
                      {supplement.taken && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-medium ${supplement.taken ? "text-zinc-500 line-through" : "text-zinc-900"}`}>
                        {supplement.name}
                      </p>
                      <p className="text-xs text-zinc-500">{supplement.dosage}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {supplements.length === 0 && (
        <div className="text-center py-6 text-zinc-500">
          <p>Brak suplementów</p>
          <p className="text-sm mt-1">Dodaj suplementy w ustawieniach</p>
        </div>
      )}
    </div>
  );
}

// Demo data
export const demoSupplements: Supplement[] = [
  { id: "1", name: "Witamina D3", dosage: "2000 IU", timeOfDay: "morning", taken: true },
  { id: "2", name: "Omega-3", dosage: "1000 mg", timeOfDay: "morning", taken: true },
  { id: "3", name: "Magnez", dosage: "400 mg", timeOfDay: "evening", taken: false },
  { id: "4", name: "Cynk", dosage: "15 mg", timeOfDay: "evening", taken: false },
];
