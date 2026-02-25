"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicalSchema, MedicalForm, BLOOD_TYPES } from "@/lib/validations/profile";

interface Step6MedicalProps {
  defaultValues?: Partial<MedicalForm>;
  onSubmit: (data: MedicalForm) => void;
}

export function Step6Medical({ defaultValues, onSubmit }: Step6MedicalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MedicalForm>({
    resolver: zodResolver(medicalSchema),
    defaultValues: {
      health_conditions: defaultValues?.health_conditions || [],
      allergies: defaultValues?.allergies || [],
      medications: defaultValues?.medications || [],
      blood_type: defaultValues?.blood_type || "unknown",
    },
  });

  return (
    <form id="onboarding-step" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Dane medyczne</h2>
        <p className="text-zinc-500 mt-2">Informacje dla Twojego bezpieczeństwa</p>
      </div>

      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-zinc-600">
          Te informacje są opcjonalne, ale pomogą AI dostarczać bezpieczniejsze
          i bardziej spersonalizowane rekomendacje.
        </p>
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
          Stosowane leki na stałe
        </label>
        <textarea
          {...register("medications.0")}
          rows={3}
          placeholder="Wymień leki, które przyjmujesz regularnie..."
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 resize-none"
        />
      </div>

      <div>
        <label htmlFor="health_conditions" className="block text-sm font-medium text-zinc-700 mb-1">
          Choroby i schorzenia
        </label>
        <textarea
          {...register("health_conditions.0")}
          rows={3}
          placeholder="Opisz wszystkie schorzenia, które mogą mieć wpływ na Twój plan..."
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 resize-none"
        />
      </div>

      <div>
        <label htmlFor="allergies" className="block text-sm font-medium text-zinc-700 mb-1">
          Alergie
        </label>
        <textarea
          {...register("allergies.0")}
          rows={2}
          placeholder="Wymień alergie, szczególnie pokarmowe..."
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 resize-none"
        />
      </div>
    </form>
  );
}
