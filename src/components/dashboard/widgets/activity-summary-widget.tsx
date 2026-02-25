"use client";

interface ActivityData {
  today: {
    steps: number;
    distance: number; // km
    activeMinutes: number;
    caloriesBurned: number;
  };
  weekly: {
    totalSteps: number;
    totalDistance: number;
    totalActiveMinutes: number;
    workoutsCompleted: number;
  };
  targets: {
    steps: number;
    distance: number;
    activeMinutes: number;
  };
}

interface ActivitySummaryWidgetProps {
  data: ActivityData;
}

export function ActivitySummaryWidget({ data }: ActivitySummaryWidgetProps) {
  const stepsPercentage = Math.min((data.today.steps / data.targets.steps) * 100, 100);
  const distancePercentage = Math.min((data.today.distance / data.targets.distance) * 100, 100);
  const activePercentage = Math.min((data.today.activeMinutes / data.targets.activeMinutes) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Today's Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-zinc-50 rounded-xl">
          <span className="text-2xl">👟</span>
          <p className="text-2xl font-bold text-zinc-900 mt-1">
            {data.today.steps.toLocaleString()}
          </p>
          <p className="text-xs text-zinc-500">kroki</p>
          <div className="mt-2 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-900 rounded-full"
              style={{ width: `${stepsPercentage}%` }}
            />
          </div>
        </div>

        <div className="text-center p-3 bg-zinc-50 rounded-xl">
          <span className="text-2xl">📍</span>
          <p className="text-2xl font-bold text-zinc-900 mt-1">
            {data.today.distance.toFixed(1)}
          </p>
          <p className="text-xs text-zinc-500">km</p>
          <div className="mt-2 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${distancePercentage}%` }}
            />
          </div>
        </div>

        <div className="text-center p-3 bg-zinc-50 rounded-xl">
          <span className="text-2xl">⏱️</span>
          <p className="text-2xl font-bold text-zinc-900 mt-1">
            {data.today.activeMinutes}
          </p>
          <p className="text-xs text-zinc-500">min aktywności</p>
          <div className="mt-2 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${activePercentage}%` }}
            />
          </div>
        </div>

        <div className="text-center p-3 bg-zinc-50 rounded-xl">
          <span className="text-2xl">🔥</span>
          <p className="text-2xl font-bold text-zinc-900 mt-1">
            {data.today.caloriesBurned}
          </p>
          <p className="text-xs text-zinc-500">kcal spalone</p>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="pt-4 border-t border-zinc-100">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-3">
          Ten tydzień
        </p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-zinc-900">
              {(data.weekly.totalSteps / 1000).toFixed(1)}k
            </p>
            <p className="text-xs text-zinc-500">kroków</p>
          </div>
          <div>
            <p className="text-lg font-bold text-zinc-900">
              {data.weekly.totalDistance.toFixed(0)} km
            </p>
            <p className="text-xs text-zinc-500">dystans</p>
          </div>
          <div>
            <p className="text-lg font-bold text-zinc-900">
              {data.weekly.workoutsCompleted}
            </p>
            <p className="text-xs text-zinc-500">treningów</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo data
export const demoActivityData: ActivityData = {
  today: {
    steps: 8234,
    distance: 5.8,
    activeMinutes: 45,
    caloriesBurned: 380,
  },
  weekly: {
    totalSteps: 52340,
    totalDistance: 38,
    totalActiveMinutes: 280,
    workoutsCompleted: 4,
  },
  targets: {
    steps: 10000,
    distance: 8,
    activeMinutes: 60,
  },
};
