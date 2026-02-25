"use client";

interface SleepData {
  lastNight: {
    duration: number; // in hours
    quality: number; // 1-10
    deepSleep: number; // percentage
    remSleep: number; // percentage
  };
  weeklyAverage: number;
}

interface SleepQualityWidgetProps {
  data: SleepData;
}

export function SleepQualityWidget({ data }: SleepQualityWidgetProps) {
  const qualityLabel = data.lastNight.quality >= 8 ? "Świetny" :
    data.lastNight.quality >= 6 ? "Dobry" :
    data.lastNight.quality >= 4 ? "Średni" : "Słaby";

  const qualityColor = data.lastNight.quality >= 8 ? "text-green-600" :
    data.lastNight.quality >= 6 ? "text-blue-600" :
    data.lastNight.quality >= 4 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="space-y-4">
      {/* Last Night Summary */}
      <div className="text-center py-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl">😴</span>
          <span className={`text-3xl font-bold ${qualityColor}`}>
            {data.lastNight.duration}h
          </span>
        </div>
        <p className={`text-sm font-medium ${qualityColor} mt-1`}>
          {qualityLabel} sen
        </p>
      </div>

      {/* Sleep Stages */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600">Głęboki sen</span>
          <span className="text-sm font-medium text-zinc-900">{data.lastNight.deepSleep}%</span>
        </div>
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full"
            style={{ width: `${data.lastNight.deepSleep}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-sm text-zinc-600">REM</span>
          <span className="text-sm font-medium text-zinc-900">{data.lastNight.remSleep}%</span>
        </div>
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full"
            style={{ width: `${data.lastNight.remSleep}%` }}
          />
        </div>
      </div>

      {/* Weekly Average */}
      <div className="pt-3 border-t border-zinc-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Średnia tygodniowa</span>
          <span className="font-medium text-zinc-900">{data.weeklyAverage}h</span>
        </div>
      </div>
    </div>
  );
}

// Demo data
export const demoSleepData: SleepData = {
  lastNight: {
    duration: 7.5,
    quality: 8,
    deepSleep: 22,
    remSleep: 18,
  },
  weeklyAverage: 7.2,
};
