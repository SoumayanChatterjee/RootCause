const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const protectedRoutes = require("./routes/protectedRoutes");

const farmerAuthRoutes = require("./routes/farmerAuthRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const mlRoutes = require("./routes/mlRoutes"); // Add ML routes

const app = express();

app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const fs = require("fs");
const path = require("path");
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Routes
app.use("/api/farmer", farmerAuthRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ml", mlRoutes); // Add ML routes

// Test route
app.get("/", (req, res) => {
  res.send("RootCause Backend Running");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});