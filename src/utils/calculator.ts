import { CaloricRequirements, UserProfile } from '../types';

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2, // Little or no exercise, desk job
  light: 1.375, // Light exercise 1-3 days/week
  moderate: 1.55, // Moderate exercise 3-5 days/week
  very_active: 1.725, // Hard exercise 6-7 days/week
  athlete: 1.9, // Very hard training, physical job or twice-a-day
};

export const GOAL_CALORIE_ADJUSTMENTS = {
  lose_fat_aggressive: -600, // Safe maximum fat loss (~0.6-0.8 kg/week)
  lose_fat_moderate: -400, // Sustainable deficit (~0.4-0.5 kg/week)
  maintain: 0,
  gain_muscle_clean: 250, // Lean bulking minimizing fat gain
  gain_muscle_surplus: 450, // High-performance bulking
};

/**
 * Calculates BMR using the Mifflin-St Jeor equation (Gold Standard clinical accuracy)
 */
export function calculateMifflinStJeor(profile: UserProfile): number {
  const { weightKg, heightCm, age, gender } = profile;
  // BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(years) + s
  // s = +5 for males, -161 for females
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'male' ? Math.round(base + 5) : Math.round(base - 161);
}

/**
 * Calculates BMR using the revised Harris-Benedict equation (Roza and Shizgal, 1984)
 */
export function calculateHarrisBenedict(profile: UserProfile): number {
  const { weightKg, heightCm, age, gender } = profile;
  if (gender === 'male') {
    return Math.round(88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age);
  } else {
    return Math.round(447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age);
  }
}

/**
 * Computes full caloric and macronutrient targets based on user biometric parameters
 */
export function calculateRequirements(profile: UserProfile): CaloricRequirements {
  const bmr =
    profile.formula === 'harris_benedict'
      ? calculateHarrisBenedict(profile)
      : calculateMifflinStJeor(profile);

  const activityMultiplier = ACTIVITY_MULTIPLIERS[profile.activityLevel] || 1.375;
  const tdee = Math.round(bmr * activityMultiplier);

  const adjustment = GOAL_CALORIE_ADJUSTMENTS[profile.goal] ?? 0;
  // Safety floor: 1200 kcal for women, 1500 kcal for men
  const minSafeFloor = profile.gender === 'female' ? 1200 : 1500;
  const targetCalories = Math.max(minSafeFloor, tdee + adjustment);

  // Protein targets based on scientific recommendations (1.6 - 2.2 g/kg bodyweight)
  let proteinMultiplier = 1.8;
  if (profile.goal === 'lose_fat_aggressive' || profile.goal === 'lose_fat_moderate') {
    proteinMultiplier = 2.0; // Preserves lean muscle mass in calorie deficit
  } else if (profile.goal === 'gain_muscle_clean' || profile.goal === 'gain_muscle_surplus') {
    proteinMultiplier = 1.9;
  } else {
    proteinMultiplier = 1.6;
  }

  const proteinGrams = Math.round(profile.weightKg * proteinMultiplier);
  const proteinCals = proteinGrams * 4;

  // Healthy dietary fats: 25-30% of total daily energy requirement
  const fatsPercentTarget = profile.dietaryPreference === 'keto' ? 0.65 : 0.28;
  let fatsCals = Math.round(targetCalories * fatsPercentTarget);
  // Ensure minimum essential fatty acids (at least 0.7g/kg)
  const minFatGrams = Math.round(profile.weightKg * 0.7);
  if (fatsCals / 9 < minFatGrams && profile.dietaryPreference !== 'keto') {
    fatsCals = minFatGrams * 9;
  }
  const fatsGrams = Math.round(fatsCals / 9);

  // Carbs fill the remainder of the daily caloric pool
  const remainingCals = Math.max(0, targetCalories - (proteinCals + fatsCals));
  const carbsGrams = Math.round(remainingCals / 4);
  const carbsCals = carbsGrams * 4;

  const totalCalculatedCals = proteinCals + fatsCals + carbsCals;
  const proteinPercent = Math.round((proteinCals / totalCalculatedCals) * 100);
  const fatsPercent = Math.round((fatsCals / totalCalculatedCals) * 100);
  const carbsPercent = Math.max(0, 100 - (proteinPercent + fatsPercent));

  // 1 kg of adipose tissue ≈ 7700 kcal
  const deficitOrSurplus = targetCalories - tdee;
  const weeklyProjectedWeightChangeKg = Number(((deficitOrSurplus * 7) / 7700).toFixed(2));

  return {
    bmr,
    tdee,
    targetCalories,
    macroSplit: {
      proteinGrams,
      proteinCals,
      proteinPercent,
      carbsGrams,
      carbsCals,
      carbsPercent,
      fatsGrams,
      fatsCals,
      fatsPercent,
    },
    deficitOrSurplus,
    weeklyProjectedWeightChangeKg,
  };
}

/**
 * Calculates adherence index for a given day (100% when within ±10% of target)
 */
export function calculateDailyAdherence(consumedCalories: number, targetCalories: number): number {
  if (targetCalories <= 0) return 0;
  const diff = Math.abs(consumedCalories - targetCalories);
  const percentDiff = (diff / targetCalories) * 100;
  if (percentDiff <= 5) return 100;
  if (percentDiff <= 10) return 90;
  if (percentDiff <= 15) return 75;
  if (percentDiff <= 25) return 50;
  return Math.max(10, Math.round(100 - percentDiff * 1.5));
}
