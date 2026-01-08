import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const Sidebar = ({ activeModule, setActiveModule }) => {
  const { t } = useLanguage();
  
  const menuItems = [
    { id: 'region-overview', label: t.regionOverview || 'Region Overview', icon: '🌍' },
    { id: 'weather-alerts', label: t.weatherAlerts || 'Weather Alerts', icon: '🌤️' },
    { id: 'farm-statistics', label: t.farmStatistics || 'Farm Statistics', icon: '📊' },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <h2>🌾 {t.rootCause || 'RootCause'}</h2>
        <p>{t.adminPanel || 'Admin Panel'}</p>
      </div>
      <nav style={styles.nav}>
        <ul style={styles.menu}>
          {menuItems.map(item => (
            <li key={item.id} style={styles.menuItem}>
              <button
                style={{
                  ...styles.menuButton,
                  ...(activeModule === item.id ? styles.activeMenuButton : {})
                }}
                onClick={() => setActiveModule(item.id)}
              >
                <span style={styles.icon}>{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div style={styles.logoutContainer}>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          style={styles.logoutButton}
        >
          {t.logout || 'Logout'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#34495e',
    color: 'white',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  },
  logo: {
    padding: '20px',
    borderBottom: '1px solid #2c3e50',
  },
  nav: {
    flex: 1,
    padding: '20px 0',
  },
  menu: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  menuItem: {
    margin: 0,
    padding: 0,
  },
  menuButton: {
    width: '100%',
    padding: '15px 20px',
    textAlign: 'left',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s',
  },
  activeMenuButton: {
    backgroundColor: '#2c3e50',
    borderRight: '4px solid #3498db',
  },
  icon: {
    marginRight: '10px',
    fontSize: '18px',
  },
  logoutContainer: {
    padding: '20px',
    borderTop: '1px solid #2c3e50',
    marginTop: 'auto',
  },
  logoutButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  logoutButtonHover: {
    backgroundColor: '#c0392b',
  },
};

export default Sidebar;