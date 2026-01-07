const Farmer = require("../models/Farmer");
const axios = require('axios');

exports.getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find({}).select("-password");
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get admin dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalFarmers = await Farmer.countDocuments();
    const activeIssues = 245; // This would come from a real issue tracking system
    const resolvedCases = 1289; // This would come from a real issue tracking system
    
    res.json({
      totalFarmers,
      activeIssues,
      resolvedCases
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get farm statistics for admin dashboard
exports.getFarmStats = async (req, res) => {
  try {
    // In a real implementation, this would come from a database with actual farm data
    // For now, we'll return some realistic sample data
    const farmStats = [
      { city: "Mumbai", district: "Mumbai", cropType: "Rice", diseaseRisk: "Low", farmersAffected: 15, status: "resolved" },
      { city: "Pune", district: "Pune", cropType: "Wheat", diseaseRisk: "Medium", farmersAffected: 23, status: "in-progress" },
      { city: "Nagpur", district: "Nagpur", cropType: "Sugarcane", diseaseRisk: "High", farmersAffected: 8, status: "detected" },
      { city: "Thane", district: "Thane", cropType: "Cotton", diseaseRisk: "Low", farmersAffected: 5, status: "resolved" },
      { city: "Nashik", district: "Nashik", cropType: "Grapes", diseaseRisk: "Medium", farmersAffected: 12, status: "in-progress" },
      { city: "Delhi", district: "North Delhi", cropType: "Vegetables", diseaseRisk: "High", farmersAffected: 31, status: "detected" },
      { city: "Bangalore", district: "Bangalore Urban", cropType: "Rice", diseaseRisk: "Low", farmersAffected: 7, status: "resolved" },
      { city: "Chennai", district: "Chennai", cropType: "Coconut", diseaseRisk: "Medium", farmersAffected: 19, status: "in-progress" }
    ];
    
    res.json(farmStats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get region overview data for admin dashboard
exports.getRegionOverview = async (req, res) => {
  try {
    // In a real implementation, this would aggregate data from multiple sources like disease reports, yield predictions, etc.
    // For now, we'll return realistic sample data with location coordinates for the heatmap
    const regions = [
      { id: "mh", name: "Maharashtra", status: "healthy", crop: "Sugarcane", yield: 75.2, affectedFarmers: 120, x: 300, y: 200, width: 80, height: 60 },
      { id: "up", name: "Uttar Pradesh", status: "moderate", crop: "Wheat", yield: 68.5, affectedFarmers: 250, x: 400, y: 150, width: 100, height: 70 },
      { id: "tn", name: "Tamil Nadu", status: "high", crop: "Rice", yield: 45.3, affectedFarmers: 340, x: 350, y: 350, width: 80, height: 60 },
      { id: "ka", name: "Karnataka", status: "pest", crop: "Coffee", yield: 32.1, affectedFarmers: 180, x: 280, y: 320, width: 80, height: 60 },
      { id: "ap", name: "Andhra Pradesh", status: "healthy", crop: "Rice", yield: 78.9, affectedFarmers: 95, x: 340, y: 300, width: 90, height: 65 },
      { id: "gj", name: "Gujarat", status: "moderate", crop: "Cotton", yield: 65.7, affectedFarmers: 160, x: 250, y: 200, width: 80, height: 60 },
      { id: "rj", name: "Rajasthan", status: "high", crop: "Mustard", yield: 52.4, affectedFarmers: 210, x: 350, y: 120, width: 90, height: 65 },
      { id: "wb", name: "West Bengal", status: "pest", crop: "Rice", yield: 28.6, affectedFarmers: 290, x: 480, y: 250, width: 80, height: 60 },
      { id: "pb", name: "Punjab", status: "healthy", crop: "Wheat", yield: 82.3, affectedFarmers: 85, x: 380, y: 100, width: 80, height: 60 },
      { id: "hr", name: "Haryana", status: "moderate", crop: "Wheat", yield: 71.8, affectedFarmers: 140, x: 370, y: 120, width: 80, height: 60 }
    ];
    
    res.json({ regions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get weather alerts for a specific location
exports.getWeatherAlerts = async (req, res) => {
  const { location } = req.params;
  try {
    // Make request to OpenWeatherMap API
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ message: "Weather API key not configured" });
    }
    
    // Fetch current weather data
    const currentWeatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    );
    
    // Fetch 5-day forecast data (OpenWeatherMap provides 3-hourly data for 5 days)
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`
    );
    
    // Process current weather data
    const current = {
      temperature: Math.round(currentWeatherResponse.data.main.temp),
      humidity: currentWeatherResponse.data.main.humidity,
      condition: currentWeatherResponse.data.weather[0].description,
      location: location
    };
    
    // Process forecast data - extract daily forecasts
    const forecast = [];
    const forecastDays = {};
    
    // Group forecast data by day
    forecastResponse.data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (!forecastDays[day]) {
        forecastDays[day] = {
          day,
          date: dateStr,
          temps: [],
          descriptions: [],
          rain: []
        };
      }
      
      forecastDays[day].temps.push(item.main.temp);
      forecastDays[day].descriptions.push(item.weather[0].description);
      forecastDays[day].rain.push(item.rain ? item.rain['3h'] || 0 : 0);
    });
    
    // Convert to daily format (limit to 7 days if available)
    let dayCount = 0;
    for (const [day, data] of Object.entries(forecastDays)) {
      if (dayCount >= 7) break;
      
      const minTemp = Math.min(...data.temps);
      const maxTemp = Math.max(...data.temps);
      const avgRain = data.rain.reduce((a, b) => a + b, 0);
      const mainCondition = data.descriptions.reduce((a, b) => 
        data.descriptions.filter(v => v === a).length > data.descriptions.filter(v => v === b).length ? a : b
      );
      
      forecast.push({
        day,
        date: data.date,
        temp: { min: Math.round(minTemp), max: Math.round(maxTemp) },
        precipitation: Math.round(avgRain * 100),
        condition: mainCondition
      });
      
      dayCount++;
    }
    
    // Generate insights based on forecast data
    const insights = forecast.slice(0, 7).map(day => {
      const precipitation = day.precipitation;
      const maxTemp = day.temp.max;
      
      if (precipitation > 70) {
        return {
          day: day.day,
          message: `${day.condition.charAt(0).toUpperCase() + day.condition.slice(1)} expected - High risk for planting activities`,
          type: "danger"
        };
      } else if (precipitation > 30) {
        return {
          day: day.day,
          message: `${day.condition.charAt(0).toUpperCase() + day.condition.slice(1)} expected - Moderate conditions, plan accordingly`,
          type: "warning"
        };
      } else if (maxTemp > 40) {
        return {
          day: day.day,
          message: `High temperature (${maxTemp}°C) expected - Risk of heat stress to crops`,
          type: "warning"
        };
      } else if (maxTemp < 10) {
        return {
          day: day.day,
          message: `Low temperature (${maxTemp}°C) expected - Risk of frost damage`,
          type: "warning"
        };
      } else {
        return {
          day: day.day,
          message: `${day.condition.charAt(0).toUpperCase() + day.condition.slice(1)} - Favorable conditions for farming activities`,
          type: "info"
        };
      }
    }).filter((insight, index) => index < 3); // Limit to 3 insights
    
    const weatherData = {
      current,
      forecast,
      insights
    };
    
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    
    // Return error-specific message
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Location not found" });
    } else if (error.response && error.response.status === 401) {
      return res.status(500).json({ message: "Invalid weather API key" });
    }
    
    // Fallback to sample data if API fails
    const weatherData = {
      current: {
        temperature: Math.floor(Math.random() * 10) + 25, // Random temp between 25-35
        humidity: Math.floor(Math.random() * 20) + 60,    // Random humidity between 60-80
        condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
        location: location
      },
      forecast: [
        { day: "Monday", date: "Jan 8", temp: { min: 22, max: 32 }, precipitation: 10, condition: "Light Rain" },
        { day: "Tuesday", date: "Jan 9", temp: { min: 23, max: 34 }, precipitation: 0, condition: "Sunny" },
        { day: "Wednesday", date: "Jan 10", temp: { min: 21, max: 30 }, precipitation: 80, condition: "Heavy Rainfall" },
        { day: "Thursday", date: "Jan 11", temp: { min: 24, max: 33 }, precipitation: 20, condition: "Cloudy" },
        { day: "Friday", date: "Jan 12", temp: { min: 25, max: 35 }, precipitation: 5, condition: "Sunny" },
        { day: "Saturday", date: "Jan 13", temp: { min: 23, max: 31 }, precipitation: 90, condition: "Heavy Rainfall" },
        { day: "Sunday", date: "Jan 14", temp: { min: 22, max: 29 }, precipitation: 70, condition: "Moderate Rain" }
      ],
      insights: [
        { day: "Wednesday", message: "Heavy rainfall expected - High risk for planting activities", type: "warning" },
        { day: "Saturday", message: "Heavy rainfall expected - Potential flooding risk", type: "danger" },
        { day: "Sunday", message: "Moderate rainfall - Good for irrigation, avoid pesticide application", type: "info" }
      ]
    };
    
    res.json(weatherData);
  }
};

// Get detailed farmer information for a specific district
exports.getFarmersByDistrict = async (req, res) => {
  const { district } = req.params;
  try {
    // In a real implementation, this would query the database for farmers in a specific district
    // For now, we'll return realistic sample data that includes farmer activity from their dashboard
    const farmers = [
      { id: 1, name: "Rajesh Kumar", phone: "+91 9876543210", fieldDetails: "2 acres, Sugarcane crop", actionTaken: "Fungicide applied", status: "Resolved", activity: "Applied treatment, scheduled follow-up" },
      { id: 2, name: "Priya Sharma", phone: "+91 9876543211", fieldDetails: "1.5 acres, Sugarcane crop", actionTaken: "Irrigation increased", status: "Resolved", activity: "Completed irrigation upgrade" },
      { id: 3, name: "Amit Patel", phone: "+91 9876543212", fieldDetails: "3 acres, Sugarcane crop", actionTaken: "Pesticides applied", status: "In Progress", activity: "Monitoring crop health" },
      { id: 4, name: "Sunita Devi", phone: "+91 9876543213", fieldDetails: "1.8 acres, Rice crop", actionTaken: "Soil testing recommended", status: "Detected", activity: "Waiting for soil test results" }
    ];
    
    res.json({ farmers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};