import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Linkedin, 
  Github, 
  Twitter, 
  Send, 
  MessageSquare, 
  MapPin, 
  Phone,
  ExternalLink
} from 'lucide-react';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-page">
            <div className="blobs">
                <div className="blob blob-purple"></div>
                <div className="blob blob-blue"></div>
            </div>

            <div className="contact-container">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="contact-header"
                >
                    <span className="badge">Get in Touch</span>
                    <h1>Contact Our Team</h1>
                    <p>Have questions about disaster prevention or our ML models? We're here to help.</p>
                </motion.div>

                <div className="contact-grid">
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="contact-info glass-panel"
                    >
                        <h3>Connect with Us</h3>
                        <div className="info-items">
                            <div className="info-item">
                                <div className="icon-wrapper"><Mail size={20} /></div>
                                <div className="text">
                                    <span>Email</span>
                                    <strong>Nimbu.Mirchi.Ninjas@gmail.com</strong>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="icon-wrapper"><MapPin size={20} /></div>
                                <div className="text">
                                    <span>Location</span>
                                    <strong>Bengaluru, Karnataka, India</strong>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="icon-wrapper"><Phone size={20} /></div>
                                <div className="text">
                                    <span>Support</span>
                                    <strong>Available 24/7</strong>
                                </div>
                            </div>
                        </div>

                        <div className="social-links">
                            <a href="#"><Github size={20} /></a>
                            <a href="#"><Linkedin size={20} /></a>
                            <a href="#"><Twitter size={20} /></a>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="contact-action glass-panel"
                    >
                        <div className="gmail-box">
                            <MessageSquare className="text-blue-400" size={40} />
                            <h2>Direct Inquiry</h2>
                            <p>Click below to open Gmail and send us a detailed message. Our team usually responds within 2 hours.</p>
                            
                            <a 
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=Nimbu.Mirchi.Ninjas@gmail.com&su=Hello%20Nimbu%20Mirchi%20Ninjas&body=Hi,%20I%20would%20like%20to%20get%20in%20touch%20with%20you." 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="gmail-btn"
                            >
                                <Send size={20} />
                                Open Gmail Composer
                                <ExternalLink size={16} className="ext-icon" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
