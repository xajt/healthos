"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WeatherWidget } from "@/components/weather";

export default function WeatherPage() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Pogoda</h1>
          <p className="text-zinc-500">Sprawdź warunki na aktywność na świeżym powietrzu</p>
        </div>

        <div className="max-w-md">
          <WeatherWidget location="Warszawa" />
        </div>
      </div>
    </DashboardLayout>
  );
}
