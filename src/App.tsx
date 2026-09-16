/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { CameraAiView } from './components/CameraAiView';
import { MealSuggestionsView } from './components/MealSuggestionsView';
import { ProgressView } from './components/ProgressView';
import { ProfileView } from './components/ProfileView';
import { FoodSearchModal } from './components/FoodSearchModal';
import { TechnicalArchitectureModal } from './components/TechnicalArchitectureModal';
import {
  CaloricRequirements,
  FoodItem,
  GoogleSheetsSyncStatus,
  LoggedMeal,
  MealRecommendation,
  MealType,
  UserProfile,
} from './types';
import { calculateRequirements } from './utils/calculator';

// Initial default user profile
const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex',
  age: 29,
  gender: 'male',
  weightKg: 74,
  heightCm: 178,
  activityLevel: 'moderate',
  goal: 'lose_fat_moderate',
  formula: 'mifflin_st_jeor',
  dietaryPreference: 'mediterranean',
  dietaryRestrictions: [],
  prepTimePreference: 'moderate',
  budgetPreference: 'medium',
  waterGoalMl: 2500,
};

// Initial preloaded sample meals for today
const INITIAL_MEALS: LoggedMeal[] = [
  {
    id: 'meal-1',
    date: new Date().toISOString().slice(0, 10),
    time: '08:30',
    mealType: 'breakfast',
    title: 'Bowl de Avena con Frutos Rojos y Chía',
    calories: 345,
    proteinG: 14.5,
    carbsG: 52.0,
    fatsG: 8.8,
    loggedVia: 'search_db',
    items: [
      {
        id: 'h3',
        name: 'Bowl de Avena con Frutos Rojos y Chía',
        portionDescription: '1 tazón completo',
        portionGrams: 280,
        calories: 345,
        proteinG: 14.5,
        carbsG: 52.0,
        fatsG: 8.8,
        category: 'homemade',
      },
    ],
  },
  {
    id: 'meal-2',
    date: new Date().toISOString().slice(0, 10),
    time: '14:15',
    mealType: 'lunch',
    title: 'Pechuga de Pollo Dorada con Arroz Integral',
    calories: 555,
    proteinG: 51.0,
    carbsG: 45.8,
    fatsG: 17.0,
    loggedVia: 'camera_ai',
    items: [
      {
        id: 'f1',
        name: 'Pechuga de Pollo a la Plancha',
        portionDescription: '1 filete mediano limpio',
        portionGrams: 160,
        calories: 247,
        proteinG: 46.5,
        carbsG: 0,
        fatsG: 5.4,
        category: 'fresh',
      },
      {
        id: 'f2',
        name: 'Arroz Integral Cocido',
        portionDescription: '1 taza colmada',
        portionGrams: 195,
        calories: 218,
        proteinG: 4.5,
        carbsG: 45.8,
        fatsG: 1.6,
        category: 'fresh',
      },
      {
        id: 'f8',
        name: 'Aceite de Oliva Virgen Extra (Cocción)',
        portionDescription: '1 cucharada',
        portionGrams: 10,
        calories: 90,
        proteinG: 0,
        carbsG: 0,
        fatsG: 10.0,
        category: 'fresh',
      },
    ],
  },
  {
    id: 'meal-3',
    date: new Date().toISOString().slice(0, 10),
    time: '17:45',
    mealType: 'snack',
    title: 'Yogur Griego 0% con Nueces',
    calories: 192,
    proteinG: 15.9,
    carbsG: 7.2,
    fatsG: 10.4,
    loggedVia: 'barcode',
    items: [
      {
        id: 'b1',
        name: 'Yogur Griego Natural 0% Grasa',
        portionDescription: '1 tarrina de 125g',
        portionGrams: 125,
        calories: 68,
        proteinG: 10.3,
        carbsG: 4.8,
        fatsG: 0.2,
        category: 'packaged',
      },
      {
        id: 'b4-raw',
        name: 'Nueces de California',
        portionDescription: '15g troceadas',
        portionGrams: 15,
        calories: 124,
        proteinG: 5.6,
        carbsG: 2.4,
        fatsG: 10.2,
        category: 'fresh',
      },
    ],
  },
];

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('nutrilens_user_profile');
      return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [meals, setMeals] = useState<LoggedMeal[]>(() => {
    try {
      const stored = localStorage.getItem('nutrilens_meals');
      return stored ? JSON.parse(stored) : INITIAL_MEALS;
    } catch {
      return INITIAL_MEALS;
    }
  });

  const [waterMl, setWaterMl] = useState<number>(1250);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));

  // Modals state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchTargetMealType, setSearchTargetMealType] = useState<MealType>('lunch');
  const [architectureModalOpen, setArchitectureModalOpen] = useState(false);

  // Google Sheets sync state
  const [sheetsStatus, setSheetsStatus] = useState<GoogleSheetsSyncStatus>({
    isConnected: true,
    userEmail: 'alexfullto@gmail.com',
    isSyncing: false,
  });

  // Calculate user caloric requirements dynamically
  const requirements: CaloricRequirements = calculateRequirements(profile);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('nutrilens_user_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('nutrilens_meals', JSON.stringify(meals));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [meals]);

  const handleDateChange = (deltaDays: number) => {
    const cur = new Date(selectedDate + 'T00:00:00');
    cur.setDate(cur.getDate() + deltaDays);
    setSelectedDate(cur.toISOString().slice(0, 10));
  };

  const handleUpdateWater = (delta: number) => {
    setWaterMl((prev) => Math.max(0, prev + delta));
  };

  const handleOpenSearch = (mealType: MealType) => {
    setSearchTargetMealType(mealType);
    setSearchModalOpen(true);
  };

  const handleAddFoodFromSearch = (food: FoodItem, mealType: MealType) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMeal: LoggedMeal = {
      id: `meal-${Date.now()}`,
      date: selectedDate,
      time: timeStr,
      mealType,
      title: food.name,
      calories: food.calories,
      proteinG: food.proteinG,
      carbsG: food.carbsG,
      fatsG: food.fatsG,
      loggedVia: food.barcode ? 'barcode' : food.isCustom ? 'manual' : 'search_db',
      items: [food],
    };

    setMeals((prev) => [newMeal, ...prev]);
  };

  const handleSaveMealFromCamera = (
    title: string,
    mealType: MealType,
    calories: number,
    protein: number,
    carbs: number,
    fats: number,
    items: FoodItem[],
    imageUrl?: string
  ) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMeal: LoggedMeal = {
      id: `meal-${Date.now()}`,
      date: selectedDate,
      time: timeStr,
      mealType,
      title,
      calories,
      proteinG: protein,
      carbsG: carbs,
      fatsG: fats,
      imageUrl,
      items,
      loggedVia: 'camera_ai',
    };

    setMeals((prev) => [newMeal, ...prev]);
    setActiveTab('dashboard');
  };

  const handleAddRecommendationToMeal = (rec: MealRecommendation) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMeal: LoggedMeal = {
      id: `meal-${Date.now()}`,
      date: selectedDate,
      time: timeStr,
      mealType: rec.mealType,
      title: rec.title,
      calories: rec.calories,
      proteinG: rec.proteinG,
      carbsG: rec.carbsG,
      fatsG: rec.fatsG,
      loggedVia: 'recommendation',
      items: [
        {
          id: rec.id,
          name: rec.title,
          portionDescription: 'Ración completa sugerida por IA',
          portionGrams: 350,
          calories: rec.calories,
          proteinG: rec.proteinG,
          carbsG: rec.carbsG,
          fatsG: rec.fatsG,
          category: 'homemade',
        },
      ],
    };

    setMeals((prev) => [newMeal, ...prev]);
  };

  const handleRemoveMeal = (mealId: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  // Filter meals for the selected date
  const dateMeals = meals.filter((m) => m.date === selectedDate);
  const totalCaloriesToday = dateMeals.reduce((acc, m) => acc + m.calories, 0);
  const remainingCaloriesToday = requirements.targetCalories - totalCaloriesToday;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-start antialiased">
      {/* Top Main Bar */}
      <div className="w-full">
        <Header
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
          onOpenArchitecture={() => setArchitectureModalOpen(true)}
          sheetsStatus={sheetsStatus}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
      </div>

      {/* Main Container: Mobile Frame Simulator or Fluid Desktop View */}
      <main
        className={`w-full transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-md my-4 sm:my-8 rounded-[40px] border-8 border-neutral-800 shadow-2xl shadow-black overflow-hidden bg-neutral-950 flex flex-col min-h-[840px] relative'
            : 'max-w-5xl px-4 py-6'
        }`}
      >
        {/* Smartphone top speaker & dynamic island notch (visible only in mobile frame mode) */}
        {isMobileFrame && (
          <div className="pt-2 pb-1 px-6 bg-neutral-950 flex items-center justify-between text-[11px] text-neutral-400 font-semibold select-none z-20">
            <span>09:41</span>
            <div className="w-20 h-4 bg-neutral-900 rounded-full border border-neutral-800/80 mx-auto" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <span className="w-5 h-2.5 border border-neutral-400 rounded-sm inline-block p-0.5">
                <span className="w-full h-full bg-emerald-400 block rounded-2xs" />
              </span>
            </div>
          </div>
        )}

        {/* Viewport Content */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto no-scrollbar">
          {activeTab === 'dashboard' && (
            <DashboardView
              profile={profile}
              requirements={requirements}
              meals={dateMeals}
              waterMl={waterMl}
              onUpdateWater={handleUpdateWater}
              onOpenSearch={handleOpenSearch}
              onRemoveMeal={handleRemoveMeal}
              onGoToCamera={() => setActiveTab('camera')}
              onGoToRecommendations={() => setActiveTab('recommendations')}
            />
          )}

          {activeTab === 'camera' && (
            <CameraAiView onSaveMeal={handleSaveMealFromCamera} />
          )}

          {activeTab === 'recommendations' && (
            <MealSuggestionsView
              profile={profile}
              remainingCalories={remainingCaloriesToday}
              onAddRecommendationToMeal={handleAddRecommendationToMeal}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressView
              profile={profile}
              requirements={requirements}
              meals={meals}
              sheetsStatus={sheetsStatus}
              onUpdateSheetsStatus={(st) => setSheetsStatus((prev) => ({ ...prev, ...st }))}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onOpenArchitecture={() => setArchitectureModalOpen(true)}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </main>

      {/* Food Search and Barcode Modal */}
      <FoodSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        targetMealType={searchTargetMealType}
        onAddFood={handleAddFoodFromSearch}
      />

      {/* Technical Architecture & Blueprint Modal */}
      <TechnicalArchitectureModal
        isOpen={architectureModalOpen}
        onClose={() => setArchitectureModalOpen(false)}
      />
    </div>
  );
}
