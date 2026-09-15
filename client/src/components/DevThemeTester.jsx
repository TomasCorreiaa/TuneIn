import React, { useState } from 'react';
import { applySeasonalTheme, getActiveSeasonalTheme } from '../utils/seasonalTheme';
import { Wrench, X, Sparkles } from 'lucide-react';

const themes = [
  { id: 'auto', label: '⚡ Auto (Data Real)', icon: '📅' },
  { id: 'halloween', label: 'Halloween', icon: '🎃' },
  { id: 'christmas', label: 'Natal', icon: '🎄' },
  { id: 'newyear', label: 'Ano Novo', icon: '🥂' },
  { id: 'easter', label: 'Páscoa', icon: '🐣' },
  { id: 'spring', label: 'Primavera', icon: '🌸' },
  { id: 'summer', label: 'Verão', icon: '☀️' },
  { id: 'autumn', label: 'Outono', icon: '🍂' },
  { id: 'winter', label: 'Inverno', icon: '❄️' },
  { id: 'default', label: 'Padrão TuneIn', icon: '🎵' },
];

export default function DevThemeTester() {
  const isDev = Boolean(
    import.meta.env.DEV || 
    (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  );

  const [isOpen, setIsOpen] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tunein_dev_seasonal_theme') || 'auto';
    }
    return 'auto';
  });

  if (!isDev) {
    return null;
  }

  const handleSelectTheme = (themeId) => {
    setCurrentSelection(themeId);
    if (themeId === 'auto') {
      localStorage.removeItem('tunein_dev_seasonal_theme');
      const active = getActiveSeasonalTheme();
      applySeasonalTheme(active);
      window.dispatchEvent(new CustomEvent('seasonalThemeChange', { detail: active }));
    } else {
      localStorage.setItem('tunein_dev_seasonal_theme', themeId);
      applySeasonalTheme(themeId);
      window.dispatchEvent(new CustomEvent('seasonalThemeChange', { detail: themeId }));
    }
  };

  return (
    <div className="fixed bottom-3 left-3 z-[9999] font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          type="button"
          className="flex items-center gap-1.5 bg-neutral-900/90 hover:bg-neutral-900 text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-full border border-amber-500/40 shadow-xl text-xs font-bold transition-all backdrop-blur-md"
          title="Ferramenta de Teste de Temas Sazonais (Apenas Localhost)"
        >
          <Wrench size={14} className="animate-spin-slow" />
          <span>Testar Temas (Dev)</span>
        </button>
      ) : (
        <div className="bg-neutral-900/95 border border-neutral-700 shadow-2xl rounded-2xl p-3 w-64 backdrop-blur-xl text-white animate-fade-in">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Sparkles size={14} />
              <span>Simulador de Temas (Dev)</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Fechar"
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-[10px] text-neutral-400 mb-2 leading-tight">
            Ativa e testa qualquer tema sazonal instantaneamente. Visível apenas em <code className="text-amber-300">localhost</code>.
          </p>

          <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-0.5">
            {themes.map((t) => {
              const isSelected = currentSelection === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTheme(t.id)}
                  type="button"
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-left transition-all truncate ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                      : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border border-transparent hover:border-neutral-700'
                  }`}
                >
                  <span className="text-sm leading-none flex-shrink-0">{t.icon}</span>
                  <span className="truncate text-[11px]">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
