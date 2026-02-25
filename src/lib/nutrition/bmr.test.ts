import { describe, it, expect } from 'vitest';
import { calculateBMR, calculateTDEE, calculateCalorieGoal, calculateProteinGoal, calculateFullBMR } from './bmr';
import { ACTIVITY_MULTIPLIERS, GOAL_MULTIPLIERS } from './bmr';

describe('BMR Calculator', () => {
  describe('calculateBMR', () => {
    it('should calculate BMR for male correctly', () => {
      const result = calculateBMR({
        weight: 70,
        height: 175,
        age: 25,
        gender: 'M',
      });
      // Mifflin-St Jeor: 10*70 + 6.25*175 - 5*25 + 5 = 700 + 1093.75 - 125 + 5 = 1673.75
      expect(result).toBeCloseTo(1673.75, 1);
    });

    it('should calculate BMR for female correctly', () => {
      const result = calculateBMR({
        weight: 55,
        height: 165,
        age: 30,
        gender: 'F',
      });
      // Mifflin-St Jeor: 10*55 + 6.25*165 - 5*30 - 161 = 550 + 1031.25 - 150 - 161 = 1270.25
      expect(result).toBeCloseTo(1270.25, 1);
    });

    it('should handle edge cases for male', () => {
      const result = calculateBMR({
        weight: 80,
        height: 180,
        age: 30,
        gender: 'M',
      });
      // 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
      expect(result).toBeCloseTo(1780, 1);
    });

    it('should handle edge cases for female', () => {
      const result = calculateBMR({
        weight: 50,
        height: 152,
        age: 20,
        gender: 'F',
      });
      // 10*50 + 6.25*152 - 5*20 - 161 = 500 + 950 - 100 - 161 = 1189
      expect(result).toBeCloseTo(1189, 1);
    });
  });

  describe('calculateTDEE', () => {
    it('should calculate TDEE for sedentary activity level', () => {
      const bmr = 1650;
      const result = calculateTDEE(bmr, 'sedentary');
      expect(result).toBeCloseTo(bmr * 1.2, 1);
    });

    it('should calculate TDEE for moderate activity level', () => {
      const bmr = 1650;
      const result = calculateTDEE(bmr, 'moderate');
      expect(result).toBeCloseTo(bmr * 1.55, 1);
    });

    it('should calculate TDEE for active activity level', () => {
      const bmr = 1650;
      const result = calculateTDEE(bmr, 'active');
      expect(result).toBeCloseTo(bmr * 1.725, 1);
    });

    it('should calculate TDEE for very active activity level', () => {
      const bmr = 1650;
      const result = calculateTDEE(bmr, 'veryActive');
      expect(result).toBeCloseTo(bmr * 1.9, 1);
    });

    it('should calculate TDEE for light activity level', () => {
      const bmr = 1700;
      const result = calculateTDEE(bmr, 'light');
      expect(result).toBeCloseTo(bmr * 1.375, 1);
    });
  });

  describe('calculateCalorieGoal', () => {
    it('should calculate calorie goal for losing weight', () => {
      const tdee = 2000;
      const result = calculateCalorieGoal(tdee, 'lose');
      expect(result).toBe(1600); // 2000 * 0.8
    });

    it('should calculate calorie goal for maintaining weight', () => {
      const tdee = 2000;
      const result = calculateCalorieGoal(tdee, 'maintain');
      expect(result).toBe(2000); // 2000 * 1.0
    });

    it('should calculate calorie goal for gaining weight', () => {
      const tdee = 2000;
      const result = calculateCalorieGoal(tdee, 'gain');
      expect(result).toBe(2300); // 2000 * 1.15
    });
  });

  describe('calculateProteinGoal', () => {
    it('should calculate protein goal for losing weight', () => {
      const weight = 70;
      const result = calculateProteinGoal(weight, 'lose');
      // 70 * 1.6 * 0.8 = 89.6 -> 90
      expect(result).toBe(90);
    });

    it('should calculate protein goal for gaining weight', () => {
      const weight = 70;
      const result = calculateProteinGoal(weight, 'gain');
      // 70 * 1.6 * 1.15 = 128.8 -> 129
      expect(result).toBe(129);
    });

    it('should calculate protein goal for maintaining weight', () => {
      const weight = 70;
      const result = calculateProteinGoal(weight, 'maintain');
      // 70 * 1.6 * 1.0 = 112 -> 112
      expect(result).toBe(112);
    });
  });

  describe('calculateFullBMR', () => {
    it('should return complete BMR result for male with moderate activity and lose goal', () => {
      const result = calculateFullBMR(
        { weight: 70, height: 175, age: 25, gender: 'M' },
        'moderate',
        'lose'
      );

      expect(result.bmr).toBeCloseTo(1673.75, 1);
      expect(result.tdee).toBeCloseTo(1673.75 * 1.55, 1);
      expect(result.activityLevel).toBe('moderate');
      expect(result.goalType).toBe('lose');
    });

    it('should return complete BMR result for female with active activity and gain goal', () => {
      const result = calculateFullBMR(
        { weight: 55, height: 165, age: 30, gender: 'F' },
        'active',
        'gain'
      );

      expect(result.bmr).toBeCloseTo(1270.25, 1);
      expect(result.tdee).toBeCloseTo(1270.25 * 1.725, 1);
      expect(result.activityLevel).toBe('active');
      expect(result.goalType).toBe('gain');
    });
  });

  describe('Constants', () => {
    it('should have correct activity multipliers', () => {
      expect(ACTIVITY_MULTIPLIERS.sedentary).toBe(1.2);
      expect(ACTIVITY_MULTIPLIERS.light).toBe(1.375);
      expect(ACTIVITY_MULTIPLIERS.moderate).toBe(1.55);
      expect(ACTIVITY_MULTIPLIERS.active).toBe(1.725);
      expect(ACTIVITY_MULTIPLIERS.veryActive).toBe(1.9);
    });

    it('should have correct goal multipliers', () => {
      expect(GOAL_MULTIPLIERS.lose).toBe(0.8);
      expect(GOAL_MULTIPLIERS.maintain).toBe(1.0);
      expect(GOAL_MULTIPLIERS.gain).toBe(1.15);
    });
  });
});
