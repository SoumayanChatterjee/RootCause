import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Login from "./pages/auth/Login";
import FarmerLogin from "./pages/auth/FarmerLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import FarmerSignup from "./pages/auth/FarmerSignup";
import AdminSignup from "./pages/auth/AdminSignup";
import FarmerDashboard from "./pages/farmer/Dashboard";
import DiseaseDetection from "./pages/farmer/DiseaseDetection";
import Treatment from "./pages/farmer/Treatment";
import YieldPrediction from "./pages/farmer/YieldPrediction";
import AdminDashboard from "./pages/admin/Dashboard";
import LanguageModal from "./components/LanguageModal";

import { useState, useEffect } from "react";

export default function App() {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [languageSet, setLanguageSet] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("lang");
    if (!storedLanguage) {
      setShowLanguageModal(true);
    } else {
      setLanguageSet(true);
    }
  }, []);

  const handleLanguageSelect = (lang) => {
    localStorage.setItem("lang", lang);
    setShowLanguageModal(false);
    setLanguageSet(true);
  };

  if (!languageSet && !showLanguageModal) {
    return <div>Loading...</div>;
  }

  return (
    <LanguageProvider>
      {showLanguageModal && (
        <LanguageModal setLanguage={handleLanguageSelect} />
      )}
      
      {languageSet && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/farmer" element={<FarmerLogin />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/signup/farmer" element={<FarmerSignup />} />
            <Route path="/signup/admin" element={<AdminSignup />} />
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/disease" element={<DiseaseDetection />} />
            <Route path="/farmer/treatment" element={<Treatment />} />
            <Route path="/farmer/yield" element={<YieldPrediction />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      )}
    </LanguageProvider>
  );
}