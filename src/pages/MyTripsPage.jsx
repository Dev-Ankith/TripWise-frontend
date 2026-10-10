import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Sliders, 
  Eye, 
  Download, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import './MyTripsPage.css';

const MyTripsPage = () => {
  const { savedTrips, deleteTrip, updateCurrentTrip, user } = useTrip();
  const navigate = useNavigate();
  const [selectedTripModal, setSelectedTripModal] = useState(null);

  const handleEditOrClone = (trip) => {
    updateCurrentTrip({
      destinationName: trip.destination,
      durationDays: trip.durationDays,
      travelers: trip.travelers,
      budget: trip.budgetTotal
    });
    navigate('/build-my-trip');
  };

  return (
    <div className="my-trips-page-wrapper">
      {/* Header Banner */}
      <div className="my-trips-header-banner">
        <div className="container">
          <div className="my-trips-header-content">
            <span className="badge badge-teal">Stored Custom Itineraries</span>
            <h1 className="my-trips-title">My Saved Trips & Itineraries</h1>
            <p className="my-trips-subtitle">
              Manage your direct-booked trips, inspect itemized expense ledgers, and export transparent summaries.
            </p>
          </div>
        </div>
      </div>

      <div className="container my-trips-content-container">
        {/* Academic Prototype Notice */}
        <div className="prototype-demo-box card">
          <div className="proto-icon-wrap">
            <Info size={22} className="text-teal" />
          </div>
          <div className="proto-text">
            <strong>Demonstration Workspace Active:</strong>
            <p>
              Trip data below is persisted client-side in browser storage. In the upcoming full-stack milestone, 
              these itineraries will sync via Spring Boot REST APIs to a MySQL relational database.
            </p>
          </div>
        </div>

        {/* Trips List */}
        {savedTrips.length > 0 ? (
          <div className="trips-grid">
            {savedTrips.map((trip) => {
              const remainingFromBudget = trip.budgetTotal - trip.actualCost;
              return (
                <div key={trip.id} className="trip-card card">
                  <div className="trip-cover-wrap">
                    <img src={trip.coverImage} alt={trip.destination} className="trip-cover-img" />
                    <span className={`trip-status-badge status-${trip.status.toLowerCase()}`}>
                      {trip.status}
                    </span>
                  </div>

                  <div className="trip-card-body">
                    <div className="trip-card-head">
                      <h3 className="trip-title">{trip.title}</h3>
                      <div className="trip-meta-tags">
                        <span className="meta-tag"><MapPin size={13} /> {trip.destination}</span>
                        <span className="meta-tag"><Calendar size={13} /> {trip.dates}</span>
                        <span className="meta-tag"><Users size={13} /> {trip.travelers} Pax • {trip.durationDays} Days</span>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="trip-financial-box">
                      <div className="fin-row">
                        <span className="fin-label">Calculated Cost:</span>
                        <span className="fin-val highlight-val">₹{trip.actualCost.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="fin-row">
                        <span className="fin-label">Planned Budget:</span>
                        <span className="fin-val">₹{trip.budgetTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="fin-savings-note">
                        <CheckCircle size={14} className="text-emerald" />
                        <span>{trip.savingsVsAgent}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="trip-card-actions">
                      <button 
                        onClick={() => setSelectedTripModal(trip)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Eye size={14} /> View Itemized Ledger
                      </button>

                      <button 
                        onClick={() => handleEditOrClone(trip)}
                        className="btn btn-primary btn-sm"
                      >
                        <Sliders size={14} /> Edit in Builder
                      </button>

                      <button 
                        onClick={() => deleteTrip(trip.id)}
                        className="btn btn-sm btn-delete-trip"
                        title="Delete Trip"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-trips-card card">
            <Briefcase size={54} className="empty-suitcase-icon" />
            <h3 className="empty-title">No Saved Trips Yet</h3>
            <p className="empty-desc">
              You haven't built any custom trips yet. Use our interactive builder to assemble an itemized itinerary with transparent costs.
            </p>
            <Link to="/build-my-trip" className="btn btn-primary btn-lg">
              <Sliders size={18} /> Start Building My First Trip
            </Link>
          </div>
        )}
      </div>

      {/* DETAIL MODAL FOR ITEMIZED LEDGER */}
      {selectedTripModal && (
        <div className="modal-backdrop" onClick={() => setSelectedTripModal(null)}>
          <div className="modal-container card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-teal">Itemized Cost Ledger</span>
                <h3 className="modal-title">{selectedTripModal.title}</h3>
                <p className="modal-sub">{selectedTripModal.destination} • {selectedTripModal.dates}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedTripModal(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="ledger-table-wrap">
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th>Component Category</th>
                      <th>Selected Service</th>
                      <th className="text-right">Estimated Cost (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTripModal.breakdown && Object.entries(selectedTripModal.breakdown).map(([key, val]) => (
                      <tr key={key}>
                        <td className="font-semibold text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                        <td>{val.name}</td>
                        <td className="text-right font-bold">₹{val.cost.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                    <tr className="table-total-row">
                      <td colSpan="2"><strong>Total Direct Outlay</strong></td>
                      <td className="text-right font-bold text-teal">
                        <strong>₹{selectedTripModal.actualCost.toLocaleString('en-IN')}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="modal-broker-notice">
                <p>
                  <strong>Zero-Commission Guarantee:</strong> Unlike packaged travel agencies that bundle hidden booking commissions, these figures reflect direct supplier tariffs.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => {
                  alert(`Trip itinerary for ${selectedTripModal.destination} exported! In the Spring Boot phase, this will generate a PDF invoice.`);
                }} 
                className="btn btn-secondary"
              >
                <Download size={16} /> Export Itinerary PDF (Demo)
              </button>
              <button onClick={() => setSelectedTripModal(null)} className="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTripsPage;
