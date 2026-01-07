const Farmer = require("../models/Farmer");

exports.getMyProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.user.id).select("-__v");
    res.json(farmer);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch farmer profile" });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const { name, phone, city, district, village, language } = req.body;
    
    // Check if phone number is being changed and if it's already taken
    if (phone) {
      const existingFarmer = await Farmer.findOne({ phone, _id: { $ne: req.user.id } });
      if (existingFarmer) {
        return res.status(400).json({ message: "Phone number already in use" });
      }
    }
    
    // Update farmer profile
    const updatedFarmer = await Farmer.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        city,
        district,
        village,
        language
      },
      { new: true, runValidators: true }
    ).select("-__v");
    
    if (!updatedFarmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    
    res.json({ message: "Profile updated successfully", farmer: updatedFarmer });
  } catch (err) {
    res.status(500).json({ message: "Failed to update farmer profile", error: err.message });
  }
};
