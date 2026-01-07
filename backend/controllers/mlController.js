const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// Disease Detection
exports.predictDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Create form data for the ML service
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Forward the request to ML service
    const mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL || "http://localhost:8000"}/predict-disease`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    res.json(mlResponse.data);
  } catch (error) {
    console.error("Disease prediction error details:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      url: process.env.ML_SERVICE_URL || "http://localhost:8000"
    });

    // If ML service is not available, return a simulated response for development
    if (error.code === 'ECONNREFUSED' || error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.warn("ML service not available, returning simulated response for development");
      
      // Simulate a prediction response for development purposes
      const simulatedResults = [
        { disease: "Healthy", confidence: 0.92 },
        { disease: "Leaf_Blight", confidence: 0.78 },
        { disease: "Rust", confidence: 0.85 }
      ];
      
      const randomResult = simulatedResults[Math.floor(Math.random() * simulatedResults.length)];
      
      return res.json({
        disease: randomResult.disease,
        confidence: randomResult.confidence,
        message: "ML service unavailable - using simulated response for development"
      });
    }

    res.status(500).json({ 
      message: "Disease prediction failed", 
      error: error.response?.data?.detail || error.message,
      code: error.code
    });
  }
};

// Yield Prediction
exports.predictYield = async (req, res) => {
  try {
    const { Crop, District, Year } = req.body;

    if (!Crop || !District || !Year) {
      return res.status(400).json({ 
        message: "Crop, District, and Year are required" 
      });
    }

    // Forward the request to ML service
    const mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL || "http://localhost:8000"}/predict-yield`,
      { Crop, District, Year },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 seconds timeout
      }
    );

    res.json(mlResponse.data);
  } catch (error) {
    console.error("Yield prediction error details:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      url: process.env.ML_SERVICE_URL || "http://localhost:8000"
    });

    // If ML service is not available, return a simulated response for development
    if (error.code === 'ECONNREFUSED' || error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.warn("ML service not available, returning simulated yield response for development");
      
      // Simulate a yield prediction response for development purposes
      const simulatedYield = Math.floor(Math.random() * 1000) + 500; // Random yield between 500-1500
      
      return res.json({
        predicted_yield: simulatedYield,
        unit: "hg/ha (simulated for development)",
        message: "ML service unavailable - using simulated response for development"
      });
    }

    // Handle specific yield prediction errors
    if (error.response?.status === 400 && error.response?.data?.detail?.includes("Invalid Crop/District name")) {
      return res.status(400).json({ 
        message: "Invalid crop or district name. Please select from the available options.",
        error: error.response.data.detail,
        code: error.code
      });
    }

    res.status(500).json({ 
      message: "Yield prediction failed", 
      error: error.response?.data?.detail || error.message,
      code: error.code
    });
  }
};