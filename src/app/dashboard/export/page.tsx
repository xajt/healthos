"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExportPanel } from "@/components/export";
import { HealthDataExport } from "@/lib/export/types";

// Demo data for export
const DEMO_EXPORT_DATA: HealthDataExport = {
  dateRange: {
    start: "2026-01-01",
    end: "2026-02-25",
  },
  generatedAt: new Date().toISOString(),
  profile: {
    name: "Jan Kowalski",
    age: 30,
    gender: "Mężczyzna",
  },
  weight: [
    { date: "2026-02-25", weight: 75.5, notes: "Rano" },
    { date: "2026-02-24", weight: 75.8 },
    { date: "2026-02-23", weight: 76.0 },
    { date: "2026-02-22", weight: 75.7 },
    { date: "2026-02-21", weight: 76.2 },
    { date: "2026-02-20", weight: 75.9 },
    { date: "2026-02-19", weight: 76.1 },
  ],
  nutrition: [
    { date: "2026-02-25", calories: 2100, protein: 120, carbs: 200, fat: 70 },
    { date: "2026-02-24", calories: 1950, protein: 110, carbs: 190, fat: 65 },
    { date: "2026-02-23", calories: 2300, protein: 130, carbs: 220, fat: 75 },
    { date: "2026-02-22", calories: 2050, protein: 115, carbs: 195, fat: 68 },
    { date: "2026-02-21", calories: 2400, protein: 140, carbs: 230, fat: 80 },
  ],
  water: [
    { date: "2026-02-25", amount: 2200 },
    { date: "2026-02-24", amount: 1800 },
    { date: "2026-02-23", amount: 2500 },
    { date: "2026-02-22", amount: 2000 },
  ],
  sleep: [
    { date: "2026-02-25", duration: 7.5, quality: 4, bedTime: "23:00", wakeTime: "06:30" },
    { date: "2026-02-24", duration: 6.5, quality: 3, bedTime: "00:00", wakeTime: "06:30" },
    { date: "2026-02-23", duration: 8, quality: 5, bedTime: "22:30", wakeTime: "06:30" },
    { date: "2026-02-22", duration: 7, quality: 4, bedTime: "23:30", wakeTime: "06:30" },
  ],
  mood: [
    { date: "2026-02-25", mood: 4, energy: 4, stress: 2 },
    { date: "2026-02-24", mood: 3, energy: 3, stress: 3, notes: "Ciężki dzień w pracy" },
    { date: "2026-02-23", mood: 5, energy: 5, stress: 1 },
    { date: "2026-02-22", mood: 4, energy: 4, stress: 2 },
  ],
  bloodTests: [
    { date: "2026-02-15", name: "Hemoglobina", value: 14.2, unit: "g/dL", referenceMin: 12, referenceMax: 16, status: "normal" },
    { date: "2026-02-15", name: "Glukoza", value: 95, unit: "mg/dL", referenceMin: 70, referenceMax: 100, status: "normal" },
    { date: "2026-02-15", name: "Cholesterol całkowity", value: 210, unit: "mg/dL", referenceMin: 0, referenceMax: 200, status: "high" },
    { date: "2026-02-15", name: "HDL", value: 55, unit: "mg/dL", referenceMin: 40, referenceMax: 100, status: "normal" },
    { date: "2026-02-15", name: "LDL", value: 130, unit: "mg/dL", referenceMin: 0, referenceMax: 100, status: "high" },
    { date: "2026-02-15", name: "Witamina D", value: 28, unit: "ng/mL", referenceMin: 30, referenceMax: 100, status: "low" },
  ],
  workouts: [
    { date: "2026-02-25", name: "Push Day", type: "strength", duration: 60, caloriesBurned: 300 },
    { date: "2026-02-24", name: "Cardio", type: "cardio", duration: 35, caloriesBurned: 350 },
    { date: "2026-02-22", name: "Pull Day", type: "strength", duration: 55, caloriesBurned: 280 },
    { date: "2026-02-20", name: "Leg Day", type: "strength", duration: 65, caloriesBurned: 320 },
  ],
};

export default function ExportPage() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Eksport danych</h1>
          <p className="text-zinc-500">Pobierz lub udostępnij swoje dane zdrowotne</p>
        </div>

        <div className="max-w-3xl">
          <ExportPanel data={DEMO_EXPORT_DATA} />
        </div>

        {/* Privacy Notice */}
        <div className="max-w-3xl mt-6">
          <div className="bg-zinc-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="font-medium text-zinc-900">Prywatność danych</p>
                <p className="text-sm text-zinc-600 mt-1">
                  Twoje dane są eksportowane lokalnie na Twoim urządzeniu.
                  Nie są przesyłane na żaden serwer bez Twojej wyraźnej zgody.
                  Podczas udostępniania lekarzowi, dane są wysyłane przez Twój klient email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
