import React, { useState } from 'react';
import './App.css';

function App() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState('');

  const fetchWeatherAndMedia = async () => {
    try {
      setError('');
      
      // 1. Fetch Current Weather
      const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=YOUR_OWM_API_KEY&units=metric`);
      if (!weatherRes.ok) throw new Error('City not found. Please try again.');
      const currentData = await weatherRes.json();
      setWeatherData(currentData);

      // 2. Fetch 5-Day Forecast (returns data in 3-hour chunks, we filter for daily)
      const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=YOUR_OWM_API_KEY&units=metric`);
      const forecastJson = await forecastRes.json();
      
      // Filter for one reading per day (e.g., at 12:00 PM)
      const dailyForecast = forecastJson.list.filter(item => item.dt_txt.includes('12:00:00'));
      setForecastData(dailyForecast);

      // 3. Fetch YouTube Video from our Node backend
      const mediaRes = await fetch(`http://localhost:5000/api/media/${location}`);
      const mediaData = await mediaRes.json();
      setVideoId(mediaData.videoId);

      // 4. Save to Database (CREATE requirement)
      await fetch('http://localhost:5000/api/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: currentData.name,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          temperature: currentData.main.temp
        })
      });

    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setForecastData([]);
      setVideoId(null);
    }
  };

  return (
    <div className="app-container" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <header>
        <h1>Weather Explorer</h1>
        <p>Built by: Murray Watt</p>
        <p><em>Product Manager Accelerator is a premier program designed to help professionals transition into and accelerate their product management careers.</em></p>
      </header>

      <main>
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Enter City..." 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button onClick={fetchWeatherAndMedia}>Get Weather & Info</button>
        </div>

        {error && <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

        {weatherData && (
          <div className="results-container" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <div className="current-weather">
              <h2>{weatherData.name} - Current</h2>
              <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="weather icon" />
              <p>Temperature: {Math.round(weatherData.main.temp)}°C</p>
            </div>

            {/* 5-Day Forecast Grid */}
            <div className="forecast-section">
              <h2>5-Day Forecast</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                {forecastData.map((day, index) => (
                  <div key={index} className="forecast-card" style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
                    <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="icon" />
                    <p>{Math.round(day.main.temp)}°C</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* YouTube Integration */}
        {videoId && (
          <div className="media-section" style={{ marginTop: '20px' }}>
            <h2>Explore {weatherData?.name}</h2>
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
