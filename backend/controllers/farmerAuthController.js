const Farmer = require("../models/Farmer");
const jwt = require("jsonwebtoken");

// Farmer Signup
exports.signup = async (req, res) => {
  const { name, phone, city, district, village, language } = req.body;

  try {
    // Check if farmer already exists
    const existingFarmer = await Farmer.findOne({ phone });
    if (existingFarmer) {
      return res.status(400).json({ message: "Farmer with this phone number already exists" });
    }

    // Create new farmer (without password)
    const farmer = await Farmer.create({
      name,
      phone,
      city,
      district,
      village,
      language: language || "en"
    });

    const token = jwt.sign(
      { id: farmer._id, role: "FARMER" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Farmer registered successfully", token, farmer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Farmer Login (Phone number only)
exports.login = async (req, res) => {
  const { phone } = req.body;

  try {
    // Find farmer by phone
    const farmer = await Farmer.findOne({ phone });
    if (!farmer) {
      return res.status(401).json({ message: "Phone number not registered. Please sign up first." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: farmer._id, role: "FARMER" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Farmer authenticated", token, farmer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};