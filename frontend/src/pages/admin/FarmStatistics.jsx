import React, { useState, useEffect } from 'react';
import { useLanguage } from "../../hooks/useLanguage";
import api from '../../services/api';

const FarmStatistics = () => {
  const [farmStats, setFarmStats] = useState([]);
  const [farmerDetails, setFarmerDetails] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [showFarmerDetails, setShowFarmerDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { t } = useLanguage();

  useEffect(() => {
    fetchAllFarmers();
  }, []);

  const fetchAllFarmers = async () => {
    try {
      const response = await api.get('/dashboard/admin/farmers');
      setFarmStats(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching farmers:', error);
      // Fallback to sample data if API fails
      setFarmStats([
        { _id: 1, name: 'Rajesh Kumar', phone: '+91 9876543210', district: 'Pune', city: 'Pimpri', village: 'Wakad', language: 'en', role: 'FARMER' },
        { _id: 2, name: 'Priya Sharma', phone: '+91 9876543211', district: 'Nashik', city: 'Nashik Road', village: 'Ganpati Nagar', language: 'en', role: 'FARMER' },
        { _id: 3, name: 'Amit Patel', phone: '+91 9876543212', district: 'Mumbai', city: 'Mumbai Suburban', village: 'Andheri', language: 'en', role: 'FARMER' },
        { _id: 4, name: 'Sunita Devi', phone: '+91 9876543213', district: 'Thane', city: 'Thane', village: 'Kasarvadavali', language: 'en', role: 'FARMER' },
        { _id: 5, name: 'Vijay Singh', phone: '+91 9876543214', district: 'Nagpur', city: 'Nagpur', village: 'Dharampeth', language: 'en', role: 'FARMER' },
      ]);
      setLoading(false);
    }
  };

  // We don't need district-specific farmer details anymore since we're showing all farmers
  const fetchFarmerDetails = async (district) => {
    try {
      const response = await api.get(`/dashboard/admin/farmers`);
      setFarmerDetails(response.data || []);
    } catch (error) {
      console.error('Error fetching farmer details:', error);
      // Fallback to sample data if API fails
      setFarmerDetails([
        { _id: 1, name: 'Rajesh Kumar', phone: '+91 9876543210', district: 'Pune', city: 'Pimpri', village: 'Wakad', language: 'en', role: 'FARMER' },
        { _id: 2, name: 'Priya Sharma', phone: '+91 9876543211', district: 'Nashik', city: 'Nashik Road', village: 'Ganpati Nagar', language: 'en', role: 'FARMER' },
        { _id: 3, name: 'Amit Patel', phone: '+91 9876543212', district: 'Mumbai', city: 'Mumbai Suburban', village: 'Andheri', language: 'en', role: 'FARMER' },
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
        <h2>{t.farmStatistics || 'Farm Statistics'}</h2>
        <div style={styles.loading}>{t.loadingFarmStats || 'Loading farm statistics...'}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>{t.allFarmersDatabase || 'All Farmers Database'}</h2>
        
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableHeaderCell}>{t.name || 'Name'}</th>
              <th style={styles.tableHeaderCell}>{t.phoneNumber || 'Phone Number'}</th>
              <th style={styles.tableHeaderCell}>{t.district || 'District'}</th>
              <th style={styles.tableHeaderCell}>{t.city || 'City'}</th>
              <th style={styles.tableHeaderCell}>{t.village || 'Village'}</th>
              <th style={styles.tableHeaderCell}>{t.language || 'Language'}</th>
              <th style={styles.tableHeaderCell}>{t.role || 'Role'}</th>
            </tr>
          </thead>
          <tbody>
            {(farmStats || []).map(farmer => (
              <tr key={farmer._id} style={styles.tableRow}>
                <td style={{...styles.tableCell, ...styles.nameCell}}>{farmer.name}</td>
                <td style={{...styles.tableCell, ...styles.phoneCell}}>{farmer.phone}</td>
                <td style={{...styles.tableCell, ...styles.locationCell}}>{farmer.district}</td>
                <td style={{...styles.tableCell, ...styles.locationCell}}>{farmer.city}</td>
                <td style={{...styles.tableCell, ...styles.locationCell}}>{farmer.village}</td>
                <td style={{...styles.tableCell, ...styles.languageCell}}>{farmer.language}</td>
                <td style={{...styles.tableCell, ...styles.roleCell}}>{farmer.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* We don't need the farmer details modal anymore since we're showing all farmer details */}
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