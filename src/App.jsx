import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import BackgroundEffects from './components/BackgroundEffects';
import Home from './pages/Home';
import GlobeExplorer from './pages/GlobeExplorer';
import Simulation from './pages/Simulation';
import Weather from './pages/Weather';
import MachineLearning from './pages/MachineLearning';
import Contact from './pages/Contact';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <BackgroundEffects />
      <Navigation />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/globe" element={<GlobeExplorer />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/ml" element={<MachineLearning />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
