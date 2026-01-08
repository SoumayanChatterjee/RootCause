import React, { useState, useEffect } from 'react';
import { useLanguage } from "../../hooks/useLanguage";
import api from '../../services/api';

const WeatherAlerts = () => {
  const [selectedLocation, setSelectedLocation] = useState('Maharashtra');
  const [currentWeather, setCurrentWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { t } = useLanguage();
  
  const locations = [
    'Maharashtra', 'Uttar Pradesh', 'Tamil Nadu', 'Karnataka', 
    'Andhra Pradesh', 'Gujarat', 'Rajasthan', 'West Bengal', 
    'Punjab', 'Haryana'
  ];

  useEffect(() => {
    fetchWeatherData();
  }, [selectedLocation]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/weather-alerts/${selectedLocation}`);
      
      setCurrentWeather(response.data.current || {});
      setForecast(response.data.forecast || []);
      setInsights(response.data.insights || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Fallback to sample data if API fails
      setCurrentWeather({
        temperature: 28,
        humidity: 65,
        condition: 'Partly Cloudy',
        location: selectedLocation
      });
      
      setForecast([
        { day: 'Monday', date: 'Jan 8', temp: { min: 22, max: 32 }, precipitation: 10, condition: 'Light Rain' },
        { day: 'Tuesday', date: 'Jan 9', temp: { min: 23, max: 34 }, precipitation: 0, condition: 'Sunny' },
        { day: 'Wednesday', date: 'Jan 10', temp: { min: 21, max: 30 }, precipitation: 80, condition: 'Heavy Rainfall' },
        { day: 'Thursday', date: 'Jan 11', temp: { min: 24, max: 33 }, precipitation: 20, condition: 'Cloudy' },
        { day: 'Friday', date: 'Jan 12', temp: { min: 25, max: 35 }, precipitation: 5, condition: 'Sunny' },
        { day: 'Saturday', date: 'Jan 13', temp: { min: 23, max: 31 }, precipitation: 90, condition: 'Heavy Rainfall' },
        { day: 'Sunday', date: 'Jan 14', temp: { min: 22, max: 29 }, precipitation: 70, condition: 'Moderate Rain' },
      ]);
      
      setInsights([
        { day: 'Wednesday', message: 'Heavy rainfall expected - High risk for planting activities', type: 'warning' },
        { day: 'Saturday', message: 'Heavy rainfall expected - Potential flooding risk', type: 'danger' },
        { day: 'Sunday', message: 'Moderate rainfall - Good for irrigation, avoid pesticide application', type: 'info' },
      ]);
      
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>{t.weatherAlerts || 'Weather Alerts'}</h2>
        <div style={styles.loading}>{t.loadingWeatherData || 'Loading weather data for'} {selectedLocation}...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>{t.weatherAlerts || 'Weather Alerts'}</h2>
      
      {/* Location Selector */}
      <div style={styles.locationSelector}>
        <label htmlFor="location-select">{t.selectLocation || 'Select Location'}: </label>
        <select 
          id="location-select"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          style={styles.locationDropdown}
        >
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>
      
      {/* Current Weather */}
      <div style={styles.currentWeather}>
        <div style={styles.currentWeatherCard}>
          <h3>{t.currentWeather || 'Current Weather'} - {currentWeather.location || selectedLocation}</h3>
          <div style={styles.currentWeatherContent}>
            <div style={styles.temperature}>
              {(currentWeather.temperature || 28)}°C
            </div>
            <div style={styles.weatherDetails}>
              <div>{t.condition || 'Condition'}: {currentWeather.condition || 'Partly Cloudy'}</div>
              <div>{t.humidity || 'Humidity'}: {(currentWeather.humidity || 65)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div style={styles.forecastSection}>
        <h3>{t.sevenDayForecast || '7-Day Forecast'}</h3>
        <div style={styles.forecastGrid}>
          {(forecast || []).map((day, index) => (
            <div key={index} style={styles.forecastCard}>
              <div style={styles.forecastHeader}>
                <div>{day.day}</div>
                <div style={styles.forecastDate}>{day.date}</div>
              </div>
              <div style={styles.forecastWeather}>
                <div style={styles.forecastTemp}>
                  <span style={styles.tempMax}>{day.temp?.max || 32}°</span>
                  <span style={styles.tempMin}>{day.temp?.min || 22}°</span>
                </div>
                <div style={styles.forecastCondition}>
                  {day.condition || 'Sunny'}
                </div>
                <div style={styles.precipitation}>
                  💧 {(day.precipitation || 0)}% {t.precip || 'precip'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Planning Insights */}
      <div style={styles.insightsSection}>
        <h3>{t.sevenDayPlanningInsights || '7-Day Planning Insights'}</h3>
        <div style={styles.insightsList}>
          {(insights || []).map((insight, index) => (
            <div 
              key={index} 
              style={{
                ...styles.insightItem,
                ...(insight.type === 'warning' ? styles.warningInsight : {}),
                ...(insight.type === 'danger' ? styles.dangerInsight : {}),
                ...(insight.type === 'info' ? styles.infoInsight : {})
              }}
            >
              <strong>{insight.day || 'Today'}:</strong> {insight.message || 'No specific insights available'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  loading: {
    padding: '20px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#7f8c8d',
  },
  locationSelector: {
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  locationDropdown: {
    marginLeft: '10px',
    padding: '5px 10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  currentWeather: {
    marginBottom: '30px',
  },
  currentWeatherCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  currentWeatherContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  temperature: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  weatherDetails: {
    textAlign: 'right',
  },
  forecastSection: {
    marginBottom: '30px',
  },
  forecastGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
  },
  forecastCard: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  forecastHeader: {
    marginBottom: '10px',
  },
  forecastDate: {
    fontSize: '12px',
    color: '#7f8c8d',
  },
  forecastWeather: {
    textAlign: 'center',
  },
  forecastTemp: {
    marginBottom: '5px',
  },
  tempMax: {
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#e74c3c',
  },
  tempMin: {
    marginLeft: '8px',
    fontSize: '16px',
    color: '#3498db',
  },
  forecastCondition: {
    fontSize: '14px',
    marginBottom: '5px',
  },
  precipitation: {
    fontSize: '12px',
    color: '#3498db',
  },
  insightsSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  insightsList: {
    marginTop: '15px',
  },
  insightItem: {
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    borderLeft: '4px solid #3498db',
  },
  warningInsight: {
    backgroundColor: '#fef9e7',
    borderLeft: '4px solid #f39c12',
  },
  dangerInsight: {
    backgroundColor: '#fadbd8',
    borderLeft: '4px solid #e74c3c',
  },
  infoInsight: {
    backgroundColor: '#d6eaf8',
    borderLeft: '4px solid #3498db',
  },
};

export default WeatherAlerts;