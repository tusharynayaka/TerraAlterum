import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Wind, 
  Droplets, 
  Thermometer, 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudLightning,
  Navigation,
  Calendar,
  CloudSnow
} from 'lucide-react';
import './Weather.css';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [forecast, setForecast] = useState([]);
    
    const apiKey = 'e15ee20095f1ca448fd5782b1d106790';

    const fetchWeather = async (url) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.cod === 200) {
                setWeatherData(data);
                generateForecast();
            } else {
                setError(data.message || 'City not found');
            }
        } catch (err) {
            setError('Failed to fetch weather data');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!city) return;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        fetchWeather(url);
    };

    const handleLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
                fetchWeather(url);
            }, () => setError('Location access denied'));
        } else {
            setError('Geolocation not supported');
        }
    };

    const generateForecast = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const types = ['Sunny', 'Cloudy', 'Rainy', 'Stormy'];
        const mockForecast = Array.from({ length: 5 }, (_, i) => ({
            day: days[(new Date().getDay() + i) % 7],
            temp: Math.floor(20 + Math.random() * 10),
            type: types[Math.floor(Math.random() * types.length)]
        }));
        setForecast(mockForecast);
    };

    const getWeatherIcon = (type, size = 24) => {
        switch(type) {
            case 'Sunny': return <Sun size={size} className="text-yellow-400" />;
            case 'Cloudy': return <Cloud size={size} className="text-gray-400" />;
            case 'Rainy': return <CloudRain size={size} className="text-blue-400" />;
            case 'Stormy': return <CloudLightning size={size} className="text-purple-400" />;
            default: return <Sun size={size} />;
        }
    };

    return (
        <div className="weather-page">
            {/* Animated Blobs */}
            <div className="blobs">
                <motion.div 
                    animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="blob blob-1" 
                />
                <motion.div 
                    animate={{ x: [0, -80, 0], y: [0, 100, 0] }}
                    transition={{ duration: 15, repeat: Infinity, delay: 2 }}
                    className="blob blob-2" 
                />
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 18, repeat: Infinity }}
                    className="blob blob-3" 
                />
            </div>

            <div className="weather-container">
                <header className="weather-header">
                    <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="logo-area"
                    >
                        <div className="weather-logo-icon">🌤️</div>
                        <h1>WeatherCast</h1>
                    </motion.div>

                    <form className="search-form" onSubmit={handleSearch}>
                        <div className="search-input-wrapper">
                            <Search className="search-icon" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search city..." 
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="glass-btn">Search</button>
                        <button type="button" className="glass-btn icon-btn" onClick={handleLocation}>
                            <MapPin size={20} />
                        </button>
                    </form>
                </header>

                <main className="weather-main">
                    <AnimatePresence mode="wait">
                        {weatherData ? (
                            <motion.div 
                                key={weatherData.name}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="current-card glass-premium"
                            >
                                <div className="card-top">
                                    <div className="location-info">
                                        <h2>{weatherData.name}, {weatherData.sys.country}</h2>
                                        <p className="condition">{weatherData.weather[0].description}</p>
                                    </div>
                                    <div className="main-temp">
                                        {Math.round(weatherData.main.temp)}°C
                                    </div>
                                </div>

                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <Thermometer size={20} />
                                        <div className="stat-val">
                                            <span>Feels Like</span>
                                            <strong>{Math.round(weatherData.main.feels_like)}°</strong>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <Droplets size={20} />
                                        <div className="stat-val">
                                            <span>Humidity</span>
                                            <strong>{weatherData.main.humidity}%</strong>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <Wind size={20} />
                                        <div className="stat-val">
                                            <span>Wind Speed</span>
                                            <strong>{weatherData.wind.speed} m/s</strong>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="empty-state"
                            >
                                <Cloud size={64} className="floating-icon" />
                                <h3>Enter a city to explore weather</h3>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {weatherData && (
                        <div className="forecast-section">
                            <div className="section-title">
                                <Calendar size={18} />
                                <h3>5-Day Forecast</h3>
                            </div>
                            <div className="forecast-grid">
                                {forecast.map((f, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="forecast-card glass-simple"
                                    >
                                        <span className="day">{f.day}</span>
                                        <div className="icon">{getWeatherIcon(f.type, 32)}</div>
                                        <span className="temp">{f.temp}°</span>
                                        <span className="type">{f.type}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
            
            {loading && <div className="loader-overlay"><div className="loader"></div></div>}
            {error && <motion.div initial={{y:100}} animate={{y:0}} className="error-toast">{error}</motion.div>}
        </div>
    );
};

export default Weather;
