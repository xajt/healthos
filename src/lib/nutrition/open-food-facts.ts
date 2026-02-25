/**
 * Open Food Facts API Service
 * Free, open database of food products with nutrition information
 * API Docs: https://openfoodfacts.github.io/api-documentation/
 */

const OFF_API_BASE = 'https://world.openfoodfacts.org/api/v2';

export interface OFFProduct {
  code: string;
  product_name?: string;
  product_name_pl?: string;
  brands?: string;
  image_small_url?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    'energy-kcal'?: number;
    'energy_100g'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    sugars_100g?: number;
    fat_100g?: number;
    'saturated-fat_100g'?: number;
    fiber_100g?: number;
    sodium_100g?: number;
    salt_100g?: number;
  };
  serving_size?: string;
  quantity?: string;
  nutriscore_grade?: string;
  categories?: string;
}

export interface OFFSearchResult {
  count: number;
  page: number;
  page_size: number;
  products: OFFProduct[];
}

export interface FoodItem {
  id: string;
  barcode?: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  calories: number; // per 100g
  protein: number; // per 100g
  carbs: number; // per 100g
  fat: number; // per 100g
  fiber?: number; // per 100g
  sugar?: number; // per 100g
  sodium?: number; // per 100g
  servingSize?: string;
  nutriscore?: string;
}

/**
 * Search for food products by name
 */
export async function searchFood(query: string, page = 1, pageSize = 20): Promise<OFFSearchResult> {
  const url = `${OFF_API_BASE}/search?search_terms=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}&fields=code,product_name,product_name_pl,brands,image_small_url,nutriments,serving_size,quantity,nutriscore_grade,categories`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'HealthOS/1.0 (contact@healthos.app)',
    },
  });

  if (!response.ok) {
    throw new Error(`Open Food Facts API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get a specific product by barcode
 */
export async function getProductByBarcode(barcode: string): Promise<OFFProduct | null> {
  const url = `${OFF_API_BASE}/product/${barcode}?fields=code,product_name,product_name_pl,brands,image_small_url,nutriments,serving_size,quantity,nutriscore_grade,categories`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'HealthOS/1.0 (contact@healthos.app)',
    },
  });

  if (!response.ok) {
    throw new Error(`Open Food Facts API error: ${response.status}`);
  }

  const data = await response.json();
  return data.product || null;
}

/**
 * Transform OFF product to our FoodItem format
 */
export function transformProduct(product: OFFProduct): FoodItem {
  const nutriments = product.nutriments || {};

  return {
    id: product.code,
    barcode: product.code,
    name: product.product_name_pl || product.product_name || 'Unknown Product',
    brand: product.brands,
    imageUrl: product.image_small_url,
    calories: nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0,
    protein: nutriments.proteins_100g || 0,
    carbs: nutriments.carbohydrates_100g || 0,
    fat: nutriments.fat_100g || 0,
    fiber: nutriments.fiber_100g,
    sugar: nutriments.sugars_100g,
    sodium: nutriments.sodium_100g,
    servingSize: product.serving_size || product.quantity,
    nutriscore: product.nutriscore_grade,
  };
}

/**
 * Calculate nutrition for a given amount
 */
export function calculateNutritionForAmount(
  food: FoodItem,
  amountInGrams: number
): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
} {
  const multiplier = amountInGrams / 100;

  return {
    calories: Math.round(food.calories * multiplier),
    protein: Math.round(food.protein * multiplier * 10) / 10,
    carbs: Math.round(food.carbs * multiplier * 10) / 10,
    fat: Math.round(food.fat * multiplier * 10) / 10,
    fiber: Math.round((food.fiber || 0) * multiplier * 10) / 10,
    sugar: Math.round((food.sugar || 0) * multiplier * 10) / 10,
    sodium: Math.round((food.sodium || 0) * multiplier * 10) / 10,
  };
}

/**
 * Common food items for quick logging (Polish food database)
 */
export const COMMON_FOODS: FoodItem[] = [
  {
    id: 'local-1',
    name: 'Jajko gotowane',
    calories: 155,
    protein: 12.6,
    carbs: 1.1,
    fat: 10.6,
    servingSize: '1 sztuka (50g)',
  },
  {
    id: 'local-2',
    name: 'Pierś z kurczaka',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: '100g',
  },
  {
    id: 'local-3',
    name: 'Ryż biały gotowany',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    servingSize: '100g',
  },
  {
    id: 'local-4',
    name: 'Makaron pełnoziarnisty',
    calories: 124,
    protein: 5,
    carbs: 25,
    fat: 0.6,
    fiber: 4.2,
    servingSize: '100g (ugotowany)',
  },
  {
    id: 'local-5',
    name: 'Twaróg półtłusty',
    calories: 162,
    protein: 18,
    carbs: 3.3,
    fat: 9,
    servingSize: '100g',
  },
  {
    id: 'local-6',
    name: 'Banana',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    sugar: 12,
    servingSize: '1 sztuka (120g)',
  },
  {
    id: 'local-7',
    name: 'Jabłko',
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    fiber: 2.4,
    sugar: 10,
    servingSize: '1 sztuka (180g)',
  },
  {
    id: 'local-8',
    name: 'Płatki owsiane',
    calories: 389,
    protein: 17,
    carbs: 66,
    fat: 7,
    fiber: 10.6,
    servingSize: '50g (suche)',
  },
  {
    id: 'local-9',
    name: 'Łosoś pieczony',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    servingSize: '100g',
  },
  {
    id: 'local-10',
    name: 'Brokuły gotowane',
    calories: 35,
    protein: 2.6,
    carbs: 7,
    fat: 0.4,
    fiber: 3.3,
    servingSize: '100g',
  },
  {
    id: 'local-11',
    name: 'Chleb żytni',
    calories: 259,
    protein: 9,
    carbs: 48,
    fat: 3.3,
    fiber: 5.8,
    servingSize: '1 kromka (35g)',
  },
  {
    id: 'local-12',
    name: 'Oliwa z oliwek',
    calories: 884,
    protein: 0,
    carbs: 0,
    fat: 100,
    servingSize: '1 łyżka (14g)',
  },
];
