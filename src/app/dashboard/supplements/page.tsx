"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SupplementTracker } from "@/components/tracking/supplement-tracker";

type TimeOfDay = "morning" | "afternoon" | "evening" | "any";

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timeOfDay: TimeOfDay;
  notes?: string;
}

// Demo data for development
const DEMO_SUPPLEMENTS: Supplement[] = [
  {
    id: "1",
    name: "Witamina D3",
    dosage: "2000 IU",
    timeOfDay: "morning",
    notes: "Brać z tłuszczem",
  },
  {
    id: "2",
    name: "Omega-3",
    dosage: "1000mg",
    timeOfDay: "morning",
  },
  {
    id: "3",
    name: "Magnez",
    dosage: "400mg",
    timeOfDay: "evening",
    notes: "1 godzina przed snem",
  },
  {
    id: "4",
    name: "Witamina C",
    dosage: "500mg",
    timeOfDay: "any",
  },
  {
    id: "5",
    name: "B-complex",
    dosage: "1 tabletka",
    timeOfDay: "morning",
  },
];

const DEMO_TODAY_LOGS = [
  { supplementId: "1", loggedAt: "2026-02-25T08:00:00Z" },
  { supplementId: "2", loggedAt: "2026-02-25T08:00:00Z" },
  { supplementId: "5", loggedAt: "2026-02-25T08:00:00Z" },
];

export default function SupplementsPage() {
  const [supplements, setSupplements] = useState<Supplement[]>(DEMO_SUPPLEMENTS);
  const [todayLogs, setTodayLogs] = useState(DEMO_TODAY_LOGS);

  const handleLogSupplement = (supplementId: string) => {
    setTodayLogs((prev) => [
      ...prev,
      { supplementId, loggedAt: new Date().toISOString() },
    ]);
  };

  const handleRemoveLog = (supplementId: string) => {
    setTodayLogs((prev) => prev.filter((log) => log.supplementId !== supplementId));
  };

  const handleAddSupplement = (supplement: Omit<Supplement, "id">) => {
    const newSupplement: Supplement = {
      ...supplement,
      id: `${Date.now()}`,
    };
    setSupplements((prev) => [...prev, newSupplement]);
  };

  const handleDeleteSupplement = (id: string) => {
    setSupplements((prev) => prev.filter((s) => s.id !== id));
    setTodayLogs((prev) => prev.filter((log) => log.supplementId !== id));
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Suplementy</h1>
          <p className="text-zinc-500">Śledź regularne przyjmowanie suplementów</p>
        </div>

        <SupplementTracker
          supplements={supplements}
          todayLogs={todayLogs}
          onLogSupplement={handleLogSupplement}
          onRemoveLog={handleRemoveLog}
          onAddSupplement={handleAddSupplement}
          onDeleteSupplement={handleDeleteSupplement}
        />
      </div>
    </DashboardLayout>
  );
}
