import React, { useState, useEffect, useRef } from 'react';
import { 
  Bar, 
  Line, 
  Doughnut, 
  Radar 
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Database, 
  Map as MapIcon, 
  BarChart3, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  Globe, 
  TrendingUp,
  ChevronRight,
  Info,
  Layers,
  Search,
  Filter
} from 'lucide-react';
import './MachineLearning.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MachineLearning = () => {
    const [activeTab, setActiveTab] = useState('database');
    const [dbSearch, setDbSearch] = useState('');
    const [selectedDisasterIdx, setSelectedDisasterIdx] = useState(0);
    const [mlDatabase, setMlDatabase] = useState({ disasters: [], calculations: [] });
    const [kpis, setKpis] = useState({
        riskIndex: 0,
        alerts: 0,
        accuracy: 94.2,
        regions: 0
    });

    // Mock data generation (similar to original ML.html logic)
    useEffect(() => {
        const disasterTypes = ["Flood", "Tsunami", "Hurricane", "Wildfire", "Earthquake", "Drought"];
        const locations = ["Mumbai", "Tokyo", "London", "New York", "Jakarta", "Cairo"];
        
        const disasters = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            name: `${disasterTypes[Math.floor(Math.random() * disasterTypes.length)]} in ${locations[Math.floor(Math.random() * locations.length)]}`,
            date: `2024-${Math.floor(Math.random() * 12 + 1)}-${Math.floor(Math.random() * 28 + 1)}`,
            severity: Math.floor(Math.random() * 100),
            temp: 15 + Math.random() * 30,
            humidity: 40 + Math.random() * 50,
            pressure: 980 + Math.random() * 40
        }));

        setMlDatabase({ disasters });
        
        // Calculate initial KPIs
        const riskAvg = disasters.reduce((acc, curr) => acc + curr.severity, 0) / disasters.length;
        setKpis({
            riskIndex: riskAvg.toFixed(1),
            alerts: disasters.filter(d => d.severity > 70).length,
            accuracy: 94.2,
            regions: locations.length
        });
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: { color: '#94a3b8', font: { size: 10 } }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 12 }
            }
        },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
            x: { grid: { display: false }, ticks: { color: '#64748b' } }
        }
    };

    // Chart Data Definitions
    const riskTrendData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Global Risk Trend',
            data: [65, 59, 80, 81, 56, 55],
            fill: true,
            borderColor: '#4facfe',
            backgroundColor: 'rgba(79, 172, 254, 0.1)',
            tension: 0.4
        }]
    };

    const disasterTypeData = {
        labels: ['Flood', 'Fire', 'Storm', 'Quake'],
        datasets: [{
            data: [30, 20, 25, 25],
            backgroundColor: ['#4facfe', '#ff5252', '#764ba2', '#ff9800'],
            borderWidth: 0
        }]
    };

    return (
        <div className="ml-page">
            <div className="ml-sidebar glass-sidebar">
                <div className="sidebar-header">
                    <Cpu className="text-blue-400" size={32} />
                    <span>ML Insights</span>
                </div>
                
                <nav className="sidebar-nav">
                    <button 
                        className={activeTab === 'database' ? 'active' : ''} 
                        onClick={() => setActiveTab('database')}
                    >
                        <Database size={20} /> Database
                    </button>
                    <button 
                        className={activeTab === 'analytics' ? 'active' : ''} 
                        onClick={() => setActiveTab('analytics')}
                    >
                        <BarChart3 size={20} /> Analytics
                    </button>
                    <button 
                        className={activeTab === 'location' ? 'active' : ''} 
                        onClick={() => setActiveTab('location')}
                    >
                        <MapIcon size={20} /> Location
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="accuracy-pill">
                        <Activity size={14} />
                        Model Accuracy: 94.2%
                    </div>
                </div>
            </div>

            <main className="ml-main">
                <header className="ml-header">
                    <div className="user-info">
                        <h1>Advanced ML Dashboard</h1>
                        <p>Monitoring global disaster patterns</p>
                    </div>
                    <div className="header-actions">
                        <div className="search-pill">
                            <Search size={16} />
                            <input placeholder="Search records..." />
                        </div>
                    </div>
                </header>

                <div className="kpi-grid">
                    <motion.div whileHover={{ y: -5 }} className="kpi-card glass-kpi">
                        <div className="kpi-icon risk"><AlertTriangle size={20} /></div>
                        <div className="kpi-data">
                            <h3>{kpis.riskIndex}</h3>
                            <p>Risk Index</p>
                        </div>
                        <TrendingUp className="trend-up" size={16} />
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="kpi-card glass-kpi">
                        <div className="kpi-icon alerts"><ShieldCheck size={20} /></div>
                        <div className="kpi-data">
                            <h3>{kpis.alerts}</h3>
                            <p>Active Alerts</p>
                        </div>
                        <span className="pill warning">Active</span>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="kpi-card glass-kpi">
                        <div className="kpi-icon geo"><Globe size={20} /></div>
                        <div className="kpi-data">
                            <h3>{kpis.regions}</h3>
                            <p>Risk Zones</p>
                        </div>
                        <span className="pill info">Global</span>
                    </motion.div>
                </div>

                <div className="ml-content-area">
                    <AnimatePresence mode="wait">
                        {activeTab === 'database' && (
                            <motion.div 
                                key="db"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="tab-pane"
                            >
                                <div className="pane-grid">
                                    <div className="records-list glass-panel">
                                        <div className="panel-header">
                                            <h3><Database size={18} /> Disaster Records</h3>
                                            <Filter size={16} />
                                        </div>
                                        <div className="records-scroll">
                                            {mlDatabase.disasters.map((d, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`record-item ${selectedDisasterIdx === i ? 'selected' : ''}`}
                                                    onClick={() => setSelectedDisasterIdx(i)}
                                                >
                                                    <div className="dot" style={{ backgroundColor: d.severity > 70 ? '#ff5252' : '#4facfe' }}></div>
                                                    <div className="info">
                                                        <strong>{d.name}</strong>
                                                        <span>{d.date}</span>
                                                    </div>
                                                    <ChevronRight size={16} className="arrow" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="analysis-view">
                                        <div className="analysis-main glass-panel">
                                            <div className="panel-header">
                                                <h3><Layers size={18} /> Feature Analysis</h3>
                                                <span className="badge">AI Prediction</span>
                                            </div>
                                            {mlDatabase.disasters[selectedDisasterIdx] && (
                                                <div className="feature-grid">
                                                    <div className="f-card">
                                                        <span className="label">Temperature</span>
                                                        <span className="val">{mlDatabase.disasters[selectedDisasterIdx].temp.toFixed(1)}°C</span>
                                                    </div>
                                                    <div className="f-card">
                                                        <span className="label">Humidity</span>
                                                        <span className="val">{mlDatabase.disasters[selectedDisasterIdx].humidity.toFixed(1)}%</span>
                                                    </div>
                                                    <div className="f-card">
                                                        <span className="label">Pressure</span>
                                                        <span className="val">{mlDatabase.disasters[selectedDisasterIdx].pressure.toFixed(0)} hPa</span>
                                                    </div>
                                                    <div className="f-card risk">
                                                        <span className="label">Risk Score</span>
                                                        <span className="val">{mlDatabase.disasters[selectedDisasterIdx].severity}%</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="charts-sub-grid">
                                            <div className="mini-chart glass-panel">
                                                <h4><TrendingUp size={14} /> Risk Timeline</h4>
                                                <div className="c-wrap"><Line data={riskTrendData} options={chartOptions} /></div>
                                            </div>
                                            <div className="mini-chart glass-panel">
                                                <h4><BarChart3 size={14} /> Distribution</h4>
                                                <div className="c-wrap"><Doughnut data={disasterTypeData} options={chartOptions} /></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'analytics' && (
                            <motion.div 
                                key="analytics"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="tab-pane"
                            >
                                <div className="analytics-dashboard">
                                    <div className="big-chart glass-panel">
                                        <div className="panel-header">
                                            <h3>Global Trend Analysis</h3>
                                            <div className="time-select">
                                                <span>6 Months</span>
                                            </div>
                                        </div>
                                        <div className="c-wrap-big">
                                            <Line data={riskTrendData} options={{...chartOptions, maintainAspectRatio: false}} />
                                        </div>
                                    </div>
                                    <div className="stats-row">
                                        <div className="glass-panel">
                                            <h4>Model Insights</h4>
                                            <p className="text-muted text-sm">Neural network patterns identified 14 recurring hotspots in the last cycle.</p>
                                        </div>
                                        <div className="glass-panel">
                                            <h4>System Status</h4>
                                            <p className="text-muted text-sm">High-performance computing clusters are operating at 88% capacity.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default MachineLearning;
