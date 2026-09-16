import React from 'react';
import { Home, Camera, Sparkles, LineChart, User } from 'lucide-react';

export type TabType = 'dashboard' | 'camera' | 'recommendations' | 'progress' | 'profile';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingCameraCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Hoy',
      icon: Home,
    },
    {
      id: 'camera' as TabType,
      label: 'Cámara IA',
      icon: Camera,
      highlight: true,
    },
    {
      id: 'recommendations' as TabType,
      label: 'Sugerencias',
      icon: Sparkles,
    },
    {
      id: 'progress' as TabType,
      label: 'Progreso',
      icon: LineChart,
    },
    {
      id: 'profile' as TabType,
      label: 'Perfil',
      icon: User,
    },
  ];

  return (
    <nav className="bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 text-neutral-400 px-2 py-1.5 sticky bottom-0 z-30 flex items-center justify-around shadow-2xl">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        if (tab.highlight) {
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center -mt-5 focus:outline-none group relative cursor-pointer"
            >
              <div
                className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isActive
                    ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-neutral-950 scale-105 shadow-emerald-500/40 ring-4 ring-neutral-900'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-neutral-700 shadow-black/50 group-hover:scale-105'
                }`}
              >
                <Icon className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span
                className={`text-[10px] font-semibold mt-1 transition-colors ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-neutral-400 group-hover:text-neutral-300'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            id={`tab-btn-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive
                ? 'text-emerald-400'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full" />
              )}
            </div>
            <span className={`text-[11px] mt-1 font-medium ${isActive ? 'font-semibold text-emerald-400' : ''}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
