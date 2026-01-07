const router = require("express").Router();
const multer = require("multer");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");
const { predictDisease, predictYield } = require("../controllers/mlController");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Disease Detection (requires file upload)
router.post(
  "/disease",
  verifyToken,
  allowRoles("FARMER", "ADMIN"),
  upload.single("file"),
  predictDisease
);

// Yield Prediction (no file upload needed)
router.post(
  "/yield",
  verifyToken,
  allowRoles("FARMER", "ADMIN"),
  predictYield
);

module.exports = router;