import React, { createContext, useContext, useState, useEffect } from 'react';
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

// Context erstellen
const TranslationContext = createContext();

// Provider Component
export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState('de');

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
      console.log('Language changed to:', lang);
    }
  };

  // t = translate Funktion
  const t = (key, values) => {
    const text = getNestedValue(translations[language], key);
    if (!text) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return interpolate(text, values);
  };

  return (
    <TranslationContext.Provider value={{ t, language, changeLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook zum Nutzen des Contexts
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};