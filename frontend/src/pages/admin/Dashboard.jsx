import AdminLayout from "../../layouts/AdminLayout";
import React, { useState } from 'react';
import { useLanguage } from "../../hooks/useLanguage";
import Sidebar from '../../components/admin/Sidebar';
import RegionOverview from './RegionOverview';
import WeatherAlerts from './WeatherAlerts';
import FarmStatistics from './FarmStatistics';

const AdminDashboard = () => {
  const [activeModule, setActiveModule] = useState('region-overview');
  
  const { t } = useLanguage();

  const renderActiveModule = () => {
    switch(activeModule) {
      case 'region-overview':
        return <RegionOverview />;
      case 'weather-alerts':
        return <WeatherAlerts />;
      case 'farm-statistics':
        return <FarmStatistics />;
      default:
        return <RegionOverview />;
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h1>{t.adminDashboard || 'Admin Dashboard'}</h1>
        </header>
        <main style={styles.main}>
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  main: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
  },
};

export default AdminDashboard;
