import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const RegionOverview = () => {
  const [statesData, setStatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchRegionData();
  }, []);
  
  const fetchRegionData = async () => {
    try {
      // Fetch actual region data from the backend API
      const response = await api.get('/admin/region-overview');
      setStatesData(response.data.regions || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching region data:', error);
      // Fallback to sample data if API fails
      setStatesData([
        { id: 'mh', name: 'Maharashtra', status: 'healthy', crop: 'Sugarcane', yield: 75.2, affectedFarmers: 120 },
        { id: 'up', name: 'Uttar Pradesh', status: 'moderate', crop: 'Wheat', yield: 68.5, affectedFarmers: 250 },
        { id: 'tn', name: 'Tamil Nadu', status: 'high', crop: 'Rice', yield: 45.3, affectedFarmers: 340 },
        { id: 'ka', name: 'Karnataka', status: 'pest', crop: 'Coffee', yield: 32.1, affectedFarmers: 180 },
        { id: 'ap', name: 'Andhra Pradesh', status: 'healthy', crop: 'Rice', yield: 78.9, affectedFarmers: 95 },
        { id: 'gj', name: 'Gujarat', status: 'moderate', crop: 'Cotton', yield: 65.7, affectedFarmers: 160 },
        { id: 'rj', name: 'Rajasthan', status: 'high', crop: 'Mustard', yield: 52.4, affectedFarmers: 210 },
        { id: 'wb', name: 'West Bengal', status: 'pest', crop: 'Rice', yield: 28.6, affectedFarmers: 290 },
        { id: 'pb', name: 'Punjab', status: 'healthy', crop: 'Wheat', yield: 82.3, affectedFarmers: 85 },
        { id: 'hr', name: 'Haryana', status: 'moderate', crop: 'Wheat', yield: 71.8, affectedFarmers: 140 },
      ]);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'healthy': return '#2ecc71'; // Green
      case 'moderate': return '#f1c40f'; // Yellow
      case 'high': return '#e67e22'; // Orange
      case 'pest': return '#e74c3c'; // Red
      default: return '#bdc3c7'; // Gray
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'healthy': return 'Healthy';
      case 'moderate': return 'Moderate Stress';
      case 'high': return 'High Stress';
      case 'pest': return 'Pest Outbreak';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Region Overview</h2>
        <div style={styles.loading}>Loading region data...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Region Overview</h2>
      <div style={styles.mapContainer}>
        <div style={styles.map}>
          <div style={styles.mapTitle}>State Health Status</div>
          <div style={styles.indiaMap}>
            {/* Simplified SVG representation of India with state boundaries */}
            <svg viewBox="0 0 800 600" style={styles.svgMap}>
              {statesData.map((state) => (
                <g key={state.id}>
                  <rect 
                    x={state.x || 100 + (statesData.indexOf(state) % 5) * 100}
                    y={state.y || 50 + Math.floor(statesData.indexOf(state) / 5) * 80}
                    width={state.width || 80}
                    height={state.height || 60}
                    fill={getStatusColor(state.status)}
                    stroke="#fff"
                    strokeWidth="2"
                    rx="4"
                    ry="4"
                    title={`${state.name}: ${getStatusLabel(state.status)}, Yield: ${state.yield || 'N/A'} tons/hectare`}
                  />
                  <text 
                    x={state.x ? state.x + (state.width || 80)/2 : 140 + (statesData.indexOf(state) % 5) * 100}
                    y={state.y ? state.y + (state.height || 60)/2 : 80 + Math.floor(statesData.indexOf(state) / 5) * 80}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {state.name.substring(0, 4)}
                  </text>
                  <text 
                    x={state.x ? state.x + (state.width || 80)/2 : 140 + (statesData.indexOf(state) % 5) * 100}
                    y={state.y ? state.y + (state.height || 60)/2 + 12 : 92 + Math.floor(statesData.indexOf(state) / 5) * 80}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="8"
                  >
                    {state.yield ? `${state.yield}t` : 'N/A'}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
      
      <div style={styles.legend}>
        <h3>Status Legend</h3>
        <div style={styles.legendItems}>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: '#2ecc71'}}></div>
            <span>Healthy</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: '#f1c40f'}}></div>
            <span>Moderate Stress</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: '#e67e22'}}></div>
            <span>High Stress</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: '#e74c3c'}}></div>
            <span>Pest Outbreak</span>
          </div>
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
  mapContainer: {
    marginBottom: '30px',
  },
  map: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  mapTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#2c3e50',
  },
  indiaMap: {
    width: '100%',
    height: '400px',
    overflow: 'hidden',
    border: '1px solid #ecf0f1',
    borderRadius: '4px',
  },
  svgMap: {
    width: '100%',
    height: '100%',
  },
  stateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '15px',
  },
  stateBox: {
    padding: '15px',
    borderRadius: '6px',
    color: 'white',
    textAlign: 'center',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  },
  stateContent: {
    fontSize: '14px',
  },
  stateName: {
    fontWeight: 'bold',
    marginBottom: '5px',
    fontSize: '16px',
  },
  stateInfo: {
    fontSize: '12px',
    marginTop: '3px',
  },
  legend: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  legendItems: {
    display: 'flex',
    gap: '20px',
    marginTop: '10px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendColor: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
  },
};

export default RegionOverview;