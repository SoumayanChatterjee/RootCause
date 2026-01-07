import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const FarmStatistics = () => {
  const [farmStats, setFarmStats] = useState([]);
  const [farmerDetails, setFarmerDetails] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [showFarmerDetails, setShowFarmerDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmStats();
  }, []);

  const fetchFarmStats = async () => {
    try {
      const response = await api.get('/admin/farm-statistics');
      setFarmStats(response.data.farms || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching farm stats:', error);
      // Fallback to sample data if API fails
      setFarmStats([
        { id: 1, district: 'Pune', cropType: 'Sugarcane', diseaseRisk: 'Low', farmersAffected: 45, status: 'Resolved' },
        { id: 2, district: 'Nashik', cropType: 'Grapes', diseaseRisk: 'High', farmersAffected: 120, status: 'In Progress' },
        { id: 3, district: 'Mumbai', cropType: 'Vegetables', diseaseRisk: 'Medium', farmersAffected: 78, status: 'Detected' },
        { id: 4, district: 'Thane', cropType: 'Rice', diseaseRisk: 'Low', farmersAffected: 32, status: 'Resolved' },
        { id: 5, district: 'Nagpur', cropType: 'Oranges', diseaseRisk: 'High', farmersAffected: 95, status: 'In Progress' },
        { id: 6, district: 'Aurangabad', cropType: 'Cotton', diseaseRisk: 'Medium', farmersAffected: 67, status: 'Detected' },
        { id: 7, district: 'Solapur', cropType: 'Soybean', diseaseRisk: 'Low', farmersAffected: 54, status: 'Resolved' },
        { id: 8, district: 'Amravati', cropType: 'Wheat', diseaseRisk: 'High', farmersAffected: 89, status: 'In Progress' },
      ]);
      setLoading(false);
    }
  };

  const fetchFarmerDetails = async (district) => {
    try {
      const response = await api.get(`/admin/farm-statistics/${district}/farmers`);
      setFarmerDetails(response.data.farmers || []);
    } catch (error) {
      console.error('Error fetching farmer details:', error);
      // Fallback to sample data if API fails
      setFarmerDetails([
        { id: 1, name: 'Rajesh Kumar', phone: '+91 9876543210', fieldDetails: '2 acres, Sugarcane crop', actionTaken: 'Fungicide applied', status: 'Resolved', activity: 'Applied treatment, scheduled follow-up' },
        { id: 2, name: 'Priya Sharma', phone: '+91 9876543211', fieldDetails: '1.5 acres, Sugarcane crop', actionTaken: 'Irrigation increased', status: 'Resolved', activity: 'Completed irrigation upgrade' },
        { id: 3, name: 'Amit Patel', phone: '+91 9876543212', fieldDetails: '3 acres, Sugarcane crop', actionTaken: 'Pesticides applied', status: 'In Progress', activity: 'Monitoring crop health' },
      ]);
    }
  };

  const getRiskColor = (risk) => {
    switch(risk.toLowerCase()) {
      case 'low': return '#2ecc71';
      case 'medium': return '#f1c40f';
      case 'high': return '#e74c3c';
      default: return '#bdc3c7';
    }
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'detected': return '#e74c3c';
      case 'in progress': return '#f1c40f';
      case 'resolved': return '#2ecc71';
      default: return '#bdc3c7';
    }
  };

  const handleDistrictClick = async (district) => {
    setSelectedDistrict(district);
    await fetchFarmerDetails(district);
    setShowFarmerDetails(true);
  };

  const closeFarmerDetails = () => {
    setShowFarmerDetails(false);
    setSelectedDistrict(null);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Farm Statistics</h2>
        <div style={styles.loading}>Loading farm statistics...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Farm Statistics</h2>
      
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th>District</th>
              <th>Crop Type</th>
              <th>Disease Risk Level</th>
              <th>Number of Farmers Affected</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(farmStats || []).map(stat => (
              <tr key={stat.id} style={styles.tableRow}>
                <td style={styles.tableCell}>{stat.district}</td>
                <td style={styles.tableCell}>{stat.cropType}</td>
                <td style={styles.tableCell}>
                  <span 
                    style={{
                      ...styles.riskBadge,
                      backgroundColor: getRiskColor(stat.diseaseRisk)
                    }}
                  >
                    {stat.diseaseRisk}
                  </span>
                </td>
                <td style={styles.tableCell}>{stat.farmersAffected}</td>
                <td style={styles.tableCell}>
                  <span 
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(stat.status)
                    }}
                  >
                    {stat.status}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <button 
                    style={styles.viewDetailsButton}
                    onClick={() => handleDistrictClick(stat.district)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Farmer Details Modal */}
      {showFarmerDetails && (
        <div style={styles.modalOverlay} onClick={closeFarmerDetails}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3>Farmer Details - {selectedDistrict}</h3>
              <button style={styles.closeButton} onClick={closeFarmerDetails}>×</button>
            </div>
            <div style={styles.modalBody}>
              <table style={styles.farmerTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>Field Details</th>
                    <th>Action Taken</th>
                    <th>Activity in Farmer Dashboard</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(farmerDetails || []).map(farmer => (
                    <tr key={farmer.id}>
                      <td>{farmer.name}</td>
                      <td>{farmer.phone}</td>
                      <td>{farmer.fieldDetails}</td>
                      <td>{farmer.actionTaken}</td>
                      <td>{farmer.activity || 'No activity recorded'}</td>
                      <td>
                        <span 
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: getStatusColor(farmer.status)
                          }}
                        >
                          {farmer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
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
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#34495e',
    color: 'white',
  },
  tableRow: {
    borderBottom: '1px solid #ecf0f1',
  },
  tableCell: {
    padding: '12px',
    textAlign: 'left',
    verticalAlign: 'middle',
  },
  riskBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  viewDetailsButton: {
    padding: '6px 12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '900px',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  modalHeader: {
    padding: '20px',
    borderBottom: '1px solid #ecf0f1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalBody: {
    padding: '20px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#7f8c8d',
  },
  farmerTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
};

export default FarmStatistics;