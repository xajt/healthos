"use client";

import { useState, useCallback } from "react";
import { searchFood, transformProduct, FoodItem, COMMON_FOODS } from "@/lib/nutrition/open-food-facts";
import { calculateNutritionForAmount } from "@/lib/nutrition/open-food-facts";

interface FoodSearchProps {
  onSelectFood: (food: FoodItem, amount: number, nutrition: ReturnType<typeof calculateNutritionForAmount>) => void;
  onClose?: () => void;
}

export function FoodSearch({ onSelectFood, onClose }: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [amount, setAmount] = useState(100);
  const [showCommon, setShowCommon] = useState(true);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const data = await searchFood(query, 1, 20);
      const foods = data.products.map(transformProduct);
      setResults(foods);
      setShowCommon(false);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setAmount(100);
  };

  const handleConfirm = () => {
    if (!selectedFood) return;
    const nutrition = calculateNutritionForAmount(selectedFood, amount);
    onSelectFood(selectedFood, amount, nutrition);
    setSelectedFood(null);
    setQuery("");
    setResults([]);
  };

  const previewNutrition = selectedFood
    ? calculateNutritionForAmount(selectedFood, amount)
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-3xl md:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">
            {selectedFood ? "Wybierz ilość" : "Dodaj posiłek"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {selectedFood ? (
          /* Amount selection view */
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              {selectedFood.imageUrl && (
                <img
                  src={selectedFood.imageUrl}
                  alt={selectedFood.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium text-zinc-900">{selectedFood.name}</h3>
                {selectedFood.brand && (
                  <p className="text-sm text-zinc-500">{selectedFood.brand}</p>
                )}
                {selectedFood.servingSize && (
                  <p className="text-xs text-zinc-400">{selectedFood.servingSize}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Ilość (gramy)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                min={1}
              />
            </div>

            {previewNutrition && (
              <div className="bg-zinc-50 rounded-xl p-4 grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-lg font-semibold text-zinc-900">{previewNutrition.calories}</p>
                  <p className="text-xs text-zinc-500">kcal</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-600">{previewNutrition.protein}g</p>
                  <p className="text-xs text-zinc-500">białko</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-amber-600">{previewNutrition.carbs}g</p>
                  <p className="text-xs text-zinc-500">węgle</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-red-500">{previewNutrition.fat}g</p>
                  <p className="text-xs text-zinc-500">tłuszcze</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFood(null)}
                className="flex-1 py-3 border border-zinc-200 rounded-xl text-zinc-600 font-medium hover:bg-zinc-50 transition-colors"
              >
                Wróć
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
              >
                Dodaj
              </button>
            </div>
          </div>
        ) : (
          /* Search view */
          <>
            <div className="p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Szukaj produktu..."
                  className="flex-1 px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="px-4 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "..." : "Szukaj"}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {showCommon && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-zinc-500 mb-3">Często dodawane</h3>
                  <div className="space-y-2">
                    {COMMON_FOODS.map((food) => (
                      <button
                        key={food.id}
                        onClick={() => handleSelectFood(food)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                          <span className="text-lg">🍽️</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-zinc-900 truncate">{food.name}</p>
                          <p className="text-sm text-zinc-500">
                            {food.calories} kcal / 100g
                          </p>
                        </div>
                        <div className="text-right text-xs text-zinc-400">
                          <p>B: {food.protein}g</p>
                          <p>W: {food.carbs}g</p>
                          <p>T: {food.fat}g</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-zinc-500 mb-3">Wyniki wyszukiwania</h3>
                  <div className="space-y-2">
                    {results.map((food) => (
                      <button
                        key={food.id}
                        onClick={() => handleSelectFood(food)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 transition-colors text-left"
                      >
                        {food.imageUrl ? (
                          <img
                            src={food.imageUrl}
                            alt={food.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                            <span className="text-lg">🍽️</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-zinc-900 truncate">{food.name}</p>
                          {food.brand && (
                            <p className="text-xs text-zinc-500 truncate">{food.brand}</p>
                          )}
                          <p className="text-sm text-zinc-500">
                            {food.calories} kcal / 100g
                          </p>
                        </div>
                        {food.nutriscore && (
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                            food.nutriscore === 'a' ? 'bg-green-100 text-green-700' :
                            food.nutriscore === 'b' ? 'bg-lime-100 text-lime-700' :
                            food.nutriscore === 'c' ? 'bg-yellow-100 text-yellow-700' :
                            food.nutriscore === 'd' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {food.nutriscore}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!showCommon && results.length === 0 && !isLoading && (
                <div className="p-8 text-center text-zinc-500">
                  <p>Brak wyników dla &quot;{query}&quot;</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
