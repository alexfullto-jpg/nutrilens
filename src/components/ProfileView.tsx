import React, { useState } from 'react';
import {
  User,
  Calculator,
  Target,
  Activity,
  Flame,
  Scale,
  ShieldCheck,
  Check,
  Info,
  Layers,
  ChevronDown,
} from 'lucide-react';
import {
  ActivityLevel,
  CalculationFormula,
  CalorieGoal,
  DietaryPreference,
  DietaryRestriction,
  Gender,
  UserProfile,
} from '../types';
import { calculateRequirements } from '../utils/calculator';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
  onOpenArchitecture: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onOpenArchitecture,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Dynamic live calculations as user changes inputs
  const liveRequirements = calculateRequirements(formData);

  // BMI calculation
  const heightM = formData.heightCm / 100;
  const bmi = Number((formData.weightKg / (heightM * heightM)).toFixed(1));
  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: 'Bajo peso', color: 'text-amber-400' };
    if (val < 25) return { label: 'Normopeso (Saludable)', color: 'text-emerald-400' };
    if (val < 30) return { label: 'Sobrepeso ligero', color: 'text-amber-400' };
    return { label: 'Obesidad', color: 'text-rose-400' };
  };
  const bmiCat = getBmiCategory(bmi);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const toggleRestriction = (res: DietaryRestriction) => {
    setFormData((prev) => {
      const exists = prev.dietaryRestrictions.includes(res);
      const updated = exists
        ? prev.dietaryRestrictions.filter((r) => r !== res)
        : [...prev.dietaryRestrictions, res];
      return { ...prev, dietaryRestrictions: updated };
    });
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display text-white">
                Perfil Biométrico & Metas
              </h1>
              <p className="text-xs text-neutral-400">
                Algoritmos clínicos de requerimiento calórico personalizado
              </p>
            </div>
          </div>

          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-teal-300 text-xs px-2.5 py-1.5 rounded-xl border border-neutral-700 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">Docs Técnicos</span>
          </button>
        </div>

        {/* Live Metabolic Engine Summary Card */}
        <div className="bg-neutral-850 border border-neutral-750 rounded-2xl p-4 my-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Fórmula Activa:{' '}
                <span className="text-emerald-400">
                  {formData.formula === 'mifflin_st_jeor' ? 'Mifflin-St Jeor' : 'Harris-Benedict'}
                </span>
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 font-medium">
              IMC: <strong className={bmiCat.color}>{bmi}</strong> ({bmiCat.label})
            </span>
          </div>

          {/* Mathematical Step-by-Step Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block font-medium">1. Tasa Basal (TMB)</span>
              <span className="text-base font-bold text-white">{liveRequirements.bmr}</span>
              <span className="text-[9px] text-neutral-500 block">kcal en reposo</span>
            </div>

            <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block font-medium">2. Gasto Total (TDEE)</span>
              <span className="text-base font-bold text-neutral-200">{liveRequirements.tdee}</span>
              <span className="text-[9px] text-neutral-500 block">con actividad física</span>
            </div>

            <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40">
              <span className="text-[10px] text-emerald-400 block font-semibold">3. Meta Calórica</span>
              <span className="text-base font-black text-emerald-400 font-display">
                {liveRequirements.targetCalories}
              </span>
              <span className="text-[9px] text-emerald-500 block font-medium">
                {liveRequirements.deficitOrSurplus >= 0
                  ? `+${liveRequirements.deficitOrSurplus}`
                  : liveRequirements.deficitOrSurplus}{' '}
                kcal/día
              </span>
            </div>
          </div>

          {/* Macro Split Preview */}
          <div className="bg-neutral-900/60 p-2.5 rounded-xl text-xs flex justify-around text-center border border-neutral-800">
            <div>
              <span className="text-blue-400 font-bold block">{liveRequirements.macroSplit.proteinGrams}g</span>
              <span className="text-[10px] text-neutral-400">Proteína (2.0g/kg)</span>
            </div>
            <div>
              <span className="text-amber-400 font-bold block">{liveRequirements.macroSplit.carbsGrams}g</span>
              <span className="text-[10px] text-neutral-400">Carbohidratos</span>
            </div>
            <div>
              <span className="text-rose-400 font-bold block">{liveRequirements.macroSplit.fatsGrams}g</span>
              <span className="text-[10px] text-neutral-400">Grasas saludables</span>
            </div>
          </div>
        </div>

        {/* Form: Biometrics & Goals */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* User Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Sexo Biológico</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: 'male' })}
                  className={`py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    formData.gender === 'male'
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-400'
                  }`}
                >
                  Hombre
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: 'female' })}
                  className={`py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    formData.gender === 'female'
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-400'
                  }`}
                >
                  Mujer
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Edad (años)</label>
              <input
                type="number"
                min="14"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) || 25 })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Weight & Height */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Peso Actual (kg)</label>
              <input
                type="number"
                step="0.5"
                min="35"
                max="250"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) || 70 })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Altura (cm)</label>
              <input
                type="number"
                min="100"
                max="230"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) || 170 })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Formula Selector: Mifflin-St Jeor vs Harris-Benedict (Prompt requirement) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Fórmula de Cálculo Metabólico:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, formula: 'mifflin_st_jeor' })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  formData.formula === 'mifflin_st_jeor'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <span className="font-bold text-xs block text-white">Mifflin-St Jeor</span>
                <span className="text-[10px] text-neutral-400 leading-tight block mt-0.5">
                  Estándar clínico moderno (mayor precisión en población general).
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, formula: 'harris_benedict' })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  formData.formula === 'harris_benedict'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <span className="font-bold text-xs block text-white">Harris-Benedict (Rev.)</span>
                <span className="text-[10px] text-neutral-400 leading-tight block mt-0.5">
                  Ecuación clásica revisada por Roza & Shizgal (1984).
                </span>
              </button>
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Nivel de Actividad Física Habitual:
            </label>
            <select
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="sedentary">Sedentario (Trabajo de oficina, poco o nada de ejercicio) [x1.2]</option>
              <option value="light">Ligero (Ejercicio 1 a 3 veces por semana) [x1.375]</option>
              <option value="moderate">Moderado (Entrenamiento 3 a 5 días por semana) [x1.55]</option>
              <option value="very_active">Muy Activo (Ejercicio intenso 6 a 7 días) [x1.725]</option>
              <option value="athlete">Atleta / Trabajo Físico Pesado (Doble sesión o albañilería) [x1.9]</option>
            </select>
          </div>

          {/* Goal Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Objetivo Nutricional:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, goal: 'lose_fat_moderate' })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  formData.goal === 'lose_fat_moderate'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="font-bold text-white block">Perder Grasa (Sostenible)</span>
                <span className="text-[10px] text-neutral-400">-400 kcal/día (~0.4 kg/semana)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, goal: 'lose_fat_aggressive' })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  formData.goal === 'lose_fat_aggressive'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="font-bold text-white block">Perder Grasa (Deficit Alto)</span>
                <span className="text-[10px] text-neutral-400">-600 kcal/día (~0.6-0.8 kg/semana)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, goal: 'maintain' })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  formData.goal === 'maintain'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="font-bold text-white block">Mantener Peso (Normocalórica)</span>
                <span className="text-[10px] text-neutral-400">Equilibrio metabólico (0 kcal)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, goal: 'gain_muscle_clean' })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  formData.goal === 'gain_muscle_clean'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="font-bold text-white block">Ganar Masa Muscular (Limpio)</span>
                <span className="text-[10px] text-neutral-400">+250 kcal/día (mínima grasa)</span>
              </button>
            </div>
          </div>

          {/* Allergens & Dietary Restrictions */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Restricciones Alimentarias & Alergias:
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {(
                [
                  { id: 'gluten_free', label: 'Sin Gluten (Celíaco)' },
                  { id: 'lactose_free', label: 'Sin Lactosa' },
                  { id: 'nut_free', label: 'Sin Frutos Secos' },
                  { id: 'shellfish_free', label: 'Sin Mariscos' },
                  { id: 'fructose_free', label: 'Bajo en FODMAP' },
                ] as { id: DietaryRestriction; label: string }[]
              ).map((r) => {
                const isSelected = formData.dietaryRestrictions.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggleRestriction(r.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-neutral-950 shadow-md'
                        : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              id="btn-save-profile"
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>¡Requerimientos Actualizados!</span>
                </>
              ) : (
                <span>Guardar y Recalcular Metas Diarias</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
