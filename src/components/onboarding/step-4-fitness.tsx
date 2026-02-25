"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fitnessSchema, FitnessForm, FITNESS_GOALS, WORKOUT_TYPES } from "@/lib/validations/profile";

interface Step4FitnessProps {
  defaultValues?: Partial<FitnessForm>;
  onSubmit: (data: FitnessForm) => void;
}

export function Step4Fitness({ defaultValues, onSubmit }: Step4FitnessProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FitnessForm>({
    resolver: zodResolver(fitnessSchema),
    defaultValues: {
      fitness_goal: defaultValues?.fitness_goal,
      workout_frequency_per_week: defaultValues?.workout_frequency_per_week || 3,
      preferred_workout_types: defaultValues?.preferred_workout_types || [],
    },
  });

  const watchedGoal = watch("fitness_goal");
  const watchedFrequency = watch("workout_frequency_per_week");
  const watchedWorkoutTypes = watch("preferred_workout_types") || [];

  const toggleWorkoutType = (type: string) => {
    const current = watchedWorkoutTypes;
    const newValue = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setValue("preferred_workout_types", newValue);
  };

  return (
    <form id="onboarding-step" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Fitness</h2>
        <p className="text-zinc-500 mt-2">Twoja aktywność fizyczna</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Główny cel fitness *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {FITNESS_GOALS.map((goal) => (
            <button
              key={goal.value}
              type="button"
              onClick={() => setValue("fitness_goal", goal.value)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                watchedGoal === goal.value
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <span className="text-2xl">{goal.icon}</span>
              <p className="font-medium text-zinc-900 mt-2">{goal.label}</p>
            </button>
          ))}
        </div>
        {errors.fitness_goal && (
          <p className="text-sm text-red-500 mt-1">{errors.fitness_goal.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Ile razy w tygodniu trenujesz? ({watchedFrequency}x)
        </label>
        <input
          {...register("workout_frequency_per_week", { valueAsNumber: true })}
          type="range"
          min="0"
          max="7"
          className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
        />
        <div className="flex justify-between text-xs text-zinc-400 mt-1">
          <span>0</span>
          <span>3-4</span>
          <span>7</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Preferowane rodzaje treningów
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {WORKOUT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleWorkoutType(type)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                watchedWorkoutTypes.includes(type)
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
