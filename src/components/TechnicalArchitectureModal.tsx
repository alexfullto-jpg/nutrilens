import React, { useState } from 'react';
import { X, Layers, Cpu, ShieldCheck, Database, Camera, Smartphone, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

interface TechnicalArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalArchitectureModal: React.FC<TechnicalArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<'mvp' | 'vision' | 'privacy' | 'tech_stack' | 'database'>('mvp');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Propuesta de Arquitectura & Blueprint de NutriLens
              </h2>
              <p className="text-xs text-neutral-400">
                Diseño de Sistema Móvil, Estrategia de IA, Privacidad y Roadmap MVP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-neutral-800 bg-neutral-900/60 px-4 py-2 gap-2 text-xs">
          <button
            onClick={() => setActiveSection('mvp')}
            className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSection === 'mvp'
                ? 'bg-emerald-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Roadmap MVP vs Futuro
          </button>
          <button
            onClick={() => setActiveSection('vision')}
            className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSection === 'vision'
                ? 'bg-emerald-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            IA Visual & Porciones
          </button>
          <button
            onClick={() => setActiveSection('tech_stack')}
            className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSection === 'tech_stack'
                ? 'bg-emerald-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Tecnologías & Nube vs Local
          </button>
          <button
            onClick={() => setActiveSection('privacy')}
            className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSection === 'privacy'
                ? 'bg-emerald-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Privacidad & Datos de Salud
          </button>
          <button
            onClick={() => setActiveSection('database')}
            className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSection === 'database'
                ? 'bg-emerald-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Base Nutricional & Mantenimiento
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed text-neutral-300">
          {activeSection === 'mvp' && (
            <div className="space-y-6">
              <div className="border border-emerald-500/20 bg-emerald-500/10 p-4 rounded-2xl">
                <h3 className="text-emerald-400 font-bold text-base mb-1">
                  Estrategia de Producto: De MVP a Ecosistema Nutricional Integral
                </h3>
                <p className="text-xs text-neutral-300">
                  Priorización basada en el menor rozamiento para el usuario al registrar comidas, garantizando adherencia real antes de añadir capas de complejidad.
                </p>
              </div>

              {/* MVP vs Fases */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-neutral-800/60 border border-neutral-700/60 p-4 rounded-2xl flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                      Fase 1: MVP (Implementado)
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-2">Funcionalidades Clave</h4>
                  <ul className="text-xs space-y-1.5 text-neutral-300 flex-1">
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Reconocimiento visual de comidas con IA multimodal (Gemini 2.5 Flash).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Cálculo metabólico con Mifflin-St Jeor y Harris-Benedict.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Detección de ingredientes ocultos (aceites de cocción, aderezos).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Recomendaciones de comidas personalizadas por dieta, tiempo y estación.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Sincronización directa y exportación a Google Sheets.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-neutral-800/60 border border-neutral-700/60 p-4 rounded-2xl flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-800/40">
                      Fase 2: Conectividad
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-2">Salud Conectada</h4>
                  <ul className="text-xs space-y-1.5 text-neutral-300 flex-1">
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                      <span>Integración con Apple HealthKit y Google Health Connect (sueño, pasos, gasto calórico activo).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                      <span>Escáner de código de barras nativo con cámara continua rápida.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                      <span>Sincronización con básculas inteligentes de bioimpedancia vía Bluetooth (BLE).</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-neutral-800/60 border border-neutral-700/60 p-4 rounded-2xl flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-800/40">
                      Fase 3: IA Predictiva
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-2">Biometría & Asesoría</h4>
                  <ul className="text-xs space-y-1.5 text-neutral-300 flex-1">
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                      <span>Compatibilidad con Monitores Continuos de Glucosa (CGM: Dexcom, Freestyle Libre).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                      <span>Estimación volumétrica 3D por profundidad LiDAR (iPhone Pro / sensores ToF).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                      <span>Portal para nutricionistas colegiados para seguimiento de pacientes.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'vision' && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                Ingeniería del Reconocimiento Visual de Alimentos
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-neutral-800/60 border border-neutral-700/60 p-4 rounded-2xl">
                  <h4 className="font-bold text-emerald-400 text-sm mb-2">1. Manejo de Porciones</h4>
                  <p className="text-xs text-neutral-300 mb-2">
                    <strong>Desafío:</strong> Las fotos 2D carecen de escala de profundidad absoluta.
                  </p>
                  <p className="text-xs text-neutral-300">
                    <strong>Solución NutriLens:</strong> El modelo calcula la relación de aspecto del plato estándar (24-27 cm diámetro) o cubiertos como referencia métrica. Además, se le ofrece al usuario un selector rápido de escala (0.75x pequeña, 1.0x estándar, 1.3x abundante) o ajuste en gramos con recálculo dinámico.
                  </p>
                </div>

                <div className="bg-neutral-800/60 border border-neutral-700/60 p-4 rounded-2xl">
                  <h4 className="font-bold text-amber-400 text-sm mb-2">2. Ingredientes Ocultos</h4>
                  <p className="text-xs text-neutral-300 mb-2">
                    <strong>Desafío:</strong> El 20-35% de calorías en platos cocinados proviene de aceites de salteado, mantequillas y azúcares en salsas.
                  </p>
                  <p className="text-xs text-neutral-300">
                    <strong>Solución NutriLens:</strong> Clasificador heurístico culinario. Si se detecta fritura o salteado a la plancha, el sistema deduce automáticamente 10-14g de lípidos de cocción (80-120 kcal) y permite al usuario activarlo/desactivarlo con un toggle transparente.
                  </p>
                </div>

                <div className="bg-neutral-800/60 border border-neutral-700/60 p-4 rounded-2xl">
                  <h4 className="font-bold text-teal-400 text-sm mb-2">3. Precisión & Calibración</h4>
                  <p className="text-xs text-neutral-300 mb-2">
                    <strong>Rango de Incertidumbre:</strong> Nunca mostramos una cifra rígida engañosa.
                  </p>
                  <p className="text-xs text-neutral-300">
                    Se muestra un rango de confianza (ej. 520 - 590 kcal, ±8%). El usuario puede editar cualquier ingrediente con un toque, y el modelo aprende sus preferencias habituales (few-shot context).
                  </p>
                </div>
              </div>

              <div className="bg-neutral-800/40 border border-neutral-700/60 p-4 rounded-2xl">
                <h4 className="font-bold text-white text-xs mb-2">Flujo de Inferencia de Imagen:</h4>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-neutral-700 px-2.5 py-1 rounded-lg">1. Captura / Compresión local en cliente</span>
                  <span>→</span>
                  <span className="bg-neutral-700 px-2.5 py-1 rounded-lg">2. Pre-segmentación Edge ML</span>
                  <span>→</span>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 px-2.5 py-1 rounded-lg">
                    3. Gemini Multimodal Cloud Vision
                  </span>
                  <span>→</span>
                  <span className="bg-neutral-700 px-2.5 py-1 rounded-lg">4. Extracción JSON estructurada</span>
                  <span>→</span>
                  <span className="bg-neutral-700 px-2.5 py-1 rounded-lg">5. Validación y edición por el usuario</span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'tech_stack' && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <Cpu className="w-5 h-5 text-teal-400" />
                Arquitectura Técnica Recomendada
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-800/60 border border-neutral-700/60 p-4 rounded-2xl">
                  <h4 className="font-bold text-white text-sm mb-2">Plataforma Móvil: React Native / Expo</h4>
                  <ul className="text-xs space-y-2 text-neutral-300">
                    <li>
                      <strong>Por qué React Native / Expo:</strong> Permite compartir el 90% de la lógica de TypeScript (cálculo de Harris-Benedict, Mifflin-St Jeor, estado nutricional) entre iOS, Android y versión Web PWA.
                    </li>
                    <li>
                      <strong>Acceso a Cámara:</strong> Uso de `expo-camera` y `react-native-vision-camera` con soporte para frame processors a 60 FPS en tiempo real.
                    </li>
                    <li>
                      <strong>Almacenamiento Local Offline:</strong> WatermelonDB o SQLite con cifrado SQLCipher para funcionamiento 100% sin conexión cuando el usuario viaja o come sin cobertura.
                    </li>
                  </ul>
                </div>

                <div className="bg-neutral-800/60 border border-neutral-700/60 p-4 rounded-2xl">
                  <h4 className="font-bold text-white text-sm mb-2">
                    Procesamiento de Imágenes: Enfoque Híbrido (Edge + Cloud)
                  </h4>
                  <ul className="text-xs space-y-2 text-neutral-300">
                    <li>
                      <strong>Edge (Local en el teléfono):</strong> Modelo ligero TensorFlow Lite / MediaPipe Food Detection para detectar presencia de comida y encuadre óptimo en el visor en menos de 50ms sin consumir batería.
                    </li>
                    <li>
                      <strong>Cloud (Servidor seguro Vertex AI / Gemini):</strong> El análisis fino de ingredientes, texturas, salsas y cálculo nutricional se delega al backend mediante llamadas HTTPS cifradas con TLS 1.3.
                    </li>
                    <li>
                      <strong>Latencia:</strong> &lt; 1.2 segundos por análisis completo, con compresión WebP en el dispositivo antes de transmitir.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                Estrategia de Privacidad y Datos de Salud (HIPAA / GDPR)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-neutral-800/60 border border-neutral-700/60 p-4 rounded-2xl">
                  <h4 className="font-bold text-emerald-400 text-sm mb-2">1. Cifrado Extremo a Extremo</h4>
                  <p className="text-xs text-neutral-300">
                    Todos los datos biométricos (peso, edad, altura, déficit calórico) se cifran en reposo con <strong>AES-256</strong> y en tránsito con <strong>TLS 1.3 con Perfect Forward Secrecy</strong>.
                  </p>
                </div>

                <div className="bg-neutral-800/60 border border-neutral-700/60 p-4 rounded-2xl">
                  <h4 className="font-bold text-teal-400 text-sm mb-2">2. Política de Retención Efímera de Fotos</h4>
                  <p className="text-xs text-neutral-300">
                    Las fotografías de comidas enviadas al backend de IA se procesan en memoria volátil y <strong>se destruyen inmediatamente tras generar los metadatos nutricionales</strong>, protegiendo la privacidad de los entornos personales del usuario.
                  </p>
                </div>

                <div className="bg-neutral-800/60 border border-neutral-700/60 p-4 rounded-2xl">
                  <h4 className="font-bold text-indigo-400 text-sm mb-2">3. Soberanía del Usuario & Google Sheets</h4>
                  <p className="text-xs text-neutral-300">
                    El usuario tiene control total sobre sus datos de salud. Puede exportarlos en cualquier momento a su propia hoja de cálculo en su Google Drive personal sin quedar atrapado en silos propietarios.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'database' && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                Estrategia de Alimentación y Actualización de la Base Nutricional
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-800/60 border border-neutral-700/60 p-4 rounded-2xl">
                  <h4 className="font-bold text-white text-sm mb-2">Fuentes Oficiales y Marcas</h4>
                  <ul className="text-xs space-y-2 text-neutral-300">
                    <li>
                      <strong>Alimentos Básicos:</strong> Sincronización semanal con <em>USDA FoodData Central</em> y la base de datos europea <em>CIQUAL / BEDCA</em> para materias primas no procesadas (frutas, verduras, carnes magras, pescados).
                    </li>
                    <li>
                      <strong>Productos Comerciales:</strong> Integración de la API de <em>Open Food Facts</em> (más de 3 millones de códigos de barras auditados con Nutri-Score y lista de alérgenos).
                    </li>
                  </ul>
                </div>

                <div className="bg-neutral-800/60 border border-neutral-700/60 p-4 rounded-2xl">
                  <h4 className="font-bold text-white text-sm mb-2">Platos de Restaurante & Crowdsourcing Auditado</h4>
                  <ul className="text-xs space-y-2 text-neutral-300">
                    <li>
                      <strong>Cartas de Restaurantes:</strong> Ingesta automatizada de valores nutricionales declarados legalmente por cadenas y restaurantes de comida rápida y casual.
                    </li>
                    <li>
                      <strong>Validación Comunitaria:</strong> Los usuarios pueden sugerir platos caseros o nuevos productos; un sistema de consenso con sello de validación por dietistas matriculados aprueba su inclusión en la base global.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-400">
          <span>Diseñado para arquitectura clínica y alta adherencia del usuario</span>
          <button
            onClick={onClose}
            className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Entendido, volver a la App
          </button>
        </div>
      </div>
    </div>
  );
};
