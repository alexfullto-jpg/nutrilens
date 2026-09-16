import React, { useState } from 'react';
import { X, Search, Plus, Barcode, Utensils, Sparkles, Check, Filter } from 'lucide-react';
import { FoodItem, MealType } from '../types';
import { NUTRITION_DATABASE } from '../data/nutritionDatabase';

interface FoodSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMealType: MealType;
  onAddFood: (food: FoodItem, mealType: MealType) => void;
}

export const FoodSearchModal: React.FC<FoodSearchModalProps> = ({
  isOpen,
  onClose,
  targetMealType,
  onAddFood,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'fresh' | 'restaurant' | 'homemade' | 'packaged'>('all');
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  // Custom food state
  const [customName, setCustomName] = useState('');
  const [customGrams, setCustomGrams] = useState('100');
  const [customCalories, setCustomCalories] = useState('150');
  const [customProtein, setCustomProtein] = useState('10');
  const [customCarbs, setCustomCarbs] = useState('15');
  const [customFats, setCustomFats] = useState('5');

  if (!isOpen) return null;

  const filteredFoods = NUTRITION_DATABASE.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (food.brand && food.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || food.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleBarcodeSimulate = (food: FoodItem) => {
    setIsScanningBarcode(false);
    onAddFood(food, targetMealType);
    onClose();
  };

  const handleSaveCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newFood: FoodItem = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      portionDescription: `${customGrams}g porción personalizada`,
      portionGrams: Number(customGrams) || 100,
      calories: Number(customCalories) || 0,
      proteinG: Number(customProtein) || 0,
      carbsG: Number(customCarbs) || 0,
      fatsG: Number(customFats) || 0,
      category: 'homemade',
      isCustom: true,
    };

    onAddFood(newFood, targetMealType);
    setIsCreatingCustom(false);
    onClose();
  };

  const getMealTypeLabel = (type: MealType) => {
    switch (type) {
      case 'breakfast':
        return 'Desayuno';
      case 'lunch':
        return 'Almuerzo / Comida';
      case 'dinner':
        return 'Cena';
      case 'snack':
        return 'Snack / Colación';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div>
            <h3 className="font-bold text-white text-base font-display">
              Añadir a {getMealTypeLabel(targetMealType)}
            </h3>
            <p className="text-xs text-neutral-400">
              Base de datos nutricional verificada (USDA, Open Food Facts)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barcode scanner simulator view */}
        {isScanningBarcode ? (
          <div className="p-5 space-y-4">
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 text-center space-y-3 relative overflow-hidden">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30 animate-pulse">
                <Barcode className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-white">Escáner de Código de Barras</p>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Selecciona uno de los productos comerciales con código EAN-13 registrado en la base de datos de Open Food Facts:
              </p>

              {/* Red laser line simulation */}
              <div className="w-48 h-0.5 bg-emerald-400/80 mx-auto shadow-sm shadow-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {NUTRITION_DATABASE.filter((f) => f.barcode).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleBarcodeSimulate(item)}
                  className="w-full text-left p-3 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-neutral-400">
                      {item.brand} • EAN: {item.barcode}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-400">{item.calories} kcal</span>
                    <p className="text-[10px] text-neutral-400">{item.portionDescription}</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsScanningBarcode(false)}
              className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cancelar Escáner
            </button>
          </div>
        ) : isCreatingCustom ? (
          /* Custom food form */
          <form onSubmit={handleSaveCustomFood} className="p-5 space-y-4">
            <h4 className="text-sm font-bold text-white">Crear Alimento Personalizado</h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Nombre del Alimento o Preparación</label>
                <input
                  type="text"
                  required
                  placeholder="ej: Batido casero de plátano y chía"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Gramos porción (g)</label>
                  <input
                    type="number"
                    value={customGrams}
                    onChange={(e) => setCustomGrams(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Calorías (kcal)</label>
                  <input
                    type="number"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Proteínas (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Carbos (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Grasas (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customFats}
                    onChange={(e) => setCustomFats(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingCustom(false)}
                className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Volver
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Guardar y Añadir
              </button>
            </div>
          </form>
        ) : (
          /* Normal Search & Database view */
          <>
            {/* Search Input & Action Badges */}
            <div className="p-4 border-b border-neutral-800 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar pollo, yogur, salmón, ensalada, avena..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    categoryFilter === 'all'
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  Todos ({NUTRITION_DATABASE.length})
                </button>
                <button
                  onClick={() => setCategoryFilter('fresh')}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    categoryFilter === 'fresh'
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  Frescos
                </button>
                <button
                  onClick={() => setCategoryFilter('homemade')}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    categoryFilter === 'homemade'
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  Caseros
                </button>
                <button
                  onClick={() => setCategoryFilter('restaurant')}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    categoryFilter === 'restaurant'
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  Restaurante
                </button>
                <button
                  onClick={() => setCategoryFilter('packaged')}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    categoryFilter === 'packaged'
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  Empacados
                </button>
              </div>

              {/* Quick actions: Barcode / Custom */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsScanningBarcode(true)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700/60 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Barcode className="w-3.5 h-3.5" />
                  Escanear Código
                </button>
                <button
                  onClick={() => setIsCreatingCustom(true)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700/60 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  Alimento Propio
                </button>
              </div>
            </div>

            {/* List of items */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1 max-h-96">
              {filteredFoods.length === 0 ? (
                <div className="py-8 text-center text-neutral-500 text-xs">
                  No se encontraron alimentos para &quot;{searchTerm}&quot;. Puedes crearlo con el botón &quot;Alimento Propio&quot;.
                </div>
              ) : (
                filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    className="p-3 rounded-2xl bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-between transition-all group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          {food.name}
                        </span>
                        {food.category === 'restaurant' && (
                          <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/40 px-1.5 py-0.2 rounded">
                            Restaurante
                          </span>
                        )}
                        {food.category === 'packaged' && (
                          <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/40 px-1.5 py-0.2 rounded">
                            Comercial
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400">{food.portionDescription}</p>
                      <div className="flex items-center gap-3 text-[11px] text-neutral-400 pt-0.5">
                        <span className="text-blue-400">P: {food.proteinG}g</span>
                        <span className="text-amber-400">C: {food.carbsG}g</span>
                        <span className="text-rose-400">G: {food.fatsG}g</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-bold text-emerald-400">{food.calories}</span>
                        <span className="text-[10px] text-neutral-500 block">kcal</span>
                      </div>
                      <button
                        onClick={() => {
                          onAddFood(food, targetMealType);
                          onClose();
                        }}
                        className="w-8 h-8 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-neutral-950 flex items-center justify-center transition-all cursor-pointer"
                        title="Añadir alimento"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
