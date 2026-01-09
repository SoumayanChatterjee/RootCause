import React, { useState, useEffect } from 'react';
import { useLanguage } from "../../hooks/useLanguage";
import api from '../../services/api';

const WeatherAlerts = () => {
  const [selectedLocation, setSelectedLocation] = useState('Maharashtra');
  const [currentWeather, setCurrentWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  
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
      console.log('Fetching weather data for location:', selectedLocation);
      if(initialLoad) {
        setLoading(true);
      }
      setInitialLoad(false);
      const response = await api.get(`/dashboard/admin/weather-alerts/${selectedLocation}`);
      
      console.log('Weather API Response:', response.data);
      
      setCurrentWeather(response.data.current || {});
      setForecast(response.data.forecast || []);
      setInsights(response.data.insights || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      console.error('Selected location:', selectedLocation);
      
      console.error('Weather API call failed:', error);
      
      // Don't reset data on error to preserve any previously loaded data
      // Only show error in console, keep UI as is
      setLoading(false);
    }
  };

  if (initialLoad || loading) {
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
              {currentWeather.temperature !== undefined ? `${currentWeather.temperature}°C` : 'Loading...'}
            </div>
            <div style={styles.weatherDetails}>
              <div>{t.condition || 'Condition'}: {currentWeather.condition || 'Loading...'}</div>
              <div>{t.humidity || 'Humidity'}: {currentWeather.humidity !== undefined ? `${currentWeather.humidity}%` : 'Loading...'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div style={styles.forecastSection}>
        <h3>{t.sevenDayForecast || '7-Day Forecast'}</h3>
        <div style={styles.forecastGrid}>
          {forecast && forecast.length > 0 ? (
            forecast.map((day, index) => (
              <div key={index} style={styles.forecastCard}>
                <div style={styles.forecastHeader}>
                  <div>{day.day}</div>
                  <div style={styles.forecastDate}>{day.date}</div>
                </div>
                <div style={styles.forecastWeather}>
                  <div style={styles.forecastTemp}>
                    <span style={styles.tempMax}>{day.temp?.max}°</span>
                    <span style={styles.tempMin}>{day.temp?.min}°</span>
                  </div>
                  <div style={styles.forecastCondition}>
                    {day.condition}</div>
                  <div style={styles.precipitation}>
                    💧 {day.precipitation}% {t.precip || 'precip'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.noDataMessage}>{forecast.length === 0 && !loading ? 'No forecast data available' : 'Loading forecast data...'}</div>
          )}
        </div>
      </div>

      {/* Planning Insights */}
      <div style={styles.insightsSection}>
        <h3>{t.sevenDayPlanningInsights || '7-Day Planning Insights'}</h3>
        <div style={styles.insightsList}>
          {insights && insights.length > 0 ? (
            insights.map((insight, index) => (
              <div 
                key={index} 
                style={
                  {
                    ...styles.insightItem,
                    ...(insight.type === 'warning' ? styles.warningInsight : {}),
                    ...(insight.type === 'danger' ? styles.dangerInsight : {}),
                    ...(insight.type === 'info' ? styles.infoInsight : {})
                  }
                }
              >
                <strong>{insight.day}:</strong> {insight.message}
              </div>
            ))
          ) : (
            <div style={styles.noDataMessage}>{insights.length === 0 && !loading ? 'No planning insights available' : 'Loading planning insights...'}</div>
          )}
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
  noDataMessage: {
    padding: '20px',
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  errorMessage: {
    padding: '20px',
    textAlign: 'center',
    color: '#e74c3c',
    fontWeight: 'bold',
  },
};

export default WeatherAlerts;