import { useState } from "react";
import api from "../../services/api";
import FarmerLayout from "../../layouts/FarmerLayout";

export default function DiseaseDetection() {
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const crops = [
    "Rice", "Wheat", "Corn", "Sugarcane", 
    "Cotton", "Soybean", "Potato", "Tomato"
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError("");
    }
  };

  const handleDetect = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);
      
      const response = await api.post("/ml/disease", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Handle simulated response message
      if (response.data.message && response.data.message.includes("simulated")) {
        console.info("Using simulated ML response for development:", response.data.message);
      }
      
      // Calculate severity based on confidence
      let severity = "Low";
      if (response.data.confidence > 0.8) {
        severity = "High";
      } else if (response.data.confidence > 0.6) {
        severity = "Medium";
      }
      
      setResult({
        ...response.data,
        severity,
        explanation: getDiseaseExplanation(response.data.disease)
      });
    } catch (err) {
      console.error("Disease detection error:", err);
      setError(`Error detecting disease: ${err.response?.data?.message || err.message || "Please try again"}`);
    } finally {
      setLoading(false);
    }
  };

  const getDiseaseExplanation = (disease) => {
    const explanations = {
      "Healthy": "Your crop appears to be healthy. Continue with regular care and monitoring.",
      "Leaf_Blight": "Leaf blight is a fungal disease that affects the leaves, causing brown or yellow spots and eventual leaf death. It spreads through spores in humid conditions.",
      "Rust": "Rust is a fungal disease characterized by orange or brown pustules on leaves. It weakens plants by extracting nutrients and can spread rapidly in favorable conditions."
    };
    
    return explanations[disease] || "Disease information not available.";
  };

  return (
    <FarmerLayout title="Disease Detection">
      <div style={styles.container}>
        <h1 style={styles.heading}>🔬 Crop Disease Detection</h1>
        
        <div style={styles.content}>
        <div style={styles.uploadSection}>
          <div style={styles.formGroup}>
            <label style={styles.resultSubheading}>Select Crop Type:</label>
            <select 
              value={selectedCrop} 
              onChange={(e) => setSelectedCrop(e.target.value)}
              style={styles.select}
            >
              <option value="">-- Select Crop --</option>
              {crops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.resultSubheading}>Upload Crop Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={styles.fileInput}
            />
          </div>
          
          {previewUrl && (
            <div style={styles.imagePreview}>
              <img src={previewUrl} alt="Preview" style={styles.previewImage} />
            </div>
          )}
          
          <button 
            onClick={handleDetect}
            disabled={loading || !selectedImage}
            style={loading || !selectedImage ? { ...styles.detectButton, ...styles.detectButtonDisabled } : styles.detectButton}
          >
            {loading ? "Detecting..." : "Detect Disease"}
          </button>
          
          {error && <div style={styles.error}>{error}</div>}
        </div>
        
        {result && (
          <div style={styles.resultSection}>
            <h2 style={styles.resultHeading}>Detection Results</h2>
            <div style={styles.resultCard}>
              <h3 style={styles.resultSubheading}>Disease: <span style={styles.diseaseName}>{result.disease}</span></h3>
              
              <div style={styles.confidenceContainer}>
                <div style={styles.resultSubheading}>Confidence:</div>
                <div style={styles.confidenceBar}>
                  <div style={{
                    ...styles.confidenceFill,
                    width: `${(result.confidence * 100)}%`
                  }}></div>
                </div>
                <span style={styles.resultText}>{(result.confidence * 100).toFixed(2)}%</span>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                <div style={styles.resultSubheading}>Severity:</div>
                <span style={{
                  ...styles.severity,
                  ...(result.severity === "High" ? styles.severityHigh : 
                     result.severity === "Medium" ? styles.severityMedium : styles.severityLow)
                }}>
                  {result.severity}
                </span>
              </div>
              
              {result.message && result.message.includes("simulated") && (
                <p style={styles.simulationNote}><em>Note: {result.message}</em></p>
              )}
              
              <div style={{ marginTop: "15px" }}>
                <div style={styles.resultSubheading}>Explanation:</div>
                <p style={styles.resultText}>{result.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </FarmerLayout>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
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
  content: {
    display: "flex",
    gap: "30px",
    marginTop: "20px",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  uploadSection: {
    flex: 1,
    minWidth: "350px",
    maxWidth: "500px",
    padding: "25px",
    border: "2px solid #c8e6c9",
    borderRadius: "16px",
    backgroundColor: "white",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)"
  },
  formGroup: {
    marginBottom: "20px"
  },
  select: {
    width: "100%",
    padding: "12px",
    border: "2px solid #c8e6c9",
    borderRadius: "10px",
    fontSize: "16px",
    backgroundColor: "#f1f8e9",
    color: "#2d5016",
    outline: "none",
    transition: "border-color 0.3s ease"
  },
  selectFocus: {
    borderColor: "#3b82f6"
  },
  fileInput: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d9e6",
    borderRadius: "8px",
    fontSize: "16px",
    backgroundColor: "#f8fafc",
    color: "#1e293b",
    outline: "none",
    transition: "border-color 0.3s ease"
  },
  imagePreview: {
    marginBottom: "20px",
    textAlign: "center",
    padding: "10px",
    border: "2px dashed #d1d9e6",
    borderRadius: "8px",
    backgroundColor: "#f8fafc"
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "250px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    objectFit: "contain"
  },
  detectButton: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    boxShadow: "0 4px 8px rgba(76, 175, 80, 0.3)"
  },
  detectButtonHover: {
    backgroundColor: "#059669"
  },
  detectButtonDisabled: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed"
  },
  resultSection: {
    flex: 1,
    minWidth: "350px",
    maxWidth: "500px",
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
    border: "1px solid #c8e6c9"
  },
  diseaseName: {
    color: "#dc2626",
    fontWeight: "bold",
    fontSize: "18px"
  },
  severity: {
    fontWeight: "bold",
    marginLeft: "5px",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "14px"
  },
  severityLow: {
    backgroundColor: "#dcfce7",
    color: "#166534"
  },
  severityMedium: {
    backgroundColor: "#fef3c7",
    color: "#92400e"
  },
  severityHigh: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c"
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
  simulationNote: {
    fontStyle: "italic",
    color: "#f59e0b",
    backgroundColor: "#fffbf0",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #fcd34d",
    marginBottom: "15px"
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: "10px",
    paddingBottom: "15px",
    borderBottom: "2px solid #e2e8f0"
  },
  resultHeading: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "15px",
    paddingBottom: "10px",
    borderBottom: "1px solid #e2e8f0"
  },
  resultSubheading: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#475569",
    marginBottom: "8px"
  },
  resultText: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.5"
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
  }
};