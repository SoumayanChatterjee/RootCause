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
    
    // Map state names to major cities for better API results
    const stateCityMap = {
      'Maharashtra': 'Mumbai',
      'Uttar Pradesh': 'Lucknow',
      'Tamil Nadu': 'Chennai',
      'Karnataka': 'Bangalore',
      'Andhra Pradesh': 'Hyderabad', // Using Hyderabad as it's still a major city in the region
      'Gujarat': 'Ahmedabad',
      'Rajasthan': 'Jaipur',
      'West Bengal': 'Kolkata',
      'Punjab': 'Chandigarh',
      'Haryana': 'Chandigarh'
    };
    
    // Use city name if available, otherwise use location as is
    const cityName = stateCityMap[location] || location;
    
    let currentWeatherResponse, forecastResponse;
    
    try {
      // Fetch current weather data
      currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      
      // Fetch 5-day forecast data (OpenWeatherMap provides 3-hourly data for 5 days)
      forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
      );
    } catch (apiError) {
      // If the city name fails, try the original location name
      if (apiError.response && apiError.response.status === 404) {
        currentWeatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
        );
        
        forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`
        );
      } else {
        // If it's not a 404 error, rethrow it
        throw apiError;
      }
    }
    
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
    
    // If API fails, return error instead of hardcoded data
    console.error('Weather API call failed:', error.message);
    return res.status(500).json({ 
      error: 'Failed to fetch weather data', 
      message: error.message 
    });
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