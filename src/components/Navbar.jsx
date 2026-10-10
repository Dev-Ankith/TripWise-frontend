import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Sliders, 
  GitCompare, 
  Briefcase, 
  User, 
  Menu, 
  X, 
  LogOut, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, savedTrips } = useTrip();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="demo-banner">
        <ShieldCheck size={16} />
        <span><strong>TripWise Academic Prototype:</strong> Itemized direct prices in INR (₹). Simulated client-side pricing engine.</span>
      </div>

      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-wrap">
            <Compass className="logo-icon" size={24} />
          </div>
          <div className="logo-text-wrap">
            <span className="logo-title">Trip<span className="logo-accent">Wise</span></span>
            <span className="logo-tagline">Zero Brokerage • Smart Travel</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <MapPin size={16} className="nav-icon" />
            Explore
          </NavLink>
          <NavLink to="/build-my-trip" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Sliders size={16} className="nav-icon" />
            Build My Trip
          </NavLink>
          <NavLink to="/compare-packages" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <GitCompare size={16} className="nav-icon" />
            Compare Packages
          </NavLink>
          <NavLink to="/my-trips" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Briefcase size={16} className="nav-icon" />
            My Trips
            {savedTrips.length > 0 && (
              <span className="nav-count-badge">{savedTrips.length}</span>
            )}
          </NavLink>
        </nav>

        {/* Auth / Profile Area */}
        <div className="navbar-actions">
          {user ? (
            <div className="user-profile-menu">
              <Link to="/my-trips" className="user-profile-btn" title="View my trips">
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                <span className="user-name">{user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn" title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-sm btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button 
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Navigation</span>
              <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="mobile-menu-links">
              <NavLink 
                to="/" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Home</span>
                <ChevronRight size={18} />
              </NavLink>

              <NavLink 
                to="/explore" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex-item"><MapPin size={18} /> Explore Destinations</span>
                <ChevronRight size={18} />
              </NavLink>

              <NavLink 
                to="/build-my-trip" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex-item"><Sliders size={18} /> Build My Trip</span>
                <ChevronRight size={18} />
              </NavLink>

              <NavLink 
                to="/compare-packages" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex-item"><GitCompare size={18} /> Compare Packages</span>
                <ChevronRight size={18} />
              </NavLink>

              <NavLink 
                to="/my-trips" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex-item"><Briefcase size={18} /> My Saved Trips</span>
                <span className="badge badge-teal">{savedTrips.length}</span>
              </NavLink>
            </div>

            <div className="mobile-auth-section">
              {user ? (
                <div className="mobile-user-card">
                  <div className="user-info">
                    <img src={user.avatar} alt={user.name} className="user-avatar" />
                    <div>
                      <p className="user-fullname">{user.name}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="btn btn-secondary btn-full btn-sm">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="mobile-auth-actions">
                  <Link 
                    to="/login" 
                    className="btn btn-secondary btn-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-primary btn-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
