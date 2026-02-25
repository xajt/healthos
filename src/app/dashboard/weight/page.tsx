"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WeightTracker } from "@/components/tracking/weight-tracker";

// Demo data for development
const DEMO_WEIGHT_ENTRIES = [
  { id: "1", weight: 75.5, loggedAt: "2026-02-25T08:00:00Z", notes: "Rano, na czczo" },
  { id: "2", weight: 75.2, loggedAt: "2026-02-24T08:00:00Z" },
  { id: "3", weight: 75.8, loggedAt: "2026-02-23T07:30:00Z", notes: "Po treningu cardio" },
  { id: "4", weight: 75.4, loggedAt: "2026-02-22T08:00:00Z" },
  { id: "5", weight: 76.0, loggedAt: "2026-02-21T08:00:00Z" },
  { id: "6", weight: 76.2, loggedAt: "2026-02-20T08:00:00Z", notes: "Dzień oszukania" },
  { id: "7", weight: 75.8, loggedAt: "2026-02-19T08:00:00Z" },
  { id: "8", weight: 76.0, loggedAt: "2026-02-18T08:00:00Z" },
  { id: "9", weight: 76.3, loggedAt: "2026-02-17T08:00:00Z" },
  { id: "10", weight: 76.5, loggedAt: "2026-02-16T08:00:00Z" },
];

export default function WeightPage() {
  const [entries, setEntries] = useState(DEMO_WEIGHT_ENTRIES);
  const targetWeight = 72; // Would come from user profile

  const handleAddWeight = (weight: number, notes?: string) => {
    const newEntry = {
      id: `${Date.now()}`,
      weight,
      loggedAt: new Date().toISOString(),
      notes,
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Śledzenie wagi</h1>
          <p className="text-zinc-500">Monitoruj postępy w redukcji lub budowaniu masy</p>
        </div>

        <WeightTracker
          entries={entries}
          targetWeight={targetWeight}
          onAddWeight={handleAddWeight}
          onDeleteEntry={handleDeleteEntry}
        />
      </div>
    </DashboardLayout>
  );
}
