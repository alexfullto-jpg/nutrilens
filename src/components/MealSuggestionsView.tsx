import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  DollarSign,
  Calendar,
  Check,
  Plus,
  RefreshCw,
  ChefHat,
  Filter,
  Leaf,
  Layers,
} from 'lucide-react';
import {
  BudgetPreference,
  DietaryPreference,
  DietaryRestriction,
  FoodItem,
  MealRecommendation,
  MealType,
  PrepTimePreference,
  Season,
  UserProfile,
} from '../types';
import { INITIAL_RECOMMENDATIONS } from '../data/nutritionDatabase';

interface MealSuggestionsViewProps {
  profile: UserProfile;
  remainingCalories: number;
  onAddRecommendationToMeal: (rec: MealRecommendation) => void;
}

export const MealSuggestionsView: React.FC<MealSuggestionsViewProps> = ({
  profile,
  remainingCalories,
  onAddRecommendationToMeal,
}) => {
  const [recommendations, setRecommendations] = useState<MealRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch');
  const [dietaryPref, setDietaryPref] = useState<DietaryPreference>(profile.dietaryPreference || 'mediterranean');
  const [prepTimePref, setPrepTimePref] = useState<PrepTimePreference>(profile.prepTimePreference || 'moderate');
  const [budgetPref, setBudgetPref] = useState<BudgetPreference>(profile.budgetPreference || 'medium');
  const [currentSeason, setCurrentSeason] = useState<Season>('spring');
  const [isGenerating, setIsGenerating] = useState(false);
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);

  const seasonalFoods: Record<Season, string[]> = {
    spring: ['Espárragos trigueros', 'Fresas', 'Guisantes frescos', 'Alcachofas', 'Caballa'],
    summer: ['Tomates de huerta', 'Calabacín', 'Sandía', 'Melocotón', 'Sardinas', 'Pimientos'],
    autumn: ['Calabaza', 'Setas / Champiñones', 'Granada', 'Boniatos', 'Uvas'],
    winter: ['Naranjas', 'Brócoli', 'Coliflor', 'Puerros', 'Espinacas de invierno'],
  };

  const handleGenerateAiRecommendation = async () => {
    setIsGenerating(true);
    try {
      const targetCals = Math.max(300, remainingCalories > 0 ? remainingCalories : 550);

      const response = await fetch('/api/generate-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remainingCalories: targetCals,
          dietaryPreference: dietaryPref,
          restrictions: profile.dietaryRestrictions || [],
          prepTimePreference: prepTimePref,
          budgetPreference: budgetPref,
          season: currentSeason,
          mealType: selectedMealType,
        }),
      });

      if (!response.ok) {
        throw new Error('Error generando recomendación');
      }

      const newRec: MealRecommendation = await response.json();
      setRecommendations((prev) => [newRec, ...prev]);
      setExpandedRecId(newRec.id);
    } catch (err) {
      console.error('Error generating meal plan:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAdd = (rec: MealRecommendation) => {
    onAddRecommendationToMeal(rec);
    setAddedIds((prev) => [...prev, rec.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== rec.id));
    }, 2500);
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Top Banner: Smart Meal Planner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-neutral-950 flex items-center justify-center font-bold shadow-md">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display text-white">
                Sugerencias & Menús Inteligentes
              </h1>
              <p className="text-xs text-neutral-400">
                Ajustado a tus calorías, restricciones y temporada
              </p>
            </div>
          </div>

          <div className="bg-neutral-800/80 px-3 py-1.5 rounded-xl border border-neutral-700/60 text-right">
            <span className="text-[10px] text-neutral-400 block">Presupuesto Restante</span>
            <span className="text-xs font-bold text-emerald-400">
              {remainingCalories > 0 ? `${remainingCalories} kcal` : '0 kcal (cubierto)'}
            </span>
          </div>
        </div>

        {/* Filter Controls Accordion */}
        <div className="bg-neutral-850 border border-neutral-750 rounded-2xl p-4 space-y-3.5 mt-3">
          {/* Meal Type selector */}
          <div>
            <span className="text-xs font-semibold text-neutral-300 block mb-1.5">
              Tipo de Comida a Planificar:
            </span>
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedMealType(type)}
                  className={`py-1.5 rounded-xl font-medium capitalize transition-colors cursor-pointer ${
                    selectedMealType === type
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {type === 'breakfast'
                    ? 'Desayuno'
                    : type === 'lunch'
                    ? 'Almuerzo'
                    : type === 'dinner'
                    ? 'Cena'
                    : 'Snack'}
                </button>
              ))}
            </div>
          </div>

          {/* Diet Preference Chips */}
          <div>
            <span className="text-xs font-semibold text-neutral-300 block mb-1.5">
              Preferencia Dietética:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {(
                [
                  { id: 'omnivore', label: 'Omnívora' },
                  { id: 'mediterranean', label: 'Mediterránea' },
                  { id: 'vegetarian', label: 'Vegetariana' },
                  { id: 'vegan', label: 'Vegana' },
                  { id: 'keto', label: 'Keto / Cetogénica' },
                  { id: 'low_carb', label: 'Baja en Carbos' },
                ] as { id: DietaryPreference; label: string }[]
              ).map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDietaryPref(d.id)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    dietaryPref === d.id
                      ? 'bg-teal-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time, Budget, and Season row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
            {/* Time */}
            <div>
              <span className="text-[11px] text-neutral-400 block mb-1">Tiempo de Cocina:</span>
              <select
                value={prepTimePref}
                onChange={(e) => setPrepTimePref(e.target.value as PrepTimePreference)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="express">Express (&lt;15 min)</option>
                <option value="moderate">Estándar (20-35 min)</option>
                <option value="elaborate">Elaborado (45+ min)</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <span className="text-[11px] text-neutral-400 block mb-1">Presupuesto:</span>
              <select
                value={budgetPref}
                onChange={(e) => setBudgetPref(e.target.value as BudgetPreference)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="low">Económico (€)</option>
                <option value="medium">Moderado (€€)</option>
                <option value="high">Gourmet (€€€)</option>
              </select>
            </div>

            {/* Season */}
            <div>
              <span className="text-[11px] text-neutral-400 block mb-1">Temporada:</span>
              <select
                value={currentSeason}
                onChange={(e) => setCurrentSeason(e.target.value as Season)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="spring">Primavera 🌱</option>
                <option value="summer">Verano ☀️</option>
                <option value="autumn">Otoño 🍂</option>
                <option value="winter">Invierno ❄️</option>
              </select>
            </div>
          </div>

          {/* Seasonal items spotlight */}
          <div className="bg-neutral-900/60 p-2.5 rounded-xl text-[11px] text-neutral-400 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Ingredientes de temporada activos:</strong>{' '}
              {seasonalFoods[currentSeason].join(', ')}.
            </span>
          </div>

          {/* Trigger Generate Button */}
          <button
            id="btn-generate-rec"
            onClick={handleGenerateAiRecommendation}
            disabled={isGenerating}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Chef IA calculando menú personalizado...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generar Nueva Propuesta con Gemini IA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Suggested Recipes List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold font-display uppercase tracking-wider text-neutral-400">
            Platos Sugeridos ({recommendations.length})
          </h2>
          <span className="text-[11px] text-emerald-400 font-semibold">
            Calorías cuadradas al objetivo
          </span>
        </div>

        {recommendations.map((rec) => {
          const isAdded = addedIds.includes(rec.id);
          const isExpanded = expandedRecId === rec.id;

          return (
            <div
              key={rec.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 transition-all hover:border-neutral-700/80 space-y-3"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">{rec.title}</span>
                    <span className="text-[10px] bg-neutral-800 text-teal-300 px-2 py-0.5 rounded-full capitalize font-medium">
                      {rec.mealType === 'breakfast'
                        ? 'Desayuno'
                        : rec.mealType === 'lunch'
                        ? 'Almuerzo'
                        : rec.mealType === 'dinner'
                        ? 'Cena'
                        : 'Snack'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">{rec.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-emerald-400">{rec.calories}</span>
                  <span className="text-[10px] text-neutral-500 block">kcal</span>
                </div>
              </div>

              {/* Badges: Time, Budget, Macros */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-800/80">
                <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    {rec.prepTimeMinutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-neutral-500" />
                    {rec.budgetCategory === 'low'
                      ? 'Económico'
                      : rec.budgetCategory === 'medium'
                      ? 'Medio'
                      : 'Gourmet'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-blue-400 font-medium">P: {rec.proteinG}g</span>
                  <span className="text-amber-400 font-medium">C: {rec.carbsG}g</span>
                  <span className="text-rose-400 font-medium">G: {rec.fatsG}g</span>
                </div>
              </div>

              {/* Expandable Recipe Details */}
              {isExpanded && (
                <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 space-y-2.5 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-400 block mb-1">Ingredientes:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-neutral-300 text-[11px]">
                      {rec.ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-emerald-400 block mb-1">Preparación:</span>
                    <ol className="list-decimal list-inside space-y-1 text-neutral-300 text-[11px]">
                      {rec.cookingInstructions.map((step, i) => (
                        <li key={i} className="leading-tight">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* Action Buttons: Toggle details + Add to Diary */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setExpandedRecId(isExpanded ? null : rec.id)}
                  className="flex-1 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {isExpanded ? 'Ocultar Receta' : 'Ver Ingredientes y Pasos'}
                </button>

                <button
                  onClick={() => handleAdd(rec)}
                  disabled={isAdded}
                  className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-950/40'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>¡Añadido!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Añadir al Diario</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
