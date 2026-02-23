import React, { useState } from 'react';
import './App.css';

function App() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    try {
      setError('');
      // Replace with actual OpenWeatherMap or WeatherAPI call
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=YOUR_API_KEY`);
      
      // Graceful error handling for invalid cities
      if (!response.ok) throw new Error('City not found. Please try again.');
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    }
  };

  return (
    <div className="app-container" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <header>
        <h1>Weather Explorer</h1>
        {/* Required Applicant and Company Info */}
        <p>Built by: Murray Watt</p>
        <p><em>Product Manager Accelerator is a premier program designed to help professionals transition into and accelerate their product management careers.</em></p>
      </header>

      <main>
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Enter City, Zip, or Landmark..." 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button onClick={fetchWeather}>Get Weather</button>
          {/* Future implementation for geolocation */}
          <button onClick={() => {}}>Use Current Location</button>
        </div>

        {/* Display error messages gracefully */}
        {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}

        {weatherData && (
          <div className="weather-display">
            <h2>{weatherData.name}</h2>
            <img 
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
              alt="weather icon" 
            />
            <p>Temperature: {Math.round(weatherData.main.temp - 273.15)}°C</p>
            
            {/* 5-Day Forecast Component would be rendered here */}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
