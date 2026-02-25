"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { basicInfoSchema, BasicInfoForm } from "@/lib/validations/profile";

interface Step1BasicProps {
  defaultValues?: Partial<BasicInfoForm>;
  onSubmit: (data: BasicInfoForm) => void;
}

export function Step1Basic({ defaultValues, onSubmit }: Step1BasicProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInfoForm>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      first_name: defaultValues?.first_name || "",
      last_name: defaultValues?.last_name || "",
      birth_date: defaultValues?.birth_date || "",
      gender: defaultValues?.gender,
      height_cm: defaultValues?.height_cm || 175,
      current_weight_kg: defaultValues?.current_weight_kg || 70,
      target_weight_kg: defaultValues?.target_weight_kg || 70,
    },
  });

  return (
    <form id="onboarding-step" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Podstawowe informacje</h2>
        <p className="text-zinc-500 mt-2">Powiedz nam coś o sobie</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-zinc-700 mb-1">
            Imię *
          </label>
          <input
            {...register("first_name")}
            type="text"
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            placeholder="Jan"
          />
          {errors.first_name && (
            <p className="text-sm text-red-500 mt-1">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-zinc-700 mb-1">
            Nazwisko *
          </label>
          <input
            {...register("last_name")}
            type="text"
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            placeholder="Kowalski"
          />
          {errors.last_name && (
            <p className="text-sm text-red-500 mt-1">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="birth_date" className="block text-sm font-medium text-zinc-700 mb-1">
            Data urodzenia *
          </label>
          <input
            {...register("birth_date")}
            type="date"
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
          {errors.birth_date && (
            <p className="text-sm text-red-500 mt-1">{errors.birth_date.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-zinc-700 mb-1">
            Płeć *
          </label>
          <select
            {...register("gender")}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          >
            <option value="">Wybierz</option>
            <option value="male">Mężczyzna</option>
            <option value="female">Kobieta</option>
            <option value="other">Inne</option>
          </select>
          {errors.gender && (
            <p className="text-sm text-red-500 mt-1">{errors.gender.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="height_cm" className="block text-sm font-medium text-zinc-700 mb-1">
          Wzrost (cm) *
        </label>
        <input
          {...register("height_cm", { valueAsNumber: true })}
          type="number"
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="175"
        />
        {errors.height_cm && (
          <p className="text-sm text-red-500 mt-1">{errors.height_cm.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="current_weight_kg" className="block text-sm font-medium text-zinc-700 mb-1">
            Obecna waga (kg) *
          </label>
          <input
            {...register("current_weight_kg", { valueAsNumber: true })}
            type="number"
            step="0.1"
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            placeholder="70"
          />
          {errors.current_weight_kg && (
            <p className="text-sm text-red-500 mt-1">{errors.current_weight_kg.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="target_weight_kg" className="block text-sm font-medium text-zinc-700 mb-1">
            Docelowa waga (kg) *
          </label>
          <input
            {...register("target_weight_kg", { valueAsNumber: true })}
            type="number"
            step="0.1"
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            placeholder="70"
          />
          {errors.target_weight_kg && (
            <p className="text-sm text-red-500 mt-1">{errors.target_weight_kg.message}</p>
          )}
        </div>
      </div>
    </form>
  );
}
