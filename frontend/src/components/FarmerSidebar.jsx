import { NavLink } from "react-router-dom";
import { useState } from "react";

function SidebarLink({ to, icon, text }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <NavLink 
      to={to}
      style={({ isActive }) => ({
        ...styles.navLink,
        ...(isActive ? styles.navLinkActive : {}),
        ...(isHovered && !isActive ? styles.navLinkHover : {})
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={styles.icon}>{icon}</span>
      <span style={styles.text}>{text}</span>
    </NavLink>
  );
}

export default function FarmerSidebar() {
  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <h3 style={styles.headerTitle}>Navigation</h3>
      </div>
      
      <nav style={styles.nav}>
        <SidebarLink to="/farmer/dashboard" icon="🔬" text="Disease Detection" />
        <SidebarLink to="/farmer/treatment" icon="💊" text="Treatment" />
        <SidebarLink to="/farmer/yield" icon="📊" text="Yield Prediction" />
      </nav>
    </div>
  );
}

const styles = {
  sidebar: {
    position: 'fixed',
    left: 0,
    top: '80px',
    width: '240px',
    height: 'calc(100vh - 80px)',
    background: 'linear-gradient(180deg, #2d5016 0%, #1b3810 100%)',
    boxShadow: '4px 0 12px rgba(0,0,0,0.15)',
    zIndex: 100,
    overflowY: 'auto'
  },
  sidebarHeader: {
    padding: '20px',
    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '10px'
  },
  headerTitle: {
    margin: 0,
    color: '#ffeb3b',
    fontSize: '16px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  nav: {
    padding: '10px 0'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '16px 20px',
    margin: '4px 10px',
    color: '#e8f5e9',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    borderRadius: '10px',
    borderLeft: '4px solid transparent',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  navLinkActive: {
    backgroundColor: 'rgba(255, 235, 59, 0.15)',
    borderLeft: '4px solid #ffeb3b',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(255, 235, 59, 0.2)',
    fontWeight: '600'
  },
  navLinkHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderLeft: '4px solid rgba(255, 235, 59, 0.5)',
    transform: 'translateX(5px)'
  },
  icon: {
    fontSize: '28px',
    minWidth: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: '15px',
    fontWeight: '500',
    letterSpacing: '0.3px'
  }
};
