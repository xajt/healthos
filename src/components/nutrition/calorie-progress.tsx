"use client";

interface CalorieProgressProps {
  consumed: number;
  target: number;
  protein: number;
  proteinTarget: number;
  carbs: number;
  carbsTarget: number;
  fat: number;
  fatTarget: number;
}

export function CalorieProgress({
  consumed,
  target,
  protein,
  proteinTarget,
  carbs,
  carbsTarget,
  fat,
  fatTarget,
}: CalorieProgressProps) {
  const caloriePercentage = Math.min(100, Math.round((consumed / target) * 100));
  const remaining = Math.max(0, target - consumed);

  const proteinPercentage = Math.min(100, Math.round((protein / proteinTarget) * 100));
  const carbsPercentage = Math.min(100, Math.round((carbs / carbsTarget) * 100));
  const fatPercentage = Math.min(100, Math.round((fat / fatTarget) * 100));

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-4">
      {/* Main calorie display */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-zinc-500">Spożyte kalorie</p>
          <p className="text-3xl font-bold text-zinc-900">{consumed}</p>
          <p className="text-sm text-zinc-400">z {target} kcal celu</p>
        </div>
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#f4f4f5"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke={caloriePercentage >= 100 ? '#22c55e' : '#18181b'}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(caloriePercentage / 100) * 226} 226`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-zinc-900">{caloriePercentage}%</span>
          </div>
        </div>
      </div>

      {/* Remaining */}
      <div className="bg-zinc-50 rounded-xl p-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600">Pozostało</span>
          <span className="text-lg font-semibold text-zinc-900">{remaining} kcal</span>
        </div>
      </div>

      {/* Macros */}
      <div className="space-y-3">
        {/* Protein */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-zinc-600">Białko</span>
            <span className="text-zinc-900 font-medium">{Math.round(protein)}g / {proteinTarget}g</span>
          </div>
          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${proteinPercentage}%` }}
            />
          </div>
        </div>

        {/* Carbs */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-zinc-600">Węglowodany</span>
            <span className="text-zinc-900 font-medium">{Math.round(carbs)}g / {carbsTarget}g</span>
          </div>
          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${carbsPercentage}%` }}
            />
          </div>
        </div>

        {/* Fat */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-zinc-600">Tłuszcze</span>
            <span className="text-zinc-900 font-medium">{Math.round(fat)}g / {fatTarget}g</span>
          </div>
          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-400 rounded-full transition-all duration-300"
              style={{ width: `${fatPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
