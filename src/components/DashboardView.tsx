import React from 'react';
import { Camera, Plus, Trash2, Droplets, Flame, TrendingDown, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';
import { CaloricRequirements, LoggedMeal, MealType, UserProfile } from '../types';

interface DashboardViewProps {
  profile: UserProfile;
  requirements: CaloricRequirements;
  meals: LoggedMeal[];
  waterMl: number;
  onUpdateWater: (delta: number) => void;
  onOpenSearch: (mealType: MealType) => void;
  onRemoveMeal: (mealId: string) => void;
  onGoToCamera: () => void;
  onGoToRecommendations: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  requirements,
  meals,
  waterMl,
  onUpdateWater,
  onOpenSearch,
  onRemoveMeal,
  onGoToCamera,
  onGoToRecommendations,
}) => {
  // Aggregate daily totals
  const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = Math.round(meals.reduce((acc, m) => acc + m.proteinG, 0));
  const totalCarbs = Math.round(meals.reduce((acc, m) => acc + m.carbsG, 0));
  const totalFats = Math.round(meals.reduce((acc, m) => acc + m.fatsG, 0));

  const remainingCalories = requirements.targetCalories - totalCalories;
  const caloriePercent = Math.min(100, Math.round((totalCalories / requirements.targetCalories) * 100));

  const proteinGoal = requirements.macroSplit.proteinGrams;
  const carbsGoal = requirements.macroSplit.carbsGrams;
  const fatsGoal = requirements.macroSplit.fatsGrams;

  const proteinPercent = Math.min(100, Math.round((totalProtein / proteinGoal) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbs / carbsGoal) * 100));
  const fatsPercent = Math.min(100, Math.round((totalFats / fatsGoal) * 100));

  const mealTypes: { type: MealType; label: string; iconTime: string }[] = [
    { type: 'breakfast', label: 'Desayuno', iconTime: '08:00 - 10:00' },
    { type: 'lunch', label: 'Almuerzo / Comida', iconTime: '13:30 - 15:30' },
    { type: 'dinner', label: 'Cena', iconTime: '20:30 - 22:00' },
    { type: 'snack', label: 'Snacks & Colaciones', iconTime: 'A lo largo del día' },
  ];

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Top Banner: User Greeting & Caloric Summary */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold font-display text-white tracking-tight">
              Hola, {profile.name} 👋
            </h1>
            <p className="text-xs text-neutral-400">
              Objetivo:{' '}
              <span className="text-emerald-400 font-semibold">
                {profile.goal === 'lose_fat_aggressive' || profile.goal === 'lose_fat_moderate'
                  ? 'Déficit para Grasa'
                  : profile.goal === 'maintain'
                  ? 'Mantenimiento'
                  : 'Ganancia Muscular'}
              </span>{' '}
              ({requirements.targetCalories} kcal)
            </p>
          </div>

          <div className="text-right">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1 ${
                remainingCalories >= 0
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                  : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
              }`}
            >
              {remainingCalories >= 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              {Math.abs(remainingCalories)} kcal {remainingCalories >= 0 ? 'restantes' : 'excedente'}
            </span>
          </div>
        </div>

        {/* Circular Calorie Gauge & Big Numbers */}
        <div className="grid grid-cols-3 gap-2 py-2 items-center text-center">
          <div className="bg-neutral-800/50 rounded-2xl p-2.5 border border-neutral-800">
            <span className="text-xs text-neutral-400 block font-medium">Consumidas</span>
            <span className="text-xl font-bold text-white tracking-tight">{totalCalories}</span>
            <span className="text-[10px] text-neutral-500 block">kcal</span>
          </div>

          <div className="bg-gradient-to-b from-neutral-800/90 to-neutral-800/40 rounded-2xl p-3 border border-emerald-500/30 ring-2 ring-emerald-500/10">
            <span className="text-xs text-emerald-400 block font-semibold">Meta Diaria</span>
            <span className="text-2xl font-black text-white tracking-tight font-display">
              {requirements.targetCalories}
            </span>
            <span className="text-[10px] text-emerald-500/80 block font-medium">TDEE ajustado</span>
          </div>

          <div className="bg-neutral-800/50 rounded-2xl p-2.5 border border-neutral-800">
            <span className="text-xs text-neutral-400 block font-medium">Restante</span>
            <span
              className={`text-xl font-bold tracking-tight ${
                remainingCalories >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {remainingCalories}
            </span>
            <span className="text-[10px] text-neutral-500 block">kcal</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 space-y-1">
          <div className="h-2.5 w-full bg-neutral-800 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                caloriePercent > 100
                  ? 'bg-rose-500'
                  : caloriePercent > 85
                  ? 'bg-emerald-400'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, caloriePercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-neutral-400 font-medium">
            <span>Progreso diario</span>
            <span>{caloriePercent}% del requerimiento</span>
          </div>
        </div>

        {/* Macronutrients Mini Cards */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-neutral-800/80">
          {/* Protein */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-blue-400 font-semibold">Proteína</span>
              <span className="text-neutral-400 text-[11px]">
                {totalProtein}/{proteinGoal}g
              </span>
            </div>
            <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-amber-400 font-semibold">Carbos</span>
              <span className="text-neutral-400 text-[11px]">
                {totalCarbs}/{carbsGoal}g
              </span>
            </div>
            <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${carbsPercent}%` }}
              />
            </div>
          </div>

          {/* Fats */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-rose-400 font-semibold">Grasas</span>
              <span className="text-neutral-400 text-[11px]">
                {totalFats}/{fatsGoal}g
              </span>
            </div>
            <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-300"
                style={{ width: `${fatsPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Quick Scan AI Trigger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          id="btn-quick-camera"
          onClick={onGoToCamera}
          className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-neutral-950 font-bold p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-950/20 text-neutral-950 flex items-center justify-center">
              <Camera className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div className="text-left">
              <p className="text-sm font-display font-extrabold text-neutral-950 leading-tight">
                Escanear Plato con IA
              </p>
              <p className="text-[11px] font-medium text-emerald-950/80">
                Reconoce comida, porciones y calorías
              </p>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-neutral-950 opacity-70 group-hover:scale-125 transition-transform" />
        </button>

        <button
          id="btn-quick-recommend"
          onClick={onGoToRecommendations}
          className="bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700/60 p-4 rounded-2xl flex items-center justify-between text-white transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold leading-tight">¿Qué puedo comer?</p>
              <p className="text-[11px] text-neutral-400">
                Menús adaptados a tus {Math.max(0, remainingCalories)} kcal
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Water Tracking Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center border border-sky-500/20">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">Hidratación Diaria</span>
              <span className="text-[11px] text-sky-400 font-bold">
                {waterMl} / {profile.waterGoalMl} ml
              </span>
            </div>
            <div className="w-32 sm:w-48 h-1.5 bg-neutral-800 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full"
                style={{ width: `${Math.min(100, (waterMl / profile.waterGoalMl) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onUpdateWater(-250)}
            disabled={waterMl <= 0}
            className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-neutral-300 text-xs font-bold transition-colors cursor-pointer"
            title="Restar 250ml"
          >
            -
          </button>
          <button
            onClick={() => onUpdateWater(250)}
            className="px-2.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-semibold transition-colors cursor-pointer"
            title="Añadir 250ml"
          >
            +250ml
          </button>
        </div>
      </div>

      {/* Meals of the Day Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold font-display uppercase tracking-wider text-neutral-400 px-1">
          Registro de Comidas
        </h2>

        {mealTypes.map(({ type, label, iconTime }) => {
          const mealsOfType = meals.filter((m) => m.mealType === type);
          const mealCalories = mealsOfType.reduce((acc, m) => acc + m.calories, 0);

          return (
            <div
              key={type}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 transition-all hover:border-neutral-700/80"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{label}</h3>
                    {mealsOfType.length > 0 && (
                      <span className="text-[11px] bg-neutral-800 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                        {mealCalories} kcal
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-500">{iconTime}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    id={`btn-add-${type}`}
                    onClick={() => onOpenSearch(type)}
                    className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs px-2.5 py-1.5 rounded-xl font-medium transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Añadir</span>
                  </button>
                </div>
              </div>

              {/* Logged items in this meal */}
              {mealsOfType.length === 0 ? (
                <div className="py-3 text-center text-xs text-neutral-500 font-medium">
                  No hay alimentos registrados en {label.toLowerCase()}.
                </div>
              ) : (
                <div className="divide-y divide-neutral-800/60 pt-1">
                  {mealsOfType.map((meal) => (
                    <div
                      key={meal.id}
                      className="py-2.5 flex items-center justify-between text-xs group"
                    >
                      <div className="space-y-0.5 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-neutral-200">{meal.title}</span>
                          {meal.loggedVia === 'camera_ai' && (
                            <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800/40 px-1.5 py-0.2 rounded font-medium">
                              IA Cámara
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                          <span className="text-blue-400">P: {meal.proteinG}g</span>
                          <span className="text-amber-400">C: {meal.carbsG}g</span>
                          <span className="text-rose-400">G: {meal.fatsG}g</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-emerald-400 text-xs">{meal.calories} kcal</span>
                        <button
                          onClick={() => onRemoveMeal(meal.id)}
                          className="p-1 text-neutral-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar comida"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
