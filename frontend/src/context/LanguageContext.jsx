import { createContext, useEffect, useState } from "react";
import translations from "../utils/translations";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en");

  // Listen for custom language change events
  useEffect(() => {
    const handleLanguageChange = () => {
      // Force a re-render by updating state with the same value
      setLang(prevLang => prevLang);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};