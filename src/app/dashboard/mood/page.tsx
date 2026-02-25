"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MoodTracker } from "@/components/tracking/mood-tracker";

interface MoodEntry {
  id: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 1 | 2 | 3 | 4 | 5;
  stress: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

// Demo data
const DEMO_MOOD_ENTRIES: MoodEntry[] = [
  { id: "1", date: "2026-02-25T08:00:00Z", mood: 4, energy: 4, stress: 2 },
  { id: "2", date: "2026-02-24T20:00:00Z", mood: 3, energy: 3, stress: 3, notes: "Ciężki dzień w pracy" },
  { id: "3", date: "2026-02-23T08:00:00Z", mood: 5, energy: 5, stress: 1 },
  { id: "4", date: "2026-02-22T08:00:00Z", mood: 4, energy: 4, stress: 2 },
  { id: "5", date: "2026-02-21T08:00:00Z", mood: 2, energy: 2, stress: 4, notes: "Słaby sen" },
  { id: "6", date: "2026-02-20T08:00:00Z", mood: 4, energy: 4, stress: 3 },
  { id: "7", date: "2026-02-19T08:00:00Z", mood: 5, energy: 5, stress: 1 },
];

export default function MoodPage() {
  const [entries, setEntries] = useState<MoodEntry[]>(DEMO_MOOD_ENTRIES);

  const handleAddEntry = (entry: Omit<MoodEntry, "id">) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: `${Date.now()}`,
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Nastrój</h1>
          <p className="text-zinc-500">Śledź swoje samopoczucie i poziom stresu</p>
        </div>

        <MoodTracker
          entries={entries}
          onAddEntry={handleAddEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      </div>
    </DashboardLayout>
  );
}
