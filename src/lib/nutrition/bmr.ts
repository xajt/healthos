/**
 * BMR Calculator - Mifflin-St Jeor Formula
 *
 * Activity Level Multipliers (TDEE = Total Daily Energy Expenditure)
 * Goal Multipliers (calorie adjustment)
 */

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type GoalType = 'lose' | 'maintain' | 'gain';

export interface BMRInput {
  weight: number; // kg
  height: number; // cm
  age: number; // years
  gender: 'M' | 'F';
}

export interface BMRResult {
  bmr: number; // Base Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  calorieGoal: number; // Adjusted for goal
  proteinGoal: number; // grams
  activityLevel: ActivityLevel;
  goalType: GoalType;
}

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

export const GOAL_MULTIPLIERS: Record<GoalType, number> = {
  lose: 0.8,
  maintain: 1.0,
  gain: 1.15,
};

export const PROTEIN_MULTIPLIER = 1.6; // g per kg of body weight

/**
 * Calculate BMR using Mifflin-St Jeor Formula
 */
export function calculateBMR(input: BMRInput): number {
  const { weight, height, age, gender } = input;

  if (gender === 'M') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel];
}

/**
 * Calculate calorie goal based on goal type
 */
export function calculateCalorieGoal(tdee: number, goalType: GoalType): number {
  return Math.round(tdee * GOAL_MULTIPLIERS[goalType]);
}

/**
 * Calculate protein goal
 */
export function calculateProteinGoal(weight: number, goalType: GoalType): number {
  return Math.round(weight * PROTEIN_MULTIPLIER * GOAL_MULTIPLIERS[goalType]);
}

/**
 * Full BMR calculation with all goals
 */
export function calculateFullBMR(
  input: BMRInput,
  activityLevel: ActivityLevel,
  goalType: GoalType
): BMRResult {
  const bmr = calculateBMR(input);
  const tdee = calculateTDEE(bmr, activityLevel);
  const calorieGoal = calculateCalorieGoal(tdee, goalType);
  const proteinGoal = calculateProteinGoal(input.weight, goalType);

  return {
    bmr,
    tdee,
    calorieGoal,
    proteinGoal,
    activityLevel,
    goalType,
  };
}
