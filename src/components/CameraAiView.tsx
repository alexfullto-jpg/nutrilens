import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  Sliders,
  Flame,
  Info,
  Layers,
} from 'lucide-react';
import { FoodItem, HiddenIngredient, MealAnalysisResult, MealType } from '../types';

interface CameraAiViewProps {
  onSaveMeal: (
    title: string,
    mealType: MealType,
    calories: number,
    protein: number,
    carbs: number,
    fats: number,
    items: FoodItem[],
    imageUrl?: string
  ) => void;
}

// Sample dish presets for quick instant testing
const SAMPLE_DISHES = [
  {
    title: 'Pollo Dorado con Arroz y Ensalada',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Pechuga magra a la plancha con arroz integral y vegetales frescos',
  },
  {
    title: 'Bowl de Salmón, Aguacate y Quinoa',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    description: 'Salmón fresco sellado, brotes, quinoa y grasas saludables',
  },
  {
    title: 'Hamburguesa Gourmet con Queso',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    description: 'Ternera a la parrilla, cheddar derretido en pan brioche',
  },
  {
    title: 'Tazón de Avena con Frutas y Nueces',
    url: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80',
    description: 'Avena cocida con frutos rojos, plátano laminado y semillas',
  },
];

export const CameraAiView: React.FC<CameraAiViewProps> = ({ onSaveMeal }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgressText, setAnalysisProgressText] = useState('Iniciando análisis...');
  const [analysisResult, setAnalysisResult] = useState<MealAnalysisResult | null>(null);
  const [portionScale, setPortionScale] = useState<number>(1.0);
  const [targetMealType, setTargetMealType] = useState<MealType>('lunch');
  const [hiddenIngredientsState, setHiddenIngredientsState] = useState<HiddenIngredient[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera error or permission denied:', err);
      setCameraError('No se pudo acceder a la cámara. Puedes subir una foto o usar los platos de prueba.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      handleProcessImage(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        handleProcessImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessImage = async (base64OrUrl: string) => {
    setSelectedImage(base64OrUrl);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Progressive status updates to communicate real AI pipeline steps
    setAnalysisProgressText('Segmentando alimentos en el plato...');
    const t1 = setTimeout(() => setAnalysisProgressText('Estimando volumen y densidad calórica...'), 600);
    const t2 = setTimeout(() => setAnalysisProgressText('Detectando ingredientes ocultos y aceites de cocción...'), 1200);

    try {
      const response = await fetch('/api/analyze-plate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64OrUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al procesar la imagen con IA');
      }

      const data: MealAnalysisResult = await response.json();
      setAnalysisResult(data);
      setPortionScale(data.portionMultiplier || 1.0);
      setHiddenIngredientsState(data.hiddenIngredients || []);
    } catch (err: any) {
      console.error('Analysis error:', err);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsAnalyzing(false);
    }
  };

  // Toggle a hidden ingredient
  const handleToggleHiddenIngredient = (index: number) => {
    setHiddenIngredientsState((prev) =>
      prev.map((item, i) => (i === index ? { ...item, included: !item.included } : item))
    );
  };

  // Calculate dynamic totals based on portion scale & active hidden ingredients
  const getScaledNutrients = () => {
    if (!analysisResult) return { calories: 0, protein: 0, carbs: 0, fats: 0 };

    let baseCals = 0;
    let baseP = 0;
    let baseC = 0;
    let baseF = 0;

    analysisResult.items.forEach((item) => {
      baseCals += item.calories * portionScale;
      baseP += item.proteinG * portionScale;
      baseC += item.carbsG * portionScale;
      baseF += item.fatsG * portionScale;
    });

    // Add included hidden ingredients
    hiddenIngredientsState.forEach((hidden) => {
      if (hidden.included) {
        baseCals += hidden.calories;
        baseF += hidden.fatsG;
        baseC += hidden.carbsG;
      }
    });

    return {
      calories: Math.round(baseCals),
      protein: Math.round(baseP),
      carbs: Math.round(baseC),
      fats: Math.round(baseF),
    };
  };

  const scaled = getScaledNutrients();

  const handleSaveToDiary = () => {
    if (!analysisResult) return;

    const scaledItems: FoodItem[] = analysisResult.items.map((item) => ({
      ...item,
      portionGrams: Math.round(item.portionGrams * portionScale),
      calories: Math.round(item.calories * portionScale),
      proteinG: Number((item.proteinG * portionScale).toFixed(1)),
      carbsG: Number((item.carbsG * portionScale).toFixed(1)),
      fatsG: Number((item.fatsG * portionScale).toFixed(1)),
    }));

    onSaveMeal(
      analysisResult.dishTitle,
      targetMealType,
      scaled.calories,
      scaled.protein,
      scaled.carbs,
      scaled.fats,
      scaledItems,
      selectedImage || undefined
    );
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Title & Instructions */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-neutral-950 flex items-center justify-center font-bold shadow-md">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display text-white">
              Reconocimiento Visual de Comidas
            </h1>
            <p className="text-xs text-neutral-400">
              Gemini Vision Multimodal con detección de porciones e ingredientes ocultos
            </p>
          </div>
        </div>

        {/* Live Camera View or Photo Uploader */}
        {isCameraActive ? (
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-4/3 border-2 border-emerald-500 shadow-2xl my-3">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

            {/* Target viewfinder overlay */}
            <div className="absolute inset-8 border border-white/40 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
              <span className="text-[11px] text-white/80 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm self-start">
                Centra el plato dentro del marco
              </span>
              <div className="text-center text-[10px] text-white/70">
                La IA calculará la escala en base a las proporciones del plato
              </div>
            </div>

            {/* Camera Controls */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
              <button
                onClick={stopCamera}
                className="bg-neutral-800/90 text-white text-xs px-3 py-2 rounded-xl backdrop-blur-md cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={captureCameraPhoto}
                className="w-14 h-14 rounded-full bg-white ring-4 ring-emerald-500 flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500" />
              </button>
            </div>
          </div>
        ) : !selectedImage ? (
          <div className="space-y-4 my-2">
            {cameraError && (
              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Action buttons: Camera vs File Upload */}
            <div className="grid grid-cols-2 gap-3">
              <button
                id="btn-start-camera"
                onClick={startCamera}
                className="p-5 rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-850 hover:bg-neutral-750 border border-neutral-700/80 flex flex-col items-center justify-center gap-2 text-center group transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white">Abrir Cámara</span>
                <span className="text-[10px] text-neutral-400">Captura en tiempo real</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-5 rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-850 hover:bg-neutral-750 border border-neutral-700/80 flex flex-col items-center justify-center gap-2 text-center group transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white">Subir Foto</span>
                <span className="text-[10px] text-neutral-400">Galería de imágenes</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Quick Preset Samples */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-neutral-300 mb-2">
                O prueba con uno de estos platos de muestra:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_DISHES.map((dish, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleProcessImage(dish.url)}
                    className="p-2 rounded-xl bg-neutral-800/40 hover:bg-neutral-800 border border-neutral-800 text-left transition-all group overflow-hidden cursor-pointer"
                  >
                    <img
                      src={dish.url}
                      alt={dish.title}
                      className="w-full h-20 object-cover rounded-lg mb-1.5 group-hover:scale-105 transition-transform"
                    />
                    <p className="text-[11px] font-bold text-white truncate">{dish.title}</p>
                    <p className="text-[9px] text-neutral-400 truncate">{dish.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Selected Image & Scanning Animation State */}
        {selectedImage && isAnalyzing && (
          <div className="relative rounded-2xl overflow-hidden bg-neutral-950 my-3 aspect-4/3 flex items-center justify-center border border-neutral-800">
            <img
              src={selectedImage}
              alt="Plato a analizar"
              className="w-full h-full object-cover opacity-60"
            />
            {/* Animated Laser Scanning Line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-400/80 animate-bounce" />

            <div className="absolute bg-neutral-950/80 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-emerald-500/40 text-center space-y-2 shadow-2xl">
              <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
              <p className="text-xs font-bold text-white">{analysisProgressText}</p>
              <p className="text-[10px] text-neutral-400">NutriLens Vision Engine en ejecución</p>
            </div>
          </div>
        )}

        {/* Analysis Results View */}
        {selectedImage && analysisResult && !isAnalyzing && (
          <div className="space-y-4 my-3 pt-2">
            {/* Plate Preview with Retake button */}
            <div className="relative rounded-2xl overflow-hidden bg-neutral-950 aspect-video max-h-48 border border-neutral-800">
              <img
                src={selectedImage}
                alt="Plato analizado"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <span className="text-[10px] bg-emerald-950/90 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded-md font-semibold">
                    {analysisResult.aiModelUsed}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1 drop-shadow-md">
                    {analysisResult.dishTitle}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setAnalysisResult(null);
                  }}
                  className="bg-neutral-900/80 hover:bg-neutral-800 text-white text-xs px-2.5 py-1.5 rounded-xl border border-neutral-700 backdrop-blur-md flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Nueva Foto
                </button>
              </div>
            </div>

            {/* Main Calorie & Confidence Card */}
            <div className="bg-neutral-850 border border-neutral-750 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400">Calorías Totales Estimadas</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-400 font-display">
                      {scaled.calories}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">kcal</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-neutral-400 block">Rango de Incertidumbre</span>
                  <span className="text-xs font-bold text-neutral-300">
                    {Math.round(analysisResult.confidenceRange.min * portionScale)} -{' '}
                    {Math.round(analysisResult.confidenceRange.max * portionScale)} kcal
                  </span>
                  <span className="text-[10px] text-emerald-400 block font-medium">
                    Confianza: {analysisResult.overallConfidence === 'high' ? 'Alta (±6%)' : 'Moderada (±12%)'}
                  </span>
                </div>
              </div>

              {/* Dynamic Macro Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-750 text-center">
                <div className="bg-neutral-900/60 p-2 rounded-xl">
                  <span className="text-[10px] text-blue-400 font-semibold block">Proteínas</span>
                  <span className="text-sm font-bold text-white">{scaled.protein}g</span>
                </div>
                <div className="bg-neutral-900/60 p-2 rounded-xl">
                  <span className="text-[10px] text-amber-400 font-semibold block">Carbohidratos</span>
                  <span className="text-sm font-bold text-white">{scaled.carbs}g</span>
                </div>
                <div className="bg-neutral-900/60 p-2 rounded-xl">
                  <span className="text-[10px] text-rose-400 font-semibold block">Grasas</span>
                  <span className="text-sm font-bold text-white">{scaled.fats}g</span>
                </div>
              </div>
            </div>

            {/* Section 1: Porciones & Escala (Prompt requirement) */}
            <div className="bg-neutral-850 border border-neutral-750 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Ajuste de Porción Visual</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">
                  Factor: {portionScale}x
                </span>
              </div>

              <p className="text-[11px] text-neutral-400 leading-tight">
                Ajusta el multiplicador si consideras que la cantidad física en tu plato es menor o más abundante que la ración estándar:
              </p>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPortionScale(0.75)}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    portionScale === 0.75
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-750'
                  }`}
                >
                  Pequeña (0.75x)
                </button>
                <button
                  onClick={() => setPortionScale(1.0)}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    portionScale === 1.0
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-750'
                  }`}
                >
                  Estándar (1.0x)
                </button>
                <button
                  onClick={() => setPortionScale(1.3)}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    portionScale === 1.3
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-750'
                  }`}
                >
                  Abundante (1.3x)
                </button>
              </div>
            </div>

            {/* Section 2: Ingredientes Ocultos (Prompt requirement) */}
            <div className="bg-neutral-850 border border-neutral-750 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">
                    Ingredientes Ocultos Detectados por IA
                  </span>
                </div>
                <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800/40 px-2 py-0.5 rounded-full font-medium">
                  Aceites & Salsas
                </span>
              </div>

              <p className="text-[11px] text-neutral-400 leading-tight">
                El algoritmo analiza reflejos de calor, brillo y tipo de cocción para inferir grasas añadidas que no se ven a simple vista:
              </p>

              <div className="space-y-2">
                {hiddenIngredientsState.map((hidden, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      hidden.included
                        ? 'bg-amber-950/30 border-amber-800/60 text-neutral-200'
                        : 'bg-neutral-900/40 border-neutral-800 text-neutral-500'
                    }`}
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-white">{hidden.name}</span>
                        <span className="text-[11px] font-bold text-amber-400">
                          +{hidden.calories} kcal ({hidden.fatsG}g grasa)
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400">{hidden.detectedReason}</p>
                    </div>

                    <button
                      onClick={() => handleToggleHiddenIngredient(idx)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                        hidden.included
                          ? 'bg-amber-500 text-neutral-950'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {hidden.included ? 'Incluido' : 'Omitir'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Desglose de Alimentos Identificados */}
            <div className="bg-neutral-850 border border-neutral-750 rounded-2xl p-4 space-y-2.5">
              <span className="text-xs font-bold text-white block">
                Componentes Identificados en el Plato
              </span>

              <div className="divide-y divide-neutral-800">
                {analysisResult.items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white block">{item.name}</span>
                      <span className="text-[11px] text-neutral-400">
                        {Math.round(item.portionGrams * portionScale)}g • {item.portionDescription}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-400 text-xs">
                        {Math.round(item.calories * portionScale)} kcal
                      </span>
                      <div className="text-[10px] text-neutral-400">
                        P: {Math.round(item.proteinG * portionScale)}g | C:{' '}
                        {Math.round(item.carbsG * portionScale)}g | G:{' '}
                        {Math.round(item.fatsG * portionScale)}g
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Consejo Nutricional de la IA */}
            {analysisResult.nutritionalTips && (
              <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-800/40 text-xs flex items-start gap-2 text-teal-200">
                <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{analysisResult.nutritionalTips}</p>
              </div>
            )}

            {/* Target Meal Type Selector & Confirm Save */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Registrar esta comida como:
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setTargetMealType(type)}
                      className={`py-2 rounded-xl font-medium capitalize transition-colors cursor-pointer ${
                        targetMealType === type
                          ? 'bg-emerald-500 text-neutral-950 font-bold'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-750'
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

              <button
                id="btn-confirm-save-meal"
                onClick={handleSaveToDiary}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 stroke-[2.4]" />
                Guardar en mi Diario ({scaled.calories} kcal)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
