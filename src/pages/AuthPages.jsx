import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  Compass, 
  ShieldCheck, 
  User, 
  ArrowRight
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import './AuthPages.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('aditya.sharma@example.com');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useTrip();
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      login(email, 'Aditya Sharma');
      navigate('/my-trips');
    }, 600);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Compass size={28} />
          </div>
          <h2 className="auth-title">Welcome Back to TripWise</h2>
          <p className="auth-sub">
            Log in to manage your saved self-built trips and custom itineraries.
          </p>
        </div>

        <div className="demo-credentials-callout">
          <ShieldCheck size={16} className="text-teal" />
          <div>
            <strong>Demo Simulation Credentials:</strong>
            <p>Pre-filled for fast testing. No real server account will be contacted.</p>
          </div>
        </div>

        {error && (
          <div className="auth-error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">
              <Mail size={15} /> Email Address
            </label>
            <input 
              type="email"
              className="form-control"
              placeholder="e.g. aditya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={15} /> Password
            </label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="toggle-pw-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full btn-auth-submit"
            disabled={loading}
          >
            {loading ? 'Authenticating Mock Session...' : 'Sign In with Demo Session'}
          </button>
        </form>

        <div className="auth-footer-link">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="text-teal font-bold">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('Priya Patel');
  const [email, setEmail] = useState('priya.patel@example.com');
  const [password, setPassword] = useState('TripWise#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useTrip();
  const navigate = useNavigate();

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(email, fullName);
      navigate('/my-trips');
    }, 600);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Compass size={28} />
          </div>
          <h2 className="auth-title">Create TripWise Account</h2>
          <p className="auth-sub">
            Join the transparent travel movement and bypass broker markups across India.
          </p>
        </div>

        <div className="demo-credentials-callout">
          <ShieldCheck size={16} className="text-teal" />
          <div>
            <strong>College Demo Notice:</strong>
            <p>Mock authentication enabled. Stores test session in browser localStorage.</p>
          </div>
        </div>

        {error && (
          <div className="auth-error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">
              <User size={15} /> Full Name
            </label>
            <input 
              type="text"
              className="form-control"
              placeholder="e.g. Priya Patel"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={15} /> Email Address
            </label>
            <input 
              type="email"
              className="form-control"
              placeholder="e.g. priya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={15} /> Password
            </label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="toggle-pw-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full btn-auth-submit"
            disabled={loading}
          >
            {loading ? 'Creating Mock Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="auth-footer-link">
          <span>Already have an account? </span>
          <Link to="/login" className="text-teal font-bold">Sign In</Link>
        </div>
      </div>
    </div>
  );
};
