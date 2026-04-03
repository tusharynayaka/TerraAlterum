import React, { useEffect, useRef } from 'react';
import './BackgroundEffects.css';

const BackgroundEffects = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.L && !mapRef.current._leaflet_id) {
      const map = window.L.map('bg-map', { 
        zoomControl: false, 
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        touchZoom: false
      }).setView([20, 0], 2);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      mapRef.current = map;

      // Pulse Icon from previous UI
      const pulseHtml = '<span style="display:block;width:14px;height:14px;border-radius:50%;background:#8b5cf6;box-shadow:0 0 12px rgba(139,92,246,0.9);"></span>';
      const pulseIcon = window.L.divIcon({ 
        className: 'pulse-marker', 
        html: pulseHtml, 
        iconSize: [14, 14] 
      });

      const placeMarker = (lat, lon) => {
        map.setView([lat, lon], 10);
        window.L.circleMarker([lat, lon], { 
          radius: 8, 
          color: '#8b5cf6', 
          fillColor: '#8b5cf6', 
          fillOpacity: 0.9 
        }).addTo(map);
        
        window.L.marker([lat, lon], { 
          icon: pulseIcon, 
          interactive: false 
        }).addTo(map);
      };

      // Geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => placeMarker(pos.coords.latitude, pos.coords.longitude),
          () => {
            fetch('https://ipapi.co/json/')
              .then(r => r.json())
              .then(data => {
                if (data.latitude) placeMarker(data.latitude, data.longitude);
              }).catch(() => {});
          }
        );
      }
    }
  }, []);

  return (
    <div className="background-effects-container">
      <div id="bg-map" className="bg-map"></div>
      <div className="blobs-container">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div className="blob b3"></div>
      </div>
      <div className="bg-overlay"></div>
    </div>
  );
};

export default BackgroundEffects;
