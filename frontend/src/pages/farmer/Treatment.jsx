import { useState } from "react";
import FarmerLayout from "../../layouts/FarmerLayout";
import { useLanguage } from "../../hooks/useLanguage";

export default function Treatment() {
  const [symptoms, setSymptoms] = useState([]);
  const [farmSize, setFarmSize] = useState("");
  const [affectedArea, setAffectedArea] = useState("");
  const [severity, setSeverity] = useState("");
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { t } = useLanguage();

  const symptomOptions = [
    t.yellowingLeaves || "Yellowing leaves", 
    t.brownSpotsOnLeaves || "Brown spots on leaves", 
    t.wilting || "Wilting", 
    t.stuntedGrowth || "Stunted growth", 
    t.powderyCoating || "Powdery coating", 
    t.holesInLeaves || "Holes in leaves",
    t.blackSpots || "Black spots", 
    t.rustColoredPatches || "Rust colored patches", 
    t.leafCurling || "Leaf curling", 
    t.stemCankers || "Stem cankers"
  ];

  const toggleSymptom = (symptom) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const getTreatmentRecommendation = () => {
    setLoading(true);
    
    // Simulate treatment recommendation based on inputs
    setTimeout(() => {
      const treatmentData = {
        medicine: getMedicineRecommendation(symptoms),
        dosage: `${Math.round(affectedArea * 0.5)}-1 liter per acre`,
        applicationMethod: "Foliar spray in the early morning or late evening",
        frequency: severity === "Severe" ? "Every 7 days for 3 applications" : "Every 10 days for 2 applications",
        safetyInstructions: "Wear protective equipment, avoid application during flowering, keep away from water bodies"
      };
      
      setTreatment(treatmentData);
      setLoading(false);
    }, 1000);
  };

  const getMedicineRecommendation = (symptoms) => {
    if (symptoms.includes("Yellowing leaves") && symptoms.includes("Brown spots on leaves")) {
      return "Fungicide (Mancozeb 75% WP)";
    } else if (symptoms.includes("Rust colored patches")) {
      return "Rust control fungicide (Triadimefon 25% WP)";
    } else if (symptoms.includes("Powdery coating")) {
      return "Systemic fungicide (Myconil 50% WP)";
    } else if (symptoms.includes("Holes in leaves")) {
      return "Insecticide (Chlorpyriphos 20% + Cypermethrin 2.5%)";
    } else if (symptoms.includes("Wilting")) {
      return "Bactericide (Streptomycin + Tetracycline)";
    } else {
      return "General purpose fungicide (Carbendazim 50% WP)";
    }
  };

  return (
    <FarmerLayout title={t.treatmentRecommendation || "Treatment Recommendation"}>
      <div style={styles.container}>
        <h1 style={styles.heading}>💊 {t.cropDiseaseTreatment || "Crop Disease Treatment"}</h1>
      
      <div style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>{t.selectObservedSymptoms || "Select Observed Symptoms:"}</label>
          <div style={styles.symptomGrid}>
            {symptomOptions.map(symptom => (
              <div 
                key={symptom} 
                style={symptoms.includes(symptom) ? {
                  ...styles.symptomOption,
                  ...styles.symptomOptionSelected
                } : styles.symptomOption}
                onClick={() => toggleSymptom(symptom)}
              >
                {symptom}
              </div>
            ))}
          </div>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>{t.totalFarmSizeAcres || "Total Farm Size (in acres):"}</label>
          <input
            type="number"
            value={farmSize}
            onChange={(e) => setFarmSize(e.target.value)}
            style={styles.input}
            placeholder={t.enterFarmSize || "Enter farm size"}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>{t.affectedAreaAcres || "Affected Area (in acres):"}</label>
          <input
            type="number"
            value={affectedArea}
            onChange={(e) => setAffectedArea(e.target.value)}
            style={styles.input}
            placeholder={t.enterAffectedArea || "Enter affected area"}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>{t.diseaseSeverity || "Disease Severity:"}</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            style={styles.select}
          >
            <option value="">{t.selectSeverity || "-- Select Severity --"}</option>
            <option value="Mild">{t.mild || "Mild"}</option>
            <option value="Severe">{t.severe || "Severe"}</option>
          </select>
        </div>
        
        <button 
          onClick={getTreatmentRecommendation}
          disabled={loading || symptoms.length === 0 || !farmSize || !affectedArea || !severity}
          style={loading || symptoms.length === 0 || !farmSize || !affectedArea || !severity ? 
            { ...styles.button, ...styles.buttonDisabled } : styles.button}
        >
          {loading ? `${t.gettingRecommendation || "Getting Recommendation"}...` : t.getTreatmentRecommendation || "Get Treatment Recommendation"}
        </button>
      </div>
      
      {treatment && (
        <div style={styles.treatmentResult}>
          <h2 style={styles.resultHeading}>{t.treatmentRecommendation || "Treatment Recommendation"}</h2>
          <div style={styles.resultCard}>
            <div style={styles.resultItem}>
              <div style={styles.resultLabel}>{t.recommendedMedicine || "Recommended Medicine:"}</div>
              <div style={styles.resultValue}>{treatment.medicine}</div>
            </div>
            <div style={styles.resultItem}>
              <div style={styles.resultLabel}>{t.dosage || "Dosage:"}</div>
              <div style={styles.resultValue}>{treatment.dosage}</div>
            </div>
            <div style={styles.resultItem}>
              <div style={styles.resultLabel}>{t.applicationMethod || "Application Method:"}</div>
              <div style={styles.resultValue}>{treatment.applicationMethod}</div>
            </div>
            <div style={styles.resultItem}>
              <div style={styles.resultLabel}>{t.frequency || "Frequency:"}</div>
              <div style={styles.resultValue}>{treatment.frequency}</div>
            </div>
            <div style={styles.resultItem}>
              <div style={styles.resultLabel}>{t.safetyInstructions || "Safety Instructions:"}</div>
              <div style={styles.resultValue}>{treatment.safetyInstructions}</div>
            </div>
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
    maxWidth: "600px",
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
  symptomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "10px",
    marginTop: "10px"
  },
  symptomOption: {
    padding: "12px",
    border: "2px solid #c8e6c9",
    borderRadius: "10px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.3s ease",
    backgroundColor: "#f1f8e9",
    color: "#2d5016",
    fontSize: "14px"
  },
  symptomOptionSelected: {
    backgroundColor: "#66bb6a",
    color: "white",
    borderColor: "#4caf50"
  },
  input: {
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
  inputFocus: {
    borderColor: "#3b82f6"
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
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    boxShadow: "0 4px 8px rgba(59, 130, 246, 0.3)"
  },
  buttonHover: {
    backgroundColor: "#2563eb"
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed"
  },
  treatmentResult: {
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
    border: "1px solid #c8e6c9"
  },
  resultHeading: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "15px",
    paddingBottom: "10px",
    borderBottom: "1px solid #e2e8f0"
  },
  resultItem: {
    marginBottom: "15px",
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "white",
    borderRadius: "6px"
  },
  resultLabel: {
    fontWeight: "600",
    color: "#374151",
    marginBottom: "5px",
    fontSize: "14px"
  },
  resultValue: {
    color: "#6b7280",
    fontSize: "15px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#374151",
    fontSize: "15px"
  }
};