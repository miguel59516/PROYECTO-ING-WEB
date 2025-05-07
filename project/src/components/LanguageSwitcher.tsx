import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
      className="flex items-center gap-2 px-3 py-1 rounded-lg border border-secondary/20 hover:bg-background transition-colors"
    >
      <span className="text-sm font-medium text-secondary-dark">
        {language.toUpperCase()}
      </span>
    </button>
  );
}