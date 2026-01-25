import { useState, useEffect } from 'react';
import de from '../translations/de.json';
import en from '../translations/en.json';

const translations = {
  de,
  en
};

// Helper Funktion um verschachtelte Objekte zu durchsuchen
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Helper Funktion für String-Interpolation (z.B. "Tag {{day}} deines Zyklus")
const interpolate = (text, values) => {
  if (!values) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => values[key] || match);
};

export const useTranslation = () => {
  const [language, setLanguage] = useState('de'); // Default: Deutsch

  useEffect(() => {
    // Sprache aus localStorage laden (falls vorhanden)
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    }
  };

  // t = translate Funktion
  // Verwendung: t('home.cycleDay', { day: 14 })
  const t = (key, values) => {
    const text = getNestedValue(translations[language], key);
    if (!text) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return interpolate(text, values);
  };

  return {
    t,
    language,
    changeLanguage
  };
};