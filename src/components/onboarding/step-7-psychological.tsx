"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { psychologicalSchema, PsychologicalForm, MOTIVATION_STYLES } from "@/lib/validations/profile";

interface Step7PsychologicalProps {
  defaultValues?: Partial<PsychologicalForm>;
  onSubmit: (data: PsychologicalForm) => void;
}

const MENTAL_FOCUS_OPTIONS = [
  "Redukcja stresu",
  "Lepszy sen",
  "Większa pewność siebie",
  "Motywacja",
  "Koncentracja",
  "Równowaga emocjonalna",
  "Mindfulness",
];

export function Step7Psychological({ defaultValues, onSubmit }: Step7PsychologicalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PsychologicalForm>({
    resolver: zodResolver(psychologicalSchema),
    defaultValues: {
      motivation_level: defaultValues?.motivation_level || 7,
      preferred_motivation_style: defaultValues?.preferred_motivation_style || "moderate",
      mental_health_focus: defaultValues?.mental_health_focus || [],
    },
  });

  const watchedMotivation = watch("motivation_level");
  const watchedStyle = watch("preferred_motivation_style");
  const watchedMentalFocus = watch("mental_health_focus") || [];

  const toggleMentalFocus = (focus: string) => {
    const current = watchedMentalFocus;
    const newValue = current.includes(focus)
      ? current.filter((f) => f !== focus)
      : [...current, focus];
    setValue("mental_health_focus", newValue);
  };

  return (
    <form id="onboarding-step" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Psychologia</h2>
        <p className="text-zinc-500 mt-2">Twój mindset i motywacja</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Poziom motywacji ({watchedMotivation}/10)
        </label>
        <input
          {...register("motivation_level", { valueAsNumber: true })}
          type="range"
          min="1"
          max="10"
          className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
        />
        <div className="flex justify-between text-xs text-zinc-400 mt-1">
          <span>Niska</span>
          <span>Średnia</span>
          <span>Bardzo wysoka</span>
        </div>
        {errors.motivation_level && (
          <p className="text-sm text-red-500 mt-1">{errors.motivation_level.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Preferowany styl motywacji
        </label>
        <div className="space-y-2">
          {MOTIVATION_STYLES.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => setValue("preferred_motivation_style", style.value)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                watchedStyle === style.value
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <span className="font-medium text-zinc-900">{style.label}</span>
              <p className="text-sm text-zinc-500">{style.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-3">
          Obszary do pracy nad mindsetem
        </label>
        <div className="grid grid-cols-2 gap-2">
          {MENTAL_FOCUS_OPTIONS.map((focus) => (
            <button
              key={focus}
              type="button"
              onClick={() => toggleMentalFocus(focus)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                watchedMentalFocus.includes(focus)
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {focus}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-medium text-green-800">To ostatni krok!</p>
            <p className="text-sm text-green-700 mt-1">
              Po zapisaniu możesz zacząć korzystać z HealthOS.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
