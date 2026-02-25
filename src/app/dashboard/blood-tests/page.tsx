"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BloodTestDashboard } from "@/components/medical";

interface BloodTestResult {
  id: string;
  name: string;
  value: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  status: "low" | "normal" | "high";
}

interface BloodTest {
  id: string;
  date: string;
  labName?: string;
  results: BloodTestResult[];
  notes?: string;
  imageUrl?: string;
}

// Demo data
const DEMO_BLOOD_TESTS: BloodTest[] = [
  {
    id: "1",
    date: "2026-02-15",
    labName: "Synevo",
    results: [
      { id: "1-1", name: "Hemoglobina", value: 14.2, unit: "g/dL", referenceMin: 12, referenceMax: 16, status: "normal" },
      { id: "1-2", name: "Glukoza", value: 95, unit: "mg/dL", referenceMin: 70, referenceMax: 100, status: "normal" },
      { id: "1-3", name: "Cholesterol całkowity", value: 210, unit: "mg/dL", referenceMin: 0, referenceMax: 200, status: "high" },
      { id: "1-4", name: "HDL", value: 55, unit: "mg/dL", referenceMin: 40, referenceMax: 100, status: "normal" },
      { id: "1-5", name: "LDL", value: 130, unit: "mg/dL", referenceMin: 0, referenceMax: 100, status: "high" },
      { id: "1-6", name: "Witamina D", value: 28, unit: "ng/mL", referenceMin: 30, referenceMax: 100, status: "low" },
    ],
  },
  {
    id: "2",
    date: "2025-11-20",
    labName: "Diagnostyka",
    results: [
      { id: "2-1", name: "Hemoglobina", value: 13.8, unit: "g/dL", referenceMin: 12, referenceMax: 16, status: "normal" },
      { id: "2-2", name: "Glukoza", value: 92, unit: "mg/dL", referenceMin: 70, referenceMax: 100, status: "normal" },
      { id: "2-3", name: "Cholesterol całkowity", value: 195, unit: "mg/dL", referenceMin: 0, referenceMax: 200, status: "normal" },
      { id: "2-4", name: "TSH", value: 2.1, unit: "mIU/L", referenceMin: 0.4, referenceMax: 4.0, status: "normal" },
      { id: "2-5", name: "Witamina D", value: 22, unit: "ng/mL", referenceMin: 30, referenceMax: 100, status: "low" },
    ],
  },
];

export default function BloodTestsPage() {
  const [tests, setTests] = useState<BloodTest[]>(DEMO_BLOOD_TESTS);

  const handleAddTest = (test: Omit<BloodTest, "id">) => {
    const newTest: BloodTest = {
      ...test,
      id: `${Date.now()}`,
    };
    setTests((prev) => [newTest, ...prev]);
  };

  const handleDeleteTest = (id: string) => {
    setTests((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Badania krwi</h1>
          <p className="text-zinc-500">Śledź i analizuj wyniki badań laboratoryjnych</p>
        </div>

        <BloodTestDashboard
          tests={tests}
          onAddTest={handleAddTest}
          onDeleteTest={handleDeleteTest}
        />
      </div>
    </DashboardLayout>
  );
}
