"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { healthInfoSchema, HealthInfoForm, HEALTH_CONDITIONS, ALLERGIES, BLOOD_TYPES } from "@/lib/validations/profile";

interface Step2HealthProps {
  defaultValues?: Partial<HealthInfoForm>;
  onSubmit: (data: HealthInfoForm) => void;
}

export function Step2Health({ defaultValues, onSubmit }: Step2HealthProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HealthInfoForm>({
    resolver: zodResolver(healthInfoSchema),
    defaultValues: {
      health_conditions: defaultValues?.health_conditions || [],
      allergies: defaultValues?.allergies || [],
      medications: defaultValues?.medications || [],
      blood_type: defaultValues?.blood_type || "unknown",
    },
  });

  const watchedConditions = watch("health_conditions") || [];
  const watchedAllergies = watch("allergies") || [];

  const toggleArrayItem = (field: "health_conditions" | "allergies", value: string) => {
    const current = watch(field) || [];
    const newValue = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, newValue);
  };

  return (
    <form id="onboarding-step" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Stan zdrowia</h2>
        <p className="text-zinc-500 mt-2">Informacje o Twoim zdrowiu</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Choroby przewlekłe
        </label>
        <div className="grid grid-cols-2 gap-2">
          {HEALTH_CONDITIONS.map((condition) => (
            <button
              key={condition}
              type="button"
              onClick={() => toggleArrayItem("health_conditions", condition)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                watchedConditions.includes(condition)
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {condition}
            </button>
          ))}
        </div>
        {watchedConditions.includes("Inne") && (
          <input
            {...register("health_conditions.0")}
            type="text"
            placeholder="Opisz inne schorzenia..."
            className="mt-3 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Alergie i nietolerancje
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ALLERGIES.map((allergy) => (
            <button
              key={allergy}
              type="button"
              onClick={() => toggleArrayItem("allergies", allergy)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                watchedAllergies.includes(allergy)
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {allergy}
            </button>
          ))}
        </div>
        {watchedAllergies.includes("Inne") && (
          <input
            type="text"
            placeholder="Opisz inne alergie..."
            className="mt-3 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
          />
        )}
      </div>

      <div>
        <label htmlFor="blood_type" className="block text-sm font-medium text-zinc-700 mb-1">
          Grupa krwi
        </label>
        <select
          {...register("blood_type")}
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
        >
          {BLOOD_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="medications" className="block text-sm font-medium text-zinc-700 mb-1">
          Stosowane leki (opcjonalnie)
        </label>
        <textarea
          {...register("medications.0")}
          rows={3}
          placeholder="Wymień leki, które przyjmujesz na stałe..."
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 resize-none"
        />
      </div>
    </form>
  );
}
