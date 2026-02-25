"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goalsSchema, GoalsForm } from "@/lib/validations/profile";

interface Step5GoalsProps {
  defaultValues?: Partial<GoalsForm>;
  onSubmit: (data: GoalsForm) => void;
}

const GOAL_OPTIONS = [
  "Schudnąć",
  "Zbudować mięśnie",
  "Poprawić wydolność",
  "Zwiększyć energię",
  "Poprawić sen",
  "Zredukować stres",
  "Poprawić koncentrację",
  "Wzmocnić odporność",
];

export function Step5Goals({ defaultValues, onSubmit }: Step5GoalsProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GoalsForm>({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      daily_calorie_target: defaultValues?.daily_calorie_target || 2000,
      daily_protein_target: defaultValues?.daily_protein_target || 120,
      daily_water_ml_target: defaultValues?.daily_water_ml_target || 2000,
      primary_goals: defaultValues?.primary_goals || [],
    },
  });

  const watchedGoals = watch("primary_goals") || [];

  const toggleGoal = (goal: string) => {
    const current = watchedGoals;
    const newValue = current.includes(goal)
      ? current.filter((g) => g !== goal)
      : [...current, goal];
    setValue("primary_goals", newValue);
  };

  return (
    <form id="onboarding-step" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Twoje cele</h2>
        <p className="text-zinc-500 mt-2">Co chcesz osiągnąć?</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Priorytetowe cele (wybierz kilka)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {GOAL_OPTIONS.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => toggleGoal(goal)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                watchedGoals.includes(goal)
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="daily_calorie_target" className="block text-sm font-medium text-zinc-700 mb-1">
          Dzienne zapotrzebowanie kaloryczne (kcal)
        </label>
        <input
          {...register("daily_calorie_target", { valueAsNumber: true })}
          type="number"
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="2000"
        />
        <p className="text-xs text-zinc-400 mt-1">
          Zostaw puste, a AI obliczy dla Ciebie
        </p>
      </div>

      <div>
        <label htmlFor="daily_protein_target" className="block text-sm font-medium text-zinc-700 mb-1">
          Dzienne zapotrzebowanie białka (g)
        </label>
        <input
          {...register("daily_protein_target", { valueAsNumber: true })}
          type="number"
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="120"
        />
        <p className="text-xs text-zinc-400 mt-1">
          Zalecane: 1.6-2.2g na kg masy ciała
        </p>
      </div>

      <div>
        <label htmlFor="daily_water_ml_target" className="block text-sm font-medium text-zinc-700 mb-1">
          Dzienne spożycie wody (ml) *
        </label>
        <input
          {...register("daily_water_ml_target", { valueAsNumber: true })}
          type="number"
          step="100"
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="2000"
        />
        {errors.daily_water_ml_target && (
          <p className="text-sm text-red-500 mt-1">{errors.daily_water_ml_target.message}</p>
        )}
        <p className="text-xs text-zinc-400 mt-1">
          Zalecane: 30-35ml na kg masy ciała
        </p>
      </div>
    </form>
  );
}
