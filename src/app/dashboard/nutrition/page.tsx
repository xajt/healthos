"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  FoodSearch,
  MealLog,
  CalorieProgress,
  MealEntry,
} from "@/components/nutrition";
import { FoodItem, calculateNutritionForAmount } from "@/lib/nutrition/open-food-facts";

// Demo data for development
const DEMO_ENTRIES: MealEntry[] = [
  {
    id: "1",
    food: {
      id: "local-1",
      name: "Jajka sadzone",
      calories: 147,
      protein: 9.5,
      carbs: 0.7,
      fat: 11.2,
      servingSize: "2 sztuki (100g)",
    },
    amount: 150,
    nutrition: { calories: 221, protein: 14.3, carbs: 1.1, fat: 16.8, fiber: 0, sugar: 0, sodium: 0 },
    loggedAt: new Date(),
    mealType: "breakfast",
  },
  {
    id: "2",
    food: {
      id: "local-3",
      name: "Ryż biały gotowany",
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3,
      servingSize: "100g",
    },
    amount: 200,
    nutrition: { calories: 260, protein: 5.4, carbs: 56, fat: 0.6, fiber: 0, sugar: 0, sodium: 0 },
    loggedAt: new Date(),
    mealType: "lunch",
  },
  {
    id: "3",
    food: {
      id: "local-2",
      name: "Pierś z kurczaka",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      servingSize: "100g",
    },
    amount: 150,
    nutrition: { calories: 248, protein: 46.5, carbs: 0, fat: 5.4, fiber: 0, sugar: 0, sodium: 0 },
    loggedAt: new Date(),
    mealType: "lunch",
  },
];

// Default targets (would come from user profile in production)
const DEFAULT_TARGETS = {
  calories: 2200,
  protein: 165,
  carbs: 220,
  fat: 73,
};

export default function NutritionPage() {
  const [entries, setEntries] = useState<MealEntry[]>(DEMO_ENTRIES);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealEntry["mealType"]>("breakfast");

  const totals = useMemo(() => {
    return entries.reduce(
      (sum, entry) => ({
        calories: sum.calories + entry.nutrition.calories,
        protein: sum.protein + entry.nutrition.protein,
        carbs: sum.carbs + entry.nutrition.carbs,
        fat: sum.fat + entry.nutrition.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [entries]);

  const handleAddFood = (
    food: FoodItem,
    amount: number,
    nutrition: ReturnType<typeof calculateNutritionForAmount>
  ) => {
    const newEntry: MealEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      food,
      amount,
      nutrition,
      loggedAt: new Date(),
      mealType: selectedMealType,
    };
    setEntries((prev) => [...prev, newEntry]);
    setShowFoodSearch(false);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const mealTypes: { type: MealEntry["mealType"]; label: string; icon: string }[] = [
    { type: "breakfast", label: "Śniadanie", icon: "🌅" },
    { type: "lunch", label: "Obiad", icon: "☀️" },
    { type: "dinner", label: "Kolacja", icon: "🌙" },
    { type: "snack", label: "Przekąska", icon: "🍎" },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Odżywianie</h1>
            <p className="text-zinc-500">Śledź swoje posiłki i kalorie</p>
          </div>
          <div className="text-right text-sm text-zinc-500">
            {new Date().toLocaleDateString("pl-PL", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </div>
        </div>

        {/* Calorie Progress */}
        <CalorieProgress
          consumed={totals.calories}
          target={DEFAULT_TARGETS.calories}
          protein={totals.protein}
          proteinTarget={DEFAULT_TARGETS.protein}
          carbs={totals.carbs}
          carbsTarget={DEFAULT_TARGETS.carbs}
          fat={totals.fat}
          fatTarget={DEFAULT_TARGETS.fat}
        />

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {mealTypes.map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => {
                setSelectedMealType(type);
                setShowFoodSearch(true);
              }}
              className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
            >
              <span className="text-xl">{icon}</span>
              <span className="text-xs text-zinc-600">{label}</span>
            </button>
          ))}
        </div>

        {/* Meal Log */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">Dzisiejsze posiłki</h2>
          <MealLog entries={entries} onDeleteEntry={handleDeleteEntry} />
        </div>

        {/* AI Tip */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <p className="font-medium text-zinc-900">Porada AI</p>
              <p className="text-sm text-zinc-600 mt-1">
                {totals.protein < DEFAULT_TARGETS.protein * 0.5
                  ? "Twoje spożycie białka jest dzisiaj niskie. Spróbuj dodać chude mięso, ryby lub rośliny strączkowe do kolejnych posiłków."
                  : totals.calories > DEFAULT_TARGETS.calories * 0.8
                  ? "Świetnie! Jesteś na dobrej drodze do osiągnięcia dzisiejszego celu kalorycznego."
                  : "Pamiętaj o regularnym spożywaniu posiłków co 3-4 godziny, aby utrzymać stabilny poziom energii."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Food Search Modal */}
      {showFoodSearch && (
        <FoodSearch
          onSelectFood={handleAddFood}
          onClose={() => setShowFoodSearch(false)}
        />
      )}
    </DashboardLayout>
  );
}
