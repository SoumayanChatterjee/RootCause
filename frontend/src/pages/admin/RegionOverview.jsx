import React, { useState, useEffect } from 'react';
import { useLanguage } from "../../hooks/useLanguage";
import api from '../../services/api';

import { MapContainer, TileLayer, GeoJSON, Tooltip, useMap, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow
});

// Map controller component to handle zooming to selected state
function MapController({ selectedState, allIndianStates }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedState) {
      const selected = allIndianStates.find(s => s.id === selectedState);
      if (selected && selected.bounds) {
        const southWest = L.latLng(selected.bounds[0][0], selected.bounds[0][1]);
        const northEast = L.latLng(selected.bounds[1][0], selected.bounds[1][1]);
        const bounds = L.latLngBounds(southWest, northEast);
        map.fitBounds(bounds, { animate: true });
      }
    }
  }, [selectedState, allIndianStates, map]);

  return null;
}

const RegionOverview = () => {
  const [statesData, setStatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('');
  
  const { t } = useLanguage();
  
  useEffect(() => {
    fetchRegionData();
  }, []);
  
  const fetchRegionData = async () => {
    try {
      // Fetch actual region data from the backend API
      const response = await api.get('/dashboard/admin/region-overview');
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
      case 'healthy': return t.healthy || 'Healthy';
      case 'moderate': return t.moderateStress || 'Moderate Stress';
      case 'high': return t.highStress || 'High Stress';
      case 'pest': return t.pestOutbreak || 'Pest Outbreak';
      default: return t.unknown || 'Unknown';
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>{t.regionOverview || 'Region Overview'}</h2>
        <div style={styles.loading}>{t.loadingRegionData || 'Loading region data...'}</div>
      </div>
    );
  }

  // Simple Indian state boundaries for visualization purposes
  const indianStates = [
    {
      id: 'mh',
      name: 'Maharashtra',
      bounds: [[19.0, 72.0], [22.0, 78.0]], // [southwest, northeast]
      data: statesData.find(s => s.id === 'mh') || {}
    },
    {
      id: 'up',
      name: 'Uttar Pradesh',
      bounds: [[23.5, 77.5], [29.0, 83.0]],
      data: statesData.find(s => s.id === 'up') || {}
    },
    {
      id: 'tn',
      name: 'Tamil Nadu',
      bounds: [[8.0, 76.0], [13.5, 80.5]],
      data: statesData.find(s => s.id === 'tn') || {}
    },
    {
      id: 'ka',
      name: 'Karnataka',
      bounds: [[11.5, 74.0], [18.5, 78.5]],
      data: statesData.find(s => s.id === 'ka') || {}
    },
    {
      id: 'ap',
      name: 'Andhra Pradesh',
      bounds: [[12.5, 77.0], [19.0, 84.0]],
      data: statesData.find(s => s.id === 'ap') || {}
    },
    {
      id: 'gj',
      name: 'Gujarat',
      bounds: [[20.0, 68.0], [24.5, 74.5]],
      data: statesData.find(s => s.id === 'gj') || {}
    },
    {
      id: 'rj',
      name: 'Rajasthan',
      bounds: [[23.0, 69.5], [30.5, 78.5]],
      data: statesData.find(s => s.id === 'rj') || {}
    },
    {
      id: 'wb',
      name: 'West Bengal',
      bounds: [[21.5, 85.5], [27.5, 89.5]],
      data: statesData.find(s => s.id === 'wb') || {}
    },
    {
      id: 'pb',
      name: 'Punjab',
      bounds: [[29.5, 73.5], [32.5, 76.5]],
      data: statesData.find(s => s.id === 'pb') || {}
    },
    {
      id: 'hr',
      name: 'Haryana',
      bounds: [[27.5, 74.5], [30.5, 77.5]],
      data: statesData.find(s => s.id === 'hr') || {}
    },
  ];
  
  // Define all Indian states with their approximate coordinates for zooming
  const allIndianStates = [
    { id: 'ap', name: 'Andhra Pradesh', bounds: [[12.5, 77.0], [19.0, 84.0]] },
    { id: 'ar', name: 'Arunachal Pradesh', bounds: [[26.5, 91.5], [29.5, 97.5]] },
    { id: 'as', name: 'Assam', bounds: [[24.5, 89.5], [27.5, 96.0]] },
    { id: 'br', name: 'Bihar', bounds: [[24.5, 84.5], [27.5, 88.5]] },
    { id: 'ct', name: 'Chhattisgarh', bounds: [[17.5, 80.5], [24.0, 84.5]] },
    { id: 'ga', name: 'Goa', bounds: [[14.5, 73.5], [15.5, 74.5]] },
    { id: 'gj', name: 'Gujarat', bounds: [[20.0, 68.0], [24.5, 74.5]] },
    { id: 'hr', name: 'Haryana', bounds: [[27.5, 74.5], [30.5, 77.5]] },
    { id: 'hp', name: 'Himachal Pradesh', bounds: [[30.5, 75.5], [33.5, 79.0]] },
    { id: 'jk', name: 'Jammu and Kashmir', bounds: [[32.5, 73.5], [36.5, 79.0]] },
    { id: 'jh', name: 'Jharkhand', bounds: [[22.0, 83.5], [25.0, 87.5]] },
    { id: 'ka', name: 'Karnataka', bounds: [[11.5, 74.0], [18.5, 78.5]] },
    { id: 'kl', name: 'Kerala', bounds: [[8.0, 76.0], [12.5, 77.5]] },
    { id: 'mp', name: 'Madhya Pradesh', bounds: [[21.5, 74.0], [26.5, 82.0]] },
    { id: 'mh', name: 'Maharashtra', bounds: [[19.0, 72.0], [22.0, 78.0]] },
    { id: 'mn', name: 'Manipur', bounds: [[23.5, 93.0], [25.5, 94.5]] },
    { id: 'ml', name: 'Meghalaya', bounds: [[25.0, 89.5], [26.0, 92.5]] },
    { id: 'mz', name: 'Mizoram', bounds: [[22.5, 92.5], [24.5, 94.0]] },
    { id: 'nl', name: 'Nagaland', bounds: [[25.5, 93.5], [27.0, 95.0]] },
    { id: 'od', name: 'Odisha', bounds: [[17.5, 81.5], [22.5, 87.5]] },
    { id: 'pb', name: 'Punjab', bounds: [[29.5, 73.5], [32.5, 76.5]] },
    { id: 'rj', name: 'Rajasthan', bounds: [[23.0, 69.5], [30.5, 78.5]] },
    { id: 'sk', name: 'Sikkim', bounds: [[27.5, 88.0], [28.5, 88.5]] },
    { id: 'tn', name: 'Tamil Nadu', bounds: [[8.0, 76.0], [13.5, 80.5]] },
    { id: 'ts', name: 'Telangana', bounds: [[15.5, 77.5], [19.5, 81.5]] },
    { id: 'tr', name: 'Tripura', bounds: [[22.5, 91.0], [24.0, 92.5]] },
    { id: 'up', name: 'Uttar Pradesh', bounds: [[23.5, 77.5], [29.0, 83.0]] },
    { id: 'uk', name: 'Uttarakhand', bounds: [[28.5, 77.5], [31.0, 81.0]] },
    { id: 'wb', name: 'West Bengal', bounds: [[21.5, 85.5], [27.5, 89.5]] },
    // Union territories
    { id: 'dl', name: 'Delhi', bounds: [[28.4, 76.8], [28.9, 77.4]] },
    { id: 'py', name: 'Puducherry', bounds: [[11.5, 79.5], [12.0, 79.8]] },
    { id: 'ch', name: 'Chandigarh', bounds: [[30.6, 76.6], [30.8, 76.9]] },
    { id: 'an', name: 'Andaman and Nicobar Islands', bounds: [[6.5, 92.0], [13.5, 94.5]] },
    { id: 'ld', name: 'Lakshadweep', bounds: [[8.5, 72.0], [12.0, 73.5]] },
    { id: 'dj', name: 'Dadra and Nagar Haveli and Daman and Diu', bounds: [[20.0, 72.5], [20.5, 73.5]] },
    { id: 'la', name: 'Ladakh', bounds: [[32.5, 75.0], [35.0, 80.0]] }
  ];
  
  const handleStateChange = (stateId) => {
    setSelectedState(stateId);
  };
  
  const selectedStateData = selectedState 
    ? indianStates.find(s => s.id === allIndianStates.find(ais => ais.id === selectedState)?.id)?.data 
    : null;
  
  return (
    <div style={styles.container}>
      <h2>{t.regionOverview || 'Region Overview'}</h2>
      <div style={styles.stateSelector}>
        <label htmlFor="state-select">Search State: </label>
        <select 
          id="state-select"
          value={selectedState}
          onChange={(e) => handleStateChange(e.target.value)}
          style={styles.stateDropdown}
        >
          <option value="">Select a State</option>
          {allIndianStates.map(state => (
            <option key={state.id} value={state.id}>{state.name}</option>
          ))}
        </select>
      </div>
      
      {/* Selected State Details */}
      {selectedStateData && (
        <div style={styles.selectedStateInfo}>
          <div style={styles.selectedStateHeader}>
            <h3>{allIndianStates.find(s => s.id === selectedState)?.name || 'Selected State'} Details</h3>
            <div 
              style={{
                ...styles.statusBadge,
                backgroundColor: getStatusColor(selectedStateData.status),
              }}
            >
              {getStatusLabel(selectedStateData.status)}
            </div>
          </div>
          <div style={styles.selectedStateContent}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Crop:</span>
              <span style={styles.infoValue}>{selectedStateData.crop || 'N/A'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Yield:</span>
              <span style={styles.infoValue}>{selectedStateData.yield ? `${selectedStateData.yield} t/ha` : 'N/A'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Affected Farmers:</span>
              <span style={styles.infoValue}>{selectedStateData.affectedFarmers || 'N/A'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Status:</span>
              <span 
                style={{
                  ...styles.statusText,
                  color: getStatusColor(selectedStateData.status)
                }}
              >
                {getStatusLabel(selectedStateData.status)}
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div style={styles.mapContainer}>
        <div style={styles.map}>
          <div style={styles.mapTitle}>{t.stateHealthStatus || 'State Health Status'}</div>
          <div style={styles.indiaMap}>
            <MapContainer
              center={[22.5, 78.5]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <MapController selectedState={selectedState} allIndianStates={allIndianStates} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {indianStates.map((state) => {
                const stateData = state.data;
                const color = getStatusColor(stateData.status || 'unknown');
                
                // Convert bounds to corner coordinates for polygon
                const [[south, west], [north, east]] = state.bounds;
                const polygonPositions = [
                  [south, west],
                  [north, west], 
                  [north, east],
                  [south, east],
                  [south, west] // Close the polygon
                ];
                
                return (
                  <Polygon
                    key={state.id}
                    positions={polygonPositions}
                    eventHandlers={{
                      mouseover: (e) => {
                        e.target.setStyle({
                          fillOpacity: 0.8,
                        });
                      },
                      mouseout: (e) => {
                        e.target.setStyle({
                          fillOpacity: 0.5,
                        });
                      },
                    }}
                    pathOptions={{
                      fillColor: color,
                      color: '#ffffff',
                      weight: 1,
                      fillOpacity: 0.5,
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                      <div>
                        <strong>{state.name}</strong><br/>
                        Crop: {stateData.crop || 'N/A'}<br/>
                        Yield: {stateData.yield || 'N/A'} t/ha<br/>
                        Status: {getStatusLabel(stateData.status || 'unknown')}
                      </div>
                    </Tooltip>
                  </Polygon>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>
      
      <div style={styles.legend}>
        <h3>{t.statusLegend || 'Status Legend'}</h3>
        <div style={styles.legendItems}>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: '#2ecc71'}}></div>
            <span>{t.healthy || 'Healthy'}</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: '#f1c40f'}}></div>
            <span>{t.moderateStress || 'Moderate Stress'}</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: '#e67e22'}}></div>
            <span>{t.highStress || 'High Stress'}</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: '#e74c3c'}}></div>
            <span>{t.pestOutbreak || 'Pest Outbreak'}</span>
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
  stateSelector: {
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  stateDropdown: {
    marginLeft: '10px',
    padding: '5px 10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
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
    height: '600px',
    overflow: 'hidden',
    border: '1px solid #ecf0f1',
    borderRadius: '4px',
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
    flexWrap: 'wrap',
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
  selectedStateInfo: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  selectedStateHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  statusBadge: {
    padding: '5px 10px',
    borderRadius: '12px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  selectedStateContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 0',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#7f8c8d',
  },
  infoValue: {
    color: '#2c3e50',
  },
  statusText: {
    fontWeight: 'bold',
  },
};

export default RegionOverview;