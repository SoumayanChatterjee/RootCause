import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organisationName: "",
    password: "",
    confirmPassword: "",
    state: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/admin/signup", {
        name: formData.name,
        email: formData.email,
        organisationName: formData.organisationName,
        password: formData.password,
        state: formData.state
      });

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", "ADMIN");
      
      setMessage("Registration successful! Redirecting...");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <span style={styles.logo}>🧑‍💼</span>
          <h2 style={styles.title}>Admin Registration</h2>
          <p style={styles.subtitle}>Create your admin account</p>
        </div>
        
        {message && (
          <div style={{
            ...styles.message,
            ...(message.includes('Error') || message.includes('not') || message.includes('do not') ? styles.errorMessage : {})
          }}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Admin Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Organisation Name</label>
            <input
              type="text"
              name="organisationName"
              value={formData.organisationName}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter organisation name"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter your state"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Create a password"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        
        <div style={styles.loginLink}>
          Already have an account? <span onClick={() => navigate("/login/admin")} style={styles.link}>Login</span>
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
    background: "linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%)",
    padding: "20px"
  },
  formContainer: {
    background: "#fff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    width: "500px",
    maxWidth: "100%",
    maxHeight: "90vh",
    overflowY: "auto"
  },
  header: {
    textAlign: "center",
    marginBottom: "25px"
  },
  logo: {
    fontSize: "56px",
    display: "block",
    marginBottom: "15px"
  },
  title: {
    fontSize: "28px",
    color: "#1565c0",
    margin: "10px 0",
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    margin: "5px 0 0 0"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333"
  },
  input: {
    padding: "12px 15px",
    border: "2px solid #e0e0e0",
    borderRadius: "10px",
    fontSize: "15px",
    transition: "border-color 0.3s ease",
    outline: "none"
  },
  button: {
    padding: "14px",
    backgroundColor: "#1e88e5",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "10px"
  },
  buttonDisabled: {
    backgroundColor: "#90caf9",
    cursor: "not-allowed"
  },
  message: {
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "10px",
    textAlign: "center",
    backgroundColor: "#e3f2fd",
    color: "#1565c0",
    fontSize: "14px",
    fontWeight: "500"
  },
  errorMessage: {
    backgroundColor: "#ffebee",
    color: "#c62828"
  },
  loginLink: {
    marginTop: "25px",
    textAlign: "center",
    fontSize: "14px",
    color: "#666"
  },
  link: {
    color: "#1e88e5",
    cursor: "pointer",
    fontWeight: "600",
    transition: "color 0.3s ease"
  }
};

export default AdminSignup;