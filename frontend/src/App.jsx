import React, { useState } from 'react';
import DecryptedText from './DecryptedText';
import './App.css';

// Helper function to map Open-Meteo weather codes to standard weather icons
const getWeatherIcon = (code) => {
  if (code === 0) return '01d'; // Clear
  if (code === 1 || code === 2) return '02d'; // Partly cloudy
  if (code === 3) return '04d'; // Overcast
  if (code === 45 || code === 48) return '50d'; // Fog
  if (code >= 51 && code <= 67) return '10d'; // Rain
  if (code >= 71 && code <= 77) return '13d'; // Snow
  if (code >= 95) return '11d'; // Thunderstorm
  return '01d'; // Default
};

function App() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState('');

  const fetchWeatherAndMedia = async () => {
    try {
      setError('');
      
      // 1. Geocode using OpenStreetMap
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1&addressdetails=1`);
      const geoData = await geoRes.json();
      
      if (!geoData || geoData.length === 0) {
        throw new Error('City not found. Please try adding a state or country.');
      }
      
      const city = geoData[0];
      
      const addr = city.address || {};
      const localName = addr.city || addr.town || addr.village || city.name;
      const cleanFullName = [localName, addr.state, addr.country].filter(Boolean).join(', ');

      // 2. Fetch Weather (Open-Meteo)
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
      const weatherApiData = await weatherRes.json();

      const currentData = {
        name: cleanFullName,
        temp: weatherApiData.current.temperature_2m,
        icon: getWeatherIcon(weatherApiData.current.weather_code)
      };
      setWeatherData(currentData);

      const dailyForecast = [];
      for (let i = 1; i <= 5; i++) {
        dailyForecast.push({
          date: weatherApiData.daily.time[i],
          maxTemp: weatherApiData.daily.temperature_2m_max[i],
          minTemp: weatherApiData.daily.temperature_2m_min[i],
          icon: getWeatherIcon(weatherApiData.daily.weather_code[i])
        });
      }
      setForecastData(dailyForecast);

      // --- BACKEND SAFETY NET ---
      try {
        const mediaRes = await fetch(`http://localhost:5001/api/media/${localName}`);
        if (mediaRes.ok) {
          const mediaData = await mediaRes.json();
          setVideoId(mediaData.videoId);
        }

        await fetch('http://localhost:5001/api/weather', {

          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: cleanFullName, 
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            temperature: currentData.temp
          })
        });
      } catch (backendErr) {
        console.warn("Backend logged an error, but weather loaded successfully.");
      }

    } catch (err) {
      setError(err.message || 'An error occurred while fetching data.');
      setWeatherData(null);
      setForecastData([]);
      setVideoId(null);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>
          <DecryptedText text="Weather Explorer" animateOn="view" revealDirection="center" speed={40} maxIterations={15} />
        </h1>
        <p>Built by: Murray Watt</p>
        <p><em>Product Manager Accelerator is a premier program designed to help professionals transition into and accelerate their product management careers.</em></p>
      </header>

      <main>
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Enter City, State, or Country..." 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button onClick={fetchWeatherAndMedia}>Get Weather & Info</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {weatherData && (
          <div className="results-container">
            <div className="current-weather">
              <h2>
                <DecryptedText text={`${weatherData.name} - Current`} animateOn="view" revealDirection="start" speed={50} maxIterations={20} />
              </h2>
              <img src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} alt="weather icon" />
              <p>
                <DecryptedText text={`Temperature: ${Math.round(weatherData.temp)}°C`} animateOn="view" revealDirection="center" speed={60} maxIterations={12} />
              </p>
            </div>

            <div className="forecast-section">
              <h2 className="section-title">
                <DecryptedText text="5-Day Forecast" animateOn="view" revealDirection="end" speed={50} maxIterations={15} />
              </h2>
              <div className="forecast-grid">
                {forecastData.map((day, index) => (
                  <div key={index} className="forecast-card premium-card" style={{ '--animation-order': index }}>
                    <div className="date-wrapper">
                      <h3 className="day-name">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}</h3>
                      <p className="day-date">{new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <img src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`} alt="weather icon" className="forecast-icon" />
                    <div className="temp-range">
                      <span className="temp-max">{Math.round(day.maxTemp)}°</span>
                      <span className="temp-divider">/</span>
                      <span className="temp-min">{Math.round(day.minTemp)}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {videoId && (
          <div className="media-section">
            <h2>
              <DecryptedText text={`Explore ${weatherData?.name}`} animateOn="view" revealDirection="start" speed={40} maxIterations={15} />
            </h2>
            <iframe 
              width="560" 
              height="315" 
              src={`https://www.youtube.com/embed/${videoId}`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
