import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  Plane, 
  Train, 
  Hotel, 
  Car, 
  Camera, 
  Compass, 
  Utensils, 
  Check, 
  Plus, 
  Trash2, 
  Info,
  Sparkles,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { destinationsData, tripComponentsCatalog } from '../data/destinationsData';
import PriceSummaryCard from '../components/PriceSummaryCard';
import { useTrip } from '../context/TripContext';
import './BuildMyTripPage.css';

const interestOptions = ['Adventure', 'Nature', 'Local Food', 'Photography', 'Heritage & History', 'Spiritual', 'Relaxation & Spa'];

const BuildMyTripPage = () => {
  const [searchParams] = useSearchParams();
  const destQuery = searchParams.get('destination');
  const navigate = useNavigate();

  const { currentTrip, updateCurrentTrip, saveTrip } = useTrip();

  // If a destination was passed in URL params, sync it
  useEffect(() => {
    if (destQuery && destQuery !== currentTrip.destination) {
      const match = destinationsData.find(d => d.id === destQuery);
      if (match) {
        updateCurrentTrip({
          destination: match.id,
          destinationName: match.name
        });
      }
    }
  }, [destQuery]);

  // Active destination object
  const activeDestination = useMemo(() => {
    return destinationsData.find(d => d.id === currentTrip.destination) || destinationsData[0];
  }, [currentTrip.destination]);

  // Local state for trip inputs
  const [travelers, setTravelers] = useState(currentTrip.travelers || 2);
  const [durationDays, setDurationDays] = useState(currentTrip.durationDays || 4);
  const [budget, setBudget] = useState(currentTrip.budget || 35000);
  const [startDate, setStartDate] = useState(currentTrip.startDate || '2026-05-15');
  const [selectedInterests, setSelectedInterests] = useState(currentTrip.interests || ['Adventure', 'Nature']);

  // Component selections
  const [selectedTransport, setSelectedTransport] = useState(currentTrip.selectedTransportation || 'train_3ac');
  const [selectedStay, setSelectedStay] = useState(currentTrip.selectedAccommodation || 'hotel_3star');
  const [selectedLocalTrans, setSelectedLocalTrans] = useState(currentTrip.selectedLocalTransport || 'local_scooter');
  const [selectedSightseeing, setSelectedSightseeing] = useState(currentTrip.selectedSightseeing || ['monument_entries']);
  const [selectedActivities, setSelectedActivities] = useState(currentTrip.selectedActivities || ['adventure_sport']);
  const [selectedFood, setSelectedFood] = useState(currentTrip.selectedFoodTier || 'food_mid');

  // Notification / saved state
  const [isSaved, setIsSaved] = useState(false);

  // Sync back to context on changes
  useEffect(() => {
    updateCurrentTrip({
      travelers,
      durationDays,
      budget,
      startDate,
      interests: selectedInterests,
      selectedTransportation: selectedTransport,
      selectedAccommodation: selectedStay,
      selectedLocalTransport: selectedLocalTrans,
      selectedSightseeing,
      selectedActivities,
      selectedFoodTier: selectedFood
    });
    setIsSaved(false);
  }, [
    travelers, 
    durationDays, 
    budget, 
    startDate, 
    selectedInterests, 
    selectedTransport, 
    selectedStay, 
    selectedLocalTrans, 
    selectedSightseeing, 
    selectedActivities, 
    selectedFood
  ]);

  // Destination changer
  const handleDestinationChange = (destId) => {
    const dest = destinationsData.find(d => d.id === destId);
    if (dest) {
      updateCurrentTrip({
        destination: dest.id,
        destinationName: dest.name
      });
    }
  };

  // Toggle interest
  const toggleInterest = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  // Toggle multi-select items (sightseeing & activities)
  const toggleSightseeing = (id) => {
    setSelectedSightseeing(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleActivity = (id) => {
    setSelectedActivities(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Calculation engine: Compute itemized cost immediately
  const calculations = useMemo(() => {
    // 1. Transportation to/from destination
    const transportObj = tripComponentsCatalog.transportation.find(t => t.id === selectedTransport);
    let transportCost = 0;
    if (transportObj) {
      transportCost = transportObj.isFlatRate ? transportObj.pricePerUnit : (transportObj.pricePerUnit * travelers);
    }

    // 2. Accommodation (assume 1 room per 2 travelers, minimum 1 room)
    const stayObj = tripComponentsCatalog.accommodation.find(a => a.id === selectedStay);
    const roomsCount = Math.ceil(travelers / 2);
    let stayCost = 0;
    if (stayObj) {
      stayCost = stayObj.pricePerNight * durationDays * roomsCount;
    }

    // 3. Local Transport
    const localObj = tripComponentsCatalog.localTransport.find(l => l.id === selectedLocalTrans);
    let localCost = 0;
    if (localObj) {
      if (localObj.isFlatRate) {
        localCost = localObj.pricePerDay * durationDays;
      } else {
        localCost = localObj.pricePerDay * durationDays * travelers;
      }
    }

    // 4. Sightseeing
    let sightseeingCost = 0;
    selectedSightseeing.forEach(itemId => {
      const item = tripComponentsCatalog.sightseeing.find(s => s.id === itemId);
      if (item) {
        sightseeingCost += item.isFlatRate ? item.price : (item.price * travelers);
      }
    });

    // 5. Activities
    let activitiesCost = 0;
    selectedActivities.forEach(actId => {
      const act = tripComponentsCatalog.activities.find(a => a.id === actId);
      if (act) {
        activitiesCost += act.price * travelers;
      }
    });

    // 6. Food allowance
    const foodObj = tripComponentsCatalog.foodTiers.find(f => f.id === selectedFood);
    let foodCost = 0;
    if (foodObj) {
      foodCost = foodObj.pricePerDay * durationDays * travelers;
    }

    const calculatedTotal = transportCost + stayCost + localCost + sightseeingCost + activitiesCost + foodCost;

    const breakdown = {
      transportation: { name: transportObj?.name || 'Transport', cost: transportCost },
      accommodation: { name: stayObj?.name || 'Stay', cost: stayCost },
      localTransport: { name: localObj?.name || 'Local Transport', cost: localCost },
      sightseeing: { name: `${selectedSightseeing.length} Sightseeing Passes`, cost: sightseeingCost },
      activities: { name: `${selectedActivities.length} Activities`, cost: activitiesCost },
      food: { name: foodObj?.name || 'Food Allowance', cost: foodCost }
    };

    return {
      calculatedTotal,
      breakdown
    };
  }, [
    selectedTransport, 
    selectedStay, 
    selectedLocalTrans, 
    selectedSightseeing, 
    selectedActivities, 
    selectedFood, 
    travelers, 
    durationDays
  ]);

  // Handler for saving trip to context & localStorage
  const handleSaveTrip = () => {
    saveTrip({
      destinationName: activeDestination.name,
      startDate: startDate,
      endDate: `+${durationDays} Days`,
      durationDays,
      travelers,
      budget,
      calculatedTotal: calculations.calculatedTotal,
      breakdown: calculations.breakdown,
      coverImage: activeDestination.image
    });
    setIsSaved(true);
  };

  return (
    <div className="builder-page-wrapper">
      {/* Header Bar */}
      <div className="builder-top-header">
        <div className="container">
          <div className="builder-header-inner">
            <div>
              <span className="badge badge-teal">Interactive Trip Architect</span>
              <h1 className="builder-title">Build My Trip — Direct Pricing</h1>
              <p className="builder-subtitle">
                Customize every piece of your journey individually. Real-time cost updates with zero broker markups.
              </p>
            </div>
            <div className="destination-selector-box">
              <label className="dest-select-label">Active Destination:</label>
              <select 
                className="dest-select-input"
                value={activeDestination.id}
                onChange={(e) => handleDestinationChange(e.target.value)}
              >
                {destinationsData.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container builder-main-layout">
        {/* Left Column: Interactive Customization Controls */}
        <div className="builder-controls-column">
          {/* STEP 1: TRIP PARAMETERS CARD */}
          <div className="builder-section-card card">
            <div className="section-card-header">
              <span className="step-badge">Step 1</span>
              <div>
                <h3 className="section-card-title">Trip Parameters & Budget Cap</h3>
                <p className="section-card-desc">Set your duration, travel party size, and target ceiling budget.</p>
              </div>
            </div>

            <div className="grid-3 params-grid">
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={15} /> Travel Start Date
                </label>
                <input 
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={15} /> Duration (Nights / Days)
                </label>
                <select 
                  className="form-control"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                >
                  <option value={2}>2 Days / 1 Night (Weekend)</option>
                  <option value={3}>3 Days / 2 Nights</option>
                  <option value={4}>4 Days / 3 Nights</option>
                  <option value={5}>5 Days / 4 Nights</option>
                  <option value={7}>7 Days / 6 Nights (Full Week)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Users size={15} /> Travelers Count
                </label>
                <input 
                  type="number"
                  min="1"
                  max="12"
                  className="form-control"
                  value={travelers}
                  onChange={(e) => setTravelers(Math.max(1, Number(e.target.value)))}
                />
              </div>
            </div>

            <div className="form-group budget-input-group">
              <label className="form-label">
                <IndianRupee size={15} /> Allocated Trip Budget Target
              </label>
              <div className="budget-input-wrapper">
                <span className="rupee-symbol">₹</span>
                <input 
                  type="number"
                  step="1000"
                  min="5000"
                  className="form-control budget-custom-input"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Interests Chips */}
            <div className="interests-section">
              <label className="form-label">Select Your Trip Interests:</label>
              <div className="interests-wrap">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    className={`interest-pill ${selectedInterests.includes(interest) ? 'active' : ''}`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {selectedInterests.includes(interest) && <Check size={14} />}
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 2: TRANSPORTATION (TO/FROM) */}
          <div className="builder-section-card card">
            <div className="section-card-header">
              <span className="step-badge">Step 2</span>
              <div>
                <h3 className="section-card-title">To & From Destination Transport</h3>
                <p className="section-card-desc">Choose how your group arrives at {activeDestination.shortName}.</p>
              </div>
            </div>

            <div className="options-selection-grid">
              {tripComponentsCatalog.transportation.map((t) => {
                const isSelected = selectedTransport === t.id;
                const totalItemCost = t.isFlatRate ? t.pricePerUnit : (t.pricePerUnit * travelers);
                return (
                  <div 
                    key={t.id} 
                    className={`component-option-box ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedTransport(t.id)}
                  >
                    <div className="option-head">
                      <div className="option-title-block">
                        <span className="option-name">{t.name}</span>
                        <span className="badge badge-teal">{t.badge}</span>
                      </div>
                      <div className="option-price-block">
                        <span className="option-calc-price">₹{totalItemCost.toLocaleString('en-IN')}</span>
                        <span className="option-unit-hint">({t.unitType})</span>
                      </div>
                    </div>
                    <p className="option-desc">{t.description}</p>
                    <div className="option-footer-radio">
                      <span className={`radio-dot ${isSelected ? 'checked' : ''}`} />
                      <span>{isSelected ? 'Selected' : 'Select Option'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: ACCOMMODATION / HOTEL STAY */}
          <div className="builder-section-card card">
            <div className="section-card-header">
              <span className="step-badge">Step 3</span>
              <div>
                <h3 className="section-card-title">Accommodation & Hotel Stay</h3>
                <p className="section-card-desc">
                  Based on {Math.ceil(travelers / 2)} room(s) for {durationDays} nights.
                </p>
              </div>
            </div>

            <div className="options-selection-grid">
              {tripComponentsCatalog.accommodation.map((acc) => {
                const isSelected = selectedStay === acc.id;
                const roomsCount = Math.ceil(travelers / 2);
                const totalAccCost = acc.pricePerNight * durationDays * roomsCount;
                return (
                  <div 
                    key={acc.id} 
                    className={`component-option-box ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedStay(acc.id)}
                  >
                    <div className="option-head">
                      <div className="option-title-block">
                        <span className="option-name">{acc.name}</span>
                        <span className="badge badge-emerald">{acc.badge}</span>
                      </div>
                      <div className="option-price-block">
                        <span className="option-calc-price">₹{totalAccCost.toLocaleString('en-IN')}</span>
                        <span className="option-unit-hint">(₹{acc.pricePerNight}/night × {durationDays}n × {roomsCount} room)</span>
                      </div>
                    </div>
                    <p className="option-desc">{acc.description}</p>
                    <div className="amenity-tags-list">
                      {acc.amenities.map((am, i) => (
                        <span key={i} className="amenity-chip">✓ {am}</span>
                      ))}
                    </div>
                    <div className="option-footer-radio">
                      <span className={`radio-dot ${isSelected ? 'checked' : ''}`} />
                      <span>{isSelected ? 'Selected' : 'Select Stay'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 4: LOCAL TRANSPORT */}
          <div className="builder-section-card card">
            <div className="section-card-header">
              <span className="step-badge">Step 4</span>
              <div>
                <h3 className="section-card-title">Local Destination Transit</h3>
                <p className="section-card-desc">Getting around {activeDestination.shortName} during your {durationDays}-day stay.</p>
              </div>
            </div>

            <div className="options-selection-grid">
              {tripComponentsCatalog.localTransport.map((loc) => {
                const isSelected = selectedLocalTrans === loc.id;
                const totalLocCost = loc.isFlatRate 
                  ? (loc.pricePerDay * durationDays)
                  : (loc.pricePerDay * durationDays * travelers);
                return (
                  <div 
                    key={loc.id} 
                    className={`component-option-box ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedLocalTrans(loc.id)}
                  >
                    <div className="option-head">
                      <div className="option-title-block">
                        <span className="option-name">{loc.name}</span>
                        <span className="badge badge-amber">{loc.badge}</span>
                      </div>
                      <div className="option-price-block">
                        <span className="option-calc-price">₹{totalLocCost.toLocaleString('en-IN')}</span>
                        <span className="option-unit-hint">({loc.unitType})</span>
                      </div>
                    </div>
                    <p className="option-desc">{loc.description}</p>
                    <div className="option-footer-radio">
                      <span className={`radio-dot ${isSelected ? 'checked' : ''}`} />
                      <span>{isSelected ? 'Selected' : 'Select Local Transit'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 5: SIGHTSEEING & CERTIFIED GUIDES (MULTI-SELECT) */}
          <div className="builder-section-card card">
            <div className="section-card-header">
              <span className="step-badge">Step 5</span>
              <div>
                <h3 className="section-card-title">Sightseeing & Guides (Optional Add-ons)</h3>
                <p className="section-card-desc">Add or remove certified historical guides and monument access passes.</p>
              </div>
            </div>

            <div className="multiselect-list">
              {tripComponentsCatalog.sightseeing.map((s) => {
                const isChecked = selectedSightseeing.includes(s.id);
                const itemTotal = s.isFlatRate ? s.price : (s.price * travelers);
                return (
                  <div 
                    key={s.id} 
                    className={`multiselect-row ${isChecked ? 'active' : ''}`}
                    onClick={() => toggleSightseeing(s.id)}
                  >
                    <div className="check-box-wrapper">
                      <div className={`custom-checkbox ${isChecked ? 'checked' : ''}`}>
                        {isChecked && <Check size={14} />}
                      </div>
                    </div>
                    <div className="multi-row-content">
                      <div className="multi-title-row">
                        <span className="multi-name">{s.name}</span>
                        <span className="badge badge-teal">{s.badge}</span>
                      </div>
                      <p className="multi-desc">{s.description}</p>
                    </div>
                    <div className="multi-price-col">
                      <span className="multi-price">₹{itemTotal.toLocaleString('en-IN')}</span>
                      <span className="multi-unit">({s.unitType})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 6: EXPERIENCES & ADVENTURE (MULTI-SELECT) */}
          <div className="builder-section-card card">
            <div className="section-card-header">
              <span className="step-badge">Step 6</span>
              <div>
                <h3 className="section-card-title">Experiences & Activities</h3>
                <p className="section-card-desc">Pick thrills and immersive regional workshops for your group.</p>
              </div>
            </div>

            <div className="multiselect-list">
              {tripComponentsCatalog.activities.map((act) => {
                const isChecked = selectedActivities.includes(act.id);
                const itemTotal = act.price * travelers;
                return (
                  <div 
                    key={act.id} 
                    className={`multiselect-row ${isChecked ? 'active' : ''}`}
                    onClick={() => toggleActivity(act.id)}
                  >
                    <div className="check-box-wrapper">
                      <div className={`custom-checkbox ${isChecked ? 'checked' : ''}`}>
                        {isChecked && <Check size={14} />}
                      </div>
                    </div>
                    <div className="multi-row-content">
                      <div className="multi-title-row">
                        <span className="multi-name">{act.name}</span>
                        <span className="badge badge-coral">{act.badge}</span>
                      </div>
                      <p className="multi-desc">{act.description}</p>
                    </div>
                    <div className="multi-price-col">
                      <span className="multi-price">₹{itemTotal.toLocaleString('en-IN')}</span>
                      <span className="multi-unit">({travelers} travelers)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 7: FOOD & DINING ESTIMATE TIER */}
          <div className="builder-section-card card">
            <div className="section-card-header">
              <span className="step-badge">Step 7</span>
              <div>
                <h3 className="section-card-title">Food & Dining Budget Allowance</h3>
                <p className="section-card-desc">Realistic daily food expenditure per person across {durationDays} days.</p>
              </div>
            </div>

            <div className="food-tiers-grid">
              {tripComponentsCatalog.foodTiers.map((f) => {
                const isSelected = selectedFood === f.id;
                const totalFoodCost = f.pricePerDay * durationDays * travelers;
                return (
                  <div 
                    key={f.id} 
                    className={`component-option-box ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedFood(f.id)}
                  >
                    <div className="option-head">
                      <span className="option-name">{f.name}</span>
                      <span className="option-calc-price">₹{totalFoodCost.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="option-desc">{f.description}</p>
                    <span className="food-rate-tag">₹{f.pricePerDay}/person/day</span>
                    <div className="option-footer-radio">
                      <span className={`radio-dot ${isSelected ? 'checked' : ''}`} />
                      <span>{isSelected ? 'Selected' : 'Select Tier'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Live Price & Budget Summary */}
        <div className="builder-summary-column">
          <PriceSummaryCard 
            breakdown={calculations.breakdown}
            calculatedTotal={calculations.calculatedTotal}
            budget={budget}
            travelers={travelers}
            durationDays={durationDays}
            onSaveTrip={handleSaveTrip}
            isSaved={isSaved}
            destinationName={activeDestination.name}
          />
        </div>
      </div>
    </div>
  );
};

export default BuildMyTripPage;
