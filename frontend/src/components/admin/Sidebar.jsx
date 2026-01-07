import React from 'react';

const Sidebar = ({ activeModule, setActiveModule }) => {
  const menuItems = [
    { id: 'region-overview', label: 'Region Overview', icon: '🌍' },
    { id: 'weather-alerts', label: 'Weather Alerts', icon: '🌤️' },
    { id: 'farm-statistics', label: 'Farm Statistics', icon: '📊' },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <h2>🌾 RootCause</h2>
        <p>Admin Panel</p>
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
};

export default Sidebar;