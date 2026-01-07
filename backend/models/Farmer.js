const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      unique: true,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    village: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "Farmer"
    },
    language: {
      type: String,
      default: "en"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Farmer", farmerSchema);