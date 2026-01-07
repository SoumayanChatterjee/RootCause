const router = require("express").Router();
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");
const { getMyProfile, updateMyProfile } = require("../controllers/farmerController");
const { 
  getAllFarmers, 
  getDashboardStats, 
  getFarmStats,
  getRegionOverview,
  getWeatherAlerts,
  getFarmersByDistrict 
} = require("../controllers/adminController");

// Farmer dashboard
router.get(
  "/farmer/profile",
  verifyToken,
  allowRoles("FARMER"),
  getMyProfile
);

// Update farmer profile
router.put(
  "/farmer/profile",
  verifyToken,
  allowRoles("FARMER"),
  updateMyProfile
);

// Admin dashboard
router.get(
  "/admin/farmers",
  verifyToken,
  allowRoles("ADMIN"),
  getAllFarmers
);

// Admin dashboard stats
router.get(
  "/admin/stats",
  verifyToken,
  allowRoles("ADMIN"),
  getDashboardStats
);

// Admin farm statistics
router.get(
  "/admin/farm-stats",
  verifyToken,
  allowRoles("ADMIN"),
  getFarmStats
);

// Admin region overview
router.get(
  "/admin/region-overview",
  verifyToken,
  allowRoles("ADMIN"),
  getRegionOverview
);

// Admin weather alerts for specific location
router.get(
  "/admin/weather-alerts/:location",
  verifyToken,
  allowRoles("ADMIN"),
  getWeatherAlerts
);

// Admin farmer details by district
router.get(
  "/admin/farm-statistics/:district/farmers",
  verifyToken,
  allowRoles("ADMIN"),
  getFarmersByDistrict
);

module.exports = router;