"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase/database.types";
import { ACTIVITY_LEVELS, FITNESS_GOALS, BLOOD_TYPES, MOTIVATION_STYLES } from "@/lib/validations/profile";

interface ProfileSettingsFormProps {
  profile: Profile | null;
  userId: string;
}

export function ProfileSettingsForm({ profile, userId }: ProfileSettingsFormProps) {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      birth_date: formData.get("birth_date") as string,
      gender: formData.get("gender") as "male" | "female" | "other" | null,
      height_cm: parseInt(formData.get("height_cm") as string) || null,
      current_weight_kg: parseFloat(formData.get("current_weight_kg") as string) || null,
      target_weight_kg: parseFloat(formData.get("target_weight_kg") as string) || null,
      activity_level: formData.get("activity_level") as Profile["activity_level"],
      fitness_goal: formData.get("fitness_goal") as Profile["fitness_goal"],
      sleep_hours_target: parseInt(formData.get("sleep_hours_target") as string) || 8,
      stress_level: parseInt(formData.get("stress_level") as string) || 5,
      motivation_level: parseInt(formData.get("motivation_level") as string) || 7,
      preferred_motivation_style: formData.get("preferred_motivation_style") as Profile["preferred_motivation_style"],
      daily_calorie_target: parseInt(formData.get("daily_calorie_target") as string) || null,
      daily_protein_target: parseInt(formData.get("daily_protein_target") as string) || null,
      daily_water_ml_target: parseInt(formData.get("daily_water_ml_target") as string) || 2000,
      blood_type: formData.get("blood_type") as Profile["blood_type"],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", userId);

    setIsSubmitting(false);

    if (error) {
      setMessage({ type: "error", text: "Wystąpił błąd podczas zapisywania." });
    } else {
      setMessage({ type: "success", text: "Profil zapisany pomyślnie!" });
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Basic Info */}
      <section className="bg-white rounded-xl border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Podstawowe informacje</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Imię
            </label>
            <input
              name="first_name"
              defaultValue={profile?.first_name || ""}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Nazwisko
            </label>
            <input
              name="last_name"
              defaultValue={profile?.last_name || ""}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Data urodzenia
            </label>
            <input
              name="birth_date"
              type="date"
              defaultValue={profile?.birth_date || ""}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Płeć
            </label>
            <select
              name="gender"
              defaultValue={profile?.gender || ""}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            >
              <option value="">Wybierz</option>
              <option value="male">Mężczyzna</option>
              <option value="female">Kobieta</option>
              <option value="other">Inne</option>
            </select>
          </div>
        </div>
      </section>

      {/* Body Metrics */}
      <section className="bg-white rounded-xl border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Parametry ciała</h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Wzrost (cm)
            </label>
            <input
              name="height_cm"
              type="number"
              defaultValue={profile?.height_cm || ""}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Obecna waga (kg)
            </label>
            <input
              name="current_weight_kg"
              type="number"
              step="0.1"
              defaultValue={profile?.current_weight_kg || ""}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Docelowa waga (kg)
            </label>
            <input
              name="target_weight_kg"
              type="number"
              step="0.1"
              defaultValue={profile?.target_weight_kg || ""}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Activity & Fitness */}
      <section className="bg-white rounded-xl border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Aktywność i fitness</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Poziom aktywności
            </label>
            <select
              name="activity_level"
              defaultValue={profile?.activity_level || "moderate"}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            >
              {ACTIVITY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Cel fitness
            </label>
            <select
              name="fitness_goal"
              defaultValue={profile?.fitness_goal || ""}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            >
              {FITNESS_GOALS.map((goal) => (
                <option key={goal.value} value={goal.value}>
                  {goal.icon} {goal.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Daily Targets */}
      <section className="bg-white rounded-xl border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Dzienne cele</h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Kalorie (kcal)
            </label>
            <input
              name="daily_calorie_target"
              type="number"
              defaultValue={profile?.daily_calorie_target || ""}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Białko (g)
            </label>
            <input
              name="daily_protein_target"
              type="number"
              defaultValue={profile?.daily_protein_target || ""}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Woda (ml)
            </label>
            <input
              name="daily_water_ml_target"
              type="number"
              step="100"
              defaultValue={profile?.daily_water_ml_target || 2000}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Health & Psychology */}
      <section className="bg-white rounded-xl border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Zdrowie i motywacja</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Grupa krwi
            </label>
            <select
              name="blood_type"
              defaultValue={profile?.blood_type || "unknown"}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            >
              {BLOOD_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Styl motywacji
            </label>
            <select
              name="preferred_motivation_style"
              defaultValue={profile?.preferred_motivation_style || "moderate"}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            >
              {MOTIVATION_STYLES.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Cel snu (h)
            </label>
            <input
              name="sleep_hours_target"
              type="number"
              min="4"
              max="12"
              defaultValue={profile?.sleep_hours_target || 8}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Poziom stresu (1-10)
            </label>
            <input
              name="stress_level"
              type="number"
              min="1"
              max="10"
              defaultValue={profile?.stress_level || 5}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Motywacja (1-10)
            </label>
            <input
              name="motivation_level"
              type="number"
              min="1"
              max="10"
              defaultValue={profile?.motivation_level || 7}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
        </button>
      </div>
    </form>
  );
}
