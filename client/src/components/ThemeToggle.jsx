import React, { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { 
  getAvailableSeasonalTheme, 
  isSeasonalThemeDisabled, 
  setSeasonalThemeDisabled 
} from '../utils/seasonalTheme';

export default function ThemeToggle() {
  const { t } = useTranslation();
  const [isLight, setIsLight] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('light') ||
        localStorage.getItem('tunein_theme') === 'light';
    }
    return false;
  });

  const [availableTheme, setAvailableTheme] = useState(() => getAvailableSeasonalTheme());
  const [isSeasonalDisabled, setIsSeasonalDisabled] = useState(() => isSeasonalThemeDisabled());

  useEffect(() => {
    const handleThemeChange = () => {
      setAvailableTheme(getAvailableSeasonalTheme());
      setIsSeasonalDisabled(isSeasonalThemeDisabled());
    };

    window.addEventListener('seasonalThemeChange', handleThemeChange);
    return () => window.removeEventListener('seasonalThemeChange', handleThemeChange);
  }, []);

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('light');
      localStorage.setItem('tunein_theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('tunein_theme', 'dark');
    }
  }, [isLight]);

  const toggleTheme = () => {
    setIsLight(prev => !prev);
  };

  const toggleSeasonal = () => {
    const nextDisabled = !isSeasonalDisabled;
    setIsSeasonalDisabled(nextDisabled);
    setSeasonalThemeDisabled(nextDisabled);
  };

  return (
    <>
      {/* Botão de Modo Claro / Escuro */}
      <button
        onClick={toggleTheme}
        type="button"
        data-testid="theme-toggle-btn"
        className="flex items-center justify-center p-2 sm:p-2.5 transition-colors text-theme-secondary hover:text-accent-pink hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none"
        title={isLight ? t('theme_dark') : t('theme_light')}
        aria-label={t('toggle_theme')}
      >
        {isLight ? (
          <Moon size={18} className="text-accent-purple transition-transform duration-200 hover:rotate-12" />
        ) : (
          <Sun size={18} className="text-yellow-400 transition-transform duration-200 hover:rotate-45" />
        )}
      </button>

      {/* Botão ao lado para desativar/ativar tema personalizado se disponível */}
      {availableTheme !== 'default' && (
        <button
          onClick={toggleSeasonal}
          type="button"
          data-testid="toggle-seasonal-theme-btn"
          className="flex items-center justify-center p-2 sm:p-2.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none"
          title={isSeasonalDisabled ? t('enable_seasonal_theme') : t('disable_seasonal_theme')}
          aria-label={isSeasonalDisabled ? t('enable_seasonal_theme') : t('disable_seasonal_theme')}
        >
          <Sparkles
            size={18}
            className={`transition-all duration-200 ${
              !isSeasonalDisabled
                ? 'text-accent-orange hover:scale-110 drop-shadow-[0_0_6px_rgba(249,115,22,0.4)]'
                : 'text-theme-muted opacity-40 hover:opacity-75'
            }`}
          />
        </button>
      )}
    </>
  );
}
