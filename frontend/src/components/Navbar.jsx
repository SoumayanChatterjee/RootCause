import ProfileMenu from "./ProfileMenu";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Navbar({ title }) {
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Function to update user details
    const updateUserDetails = () => {
      const name = localStorage.getItem("userName") || "Farmer";
      const district = localStorage.getItem("userDistrict") || "";
      const state = localStorage.getItem("userState") || "";
      
      setUserName(name);
      setUserLocation(district ? `${district}${state ? `, ${state}` : ''}` : "");
    };
    
    // Initial update
    updateUserDetails();
    
    // Listen for storage changes (when profile is updated)
    window.addEventListener('storage', updateUserDetails);
    
    // Also listen for custom event for same-tab updates
    window.addEventListener('profileUpdated', updateUserDetails);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', updateUserDetails);
      window.removeEventListener('profileUpdated', updateUserDetails);
    };
  }, []);

  const userRole = localStorage.getItem("userRole");
  
  return (
    <div style={styles.navbar}>
      <div style={styles.leftSection}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🌱</span>
          <h1 style={styles.logoText}>RootCause</h1>
        </div>
        {userRole === "FARMER" && userName && (
          <p style={styles.welcomeMessage}>
            Welcome, <strong>{userName}</strong> {userLocation && `• ${userLocation}`}
          </p>
        )}
      </div>
      
      {userRole === "FARMER" && (
        <nav style={styles.navLinks}>
          {/* Navigation moved to sidebar */}
        </nav>
      )}
      
      <ProfileMenu />
    </div>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    background: 'linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logoIcon: {
    fontSize: '32px'
  },
  logoText: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
  },
  welcomeMessage: {
    margin: 0,
    fontSize: '14px',
    color: '#e8f5e9',
    fontWeight: 'normal'
  },
  navLinks: {
    display: 'flex',
    gap: '55px',
    alignItems: 'center'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    color: '#e8f5e9',
    textDecoration: 'none',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    fontSize: '15px',
    fontWeight: '500'
  },
  navLinkActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    fontWeight: '600'
  },
  navIcon: {
    fontSize: '18px'
  }
};