import React from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  Save, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './PriceSummaryCard.css';

const PriceSummaryCard = ({
  breakdown,
  calculatedTotal,
  budget,
  travelers,
  durationDays,
  onSaveTrip,
  isSaved,
  destinationName
}) => {
  const remainingBudget = budget - calculatedTotal;
  const isOverBudget = remainingBudget < 0;
  const percentUsed = Math.min(Math.round((calculatedTotal / (budget || 1)) * 100), 100);
  const perPersonCost = Math.round(calculatedTotal / (travelers || 1));

  // Estimated traditional tour broker markup (typically 25% - 35% higher in Indian tourism packages)
  const estimatedAgentBenchmark = Math.round(calculatedTotal * 1.32);
  const estimatedSavings = estimatedAgentBenchmark - calculatedTotal;

  return (
    <div className="price-summary-card card">
      <div className="summary-header">
        <div>
          <span className="summary-badge">
            <ShieldCheck size={14} /> Itemized Direct Cost
          </span>
          <h3 className="summary-title">Live Trip Budget Summary</h3>
        </div>
        <div className="travel-meta-tag">
          {travelers} {travelers > 1 ? 'Travelers' : 'Traveler'} • {durationDays} Days
        </div>
      </div>

      {/* Primary Calculated Total */}
      <div className="total-display-banner">
        <span className="total-label">Total Estimated Cost</span>
        <div className="total-amount-row">
          <span className="main-total-currency">₹{calculatedTotal.toLocaleString('en-IN')}</span>
          <span className="per-person-tag">₹{perPersonCost.toLocaleString('en-IN')}/person</span>
        </div>
      </div>

      {/* Budget Progress Meter */}
      <div className="budget-meter-section">
        <div className="meter-label-row">
          <span className="meter-text">Your Budget: <strong>₹{budget.toLocaleString('en-IN')}</strong></span>
          <span className={`meter-percent ${isOverBudget ? 'text-danger' : 'text-success'}`}>
            {Math.round((calculatedTotal / (budget || 1)) * 100)}%
          </span>
        </div>
        <div className="meter-track">
          <div 
            className={`meter-bar ${isOverBudget ? 'bar-over' : 'bar-normal'}`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>

        {/* Budget Warning or Safe Alert */}
        {isOverBudget ? (
          <div className="budget-status-alert alert-over">
            <AlertCircle size={16} className="alert-icon" />
            <div>
              <strong>Budget Exceeded by ₹{Math.abs(remainingBudget).toLocaleString('en-IN')}!</strong>
              <p>Consider choosing 3AC train or a comfort stay tier to fit within your planned budget.</p>
            </div>
          </div>
        ) : (
          <div className="budget-status-alert alert-safe">
            <CheckCircle2 size={16} className="alert-icon" />
            <div>
              <strong>Within Budget: ₹{remainingBudget.toLocaleString('en-IN')} remaining</strong>
              <p>Great job! You have room for extra activities or dining upgrades.</p>
            </div>
          </div>
        )}
      </div>

      {/* Itemized Cost Breakdown List */}
      <div className="itemized-breakdown-list">
        <h4 className="breakdown-list-title">
          <Layers size={14} /> Component Breakdown
        </h4>

        <div className="breakdown-item">
          <span className="item-name">To & From Transport</span>
          <span className="item-price">₹{breakdown.transportation.cost.toLocaleString('en-IN')}</span>
        </div>
        <div className="breakdown-item">
          <span className="item-name">Accommodation ({durationDays} nights)</span>
          <span className="item-price">₹{breakdown.accommodation.cost.toLocaleString('en-IN')}</span>
        </div>
        <div className="breakdown-item">
          <span className="item-name">Local Transport ({durationDays} days)</span>
          <span className="item-price">₹{breakdown.localTransport.cost.toLocaleString('en-IN')}</span>
        </div>
        <div className="breakdown-item">
          <span className="item-name">Sightseeing & Guides</span>
          <span className="item-price">₹{breakdown.sightseeing.cost.toLocaleString('en-IN')}</span>
        </div>
        <div className="breakdown-item">
          <span className="item-name">Activities & Experiences</span>
          <span className="item-price">₹{breakdown.activities.cost.toLocaleString('en-IN')}</span>
        </div>
        <div className="breakdown-item">
          <span className="item-name">Food & Dining Allowance</span>
          <span className="item-price">₹{breakdown.food.cost.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Comparative Broker Savings Teaser */}
      <div className="agent-savings-teaser">
        <div className="teaser-head">
          <TrendingDown size={18} className="teaser-icon" />
          <div>
            <span className="teaser-label">Typical Tour Agent Quote:</span>
            <span className="agent-quote">~₹{estimatedAgentBenchmark.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <p className="teaser-text">
          By planning directly with no hidden middleman fees, you avoid approximately <strong>₹{estimatedSavings.toLocaleString('en-IN')}</strong> in commissions.
        </p>
        <Link to="/compare-packages" className="teaser-link">
          Run in-depth package comparison <ArrowRight size={13} />
        </Link>
      </div>

      {/* Actions */}
      <div className="summary-actions">
        {onSaveTrip && (
          <button 
            onClick={onSaveTrip} 
            className={`btn btn-full ${isSaved ? 'btn-secondary' : 'btn-primary'}`}
            disabled={isSaved}
          >
            {isSaved ? (
              <>
                <CheckCircle2 size={18} /> Trip Saved to My Trips!
              </>
            ) : (
              <>
                <Save size={18} /> Save This Trip Plan
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default PriceSummaryCard;
