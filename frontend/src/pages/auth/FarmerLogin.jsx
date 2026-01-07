import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import api from "../../services/api";

function FarmerLogin() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/farmer/login", {
        phone: formData.phone
      });

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", "FARMER");
      
      // Store user details for profile
      if (response.data.farmer) {
        localStorage.setItem("userName", response.data.farmer.name);
        localStorage.setItem("userPhone", response.data.farmer.phone);
        localStorage.setItem("userCity", response.data.farmer.city);
        localStorage.setItem("userDistrict", response.data.farmer.district);
        localStorage.setItem("userVillage", response.data.farmer.village);
        localStorage.setItem("userLanguage", response.data.farmer.language);
      }
      
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/farmer/dashboard");
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <span style={styles.logo}>🌱</span>
          <h2 style={styles.title}>Farmer Login</h2>
          <p style={styles.subtitle}>Enter your phone number to continue</p>
        </div>
        
        {message && <div style={styles.message}>{message}</div>}
        
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label>{t.phone}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div style={styles.signupLink}>
          Don't have an account? <span onClick={() => navigate("/signup/farmer")} style={{color: '#4CAF50', cursor: 'pointer'}}>Sign up</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #66bb6a 0%, #ffeb3b 100%)",
    padding: "20px"
  },
  formContainer: {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    width: "450px",
    maxWidth: "90%"
  },
  header: {
    textAlign: "center",
    marginBottom: "30px"
  },
  logo: {
    fontSize: "48px",
    display: "block",
    marginBottom: "10px"
  },
  title: {
    color: "#2d5016",
    margin: "10px 0",
    fontSize: "28px"
  },
  subtitle: {
    color: "#666",
    fontSize: "14px",
    margin: "10px 0 0 0"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  input: {
    padding: "14px",
    border: "2px solid #c8e6c9",
    borderRadius: "10px",
    fontSize: "16px",
    backgroundColor: "#f1f8e9",
    transition: "border-color 0.3s ease"
  },
  button: {
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
  message: {
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "10px",
    textAlign: "center",
    backgroundColor: "#e8f5e9",
    color: "#2d5016",
    border: "1px solid #c8e6c9"
  },
  signupLink: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#666"
  }
};

export default FarmerLogin;