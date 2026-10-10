import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Sliders, 
  GitCompare, 
  DollarSign, 
  Check, 
  Star,
  Clock,
  Compass
} from 'lucide-react';
import { destinationsData } from '../data/destinationsData';
import DestinationCard from '../components/DestinationCard';
import { useTrip } from '../context/TripContext';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { updateCurrentTrip } = useTrip();

  // Search form state
  const [searchDestination, setSearchDestination] = useState('manali');
  const [travelDates, setTravelDates] = useState('2026-05-15');
  const [travelersCount, setTravelersCount] = useState(2);
  const [budgetCap, setBudgetCap] = useState(35000);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const destObj = destinationsData.find(d => d.id === searchDestination) || destinationsData[0];
    updateCurrentTrip({
      destination: destObj.id,
      destinationName: destObj.name,
      startDate: travelDates,
      travelers: Number(travelersCount),
      budget: Number(budgetCap)
    });
    navigate(`/build-my-trip?destination=${destObj.id}`);
  };

  const handlePickDestination = (destination) => {
    updateCurrentTrip({
      destination: destination.id,
      destinationName: destination.name,
      budget: destination.estCostPerPerson * 2
    });
    navigate(`/build-my-trip?destination=${destination.id}`);
  };

  return (
    <div className="home-page-wrapper">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-backdrop-overlay" />
        <div className="container hero-container">
          <div className="hero-badge animate-fade-in">
            <Sparkles size={16} />
            <span>Smart & Transparent Travel Planning Platform for India</span>
          </div>

          <h1 className="hero-headline">
            Build Your Own Dream Trip.<br />
            <span className="hero-gradient-text">Zero Middlemen. Zero Hidden Markups.</span>
          </h1>

          <p className="hero-subtext">
            Why pay 30–40% broker profit on rigid tour packages? Hand-pick verified trains, flights, boutique stays, local scooters, and certified guides with complete itemized price transparency.
          </p>

          {/* Trip Search / Quick Build Bar */}
          <div className="hero-search-card glass-panel">
            <form onSubmit={handleHeroSearch} className="hero-search-form">
              {/* Destination */}
              <div className="search-field">
                <label className="search-label">
                  <MapPin size={16} className="field-icon text-teal" />
                  Destination
                </label>
                <select 
                  className="search-select"
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                >
                  {destinationsData.map((dest) => (
                    <option key={dest.id} value={dest.id}>
                      {dest.name} ({dest.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Travel Date */}
              <div className="search-field">
                <label className="search-label">
                  <Calendar size={16} className="field-icon text-teal" />
                  Travel Date
                </label>
                <input 
                  type="date"
                  className="search-input"
                  value={travelDates}
                  onChange={(e) => setTravelDates(e.target.value)}
                  min="2026-01-01"
                />
              </div>

              {/* Number of Travelers */}
              <div className="search-field">
                <label className="search-label">
                  <Users size={16} className="field-icon text-teal" />
                  Travelers
                </label>
                <select 
                  className="search-select"
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(Number(e.target.value))}
                >
                  <option value={1}>1 Solo Explorer</option>
                  <option value={2}>2 Persons (Couple/Friends)</option>
                  <option value={3}>3 Persons</option>
                  <option value={4}>4 Persons (Family/Group)</option>
                  <option value={6}>6+ Persons (Group)</option>
                </select>
              </div>

              {/* Target Budget */}
              <div className="search-field">
                <label className="search-label">
                  <IndianRupee size={16} className="field-icon text-teal" />
                  Planned Budget (₹)
                </label>
                <input 
                  type="number"
                  step="1000"
                  className="search-input"
                  value={budgetCap}
                  onChange={(e) => setBudgetCap(Number(e.target.value))}
                  placeholder="e.g. 35000"
                />
              </div>

              {/* Submit CTA */}
              <div className="search-action">
                <button type="submit" className="btn btn-primary btn-hero-submit">
                  <span>Start Direct Plan</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>

          {/* Quick Metrics */}
          <div className="hero-metrics-row">
            <div className="metric-pill">
              <ShieldCheck size={18} className="metric-icon" />
              <span><strong>100%</strong> Itemized Pricing</span>
            </div>
            <div className="metric-pill">
              <IndianRupee size={18} className="metric-icon" />
              <span>Avg. <strong>₹8,500+ Saved</strong> / Trip</span>
            </div>
            <div className="metric-pill">
              <Compass size={18} className="metric-icon" />
              <span><strong>Direct</strong> Operator Freedom</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="section-padding bg-subtle-pattern">
        <div className="container">
          <div className="section-head text-center">
            <span className="badge badge-teal">Simple 4-Step Process</span>
            <h2 className="section-title">How TripWise Puts You in Control</h2>
            <p className="section-subtitle">
              Say goodbye to opaque "all-inclusive" packages stuffed with shopping commissions and unwanted stops.
            </p>
          </div>

          <div className="grid-4 step-cards-grid">
            <div className="step-card card">
              <div className="step-number">01</div>
              <div className="step-icon-wrap">
                <MapPin size={24} />
              </div>
              <h3 className="step-title">Select Destination & Budget</h3>
              <p className="step-desc">
                Choose any iconic Indian circuit, specify your dates, group size, and set your spending limits.
              </p>
            </div>

            <div className="step-card card">
              <div className="step-number">02</div>
              <div className="step-icon-wrap">
                <Sliders size={24} />
              </div>
              <h3 className="step-title">Pick Individual Components</h3>
              <p className="step-desc">
                Customize your flight vs 3AC train, boutique homestay vs 4-star resort, bike rentals, and certified guides.
              </p>
            </div>

            <div className="step-card card">
              <div className="step-number">03</div>
              <div className="step-icon-wrap">
                <IndianRupee size={24} />
              </div>
              <h3 className="step-title">Live Dynamic Total & Warnings</h3>
              <p className="step-desc">
                Watch every rupee update in real time. Get instant alerts if your choices exceed your allocated budget.
              </p>
            </div>

            <div className="step-card card">
              <div className="step-number">04</div>
              <div className="step-icon-wrap">
                <GitCompare size={24} />
              </div>
              <h3 className="step-title">Compare with Travel Agents</h3>
              <p className="step-desc">
                Benchmark your self-built itinerary against traditional agency packages and uncover hidden markups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR INDIAN DESTINATIONS */}
      <section className="section-padding">
        <div className="container">
          <div className="section-head-split">
            <div>
              <span className="badge badge-emerald">Handpicked Circuits</span>
              <h2 className="section-title">Trending Indian Destinations</h2>
              <p className="section-subtitle">
                Explore authentic regional experiences with verified realistic baseline rates.
              </p>
            </div>
            <button onClick={() => navigate('/explore')} className="btn btn-secondary">
              View All Destinations <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid-4 destinations-home-grid">
            {destinationsData.slice(0, 4).map((dest) => (
              <DestinationCard 
                key={dest.id} 
                destination={dest} 
                onSelectForBuilder={handlePickDestination}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMPARISON VALUE PROPOSITION SECTION */}
      <section className="section-padding comparison-teaser-section">
        <div className="container">
          <div className="comparison-banner-card card glass-panel-dark">
            <div className="comparison-banner-content">
              <span className="badge badge-amber">The Transparency Revolution</span>
              <h2 className="comparison-banner-title">
                Traditional Travel Agents vs. TripWise Self-Built
              </h2>
              <p className="comparison-banner-desc">
                Traditional agents bundle services with hefty markups and send you to commission-heavy spice gardens and carpet shops. Here is why college travelers and smart families are switching:
              </p>

              <div className="comparison-checks-grid">
                <div className="comp-check-item">
                  <div className="comp-check-icon check-agent">✕</div>
                  <div>
                    <strong>Agency Package:</strong> Opaque lumped pricing where you don’t know what individual hotels or cars cost.
                  </div>
                </div>
                <div className="comp-check-item">
                  <div className="comp-check-icon check-direct">✓</div>
                  <div>
                    <strong>TripWise:</strong> Itemized costs down to every rail berth, scooter rental, and ASI monument pass.
                  </div>
                </div>
                <div className="comp-check-item">
                  <div className="comp-check-icon check-agent">✕</div>
                  <div>
                    <strong>Agency Package:</strong> Rigid 30-minute stopovers and wasted afternoons at emporiums.
                  </div>
                </div>
                <div className="comp-check-item">
                  <div className="comp-check-icon check-direct">✓</div>
                  <div>
                    <strong>TripWise:</strong> Complete freedom to stay longer at cafes or hike secret trails.
                  </div>
                </div>
              </div>

              <div className="comparison-banner-cta">
                <button 
                  onClick={() => navigate('/compare-packages')} 
                  className="btn btn-lg btn-primary"
                >
                  <GitCompare size={20} />
                  Launch Package Comparison Tool
                </button>
                <button 
                  onClick={() => navigate('/build-my-trip')} 
                  className="btn btn-lg btn-secondary"
                >
                  <Sliders size={20} />
                  Try Trip Builder Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PLATFORM BENEFITS */}
      <section className="section-padding bg-subtle-pattern">
        <div className="container">
          <div className="section-head text-center">
            <span className="badge badge-teal">Core Advantages</span>
            <h2 className="section-title">Built for Smart Indian Travelers</h2>
            <p className="section-subtitle">
              Engineered with modern frontend components to deliver the smoothest planning experience.
            </p>
          </div>

          <div className="grid-3 benefits-grid">
            <div className="benefit-card card">
              <div className="benefit-icon bg-teal-soft">
                <IndianRupee size={26} className="text-teal" />
              </div>
              <h3 className="benefit-title">Zero Broker Commission</h3>
              <p className="benefit-desc">
                Save an estimated 20% to 35% on every booking by directly calculating actual hotel rates, transit fares, and activities.
              </p>
            </div>

            <div className="benefit-card card">
              <div className="benefit-icon bg-emerald-soft">
                <Clock size={26} className="text-emerald" />
              </div>
              <h3 className="benefit-title">Instant Live Recalculations</h3>
              <p className="benefit-desc">
                Toggle between luxury resorts and cozy homestays, or flights and sleeper trains. Your total budget recalculates on the fly.
              </p>
            </div>

            <div className="benefit-card card">
              <div className="benefit-icon bg-amber-soft">
                <ShieldCheck size={26} className="text-amber" />
              </div>
              <h3 className="benefit-title">Authentic Local Experiences</h3>
              <p className="benefit-desc">
                Hire certified local historian guides and book local scooter rentals directly rather than overpriced agent shuttles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION STRIP */}
      <section className="cta-strip">
        <div className="container cta-strip-container">
          <div>
            <h2 className="cta-title">Ready to plan your next Indian getaway?</h2>
            <p className="cta-subtitle">Test our prototype, build an itinerary in under 2 minutes, and compare your savings.</p>
          </div>
          <div className="cta-button-group">
            <button onClick={() => navigate('/build-my-trip')} className="btn btn-lg btn-primary">
              Build My Trip Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
