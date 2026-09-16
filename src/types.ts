export type Gender = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'athlete';

export type CalorieGoal = 'lose_fat_aggressive' | 'lose_fat_moderate' | 'maintain' | 'gain_muscle_clean' | 'gain_muscle_surplus';

export type CalculationFormula = 'mifflin_st_jeor' | 'harris_benedict';

export type DietaryPreference = 'omnivore' | 'vegetarian' | 'vegan' | 'keto' | 'mediterranean' | 'paleo' | 'low_carb';

export type DietaryRestriction = 'gluten_free' | 'lactose_free' | 'nut_free' | 'shellfish_free' | 'fructose_free' | 'none';

export type PrepTimePreference = 'express' | 'moderate' | 'elaborate';

export type BudgetPreference = 'low' | 'medium' | 'high';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  goal: CalorieGoal;
  formula: CalculationFormula;
  dietaryPreference: DietaryPreference;
  dietaryRestrictions: DietaryRestriction[];
  prepTimePreference: PrepTimePreference;
  budgetPreference: BudgetPreference;
  waterGoalMl: number;
}

export interface CaloricRequirements {
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  targetCalories: number; // After goal deficit/surplus
  macroSplit: {
    proteinGrams: number;
    proteinCals: number;
    proteinPercent: number;
    carbsGrams: number;
    carbsCals: number;
    carbsPercent: number;
    fatsGrams: number;
    fatsCals: number;
    fatsPercent: number;
  };
  deficitOrSurplus: number;
  weeklyProjectedWeightChangeKg: number;
}

export interface FoodItem {
  id: string;
  name: string;
  portionDescription: string;
  portionGrams: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  fiberG?: number;
  category: 'fresh' | 'restaurant' | 'packaged' | 'homemade';
  brand?: string;
  barcode?: string;
  confidenceScore?: number;
  isCustom?: boolean;
}

export interface HiddenIngredient {
  name: string;
  calories: number;
  fatsG: number;
  carbsG: number;
  detectedReason: string;
  included: boolean;
}

export interface MealAnalysisResult {
  dishTitle: string;
  description: string;
  estimatedTotalCalories: number;
  confidenceRange: {
    min: number;
    max: number;
  };
  overallConfidence: 'high' | 'medium' | 'low';
  items: FoodItem[];
  hiddenIngredients: HiddenIngredient[];
  portionMultiplier: number; // 0.75 small, 1.0 standard, 1.3 large
  dietaryTags: string[];
  nutritionalTips: string;
  aiModelUsed: string;
}

export interface LoggedMeal {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  mealType: MealType;
  title: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  imageUrl?: string;
  items: FoodItem[];
  loggedVia: 'camera_ai' | 'search_db' | 'barcode' | 'manual' | 'recommendation';
}

export interface DayLog {
  date: string;
  meals: LoggedMeal[];
  waterMl: number;
}

export interface MealRecommendation {
  id: string;
  title: string;
  mealType: MealType;
  description: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  prepTimeMinutes: number;
  budgetCategory: 'low' | 'medium' | 'high';
  season: Season;
  dietTags: string[];
  ingredients: string[];
  cookingInstructions: string[];
  imageUrl?: string;
}

export interface GoogleSheetsSyncStatus {
  isConnected: boolean;
  userEmail?: string;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  lastSyncTime?: string;
  isSyncing: boolean;
  error?: string;
}
