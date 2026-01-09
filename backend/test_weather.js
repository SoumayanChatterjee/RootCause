const axios = require('axios');

// Test the weather API directly without authentication
async function testWeatherAPI() {
  const apiKey = 'fb3b6d29fa5ca495b1e1da40ad91b4c2'; // Using the API key you provided
  const location = 'Mumbai'; // Using a major city for better results

  try {
    console.log('Testing current weather API...');
    const currentResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    );
    
    console.log('Current weather for', currentResponse.data.name, ':', currentResponse.data.main.temp + '°C');
    console.log('Condition:', currentResponse.data.weather[0].description);
    
    console.log('\nTesting forecast API...');
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`
    );
    
    console.log('Forecast API returned', forecastResponse.data.list.length, 'data points');
    
    // Show first few forecast entries
    for (let i = 0; i < Math.min(5, forecastResponse.data.list.length); i++) {
      const item = forecastResponse.data.list[i];
      const date = new Date(item.dt * 1000);
      console.log(`${date.toDateString()}: ${item.main.temp}°C, ${item.weather[0].description}`);
    }
    
  } catch (error) {
    console.error('Error testing weather API:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testWeatherAPI();