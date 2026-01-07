const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    organisationName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "Admin"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);