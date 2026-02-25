"use client";

import { FoodItem, calculateNutritionForAmount } from "@/lib/nutrition/open-food-facts";

export interface MealEntry {
  id: string;
  food: FoodItem;
  amount: number;
  nutrition: ReturnType<typeof calculateNutritionForAmount>;
  loggedAt: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface MealLogProps {
  entries: MealEntry[];
  onDeleteEntry: (id: string) => void;
}

const MEAL_TYPE_LABELS: Record<MealEntry['mealType'], string> = {
  breakfast: 'Śniadanie',
  lunch: 'Obiad',
  dinner: 'Kolacja',
  snack: 'Przekąska',
};

const MEAL_TYPE_ICONS: Record<MealEntry['mealType'], string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

export function MealLog({ entries, onDeleteEntry }: MealLogProps) {

  // Group entries by meal type
  const groupedEntries = entries.reduce((acc, entry) => {
    if (!acc[entry.mealType]) {
      acc[entry.mealType] = [];
    }
    acc[entry.mealType].push(entry);
    return acc;
  }, {} as Record<MealEntry['mealType'], MealEntry[]>);

  // Calculate totals per meal type
  const mealTotals = Object.entries(groupedEntries).reduce((acc, [type, entries]) => {
    acc[type as MealEntry['mealType']] = entries.reduce(
      (sum, entry) => ({
        calories: sum.calories + entry.nutrition.calories,
        protein: sum.protein + entry.nutrition.protein,
        carbs: sum.carbs + entry.nutrition.carbs,
        fat: sum.fat + entry.nutrition.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    return acc;
  }, {} as Record<MealEntry['mealType'], { calories: number; protein: number; carbs: number; fat: number }>);

  const mealOrder: MealEntry['mealType'][] = ['breakfast', 'lunch', 'dinner', 'snack'];

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center">
        <div className="text-4xl mb-3">🍽️</div>
        <p className="text-zinc-500">Brak zapisanych posiłków</p>
        <p className="text-sm text-zinc-400 mt-1">
          Dodaj pierwszy posiłek, aby śledzić kalorie
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {mealOrder.map((mealType) => {
        const mealEntries = groupedEntries[mealType];
        if (!mealEntries || mealEntries.length === 0) return null;

        const totals = mealTotals[mealType];

        return (
          <div key={mealType} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
            {/* Meal header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">{MEAL_TYPE_ICONS[mealType]}</span>
                <span className="font-medium text-zinc-900">{MEAL_TYPE_LABELS[mealType]}</span>
                <span className="text-sm text-zinc-400">({mealEntries.length})</span>
              </div>
              <div className="text-sm text-zinc-500">
                {totals.calories} kcal
              </div>
            </div>

            {/* Food items */}
            <div className="divide-y divide-zinc-50">
              {mealEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 flex items-center gap-3 hover:bg-zinc-50 transition-colors"
                >
                  {entry.food.imageUrl ? (
                    <img
                      src={entry.food.imageUrl}
                      alt={entry.food.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                      <span>🍽️</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 truncate text-sm">{entry.food.name}</p>
                    <p className="text-xs text-zinc-500">{entry.amount}g</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-medium text-zinc-900">{entry.nutrition.calories} kcal</p>
                    <p className="text-zinc-400">
                      B:{entry.nutrition.protein} W:{entry.nutrition.carbs} T:{entry.nutrition.fat}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Meal totals */}
            <div className="bg-zinc-50 px-4 py-2 flex items-center justify-between text-xs">
              <span className="text-zinc-500">Suma:</span>
              <div className="flex gap-4">
                <span className="text-zinc-600">Białko: <strong>{Math.round(totals.protein)}g</strong></span>
                <span className="text-zinc-600">Węgle: <strong>{Math.round(totals.carbs)}g</strong></span>
                <span className="text-zinc-600">Tłuszcze: <strong>{Math.round(totals.fat)}g</strong></span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
