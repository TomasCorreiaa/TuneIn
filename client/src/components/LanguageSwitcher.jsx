import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import Flag from './FlagIcons';

const languages = [
  { code: 'en-US', label: 'EN' },
  { code: 'pt-PT', label: 'PT' },
  { code: 'es-ES', label: 'ES' },
  { code: 'fr-FR', label: 'FR' }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('tunein_language', code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className="relative h-full flex items-center" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 sm:py-2.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none h-full"
      >
        <Globe size={16} className="text-theme-secondary" />
        <span className="text-sm text-theme-text font-bold flex items-center gap-1.5">
          <Flag code={currentLang.code} className="w-4.5 h-3.5" />
          <span>{currentLang.label}</span>
        </span>
        <ChevronDown size={14} className="text-theme-secondary" />
      </button>

      {isOpen && (
        <div data-testid="language-dropdown" className="absolute right-0 mt-2 w-32 bg-surface border border-theme-border rounded-lg shadow-xl overflow-hidden z-[100]">
          {languages.map(lang => (
            <button
              key={lang.code}
              data-testid={`lang-option-${lang.code}`}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center space-x-2.5
                ${i18n.language === lang.code ? 'bg-accent-pink/20 text-accent-pink font-bold' : 'text-theme-secondary hover:bg-black/5 dark:hover:bg-gray-800 hover:text-theme-text'}
              `}
            >
              <Flag code={lang.code} className="w-5 h-3.5" />
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
