import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Layers
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-top-grid">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <div className="footer-logo-badge">
              <Compass size={22} className="footer-logo-icon" />
            </div>
            <div>
              <span className="footer-brand-title">Trip<span className="footer-brand-accent">Wise</span></span>
              <p className="footer-brand-sub">Smart & Transparent Travel Planning</p>
            </div>
          </div>
          <p className="footer-brand-desc">
            An academic CSE capstone initiative disrupting the middleman-heavy travel industry in India. 
            Empowering travelers to build bespoke itineraries with itemized, authentic costs and zero broker markups.
          </p>
          <div className="footer-tech-stack">
            <span className="tech-chip">React.js</span>
            <span className="tech-chip">Vite</span>
            <span className="tech-chip">Spring Boot (Upcoming)</span>
            <span className="tech-chip">MySQL</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Platform Features</h4>
          <ul className="footer-links-list">
            <li><Link to="/explore">Explore Indian Destinations</Link></li>
            <li><Link to="/build-my-trip">Direct Trip Cost Calculator</Link></li>
            <li><Link to="/compare-packages">Agent vs Self-Built Comparison</Link></li>
            <li><Link to="/my-trips">My Saved Custom Trips</Link></li>
            <li><a href="#how-it-works">How Zero-Brokerage Works</a></li>
          </ul>
        </div>

        {/* Destinations */}
        <div className="footer-col">
          <h4 className="footer-heading">Top Indian Circuits</h4>
          <ul className="footer-links-list">
            <li><Link to="/explore?cat=Mountains">Himachal & Leh Ladakh</Link></li>
            <li><Link to="/explore?cat=Beaches">Goa Coastal Havens</Link></li>
            <li><Link to="/explore?cat=Heritage">Rajasthan Royal Forts</Link></li>
            <li><Link to="/explore?cat=Nature">Kerala Tea Gardens & Backwaters</Link></li>
            <li><Link to="/explore?cat=Spiritual">Ganga Ghats Varanasi</Link></li>
          </ul>
        </div>

        {/* College Project Meta */}
        <div className="footer-col project-meta-col">
          <h4 className="footer-heading">Project Information</h4>
          <div className="meta-card">
            <div className="meta-badge"><Sparkles size={14} /> College CSE Capstone</div>
            <p className="meta-text">
              Designed as a final year Computer Science & Engineering project demonstrating transparent itemized budgeting and comparative analytics.
            </p>
            <div className="meta-detail">
              <span className="meta-label">Architecture:</span>
              <span className="meta-val">Decoupled RESTful API (Vite Frontend + Spring Boot Backend)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="footer-copyright">
            © {new Date().getFullYear()} <strong>TripWise</strong>. College CSE Project. All pricing data and itineraries are academic simulated estimates.
          </p>
          <div className="footer-bottom-links">
            <span className="footer-trust-tag"><ShieldCheck size={14} /> 100% Itemized Transparency</span>
            <span className="footer-trust-tag"><Layers size={14} /> Direct Vendor Model</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
