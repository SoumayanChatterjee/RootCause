import FarmerLayout from "../../layouts/FarmerLayout";
import { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import api from "../../services/api";

export default function FarmerDashboard() {
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { t } = useLanguage();

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
      setError(t.pleaseSelectImage || "Please select an image first");
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
      
      if (response.data.message && response.data.message.includes("simulated")) {
        console.info("Using simulated ML response for development:", response.data.message);
      }
      
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
      setError(`${t.errorDetectingDisease || 'Error detecting disease'}: ${err.response?.data?.message || err.message || t.pleaseTryAgain || "Please try again"}`);
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
        <div style={styles.hero}>
          <h1 style={styles.title}>🌿 {t.cropDiseaseDetection || 'Crop Disease Detection'}</h1>
          <p style={styles.subtitle}>{t.uploadCropImagePrompt || 'Upload an image of your crop to detect diseases and get instant analysis'}</p>
        </div>
        
        <div style={styles.content}>
          <div style={styles.uploadSection}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>📸 {t.uploadImage || 'Upload Image'}</h2>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>{t.selectCropType || 'Select Crop Type'}:</label>
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
                <label style={styles.label}>{t.uploadCropImage || 'Upload Crop/Leaf Image'}:</label>
                <div style={styles.fileInputWrapper}>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleImageChange}
                    style={styles.fileInput}
                    id="fileInput"
                  />
                  <label htmlFor="fileInput" style={styles.fileInputLabel}>
                    📁 {t.chooseImage || 'Choose Image'}
                  </label>
                  {selectedImage && <span style={styles.fileName}>{selectedImage.name}</span>}
                </div>
                <p style={styles.hint}>{t.supportedFormats || 'Supported formats: .jpg, .jpeg, .png, .webp'}</p>
              </div>
              
              {previewUrl && (
                <div style={styles.imagePreview}>
                  <img src={previewUrl} alt="Preview" style={styles.previewImage} />
                </div>
              )}
              
              <button 
                onClick={handleDetect}
                disabled={loading || !selectedImage}
                style={loading || !selectedImage ? 
                  { ...styles.detectButton, ...styles.detectButtonDisabled } : styles.detectButton}
              >
                {loading ? `🔄 ${t.detecting || 'Detecting'}...` : `🔬 ${t.detectDisease || 'Detect Disease'}`}
              </button>
              
              {error && <div style={styles.error}>{error}</div>}
            </div>
          </div>
          
          {result && (
            <div style={styles.resultSection}>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>📄 {t.detectionResults || 'Detection Results'}</h2>
                
                <div style={styles.resultCard}>
                  <div style={styles.resultItem}>
                    <div style={styles.resultLabel}>{t.diseaseDetected || 'Disease Detected'}:</div>
                    <div style={styles.diseaseName}>{result.disease}</div>
                  </div>
                  
                  <div style={styles.resultItem}>
                    <div style={styles.resultLabel}>{t.confidenceLevel || 'Confidence Level'}:</div>
                    <div style={styles.confidenceContainer}>
                      <div style={styles.confidenceBar}>
                        <div style={{
                          ...styles.confidenceFill,
                          width: `${(result.confidence * 100)}%`
                        }}></div>
                      </div>
                      <span style={styles.confidenceText}>{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div style={styles.resultItem}>
                    <div style={styles.resultLabel}>{t.severityLevel || 'Severity Level'}:</div>
                    <span style={{
                      ...styles.severityBadge,
                      ...(result.severity === "High" ? styles.severityHigh : 
                         result.severity === "Medium" ? styles.severityMedium : styles.severityLow)
                    }}>
                      {result.severity}
                    </span>
                  </div>
                  
                  {result.message && result.message.includes("simulated") && (
                    <div style={styles.simulationNote}>
                      <em>⚠️ {t.note || 'Note'}: {result.message}</em>
                    </div>
                  )}
                  
                  <div style={styles.explanationBox}>
                    <div style={styles.resultLabel}>📝 {t.explanation || 'Explanation'}:</div>
                    <p style={styles.explanationText}>{result.explanation}</p>
                  </div>
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
  hero: {
    textAlign: 'center',
    padding: '30px 20px',
    background: 'linear-gradient(135deg, #66bb6a 0%, #ffeb3b 100%)',
    borderRadius: '16px',
    marginBottom: '30px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#1b5e20',
    margin: '0 0 10px 0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
  },
  subtitle: {
    fontSize: '18px',
    color: '#2d5016',
    margin: 0
  },
  content: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  uploadSection: {
    flex: '1',
    minWidth: '350px',
    maxWidth: '500px'
  },
  resultSection: {
    flex: '1',
    minWidth: '350px',
    maxWidth: '500px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    border: '2px solid #c8e6c9'
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2d5016',
    marginTop: 0,
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #c8e6c9'
  },
  formGroup: {
    marginBottom: '25px'
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '600',
    color: '#2d5016',
    fontSize: '15px'
  },
  select: {
    width: '100%',
    padding: '14px',
    border: '2px solid #c8e6c9',
    borderRadius: '10px',
    fontSize: '16px',
    backgroundColor: '#f1f8e9',
    color: '#2d5016',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    cursor: 'pointer'
  },
  fileInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  fileInput: {
    display: 'none'
  },
  fileInputLabel: {
    display: 'inline-block',
    padding: '14px 24px',
    backgroundColor: '#66bb6a',
    color: 'white',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease'
  },
  fileName: {
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic'
  },
  hint: {
    fontSize: '12px',
    color: '#666',
    marginTop: '8px',
    fontStyle: 'italic'
  },
  imagePreview: {
    marginBottom: '25px',
    textAlign: 'center',
    padding: '15px',
    border: '3px dashed #c8e6c9',
    borderRadius: '12px',
    backgroundColor: '#f1f8e9'
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '10px',
    objectFit: 'contain'
  },
  detectButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 8px rgba(76, 175, 80, 0.3)'
  },
  detectButtonDisabled: {
    backgroundColor: '#9e9e9e',
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  error: {
    color: '#d32f2f',
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#ffebee',
    borderRadius: '8px',
    border: '1px solid #ef9a9a',
    fontSize: '14px'
  },
  resultCard: {
    padding: '20px',
    backgroundColor: '#f1f8e9',
    borderRadius: '12px'
  },
  resultItem: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '10px',
    border: '1px solid #c8e6c9'
  },
  resultLabel: {
    fontWeight: '600',
    color: '#2d5016',
    marginBottom: '8px',
    fontSize: '15px'
  },
  diseaseName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: '5px'
  },
  confidenceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '8px'
  },
  confidenceBar: {
    flex: 1,
    height: '12px',
    backgroundColor: '#e0e0e0',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    transition: 'width 0.5s ease',
    borderRadius: '6px'
  },
  confidenceText: {
    fontWeight: 'bold',
    color: '#4caf50',
    fontSize: '16px'
  },
  severityBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: '600',
    fontSize: '14px',
    marginTop: '8px'
  },
  severityLow: {
    backgroundColor: '#c8e6c9',
    color: '#1b5e20'
  },
  severityMedium: {
    backgroundColor: '#fff9c4',
    color: '#f57f17'
  },
  severityHigh: {
    backgroundColor: '#ffcdd2',
    color: '#b71c1c'
  },
  simulationNote: {
    fontStyle: 'italic',
    color: '#f57c00',
    backgroundColor: '#fff3e0',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ffb74d',
    marginTop: '15px',
    fontSize: '13px'
  },
  explanationBox: {
    marginTop: '15px'
  },
  explanationText: {
    color: '#424242',
    lineHeight: '1.6',
    margin: '5px 0 0 0'
  }
};