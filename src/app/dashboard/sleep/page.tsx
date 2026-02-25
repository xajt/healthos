"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SleepTracker } from "@/components/tracking/sleep-tracker";

interface SleepEntry {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  duration: number;
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

// Demo data
const DEMO_SLEEP_ENTRIES: SleepEntry[] = [
  { id: "1", date: "2026-02-25T07:00:00Z", bedTime: "23:30", wakeTime: "07:00", duration: 7.5, quality: 4 },
  { id: "2", date: "2026-02-24T07:00:00Z", bedTime: "00:00", wakeTime: "07:30", duration: 7.5, quality: 3, notes: "Kawa przed snem" },
  { id: "3", date: "2026-02-23T07:00:00Z", bedTime: "22:30", wakeTime: "06:30", duration: 8, quality: 5 },
  { id: "4", date: "2026-02-22T07:00:00Z", bedTime: "23:00", wakeTime: "06:00", duration: 7, quality: 4 },
  { id: "5", date: "2026-02-21T07:00:00Z", bedTime: "01:00", wakeTime: "08:00", duration: 7, quality: 2, notes: "Praca do późna" },
  { id: "6", date: "2026-02-20T07:00:00Z", bedTime: "23:00", wakeTime: "07:00", duration: 8, quality: 4 },
  { id: "7", date: "2026-02-19T07:00:00Z", bedTime: "22:00", wakeTime: "06:30", duration: 8.5, quality: 5 },
];

export default function SleepPage() {
  const [entries, setEntries] = useState<SleepEntry[]>(DEMO_SLEEP_ENTRIES);

  const handleAddEntry = (entry: Omit<SleepEntry, "id">) => {
    const newEntry: SleepEntry = {
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
          <h1 className="text-2xl font-bold text-zinc-900">Sen</h1>
          <p className="text-zinc-500">Monitoruj jakość i długość swojego snu</p>
        </div>

        <SleepTracker
          entries={entries}
          onAddEntry={handleAddEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      </div>
    </DashboardLayout>
  );
}
