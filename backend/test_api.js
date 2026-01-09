const axios = require('axios');
require('dotenv').config();
const apiKey = process.env.OPENWEATHER_API_KEY;
console.log('API Key loaded:', apiKey && apiKey.length > 0 ? 'YES' : 'NO');
// Removed printing of actual API key for security reasons

// Test with one of the locations from the frontend
const location = 'Maharashtra';
console.log('Testing with location:', location);

if (apiKey && apiKey !== '# PLACEHOLDER_API_KEY') {
  // Test both current weather and forecast APIs
  console.log('\nTesting current weather API...');
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
    .then(response => {
      console.log('Current weather success for', location, ':', response.data.name, response.data.main.temp + '°C');
      
      console.log('\nTesting forecast API...');
      // Test forecast API as well since both are needed
      return axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`);
    })
    .then(forecastResponse => {
      console.log('Forecast API success, received', forecastResponse.data.list.length, 'data points');
    })
    .catch(error => {
      console.log('Error for', location, ':', error.response ? error.response.status + ' - ' + error.response.statusText : error.message);
      console.log('Trying Mumbai instead...');
      // Maharashtra might not work directly, try a major city in Maharashtra
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=${apiKey}&units=metric`)
        .then(resp => {
          console.log('Success for Mumbai:', resp.data.name, resp.data.main.temp + '°C');
        })
        .catch(err => {
          console.log('Error for Mumbai too:', err.message);
        });
    });
} else {
  console.log('API key is not properly configured');
}