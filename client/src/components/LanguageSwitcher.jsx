import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en-US', label: 'EN', flag: '🇺🇸' },
  { code: 'pt-PT', label: 'PT', flag: '🇵🇹' },
  { code: 'es-ES', label: 'ES', flag: '🇪🇸' }
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
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-surface hover:bg-surface/80 px-3 py-2 rounded-lg border border-gray-700 transition-colors focus:outline-none focus:border-accent-pink"
      >
        <Globe size={16} className="text-gray-400" />
        <span className="text-sm text-white font-bold flex items-center gap-1">
          {currentLang.flag} {currentLang.label}
        </span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-surface border border-gray-700 rounded-lg shadow-xl overflow-hidden z-[100]">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center space-x-2
                ${i18n.language === lang.code ? 'bg-accent-pink/20 text-accent-pink' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
              `}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
