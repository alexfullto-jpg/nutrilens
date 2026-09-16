import React from 'react';
import { Smartphone, Monitor, Sparkles, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import { GoogleSheetsSyncStatus } from '../types';

interface HeaderProps {
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  onOpenArchitecture: () => void;
  sheetsStatus: GoogleSheetsSyncStatus;
  selectedDate: string;
  onDateChange: (delta: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileFrame,
  onToggleFrame,
  onOpenArchitecture,
  sheetsStatus,
  selectedDate,
  onDateChange,
}) => {
  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const isToday = selectedDate === new Date().toISOString().slice(0, 10);

  return (
    <header className="bg-neutral-900 border-b border-neutral-800 text-white px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-sm">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-950/40 text-white">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-base tracking-tight text-white">NutriLens</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
              AI Vision
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 font-medium">Control Calórico & Macronutrientes</p>
        </div>
      </div>

      {/* Date Switcher */}
      <div className="hidden sm:flex items-center gap-1 bg-neutral-800/80 px-2 py-1 rounded-xl border border-neutral-700/60 text-xs">
        <button
          onClick={() => onDateChange(-1)}
          className="p-1 hover:text-emerald-400 transition-colors text-neutral-400"
          title="Día anterior"
        >
          ‹
        </button>
        <span className="font-semibold px-1.5 text-neutral-200">
          {isToday ? `Hoy (${formattedDate})` : formattedDate}
        </span>
        <button
          onClick={() => onDateChange(1)}
          className="p-1 hover:text-emerald-400 transition-colors text-neutral-400"
          title="Día siguiente"
        >
          ›
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Google Sheets Sync Badge */}
        {sheetsStatus.spreadsheetUrl ? (
          <a
            href={sheetsStatus.spreadsheetUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-emerald-950/60 text-emerald-300 text-xs px-2.5 py-1.5 rounded-lg border border-emerald-700/50 hover:bg-emerald-900/60 transition-colors"
            title="Abrir hoja de cálculo de Google Sheets"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline font-medium">Sheets Conectado</span>
          </a>
        ) : (
          <span className="flex items-center gap-1 bg-neutral-800 text-neutral-400 text-xs px-2 py-1.5 rounded-lg border border-neutral-700/60">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline text-[11px]">Google Sheets Listo</span>
          </span>
        )}

        {/* Architecture & MVP Roadmap Button */}
        <button
          id="btn-open-architecture"
          onClick={onOpenArchitecture}
          className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs px-2.5 py-1.5 rounded-lg border border-neutral-700 font-medium transition-colors cursor-pointer"
          title="Ver Arquitectura Técnica, MVP y Privacidad de Salud"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden sm:inline">Arquitectura & MVP</span>
        </button>

        {/* Mobile Device Frame Toggle */}
        <button
          id="btn-toggle-frame"
          onClick={onToggleFrame}
          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 transition-colors cursor-pointer"
          title={isMobileFrame ? 'Cambiar a vista de pantalla completa' : 'Ver en simulador de smartphone'}
        >
          {isMobileFrame ? <Monitor className="w-4 h-4 text-emerald-400" /> : <Smartphone className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>
    </header>
  );
};
