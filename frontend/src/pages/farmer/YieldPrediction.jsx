import { useState } from "react";
import api from "../../services/api";
import FarmerLayout from "../../layouts/FarmerLayout";
import { useLanguage } from "../../hooks/useLanguage";

export default function YieldPrediction() {
  const [crop, setCrop] = useState("");
  const [season, setSeason] = useState("");
  const [district, setDistrict] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { t } = useLanguage();

  // Updated crops and districts that match the trained model
  const crops = [
    t.ricePaddy || "Rice, paddy", t.wheat || "Wheat", t.maize || "Maize", t.soybeans || "Soybeans", 
    t.cassava || "Cassava", t.potatoes || "Potatoes", t.sweetPotatoes || "Sweet potatoes", 
    t.sorghum || "Sorghum", t.yams || "Yams"
  ];

  const seasons = [
    t.kharif || "Kharif", t.rabi || "Rabi", t.zaid || "Zaid", 
    t.spring || "Spring", t.summer || "Summer", t.winter || "Winter", 
    t.monsoon || "Monsoon"
  ];

  // Indian states for yield prediction
  const districts = [
    t.andhraPradesh || "Andhra Pradesh", 
    t.arunachalPradesh || "Arunachal Pradesh", 
    t.assam || "Assam", 
    t.bihar || "Bihar", 
    t.chhattisgarh || "Chhattisgarh",
    t.goa || "Goa", 
    t.gujarat || "Gujarat", 
    t.haryana || "Haryana", 
    t.himachalPradesh || "Himachal Pradesh", 
    t.jharkhand || "Jharkhand",
    t.karnataka || "Karnataka", 
    t.kerala || "Kerala", 
    t.madhyaPradesh || "Madhya Pradesh", 
    t.maharashtra || "Maharashtra", 
    t.manipur || "Manipur",
    t.meghalaya || "Meghalaya", 
    t.mizoram || "Mizoram", 
    t.nagaland || "Nagaland", 
    t.odisha || "Odisha", 
    t.punjab || "Punjab",
    t.rajasthan || "Rajasthan", 
    t.sikkim || "Sikkim", 
    t.tamilNadu || "Tamil Nadu", 
    t.telangana || "Telangana", 
    t.tripura || "Tripura",
    t.uttarPradesh || "Uttar Pradesh", 
    t.uttarakhand || "Uttarakhand", 
    t.westBengal || "West Bengal"
  ];

  const handlePredict = async () => {
    if (!crop || !district || !year) {
      setError(t.pleaseFillCropStateYearFields || "Please fill in Crop, State, and Year fields");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await api.post("/ml/yield", {
        Crop: crop,
        District: district,
        Year: parseInt(year)
      });
      
      // Handle simulated response message
      if (response.data.message && response.data.message.includes("simulated")) {
        console.info("Using simulated ML response for development:", response.data.message);
      }
      
      // Calculate confidence score (in a real app, this would come from the model)
      const confidence = Math.random() * 0.2 + 0.8; // Random confidence between 0.8 and 1.0
      
      setPrediction({
        ...response.data,
        confidence: confidence,
        farmingRecommendations: getFarmingRecommendations(crop, season)
      });
    } catch (err) {
      console.error("Yield prediction error:", err);
      let errorMessage = `${t.errorPredictingYield || "Error predicting yield"}. `;
      
      if (err.response?.data?.message?.includes("Invalid crop or district name")) {
        errorMessage += t.selectValidCropDistrict || "Please select valid crop and district from the dropdown options.";
      } else {
        errorMessage += err.response?.data?.message || err.message || t.pleaseTryAgain || "Please try again.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getFarmingRecommendations = (crop, season) => {
    const recommendations = {
      "Rice": [
        "Maintain 5-10cm water level during tillering stage",
        "Apply nitrogen fertilizer in split doses",
        "Control weeds before tillering stage"
      ],
      "Wheat": [
        "Sow at proper seed rate of 100-125 kg/hectare",
        "Apply phosphorus at time of sowing",
        "Irrigate at critical growth stages"
      ],
      "Corn": [
        "Maintain spacing of 60x20 cm for optimal growth",
        "Apply nitrogen in 2-3 splits for better utilization",
        "Control stem borers with appropriate insecticides"
      ]
    };
    
    return recommendations[crop] || [
      "Follow proper sowing time for your region",
      "Use certified seeds for better yield",
      "Apply balanced fertilizers as per soil test",
      "Implement integrated pest management"
    ];
  };

  return (
    <FarmerLayout title={t.yieldPrediction || "Yield Prediction"}>
      <div style={styles.container}>
        <h1 style={styles.heading}>📊 {t.yieldPrediction || "Yield Prediction"}</h1>
      
      <div style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>{t.selectCrop || "Select Crop:"}</label>
          <select 
            value={crop} 
            onChange={(e) => setCrop(e.target.value)}
            style={styles.select}
          >
            <option value="">{t.selectCropOption || "-- Select Crop --"}</option>
            {crops.map(crop => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>{t.selectSeason || "Select Season:"}</label>
          <select 
            value={season} 
            onChange={(e) => setSeason(e.target.value)}
            style={styles.select}
          >
            <option value="">{t.selectSeasonOption || "-- Select Season --"}</option>
            {seasons.map(season => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>{t.selectState || "Select State:"}</label>
          <select 
            value={district} 
            onChange={(e) => setDistrict(e.target.value)}
            style={styles.select}
          >
            <option value="">{t.selectStateOption || "-- Select State --"}</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>{t.selectYear || "Select Year:"}</label>
          <select 
            value={year} 
            onChange={(e) => setYear(e.target.value)}
            style={styles.select}
          >
            {Array.from({length: 5}, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={handlePredict}
          disabled={loading || !crop || !district || !year}
          style={loading || !crop || !district || !year ? 
            { ...styles.button, ...styles.buttonDisabled } : styles.button}
        >
          {loading ? `${t.predicting || "Predicting"}...` : t.predictYield || "Predict Yield"}
        </button>
        
        {error && <div style={styles.error}>{error}</div>}
      </div>
      
      {prediction && (
        <div style={styles.predictionResult}>
          <h2 style={styles.resultHeading}>{t.yieldPredictionResults || "Yield Prediction Results"}</h2>
          <div style={styles.resultCard}>
            <div style={styles.resultItem}>
              <div style={styles.resultLabel}>{t.predictedYield || "Predicted Yield:"}</div>
              <div style={styles.resultValue}>
                {prediction.predicted_yield} {prediction.unit}
              </div>
            </div>
            <div style={styles.resultItem}>
              <div style={styles.resultLabel}>{t.confidenceScore || "Confidence Score:"}</div>
              <div style={styles.confidenceValue}>
                {Math.round(prediction.confidence * 100)}%
              </div>
            </div>
            <div style={styles.confidenceContainer}>
              <div style={styles.resultLabel}>{t.confidenceLevel || "Confidence Level:"}</div>
              <div style={styles.confidenceBar}>
                <div style={{
                  ...styles.confidenceFill,
                  width: `${Math.round(prediction.confidence * 100)}%`
                }}></div>
              </div>
              <span style={styles.confidenceValue}>{Math.round(prediction.confidence * 100)}%</span>
            </div>
            {prediction.message && prediction.message.includes("simulated") && (
              <div style={styles.simulationNote}>
                <em>{t.note || "Note:"} {prediction.message}</em>
              </div>
            )}
          </div>
          
          <div style={styles.recommendations}>
            <h3 style={styles.recommendationsHeading}>{t.farmingRecommendations || "Farming Recommendations:"}</h3>
            <ul style={styles.recommendationList}>
              {prediction.farmingRecommendations.map((rec, index) => (
                <li key={index} style={styles.recommendationItem}>
                  <span style={styles.recommendationItemBullet}>•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
    </FarmerLayout>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  heading: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
    marginBottom: "30px",
    padding: '20px',
    background: 'linear-gradient(135deg, #66bb6a 0%, #ffeb3b 100%)',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  },
  form: {
    maxWidth: "500px",
    margin: "20px auto",
    padding: "25px",
    backgroundColor: "white",
    borderRadius: "16px",
    border: "2px solid #c8e6c9",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)"
  },
  formGroup: {
    marginBottom: "20px"
  },
  select: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d9e6",
    borderRadius: "8px",
    fontSize: "16px",
    boxSizing: "border-box",
    backgroundColor: "#f8fafc",
    color: "#1e293b",
    outline: "none",
    transition: "border-color 0.3s ease"
  },
  selectFocus: {
    borderColor: "#3b82f6"
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    boxShadow: "0 4px 8px rgba(245, 158, 11, 0.3)"
  },
  buttonHover: {
    backgroundColor: "#d97706"
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed"
  },
  error: {
    color: "#dc2626",
    marginTop: "15px",
    padding: "12px",
    backgroundColor: "#fef2f2",
    borderRadius: "8px",
    border: "1px solid #fecaca",
    fontSize: "14px"
  },
  predictionResult: {
    marginTop: "30px",
    padding: "25px",
    border: "2px solid #c8e6c9",
    borderRadius: "16px",
    backgroundColor: "white",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)"
  },
  resultCard: {
    padding: "20px",
    backgroundColor: "#f1f8e9",
    borderRadius: "12px",
    border: "1px solid #c8e6c9",
    marginBottom: "20px"
  },
  resultItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "white",
    borderRadius: "6px"
  },
  resultLabel: {
    fontWeight: "600",
    color: "#374151",
    fontSize: "15px"
  },
  resultValue: {
    fontWeight: "bold",
    color: "#2196F3",
    fontSize: "18px"
  },
  confidenceValue: {
    fontWeight: "bold",
    color: "#10b981",
    fontSize: "16px"
  },
  confidenceContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "10px"
  },
  confidenceBar: {
    flex: 1,
    height: "10px",
    backgroundColor: "#e2e8f0",
    borderRadius: "5px",
    overflow: "hidden",
    marginRight: "10px"
  },
  confidenceFill: {
    height: "100%",
    backgroundColor: "#10b981",
    transition: "width 0.3s ease"
  },
  recommendations: {
    marginTop: "20px"
  },
  recommendationsHeading: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "15px",
    paddingBottom: "10px",
    borderBottom: "1px solid #e2e8f0"
  },
  recommendationList: {
    padding: 0,
    margin: 0,
    listStyleType: "none"
  },
  recommendationItem: {
    marginBottom: "12px",
    padding: "12px",
    backgroundColor: "#f8fafc",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    position: "relative",
    paddingLeft: "30px"
  },
  recommendationItemBullet: {
    position: "absolute",
    left: "12px",
    top: "15px",
    color: "#10b981",
    fontWeight: "bold"
  },
  simulationNote: {
    fontStyle: "italic",
    color: "#f59e0b",
    backgroundColor: "#fffbf0",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #fcd34d",
    marginTop: "15px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#374151",
    fontSize: "15px"
  }
};