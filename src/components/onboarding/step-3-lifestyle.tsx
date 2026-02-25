"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lifestyleSchema, LifestyleForm, ACTIVITY_LEVELS } from "@/lib/validations/profile";

interface Step3LifestyleProps {
  defaultValues?: Partial<LifestyleForm>;
  onSubmit: (data: LifestyleForm) => void;
}

export function Step3Lifestyle({ defaultValues, onSubmit }: Step3LifestyleProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LifestyleForm>({
    resolver: zodResolver(lifestyleSchema),
    defaultValues: {
      activity_level: defaultValues?.activity_level || "moderate",
      work_type: defaultValues?.work_type || "",
      sleep_hours_target: defaultValues?.sleep_hours_target || 8,
      stress_level: defaultValues?.stress_level || 5,
    },
  });

  const watchedActivity = watch("activity_level");
  const watchedSleep = watch("sleep_hours_target");
  const watchedStress = watch("stress_level");

  return (
    <form id="onboarding-step" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Tryb życia</h2>
        <p className="text-zinc-500 mt-2">Twój codzienny styl</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Poziom aktywności fizycznej *
        </label>
        <div className="space-y-2">
          {ACTIVITY_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setValue("activity_level", level.value)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                watchedActivity === level.value
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <span className="font-medium text-zinc-900">{level.label}</span>
              <p className="text-sm text-zinc-500">{level.description}</p>
            </button>
          ))}
        </div>
        {errors.activity_level && (
          <p className="text-sm text-red-500 mt-1">{errors.activity_level.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="work_type" className="block text-sm font-medium text-zinc-700 mb-1">
          Rodzaj pracy
        </label>
        <select
          {...register("work_type")}
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
        >
          <option value="">Wybierz</option>
          <option value="office">Praca biurowa / Siedząca</option>
          <option value="mixed">Praca mieszana</option>
          <option value="physical">Praca fizyczna</option>
          <option value="remote">Zdalna / Home office</option>
          <option value="student">Student / Uczeń</option>
          <option value="other">Inne</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Ile godzin chcesz spać? ({watchedSleep}h)
        </label>
        <input
          {...register("sleep_hours_target", { valueAsNumber: true })}
          type="range"
          min="4"
          max="12"
          step="0.5"
          className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
        />
        <div className="flex justify-between text-xs text-zinc-400 mt-1">
          <span>4h</span>
          <span>8h</span>
          <span>12h</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Poziom stresu ({watchedStress}/10)
        </label>
        <input
          {...register("stress_level", { valueAsNumber: true })}
          type="range"
          min="1"
          max="10"
          className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
        />
        <div className="flex justify-between text-xs text-zinc-400 mt-1">
          <span>Niski</span>
          <span>Średni</span>
          <span>Wysoki</span>
        </div>
      </div>
    </form>
  );
}
