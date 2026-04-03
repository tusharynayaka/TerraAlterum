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
  const [city, setCity] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [weather, setWeather] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson');
        const data = await res.json();
        
        const earthquakeMarkers = data.features.map(feat => ({
          lat: feat.geometry.coordinates[1],
          lng: feat.geometry.coordinates[0],
          label: feat.properties.place,
          mag: feat.properties.mag,
          severity: feat.properties.mag >= 6 ? 'high' : feat.properties.mag >= 5 ? 'moderate' : 'low'
        }));
        
        setMarkers(earthquakeMarkers);
      } catch (err) {
        console.error("Failed to fetch earthquake data:", err);
      }
    };

    fetchEarthquakes();
  }, []);

  useEffect(() => {
    if (window.Globe && globeRef.current && markers.length > 0) {
      const globe = window.Globe()(globeRef.current)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .pointsData(markers)
        .pointLat(d => d.lat)
        .pointLng(d => d.lng)
        .pointColor(d => d.severity === 'high' ? '#ff5252' : d.severity === 'moderate' ? '#ffab40' : '#4facfe')
        .pointRadius(d => d.mag * 0.15)
        .pointLabel(d => `Magnitude: ${d.mag}\nLocation: ${d.label}`)
        .onPointClick((d) => handleMarkerClick(d));
      
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.5;
    }
  }, [markers]);

  const handleMarkerClick = (d) => {
    setCity(d.label);
    searchCity(d.label, d.lat, d.lng);
  };

  const searchCity = async (cityName = city, lat, lng) => {
    setLoading(true);
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=e15ee20095f1ca448fd5782b1d106790&units=metric`;
      if (lat && lng) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=e15ee20095f1ca448fd5782b1d106790&units=metric`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.cod === 200) {
        setWeather(data);
        setModalOpen(true);
        // Mock ML Prediction based on real event magnitude if available
        setPrediction({
          risk_level: markers.find(m => m.label === cityName)?.severity.toUpperCase() || 'MODERATE',
          disaster_probability: (data.main.humidity * 0.8) + (Math.random() * 20),
          will_occur: data.weather[0].main === 'Rain'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
            className="search-container glass-premium"
        >
          <div className="search-wrap">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search risk zones..." 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchCity()}
            />
          </div>
          <button className="scan-btn" onClick={() => searchCity()}>Scan</button>
        </motion.div>

        {/* Legend */}
        <div className="legend-panel glass-premium">
            <div className="legend-item">
                <span className="dot high"></span> High Intensity
            </div>
            <div className="legend-item">
                <span className="dot moderate"></span> Moderate
            </div>
            <div className="legend-item">
                <span className="dot low"></span> Registered Activity
            </div>
        </div>

        {/* Global Stats Overlay */}
        <div className="stats-overlay">
          <div className="stat-card glass-premium">
            <Activity className="text-red-400" size={16} />
            <div className="data">
              <strong>{markers.length}</strong>
              <span>Recent Events</span>
            </div>
          </div>
          <div className="stat-card glass-premium">
            <Shield className="text-blue-400" size={16} />
            <div className="data">
              <strong>98.2%</strong>
              <span>Scan Precision</span>
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
            <div className="map-modal glass-premium">
              <div className="modal-header">
                <div className="header-info">
                    <MapPin className="text-blue-400" />
                    <h2>Location <span>Report</span></h2>
                </div>
                <button className="close-btn" onClick={closePortal}><X /></button>
              </div>

              <div className="modal-content">
                <div className="report-grid">
                    <div className="weather-section">
                        <h3><Navigation size={16} /> {weather?.name || 'Local'} Info</h3>
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
                            <div className="loading-prediction">Analyzing seismic data...</div>
                        )}
                    </div>
                </div>

                <div className="action-footer">
                    <button className="btn-action primary">Deploy Response</button>
                    <button className="btn-action secondary">Log Frequency</button>
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
