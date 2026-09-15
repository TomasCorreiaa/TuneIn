import React, { useState, useEffect, useMemo } from 'react';
import { getActiveSeasonalTheme } from '../utils/seasonalTheme';
import { useTranslation } from 'react-i18next';

/**
 * Componente de Banner / Distintivo Comemorativo Sazonal do TuneIn.
 * Pode ser embutido diretamente nos cabeçalhos de Home e Room:
 * - Na Home: Posicionado no centro, logo acima do título TuneIn.
 * - Na Room: Posicionado na barra de topo entre o logo e os controlos.
 */
export default function SeasonalBanner({ forcedTheme, className = '' }) {
  const { t } = useTranslation();
  const [detectedTheme, setDetectedTheme] = useState(() => getActiveSeasonalTheme());

  useEffect(() => {
    if (forcedTheme) return;

    const handleThemeChange = (e) => {
      setDetectedTheme(e.detail || getActiveSeasonalTheme());
    };

    window.addEventListener('seasonalThemeChange', handleThemeChange);
    return () => window.removeEventListener('seasonalThemeChange', handleThemeChange);
  }, [forcedTheme]);

  const activeTheme = forcedTheme || detectedTheme;

  // Cálculo do ano dinâmico para o Ano Novo
  const targetYear = useMemo(() => {
    const now = new Date();
    return now.getMonth() === 11 && now.getDate() >= 25 ? now.getFullYear() + 1 : now.getFullYear();
  }, []);

  if (activeTheme === 'default' || !activeTheme) {
    return null;
  }

  return (
    <div
      data-testid="seasonal-banner"
      className={`inline-flex items-center gap-1.5 sm:gap-2 bg-surface/95 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-theme-border shadow-lg shadow-black/15 text-xs sm:text-sm font-bold text-theme-text transition-all select-none ${className}`}
    >
      {activeTheme === 'halloween' && (
        <>
          <span className="text-base sm:text-lg animate-bounce leading-none">🎃</span>
          <span className="bg-gradient-to-r from-orange-400 via-purple-400 to-green-400 bg-clip-text text-transparent font-extrabold tracking-wide">
            {t('greeting_halloween')}
          </span>
          <span className="text-sm sm:text-base leading-none">🦇</span>
        </>
      )}

      {activeTheme === 'christmas' && (
        <>
          <span className="text-base sm:text-lg leading-none">🎄</span>
          <span className="bg-gradient-to-r from-red-400 via-amber-300 to-green-400 bg-clip-text text-transparent font-extrabold tracking-wide">
            {t('greeting_christmas')}
          </span>
          <span className="text-sm sm:text-base leading-none">❄️</span>
        </>
      )}

      {activeTheme === 'newyear' && (
        <>
          <span className="text-base sm:text-lg leading-none animate-pulse">🥂</span>
          <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-purple-400 bg-clip-text text-transparent font-extrabold tracking-wide">
            {t('greeting_newyear', { year: targetYear })}
          </span>
          <span className="text-sm sm:text-base leading-none">✨</span>
        </>
      )}

      {activeTheme === 'easter' && (
        <>
          <span className="text-base sm:text-lg leading-none">🐣</span>
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent font-extrabold tracking-wide">
            {t('greeting_easter')}
          </span>
          <span className="text-sm sm:text-base leading-none">🌸</span>
        </>
      )}

      {activeTheme === 'spring' && (
        <>
          <span className="text-base sm:text-lg leading-none">🌸</span>
          <span className="bg-gradient-to-r from-pink-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent font-extrabold tracking-wide">
            {t('greeting_spring')}
          </span>
        </>
      )}

      {activeTheme === 'summer' && (
        <>
          <span className="text-base sm:text-lg leading-none">☀️</span>
          <span className="bg-gradient-to-r from-cyan-400 via-rose-400 to-yellow-400 bg-clip-text text-transparent font-extrabold tracking-wide">
            {t('greeting_summer')}
          </span>
        </>
      )}

      {activeTheme === 'autumn' && (
        <>
          <span className="text-base sm:text-lg leading-none">🍂</span>
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent font-extrabold tracking-wide">
            {t('greeting_autumn')}
          </span>
        </>
      )}

      {activeTheme === 'winter' && (
        <>
          <span className="text-base sm:text-lg leading-none">❄️</span>
          <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent font-extrabold tracking-wide">
            {t('greeting_winter')}
          </span>
        </>
      )}
    </div>
  );
}
