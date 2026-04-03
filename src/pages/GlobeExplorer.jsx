import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Shield, 
  Activity, 
  Zap, 
  X, 
  Maximize2,
  Minimize2,
  Wind,
  Droplets,
  Thermometer,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import './GlobeExplorer.css';

const GlobeExplorer = () => {
  const globeRef = useRef(null);
  const mapRef = useRef(null);
  const [city, setCity] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [weather, setWeather] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  // Mock data for initial markers
  const [markers, setMarkers] = useState([
    { lat: 12.9716, lng: 77.5946, label: 'Bengaluru', severity: 'low' },
    { lat: 28.6139, lng: 77.2090, label: 'Delhi', severity: 'high' },
    { lat: 19.0760, lng: 72.8777, label: 'Mumbai', severity: 'moderate' }
  ]);

  useEffect(() => {
    // Initialize Globe.gl from window (CDN in index.html)
    if (window.Globe && globeRef.current) {
      const globe = window.Globe()(globeRef.current)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .labelsData(markers)
        .labelLat(d => d.lat)
        .labelLng(d => d.lng)
        .labelText(d => d.label)
        .labelSize(d => 1.5)
        .labelDotRadius(d => 0.5)
        .labelColor(d => d.severity === 'high' ? '#ff5252' : '#4facfe')
        .onLabelClick((d) => handleLabelClick(d));
      
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.5;
    }
  }, [markers]);

  const handleLabelClick = (d) => {
    setCity(d.label);
    searchCity(d.label);
  };

  const searchCity = async (cityName = city) => {
    if (!cityName) return;
    setLoading(true);
    
    try {
      // Mock search and weather fetch (integrates with real API in production)
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=e15ee20095f1ca448fd5782b1d106790&units=metric`);
      const data = await res.json();
      
      if (data.cod === 200) {
        setWeather(data);
        setModalOpen(true);
        // Call ML Prediction API
        fetchPrediction(data.main.temp, data.main.humidity, data.main.pressure);
      } else {
        alert("City not found");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrediction = async (temp, hum, pres) => {
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temp, humidity: hum, pressure: pres })
      });
      const data = await res.json();
      if (data.success) {
        setPrediction(data);
      }
    } catch (err) {
      // Mock fallback if API fails
      setPrediction({
        risk_level: 'MODERATE',
        disaster_probability: 45.5,
        will_occur: false
      });
    }
  };

  const closePortal = () => {
    setModalOpen(false);
    setPrediction(null);
  };

  return (
    <div className="globe-explorer">
      <div className="globe-mount" ref={globeRef}></div>

      {/* Navigation Overlay */}
      <div className="overlay-elements">
        <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="search-container premium-glass"
        >
          <div className="search-wrap">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Locate risk zones..." 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchCity()}
            />
          </div>
          <button className="scan-btn" onClick={() => searchCity()}>Scan Area</button>
        </motion.div>

        {/* Legend */}
        <div className="legend-panel premium-glass">
            <div className="legend-item">
                <span className="dot high"></span> High Risk
            </div>
            <div className="legend-item">
                <span className="dot moderate"></span> Moderate
            </div>
            <div className="legend-item">
                <span className="dot low"></span> Stable
            </div>
        </div>

        {/* Global Stats Overlay */}
        <div className="stats-overlay">
          <div className="stat-card premium-glass">
            <Activity className="text-red-400" size={16} />
            <div className="data">
              <strong>12</strong>
              <span>Active Alerts</span>
            </div>
          </div>
          <div className="stat-card premium-glass">
            <Shield className="text-blue-400" size={16} />
            <div className="data">
              <strong>94%</strong>
              <span>Confidence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal / Portal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="map-modal-backdrop"
          >
            <div className="map-modal premium-glass">
              <div className="modal-header">
                <div className="header-info">
                    <MapPin className="text-blue-400" />
                    <h2>{city} <span>Intelligence Report</span></h2>
                </div>
                <button className="close-btn" onClick={closePortal}><X /></button>
              </div>

              <div className="modal-content">
                <div className="report-grid">
                    <div className="weather-section">
                        <h3><Navigation size={16} /> Site Conditions</h3>
                        {weather && (
                            <div className="weather-stats">
                                <div className="w-item">
                                    <Thermometer size={14} /> {weather.main.temp}°C
                                </div>
                                <div className="w-item">
                                    <Wind size={14} /> {weather.wind.speed} m/s
                                </div>
                                <div className="w-item">
                                    <Droplets size={14} /> {weather.main.humidity}%
                                </div>
                            </div>
                        )}
                        <p className="description">{weather?.weather[0].description}</p>
                    </div>

                    <div className="prediction-section">
                        <h3><Activity size={16} /> ML Risk Assessment</h3>
                        {prediction ? (
                            <div className="prediction-content">
                                <div className={`risk-level ${prediction.risk_level.toLowerCase()}`}>
                                    {prediction.risk_level} <span>Risk</span>
                                </div>
                                <div className="prob-bar">
                                    <div className="fill" style={{ width: `${prediction.disaster_probability}%` }}></div>
                                </div>
                                <div className="prob-text">{prediction.disaster_probability.toFixed(1)}% Probability</div>
                            </div>
                        ) : (
                            <div className="loading-prediction">Analyzing satellite data...</div>
                        )}
                    </div>
                </div>

                <div className="action-footer">
                    <button className="btn-action primary">Deploy Response Team</button>
                    <button className="btn-action secondary">Full Simulation Analysis</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobeExplorer;
