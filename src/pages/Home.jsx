import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Globe, 
  Activity, 
  Zap, 
  Cpu, 
  Bell, 
  ArrowRight,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const features = [
        { 
            icon: <Globe className="text-blue-400" />, 
            title: "3D Globe Explorer", 
            desc: "Visualize real-time disaster alerts and weather patterns on an interactive high-resolution globe." 
        },
        { 
            icon: <Cpu className="text-purple-400" />, 
            title: "AI Risk Prediction", 
            desc: "Advanced ML models analyzing environmental metrics to predict disasters with up to 94% accuracy." 
        },
        { 
            icon: <Activity className="text-red-400" />, 
            title: "Live Simulations", 
            desc: "Test emergency protocols in our physics-based disaster simulator with integrated alert systems." 
        }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hero-badge"
                    >
                        <Shield size={14} />
                        <span>Next-Gen Disaster Intelligence</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Protecting Our Planet through <br/>
                        <span>AI & Real-Time Visualization</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        TerraAlertum combines advanced machine learning with immersive 3D simulation 
                        to provide early warnings and strategic insights for global disaster management.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="hero-btns"
                    >
                        <Link to="/globe" className="btn-primary">
                            Launch Explorer <ArrowRight size={18} />
                        </Link>
                        <Link to="/simulation" className="btn-secondary">
                            Live Simulation
                        </Link>
                    </motion.div>
                </div>

                {/* Hero Decoration */}
                <div className="hero-visual">
                    <div className="sphere-glow"></div>
                    <motion.div 
                        animate={{ 
                            rotate: 360,
                            scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="sphere-wrap"
                    >
                        <Globe size={300} strokeWidth={0.5} className="hero-globe-svg" />
                    </motion.div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="stats-strip">
                <div className="stat-card">
                    <strong>94.2%</strong>
                    <span>ML Accuracy</span>
                </div>
                <div className="stat-card">
                    <strong>150+</strong>
                    <span>Countries Tracked</span>
                </div>
                <div className="stat-card">
                    <strong>2s</strong>
                    <span>Alert Latency</span>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="section-head">
                    <h2>Powerful Tools for Resilience</h2>
                    <p>Designed for government agencies and emergency responders worldwide.</p>
                </div>

                <div className="features-grid">
                    {features.map((f, i) => (
                        <motion.div 
                            key={i}
                            whileHover={{ y: -10 }}
                            className="feature-card glass-premium"
                        >
                            <div className="f-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                            <Link to={i === 0 ? "/globe" : i === 1 ? "/ml" : "/simulation"} className="f-link">
                                Learn More <ChevronRight size={14} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Trust Section */}
            <section className="trust-section">
                <div className="trust-content glass-premium">
                    <div className="trust-text">
                        <h2>Trusted by Global Response Teams</h2>
                        <ul className="check-list">
                            <li><CheckCircle2 size={18} className="text-blue-400" /> End-to-end multi-channel alert systems</li>
                            <li><CheckCircle2 size={18} className="text-blue-400" /> Real-time environmental sensor integration</li>
                            <li><CheckCircle2 size={18} className="text-blue-400" /> Physics-based disaster event modeling</li>
                        </ul>
                    </div>
                    <div className="trust-image">
                        <Zap size={100} className="text-blue-400 opacity-20" />
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="cta-footer">
                <div className="cta-box glass-premium">
                    <h2>Ready to build a safer world?</h2>
                    <p>Contact our development team for custom integration or partnership inquiries.</p>
                    <Link to="/contact" className="btn-primary">Get in Touch</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
