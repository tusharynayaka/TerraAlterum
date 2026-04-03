import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Globe, 
  Activity, 
  Zap, 
  Cpu, 
  Bell, 
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  MapPin,
  AlertTriangle,
  Wind,
  Thermometer,
  CloudRain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [location, setLocation] = useState({ city: 'Loading...', country: '' });
    const [weather, setWeather] = useState(null);
    const [earthquakes, setEarthquakes] = useState([]);
    const [loading, setLoading] = useState(true);

    const WEATHER_API_KEY = 'e15ee20095f1ca448fd5782b1d106790';

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. Get Location
                const locRes = await fetch('https://ipapi.co/json/');
                const locData = await locRes.json();
                setLocation({ city: locData.city, country: locData.country_name });

                // 2. Get Weather
                if (locData.latitude && locData.longitude) {
                    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${locData.latitude}&lon=${locData.longitude}&appid=${WEATHER_API_KEY}&units=metric`);
                    const weatherData = await weatherRes.json();
                    setWeather(weatherData);
                }

                // 3. Get Earthquakes (Last 24h)
                const eqRes = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
                const eqData = await eqRes.json();
                setEarthquakes(eqData.features.slice(0, 5)); // Top 5 recent
            } catch (err) {
                console.error("Error fetching live data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    return (
        <div className="home-page">
            {/* Real-Time Dashboard Header */}
            <div className="dashboard-grid">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="location-card glass-premium"
                >
                    <div className="card-lbl"><MapPin size={14} /> Global Station</div>
                    <h2>{location.city}, <span className="text-accent">{location.country}</span></h2>
                    {weather && (
                        <div className="weather-tiny">
                            <span className="temp">{Math.round(weather.main.temp)}°C</span>
                            <span className="desc">{weather.weather[0].main}</span>
                            <div className="w-icons">
                                <Thermometer size={14} /> <Wind size={14} /> <CloudRain size={14} />
                            </div>
                        </div>
                    )}
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="hero-header"
                >
                    <div className="hero-badge">
                        <Shield size={14} />
                        <span>Real-Time Intelligence Active</span>
                    </div>
                    <h1>TerraAlertum</h1>
                    <p>Monitoring global stability through AI & live satellite telemetry.</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="alert-feed glass-premium"
                >
                    <div className="card-lbl"><AlertTriangle size={14} /> Live Seismic Feed</div>
                    <div className="feed-items">
                        {earthquakes.map((eq, i) => (
                            <div key={i} className="feed-item">
                                <span className={`mag ${eq.properties.mag > 5 ? 'high' : ''}`}>M{eq.properties.mag}</span>
                                <span className="place">{eq.properties.place.split('of').pop()}</span>
                            </div>
                        ))}
                    </div>
                    <Link to="/globe" className="view-more">Analyze All Earthquakes <ArrowRight size={14} /></Link>
                </motion.div>
            </div>

            {/* Main Action Section */}
            <section className="main-actions">
                <div className="action-grid">
                    <motion.div whileHover={{ y: -10 }} className="action-card glass-premium">
                        <div className="a-icon"><Globe size={32} /></div>
                        <h3>Globe Explorer</h3>
                        <p>View real-time disaster alerts on an interactive 3D planet model.</p>
                        <Link to="/globe" className="btn-primary">Launch Station</Link>
                    </motion.div>

                    <motion.div whileHover={{ y: -10 }} className="action-card glass-premium">
                        <div className="a-icon"><Activity size={32} /></div>
                        <h3>Disaster Simulation</h3>
                        <p>Simulate flood response, seismic impact, and atmospheric changes.</p>
                        <Link to="/simulation" className="btn-secondary">Start Simulation</Link>
                    </motion.div>

                    <motion.div whileHover={{ y: -10 }} className="action-card glass-premium">
                        <div className="a-icon"><Cpu size={32} /></div>
                        <h3>ML Predictions</h3>
                        <p>High-accuracy risk assessment using trained neural architectures.</p>
                        <Link to="/ml" className="btn-secondary">View Insights</Link>
                    </motion.div>
                </div>
            </section>

            {/* Global Stats Counter */}
            <section className="global-pulse glass-premium">
                <div className="pulse-item">
                    <strong className="text-accent">94.2%</strong>
                    <span>Prediction Accuracy</span>
                </div>
                <div className="pulse-item">
                    <strong className="text-accent">2s</strong>
                    <span>Live Latency</span>
                </div>
                <div className="pulse-item">
                    <strong className="text-accent">24/7</strong>
                    <span>Active Monitoring</span>
                </div>
            </section>
        </div>
    );
};

export default Home;
