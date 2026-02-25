"use client";

import Link from "next/link";

interface TodayStats {
  calories: { consumed: number; target: number };
  water: { consumed: number; target: number };
  steps: { count: number; target: number };
  workouts: { completed: number; target: number };
}

interface TodaysOverviewProps {
  stats: TodayStats;
  userName?: string;
}

function ProgressRing({ value, max, size = 64, strokeWidth = 6, color = "#1A1A1A" }: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / max) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
    </svg>
  );
}

export function TodaysOverview({ stats, userName }: TodaysOverviewProps) {
  const caloriePercentage = Math.round((stats.calories.consumed / stats.calories.target) * 100);
  const waterPercentage = Math.round((stats.water.consumed / stats.water.target) * 100);
  const stepsPercentage = Math.round((stats.steps.count / stats.steps.target) * 100);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Dzisiejsze podsumowanie</h2>
          {userName && (
            <p className="text-sm text-zinc-500">Cześć, {userName}!</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-zinc-900">
            {new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Calories */}
        <div className="flex flex-col items-center p-4 bg-zinc-50 rounded-xl">
          <div className="relative">
            <ProgressRing
              value={stats.calories.consumed}
              max={stats.calories.target}
              size={72}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-zinc-900">{caloriePercentage}%</span>
            </div>
          </div>
          <p className="mt-2 text-sm font-medium text-zinc-900">Kalorie</p>
          <p className="text-xs text-zinc-500">
            {stats.calories.consumed} / {stats.calories.target} kcal
          </p>
        </div>

        {/* Water */}
        <div className="flex flex-col items-center p-4 bg-zinc-50 rounded-xl">
          <div className="relative">
            <ProgressRing
              value={stats.water.consumed}
              max={stats.water.target}
              size={72}
              color="#3B82F6"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-zinc-900">{waterPercentage}%</span>
            </div>
          </div>
          <p className="mt-2 text-sm font-medium text-zinc-900">Woda</p>
          <p className="text-xs text-zinc-500">
            {stats.water.consumed} / {stats.water.target} ml
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col items-center p-4 bg-zinc-50 rounded-xl">
          <div className="relative">
            <ProgressRing
              value={stats.steps.count}
              max={stats.steps.target}
              size={72}
              color="#10B981"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-zinc-900">{stepsPercentage}%</span>
            </div>
          </div>
          <p className="mt-2 text-sm font-medium text-zinc-900">Kroki</p>
          <p className="text-xs text-zinc-500">
            {stats.steps.count.toLocaleString()} / {stats.steps.target.toLocaleString()}
          </p>
        </div>

        {/* Workouts */}
        <div className="flex flex-col items-center p-4 bg-zinc-50 rounded-xl">
          <div className="relative">
            <ProgressRing
              value={stats.workouts.completed}
              max={stats.workouts.target}
              size={72}
              color="#F59E0B"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-zinc-900">
                {stats.workouts.completed}/{stats.workouts.target}
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm font-medium text-zinc-900">Treningi</p>
          <p className="text-xs text-zinc-500">tygodniowo</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Link
          href="/dashboard/nutrition?action=add-meal"
          className="flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="text-sm font-medium">Posiłek</span>
        </Link>

        <Link
          href="/dashboard/nutrition?action=add-water"
          className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <span className="text-sm font-medium">Woda</span>
        </Link>

        <Link
          href="/dashboard/health?action=add-weight"
          className="flex items-center justify-center gap-2 py-3 px-4 bg-zinc-100 text-zinc-900 rounded-xl hover:bg-zinc-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <span className="text-sm font-medium">Waga</span>
        </Link>
      </div>
    </div>
  );
}
