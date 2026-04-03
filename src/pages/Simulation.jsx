import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Settings, 
  MapPin, 
  Zap, 
  Droplets, 
  Flame, 
  Send, 
  Phone, 
  MessageSquare,
  Thermometer,
  CloudRain,
  Navigation,
  ChevronRight,
  ChevronLeft,
  Activity
} from 'lucide-react';
import './Simulation.css';

const Simulation = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const requestRef = useRef(null);
    
    // State for UI
    const [city, setCity] = useState('bengaluru');
    const [disaster, setDisaster] = useState('none');
    const [intensity, setIntensity] = useState(5);
    const [disasterX, setDisasterX] = useState(0);
    const [disasterZ, setDisasterZ] = useState(0);
    const [alertEmail, setAlertEmail] = useState('');
    const [alertPhone, setAlertPhone] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [alerts, setAlerts] = useState([]);
    
    // ML Prediction states
    const [mlData, setMlData] = useState({
        riskLevel: 'UNKNOWN',
        probability: 0,
        willOccur: 'No',
        temp: 25,
        humidity: 60,
        pressure: 1000,
        time: 12
    });

    // Refs for simulation objects
    const npcsRef = useRef([]);
    const sheltersRef = useRef([]);
    const buildingsRef = useRef([]);
    const humansRef = useRef([]);
    const carsRef = useRef([]);
    const buildingMeshesRef = useRef([]);
    const disasterStateRef = useRef({ 
        x: 0, z: 0, intensity: 5, active: false, type: 'none', 
        centerMarker: null, carsStoppedByDisaster: false 
    });
    const waterMeshRef = useRef(null);
    const fireParticlesRef = useRef([]);

    // Logic from original simulation.html
    const cityMaps = {
        bengaluru: {
            shelter: { x: -15, z: 10 },
            buildings: [
                { x: -8, z: -8, w: 2, d: 3, h: 3, color: 0xcccccc },
                { x: -8, z: 0, w: 2.5, d: 2.5, h: 4, color: 0xaaaaaa },
                { x: 6, z: -10, w: 3, d: 2, h: 3.5, color: 0xbbbbbb },
                { x: 8, z: 5, w: 2, d: 2, h: 2.5, color: 0xdddddd },
                { x: -2, z: 8, w: 2.5, d: 2.5, h: 3, color: 0xcccccc }
            ],
            bunker: { x: 15, z: -15 }
        },
        delhi: {
            shelter: { x: 10, z: -5 },
            buildings: [
                { x: -10, z: -5, w: 2, d: 4, h: 3.5, color: 0xcccccc },
                { x: -5, z: 5, w: 3, d: 2, h: 4, color: 0xbbbbbb },
                { x: 0, z: -8, w: 2.5, d: 2.5, h: 3, color: 0xdddddd },
                { x: 8, z: -8, w: 2, d: 3, h: 3, color: 0xaaaaaa }
            ],
            bunker: { x: -15, z: 15 }
        }
    };

    const addAlert = (msg) => {
        setAlerts(prev => [...prev.slice(-4), { id: Date.now(), text: msg }]);
    };

    // Helper functions for Three.js
    const darkenColor = (color, factor) => {
        let r = (color >> 16) & 255;
        let g = (color >> 8) & 255;
        let b = color & 255;
        r = Math.floor(r * factor);
        g = Math.floor(g * factor);
        b = Math.floor(b * factor);
        return (r << 16) | (g << 8) | b;
    };

    const createHuman = (x, z) => {
        const group = new THREE.Group();
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), new THREE.MeshPhongMaterial({ color: 0xffcc99 }));
        head.position.y = 1.3;
        group.add(head);
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 0.2), new THREE.MeshPhongMaterial({ color: 0xff6666 }));
        body.position.y = 0.8;
        group.add(body);
        const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), new THREE.MeshPhongMaterial({ color: 0xffcc99 }));
        leftArm.position.set(-0.2, 0.95, 0);
        group.add(leftArm);
        const rightArm = leftArm.clone();
        rightArm.position.set(0.2, 0.95, 0);
        group.add(rightArm);
        const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), new THREE.MeshPhongMaterial({ color: 0x333333 }));
        leftLeg.position.set(-0.1, 0.25, 0);
        group.add(leftLeg);
        const rightLeg = leftLeg.clone();
        rightLeg.position.set(0.1, 0.25, 0);
        group.add(rightLeg);
        group.position.set(x, 0, z);
        group.userData = { walkSpeed: 0.03 + Math.random() * 0.02, walkDirection: Math.random() * Math.PI * 2, walkTime: 0, leftArm, rightArm, leftLeg, rightLeg };
        return group;
    };

    useEffect(() => {
        // Init scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB);
        scene.fog = new THREE.Fog(0x87CEEB, 60, 100);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 10, 15);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(20, 30, 20);
        dirLight.castShadow = true;
        scene.add(dirLight);

        // Ground
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0x90EE90 }));
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Animation loop
        const animate = () => {
            requestRef.current = requestAnimationFrame(animate);
            
            // Movement logic
            humansRef.current.forEach(human => {
                const data = human.userData;
                data.walkTime += 0.05;
                
                if (data.goingToBunker && data.bunkerTarget) {
                    const dx = data.bunkerTarget.x - human.position.x;
                    const dz = data.bunkerTarget.z - human.position.z;
                    const dist = Math.sqrt(dx * dx + dz * dz);
                    if (dist > 0.5) {
                        human.position.x += dx / dist * 0.1;
                        human.position.z += dz / dist * 0.1;
                        data.walkDirection = Math.atan2(dz, dx);
                    }
                } else {
                    if (Math.random() < 0.01) data.walkDirection += (Math.random() - 0.5);
                    human.position.x += Math.cos(data.walkDirection) * data.walkSpeed;
                    human.position.z += Math.sin(data.walkDirection) * data.walkSpeed;
                    if (Math.abs(human.position.x) > 40) data.walkDirection = Math.PI - data.walkDirection;
                }
                
                const swing = Math.sin(data.walkTime) * 0.3;
                data.leftArm.rotation.x = swing;
                data.rightArm.rotation.x = -swing;
                data.leftLeg.rotation.x = -swing;
                data.rightLeg.rotation.x = swing;
                human.rotation.y = -data.walkDirection + Math.PI/2;
            });

            // Disaster effects
            if (disasterStateRef.current.active) {
                if (disasterStateRef.current.type === 'earthquake') {
                    const shake = (Math.random() - 0.5) * 0.1 * disasterStateRef.current.intensity;
                    camera.position.x += shake;
                    camera.position.z += shake;
                }
            }

            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Initial spawn
        spawnCity(city);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(requestRef.current);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    const spawnCity = (cityName) => {
        const scene = sceneRef.current;
        if (!scene) return;

        // Cleanup
        buildingsRef.current.forEach(b => scene.remove(b));
        humansRef.current.forEach(h => scene.remove(h));
        buildingsRef.current = [];
        humansRef.current = [];

        const loc = cityMaps[cityName];

        // Buildings
        loc.buildings.forEach(bldg => {
            const geom = new THREE.BoxGeometry(bldg.w, bldg.h, bldg.d);
            const mat = new THREE.MeshPhongMaterial({ color: bldg.color });
            const building = new THREE.Mesh(geom, mat);
            building.position.set(bldg.x, bldg.h/2, bldg.z);
            building.castShadow = true;
            scene.add(building);
            buildingsRef.current.push(building);
        });

        // Humans
        for (let i = 0; i < 10; i++) {
            const h = createHuman((Math.random()-0.5)*30, (Math.random()-0.5)*30);
            scene.add(h);
            humansRef.current.push(h);
        }
    };

    const triggerDisasterAction = () => {
        disasterStateRef.current.active = true;
        disasterStateRef.current.type = disaster;
        disasterStateRef.current.intensity = intensity;
        
        addAlert(`🚨 ${disaster.toUpperCase()} TRIGGERED! LEVEL ${intensity}`);
        
        if (disaster !== 'none') {
            const target = cityMaps[city].bunker;
            humansRef.current.forEach(h => {
                h.userData.goingToBunker = true;
                h.userData.bunkerTarget = target;
            });
        }
    };

    return (
        <div className="simulation-page">
            <div className="three-container" ref={mountRef}></div>

            {/* Glassmorphism Controls */}
            <div className="controls-panel premium-glass">
                <div className="panel-header">
                    <Activity size={20} className="icon-pulse" />
                    <h2>Simulation Center</h2>
                </div>

                <div className="control-group">
                    <label><MapPin size={16} /> Location</label>
                    <select value={city} onChange={(e) => {setCity(e.target.value); spawnCity(e.target.value);}}>
                        <option value="bengaluru">Bengaluru</option>
                        <option value="delhi">Delhi</option>
                    </select>
                </div>

                <div className="control-group">
                    <label><AlertTriangle size={16} /> Type</label>
                    <select value={disaster} onChange={(e) => setDisaster(e.target.value)}>
                        <option value="none">Normal</option>
                        <option value="fire">Fire</option>
                        <option value="flood">Flood</option>
                        <option value="earthquake">Earthquake</option>
                    </select>
                </div>

                <div className="control-group">
                    <label><Zap size={16} /> Intensity: {intensity}</label>
                    <input type="range" min="1" max="10" value={intensity} onChange={(e) => setIntensity(e.target.value)} />
                </div>

                <div className="input-group">
                  <div className="field">
                    <label><MessageSquare size={14} /> Email Alert</label>
                    <input type="email" placeholder="email@alerts.com" value={alertEmail} onChange={e => setAlertEmail(e.target.value)} />
                  </div>
                  <div className="field">
                    <label><Phone size={14} /> Phone Alert</label>
                    <input type="tel" placeholder="+91..." value={alertPhone} onChange={e => setAlertPhone(e.target.value)} />
                  </div>
                </div>

                <button className="trigger-btn" onClick={triggerDisasterAction}>
                    Trigger Event
                </button>
            </div>

            {/* Alert List */}
            <div className="alert-toast-container">
              <AnimatePresence>
                {alerts.map((a) => (
                  <motion.div 
                    key={a.id}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    className="alert-toast"
                  >
                    {a.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ML Floating Panel */}
            <motion.div 
              className={`ml-floating-panel ${isCollapsed ? 'collapsed' : ''}`}
              layout
            >
              <button className="toggle-ml" onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? <Activity size={24} /> : <ChevronRight size={24} />}
              </button>

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div 
                    className="ml-content"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <h3>ML Insights</h3>
                    <div className="metrics">
                      <div className="metric">
                        <span>Risk</span>
                        <span className={`val ${mlData.riskLevel.toLowerCase()}`}>{mlData.riskLevel}</span>
                      </div>
                      <div className="metric">
                        <span>Prob</span>
                        <span className="val">{mlData.probability}%</span>
                      </div>
                    </div>
                    <div className="risk-bar">
                      <div className="fill" style={{ width: `${mlData.probability}%` }}></div>
                    </div>
                    <div className="details">
                      <p><Thermometer size={12}/> {mlData.temp}°C</p>
                      <p><CloudRain size={12}/> {mlData.humidity}%</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Simulation;
