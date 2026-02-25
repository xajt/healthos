"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WaterTracker } from "@/components/tracking/water-tracker";

// Demo data for development
const DEMO_WATER_ENTRIES = [
  { id: "1", amount: 250, loggedAt: "2026-02-25T07:00:00Z" },
  { id: "2", amount: 500, loggedAt: "2026-02-25T09:30:00Z" },
  { id: "3", amount: 330, loggedAt: "2026-02-25T12:00:00Z" },
  { id: "4", amount: 250, loggedAt: "2026-02-25T14:30:00Z" },
];

export default function WaterPage() {
  const [entries, setEntries] = useState(DEMO_WATER_ENTRIES);
  const targetMl = 2000; // Would come from user profile

  const handleAddWater = (amount: number) => {
    const newEntry = {
      id: `${Date.now()}`,
      amount,
      loggedAt: new Date().toISOString(),
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
          <h1 className="text-2xl font-bold text-zinc-900">Nawodnienie</h1>
          <p className="text-zinc-500">Śledź swoje dzienne spożycie wody</p>
        </div>

        <WaterTracker
          entries={entries}
          targetMl={targetMl}
          onAddWater={handleAddWater}
          onDeleteEntry={handleDeleteEntry}
        />
      </div>
    </DashboardLayout>
  );
}
