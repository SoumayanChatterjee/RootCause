import { useState, useRef, useEffect } from 'react';
import translations from '../utils/translations';
import './LanguageSelector.css';

function LanguageSelector({ onLanguageChange, currentLanguage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(currentLanguage || 'en');
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧", nativeName: "English" },
    { code: "hi", name: "Hindi", flag: "🇮🇳", nativeName: "हिन्दी" },
    { code: "bn", name: "Bengali", flag: "🇧🇩", nativeName: "বাংলা" },
    { code: "ta", name: "Tamil", flag: "🇮🇳", nativeName: "தமிழ்" },
    { code: "te", name: "Telugu", flag: "🇮🇳", nativeName: "తెలుగు" },
    { code: "mr", name: "Marathi", flag: "🇮🇳", nativeName: "मराठी" }
  ];

  const selectedLanguage = languages.find(lang => lang.code === selectedLang) || languages[0];

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (langCode) => {
    setSelectedLang(langCode);
    onLanguageChange(langCode);
    setIsOpen(false);
    
    // Force a page reload to apply the new language instantly
    window.location.reload();
  };

  const t = translations[selectedLang];

  return (
    <div className="language-selector-container" ref={dropdownRef}>
      <button
        type="button"
        className="language-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="language-flag">{selectedLanguage.flag}</span>
        <span className="language-name">{selectedLanguage.nativeName}</span>
        <span className="language-selector-arrow">▼</span>
      </button>
      
      {isOpen && (
        <ul className="language-selector-dropdown" role="listbox">
          {languages.map((lang) => (
            <li
              key={lang.code}
              className={`language-option ${selectedLang === lang.code ? 'selected' : ''}`}
              onClick={() => handleSelect(lang.code)}
              role="option"
              aria-selected={selectedLang === lang.code}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.nativeName}</span>
              <span className="language-english-name">{lang.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LanguageSelector;