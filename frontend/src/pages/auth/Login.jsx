import { useNavigate } from "react-router-dom";
import translations from "../../utils/translations";

function Login({ language }) {
  const navigate = useNavigate();
  const t = translations[language || "en"];

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <span style={styles.logo}>🌱</span>
          <h1 style={styles.title}>RootCause</h1>
          <p style={styles.subtitle}>AI-Powered Crop Disease Detection & Yield Prediction</p>
        </div>

        <h2 style={styles.heading}>{t.login}</h2>

        <div style={styles.cards}>
          <div style={styles.card} onClick={() => navigate("/login/farmer")}>
            <div style={styles.cardIcon}>👨‍🌾</div>
            <h3 style={styles.cardTitle}>{t.farmerLogin}</h3>
            <p style={styles.cardDesc}>Access crop health tools</p>
          </div>

          <div style={styles.card} onClick={() => navigate("/login/admin")}>
            <div style={styles.cardIcon}>🧑‍💼</div>
            <h3 style={styles.cardTitle}>{t.adminLogin}</h3>
            <p style={styles.cardDesc}>Manage agricultural data</p>
          </div>
        </div>
        
        <div style={styles.signupLinks}>
          <p style={styles.signupText}>Don't have an account?</p>
          <div style={styles.linkContainer}>
            <span 
              style={styles.signupLink} 
              onClick={() => navigate("/signup/farmer")}
            >
              Farmer Signup
            </span>
            <span style={styles.divider}>|</span>
            <span 
              style={styles.signupLink} 
              onClick={() => navigate("/signup/admin")}
            >
              Admin Signup
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #66bb6a 0%, #ffeb3b 100%)",
    padding: "20px"
  },
  contentWrapper: {
    background: "white",
    borderRadius: "20px",
    padding: "50px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    maxWidth: "700px",
    width: "100%"
  },
  header: {
    textAlign: "center",
    marginBottom: "40px"
  },
  logo: {
    fontSize: "64px",
    display: "block",
    marginBottom: "15px"
  },
  title: {
    fontSize: "36px",
    color: "#2d5016",
    margin: "10px 0",
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    margin: "10px 0 0 0"
  },
  heading: {
    fontSize: "28px",
    color: "#2d5016",
    textAlign: "center",
    marginBottom: "30px",
    fontWeight: "600"
  },
  cards: {
    display: "flex",
    gap: "25px",
    marginTop: "20px",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  card: {
    flex: "1",
    minWidth: "250px",
    padding: "30px",
    border: "2px solid #c8e6c9",
    borderRadius: "16px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.3s ease",
    backgroundColor: "#f1f8e9",
    boxShadow: "0 4px 8px rgba(0,0,0,0.08)"
  },
  cardIcon: {
    fontSize: "48px",
    marginBottom: "15px"
  },
  cardTitle: {
    margin: "10px 0",
    color: "#2d5016",
    fontSize: "20px",
    fontWeight: "600"
  },
  cardDesc: {
    margin: "5px 0 0 0",
    color: "#666",
    fontSize: "14px"
  },
  signupLinks: {
    marginTop: "40px",
    textAlign: "center",
    paddingTop: "30px",
    borderTop: "1px solid #e0e0e0"
  },
  signupText: {
    color: "#666",
    fontSize: "15px",
    marginBottom: "15px"
  },
  linkContainer: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px"
  },
  signupLink: {
    color: "#4caf50",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    transition: "color 0.3s ease"
  },
  divider: {
    color: "#ccc",
    fontSize: "15px"
  }
};

export default Login;