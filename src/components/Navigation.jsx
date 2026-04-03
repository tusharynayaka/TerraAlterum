import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Globe, 
  Activity, 
  CloudSun, 
  Cpu, 
  Mail,
  Shield
} from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="nav-container premium-glass">
      <div className="nav-logo">
        <Shield className="logo-icon" size={24} />
        <span>TerraAlertum</span>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            <Home size={18} /> <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/globe" className={({ isActive }) => isActive ? 'active' : ''}>
            <Globe size={18} /> <span>Explorer</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/simulation" className={({ isActive }) => isActive ? 'active' : ''}>
            <Activity size={18} /> <span>Simulation</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/weather" className={({ isActive }) => isActive ? 'active' : ''}>
            <CloudSun size={18} /> <span>Weather</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/ml" className={({ isActive }) => isActive ? 'active' : ''}>
            <Cpu size={18} /> <span>ML Model</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
            <Mail size={18} /> <span>Contact</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
