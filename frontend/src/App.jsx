import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Login from "./pages/auth/Login";
import FarmerLogin from "./pages/auth/FarmerLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import FarmerSignup from "./pages/auth/FarmerSignup";
import AdminSignup from "./pages/auth/AdminSignup";
import FarmerDashboard from "./pages/farmer/Dashboard";

import Treatment from "./pages/farmer/Treatment";
import YieldPrediction from "./pages/farmer/YieldPrediction";
import AdminDashboard from "./pages/admin/Dashboard";
export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/farmer" element={<FarmerLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/signup/farmer" element={<FarmerSignup />} />
          <Route path="/signup/admin" element={<AdminSignup />} />
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer/treatment" element={<Treatment />} />
          <Route path="/farmer/yield" element={<YieldPrediction />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}