import { useState } from "react";
import translations from "../utils/translations";

function LanguageModal({ setLanguage }) {
  const [selectedLang, setSelectedLang] = useState("");
  const [hoveredLang, setHoveredLang] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previewLang, setPreviewLang] = useState("en"); // Language to preview text in

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧", nativeName: "English" },
    { code: "hi", name: "Hindi", flag: "🇮🇳", nativeName: "हिन्दी" },
    { code: "bn", name: "Bengali", flag: "🇧🇩", nativeName: "বাংলা" },
    { code: "ta", name: "Tamil", flag: "🇮🇳", nativeName: "தமிழ்" },
    { code: "te", name: "Telugu", flag: "🇮🇳", nativeName: "తెలుగు" },
    { code: "mr", name: "Marathi", flag: "🇮🇳", nativeName: "मराठी" }
  ];

  const handleLanguageSelect = (langCode) => {
    if (isTransitioning) return; // Prevent multiple clicks
    
    setSelectedLang(langCode);
    setIsTransitioning(true);
    setPreviewLang(langCode);
    localStorage.setItem("lang", langCode);
    
    // Animate selection and then trigger callback
    setTimeout(() => {
      setLanguage(langCode);
    }, 800);
  };
  
  const handleHover = (langCode) => {
    if (!selectedLang) {
      setHoveredLang(langCode);
      setPreviewLang(langCode);
    }
  };
  
  const handleHoverLeave = () => {
    if (!selectedLang) {
      setHoveredLang("");
      setPreviewLang("en");
    }
  };
  
  const t = translations[previewLang];

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <span style={styles.logo}>🌍</span>
          </div>
          <h2 style={styles.title}>{t.selectYourLanguage}</h2>
          <p style={styles.subtitle}>{t.chooseLanguageSubtitle}</p>
        </div>

        <div style={styles.languageGrid}>
          {languages.map((lang) => (
            <div
              key={lang.code}
              style={{
                ...styles.languageCard,
                ...(hoveredLang === lang.code && !selectedLang ? styles.languageCardHover : {}),
                ...(selectedLang === lang.code ? styles.languageCardSelected : {}),
                ...(selectedLang && selectedLang !== lang.code ? styles.languageCardDisabled : {})
              }}
              onClick={() => handleLanguageSelect(lang.code)}
              onMouseEnter={() => handleHover(lang.code)}
              onMouseLeave={handleHoverLeave}
            >
              <div style={styles.flagIcon}>{lang.flag}</div>
              <div style={styles.langName}>{lang.nativeName}</div>
              <div style={styles.langSubtext}>{lang.name}</div>
              {selectedLang === lang.code && (
                <div style={styles.checkmark}>✓</div>
              )}
            </div>
          ))}
        </div>
        
        {selectedLang && (
          <div style={styles.loadingMessage}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>{t.loadingExperience}</p>
          </div>
        )}
        
        <div style={styles.footer}>
          <p style={styles.footerText}>🌱 RootCause - {t.appSubtitle}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(135deg, rgba(102, 187, 106, 0.95) 0%, rgba(255, 235, 59, 0.95) 100%)",
    backdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    animation: "fadeIn 0.3s ease-in"
  },
  modal: {
    background: "#fff",
    padding: "40px",
    borderRadius: "25px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    maxWidth: "600px",
    width: "90%",
    animation: "slideUp 0.4s ease-out"
  },
  header: {
    textAlign: "center",
    marginBottom: "35px"
  },
  logoContainer: {
    marginBottom: "20px"
  },
  logo: {
    fontSize: "64px",
    display: "inline-block",
    animation: "rotate 3s linear infinite"
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#2d5016",
    margin: "10px 0",
    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease"
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    margin: "10px 0 0 0",
    transition: "all 0.3s ease"
  },
  languageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  },
  languageCard: {
    position: "relative",
    background: "linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)",
    border: "3px solid #c8e6c9",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    overflow: "hidden"
  },
  languageCardHover: {
    transform: "translateY(-8px) scale(1.05)",
    border: "3px solid #4caf50",
    boxShadow: "0 12px 24px rgba(76, 175, 80, 0.3)",
    background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)"
  },
  languageCardSelected: {
    border: "3px solid #2e7d32",
    background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
    color: "white",
    transform: "scale(1.1)",
    boxShadow: "0 8px 20px rgba(46, 125, 50, 0.4)"
  },
  languageCardDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
    pointerEvents: "none",
    filter: "grayscale(0.5)"
  },
  flagIcon: {
    fontSize: "48px",
    marginBottom: "12px",
    display: "block",
    filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))"
  },
  langName: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "inherit"
  },
  langSubtext: {
    fontSize: "13px",
    opacity: 0.8,
    color: "inherit"
  },
  checkmark: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "32px",
    height: "32px",
    background: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#2e7d32",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    animation: "bounceIn 0.5s ease-out"
  },
  footer: {
    textAlign: "center",
    paddingTop: "20px",
    borderTop: "2px solid #e0e0e0"
  },
  footerText: {
    fontSize: "14px",
    color: "#666",
    margin: 0,
    fontWeight: "500"
  },
  loadingMessage: {
    textAlign: "center",
    padding: "20px",
    marginBottom: "20px"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e0e0e0",
    borderTop: "4px solid #4caf50",
    borderRadius: "50%",
    animation: "rotate 1s linear infinite",
    margin: "0 auto 15px"
  },
  loadingText: {
    fontSize: "16px",
    color: "#4caf50",
    fontWeight: "600",
    margin: 0,
    animation: "pulse 1.5s ease-in-out infinite"
  }
};

export default LanguageModal;