import { useState, useEffect } from "react";
import { useLanguage } from "../hooks/useLanguage";
import api from "../services/api";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    city: "",
    district: "",
    village: "",
    language: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { lang, setLang, t } = useLanguage();

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
        
        if (role === "FARMER" && token) {
          // Fetch from backend API
          const response = await api.get("/dashboard/farmer/profile");
          const farmer = response.data;
          
          setUser({
            name: farmer.name,
            phone: farmer.phone,
            city: farmer.city,
            district: farmer.district,
            village: farmer.village,
            language: farmer.language || "en"
          });
          setEditData({
            name: farmer.name,
            phone: farmer.phone,
            city: farmer.city,
            district: farmer.district,
            village: farmer.village,
            language: farmer.language || "en"
          });
          
          // Update localStorage
          localStorage.setItem("userName", farmer.name);
          localStorage.setItem("userPhone", farmer.phone);
          localStorage.setItem("userCity", farmer.city);
          localStorage.setItem("userDistrict", farmer.district);
          localStorage.setItem("userVillage", farmer.village);
          // Removed lang storage as we're no longer persisting language in localStorage
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Fallback to localStorage if API fails
        const phone = localStorage.getItem("userPhone") || "Not available";
        setUser({
          name: localStorage.getItem("userName") || "Farmer",
          phone: phone,
          city: localStorage.getItem("userCity") || "",
          district: localStorage.getItem("userDistrict") || "",
          village: localStorage.getItem("userVillage") || "",
          language: "en"  // Default to English as we're not persisting language in localStorage
        });
        setEditData({
          name: localStorage.getItem("userName") || "",
          phone: phone,
          city: localStorage.getItem("userCity") || "",
          district: localStorage.getItem("userDistrict") || "",
          village: localStorage.getItem("userVillage") || "",
          language: localStorage.getItem("lang") || "en"
        });
      }
    };

    fetchUserDetails();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setIsOpen(false);
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      // Update profile in backend database
      const response = await api.put("/dashboard/farmer/profile", {
        name: editData.name,
        phone: editData.phone,
        city: editData.city,
        district: editData.district,
        village: editData.village,
        language: editData.language
      });
      
      const updatedFarmer = response.data.farmer;
      
      // Update local state
      setUser({
        name: updatedFarmer.name,
        phone: updatedFarmer.phone,
        city: updatedFarmer.city,
        district: updatedFarmer.district,
        village: updatedFarmer.village,
        language: updatedFarmer.language
      });
      
      // Update localStorage to reflect changes across the website
      localStorage.setItem("userName", updatedFarmer.name);
      localStorage.setItem("userPhone", updatedFarmer.phone);
      localStorage.setItem("userCity", updatedFarmer.city);
      localStorage.setItem("userDistrict", updatedFarmer.district);
      localStorage.setItem("userVillage", updatedFarmer.village);
      // Removed lang storage as we're no longer persisting language in localStorage
      
      // Update language context
      setLang(updatedFarmer.language);
      
      setSuccess("Profile updated successfully!");
      
      // Close edit mode and refresh the page to reflect changes
      setTimeout(() => {
        setIsEditing(false);
        window.location.reload(); // Refresh to update navbar and other components
      }, 1000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset edit data to current user data
    if (user) {
      setEditData({
        name: user.name,
        phone: user.phone,
        city: user.city,
        district: user.district,
        village: user.village,
        language: user.language
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी" },
    { code: "bn", name: "বাংলা" },
    { code: "ta", name: "தமிழ்" },
    { code: "te", name: "తెలుగు" },
    { code: "mr", name: "मराठी" }
  ];

  return (
    <div className="profile" style={styles.profile}>
      <div 
        className="avatar" 
        style={styles.avatar}
        onClick={() => setIsOpen(!isOpen)}
      >
        👤
      </div>
      
      {isOpen && !isEditing && (
        <div className="dropdown" style={styles.dropdown}>
          <div style={styles.userInfo}>
            <strong>{user?.name || "Farmer"}</strong>
            <small>{user?.district ? `${user.district}, ${user.state || user.city}` : "Location not set"}</small>
          </div>
          <div style={styles.menuItems}>
            <div style={styles.menuItem} onClick={handleEdit}>
              Edit Profile
            </div>
            <div style={styles.menuItem}>
              <select 
                value={lang} 
                onChange={(e) => {
                  const selectedLang = e.target.value;
                  setLang(selectedLang);
                  
                  // Dispatch a custom event to notify other parts of the app about language change
                  window.dispatchEvent(new Event('languageChanged'));
                }}
                style={styles.languageSelect}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <div style={styles.logoutMenuItem} onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>
      )}
      
      {isEditing && (
        <div className="edit-profile" style={styles.editProfile}>
          <h3>Edit Profile</h3>
          
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={styles.successMessage}>
              {success}
            </div>
          )}
          
          <div style={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({...editData, name: e.target.value})}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Phone:</label>
            <input
              type="tel"
              value={editData.phone}
              onChange={(e) => setEditData({...editData, phone: e.target.value})}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>City:</label>
            <input
              type="text"
              value={editData.city}
              onChange={(e) => setEditData({...editData, city: e.target.value})}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>District:</label>
            <input
              type="text"
              value={editData.district}
              onChange={(e) => setEditData({...editData, district: e.target.value})}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Village:</label>
            <input
              type="text"
              value={editData.village}
              onChange={(e) => setEditData({...editData, village: e.target.value})}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Language:</label>
            <select
              value={editData.language}
              onChange={(e) => {
                setEditData({...editData, language: e.target.value});
                
                // Update language context if this is the active language
                if (e.target.value !== lang) {
                  setLang(e.target.value);
                  
                  // Dispatch a custom event to notify other parts of the app about language change
                  window.dispatchEvent(new Event('languageChanged'));
                }
              }}
              style={styles.select}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          <div style={styles.buttonGroup}>
            <button onClick={handleSave} style={styles.saveButton} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button onClick={handleCancel} style={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  profile: {
    position: 'relative',
    display: 'inline-block'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
    userSelect: 'none'
  },
  dropdown: {
    position: 'absolute',
    top: '50px',
    right: '0',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '250px',
    zIndex: 1000,
    padding: '15px'
  },
  userInfo: {
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '10px'
  },
  menuItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  menuItem: {
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '3px'
  },
  logoutMenuItem: {
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '3px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    fontWeight: '600',
    border: '1px solid #ffcdd2',
    transition: 'all 0.3s ease'
  },
  logoutMenuItemHover: {
    backgroundColor: '#ffcdd2',
    color: '#b71c1c'
  },
  menuItemHover: {
    backgroundColor: '#f5f5f5'
  },
  languageSelect: {
    width: '100%',
    padding: '5px',
    border: '1px solid #ddd',
    borderRadius: '3px'
  },
  editProfile: {
    position: 'absolute',
    top: '50px',
    right: '0',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '300px',
    zIndex: 1000,
    padding: '20px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    marginTop: '5px',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    marginTop: '5px',
    boxSizing: 'border-box'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px'
  },
  saveButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer'
  },
  cancelButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer'
  },
  errorMessage: {
    padding: '10px',
    marginBottom: '15px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '5px',
    fontSize: '14px',
    textAlign: 'center'
  },
  successMessage: {
    padding: '10px',
    marginBottom: '15px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: '5px',
    fontSize: '14px',
    textAlign: 'center'
  }
};