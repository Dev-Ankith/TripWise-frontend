import React, { useState } from 'react';
import { 
  GitCompare, 
  IndianRupee, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  HelpCircle, 
  ShieldCheck, 
  Sliders, 
  ArrowRight,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { mockAgentPackages, tripComponentsCatalog } from '../data/destinationsData';
import { useTrip } from '../context/TripContext';
import './ComparePackagesPage.css';

const ComparePackagesPage = () => {
  const { currentTrip } = useTrip();

  // Active benchmark sample package
  const [selectedAgentPreset, setSelectedAgentPreset] = useState(mockAgentPackages[0]);

  // User input form for travel-agent quote
  const [agentName, setAgentName] = useState(mockAgentPackages[0].agentName);
  const [agentPackageTitle, setAgentPackageTitle] = useState(mockAgentPackages[0].title);
  const [agentQuotedPrice, setAgentQuotedPrice] = useState(mockAgentPackages[0].packagePrice);
  const [agentIncludedList, setAgentIncludedList] = useState(mockAgentPackages[0].inclusions.join('\n'));
  const [agentExcludedList, setAgentExcludedList] = useState(mockAgentPackages[0].hiddenCostsOrExclusions.join('\n'));

  // User self-built estimates (defaults to current context calculation or benchmark)
  const selfBuiltEst = currentTrip?.budget ? Math.round(currentTrip.budget * 0.78) : 26800;
  const [selfBuiltCustomPrice, setSelfBuiltCustomPrice] = useState(selfBuiltEst);

  // Are the services strictly equivalent checkbox
  const [isServiceEquivalent, setIsServiceEquivalent] = useState(true);

  // Load a preset template
  const handleSelectPreset = (pkg) => {
    setSelectedAgentPreset(pkg);
    setAgentName(pkg.agentName);
    setAgentPackageTitle(pkg.title);
    setAgentQuotedPrice(pkg.packagePrice);
    setAgentIncludedList(pkg.inclusions.join('\n'));
    setAgentExcludedList(pkg.hiddenCostsOrExclusions.join('\n'));
    setSelfBuiltCustomPrice(pkg.equivalentSelfBuiltCost);
  };

  // Math comparison
  const costDifference = Number(agentQuotedPrice) - Number(selfBuiltCustomPrice);
  const percentDifference = Math.round((costDifference / (selfBuiltCustomPrice || 1)) * 100);

  const inclusionsArray = agentIncludedList.split('\n').filter(line => line.trim().length > 0);
  const exclusionsArray = agentExcludedList.split('\n').filter(line => line.trim().length > 0);

  return (
    <div className="compare-page-wrapper">
      {/* Header Banner */}
      <div className="compare-header-banner">
        <div className="container">
          <div className="compare-header-content">
            <span className="badge badge-teal">Transparent Package Analysis</span>
            <h1 className="compare-title">Travel Agent vs. Self-Built Comparison</h1>
            <p className="compare-subtitle">
              Enter any quote from an offline travel broker or online package reseller. 
              Break down the true itemized difference and uncover hidden costs before paying an advance.
            </p>
          </div>
        </div>
      </div>

      <div className="container compare-main-layout">
        {/* Preset Selector Bar */}
        <div className="preset-selector-card card">
          <div className="preset-header">
            <Sparkles size={16} className="text-teal" />
            <span className="preset-label">Load Realistic Tour Package Benchmark:</span>
          </div>
          <div className="preset-buttons">
            {mockAgentPackages.map((pkg) => (
              <button
                key={pkg.destinationId}
                className={`preset-btn ${selectedAgentPreset.destinationId === pkg.destinationId ? 'active' : ''}`}
                onClick={() => handleSelectPreset(pkg)}
              >
                {pkg.destinationName.split(',')[0]} (₹{pkg.packagePrice.toLocaleString('en-IN')})
              </button>
            ))}
          </div>
        </div>

        {/* Input Forms Row: Agent Package Details vs Self-Built Cost */}
        <div className="grid-2 compare-input-cards">
          {/* Column A: Travel Agent Package Info */}
          <div className="card compare-form-card">
            <div className="form-card-badge badge-coral">Travel-Agent Package Details</div>
            <h3 className="form-card-title">Agent / Agency Quote</h3>
            <p className="form-card-sub">Enter the package quotation you received from a travel broker.</p>

            <div className="form-group">
              <label className="form-label">Agency / Provider Name</label>
              <input 
                type="text"
                className="form-control"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="e.g. StarTravel Holidays Pvt Ltd"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Package Package Title / Itinerary</label>
              <input 
                type="text"
                className="form-control"
                value={agentPackageTitle}
                onChange={(e) => setAgentPackageTitle(e.target.value)}
                placeholder="e.g. 5D/4N Himachal Delight"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Quoted Package Total Price (₹)</label>
              <div className="currency-input-wrap">
                <span className="currency-symbol">₹</span>
                <input 
                  type="number"
                  step="500"
                  className="form-control font-bold-input"
                  value={agentQuotedPrice}
                  onChange={(e) => setAgentQuotedPrice(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Included Services (one per line)</label>
              <textarea 
                className="form-control"
                rows="4"
                value={agentIncludedList}
                onChange={(e) => setAgentIncludedList(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Exclusions / On-Spot Extra Fees (one per line)</label>
              <textarea 
                className="form-control"
                rows="3"
                value={agentExcludedList}
                onChange={(e) => setAgentExcludedList(e.target.value)}
              />
            </div>
          </div>

          {/* Column B: Self-Built Trip Equivalent */}
          <div className="card compare-form-card">
            <div className="form-card-badge badge-teal">TripWise Self-Built Equivalent</div>
            <h3 className="form-card-title">Your Itemized Direct Trip</h3>
            <p className="form-card-sub">Calculated directly from verified rail/flight, hotel, and local rentals.</p>

            <div className="form-group">
              <label className="form-label">Self-Built Direct Estimate (₹)</label>
              <div className="currency-input-wrap">
                <span className="currency-symbol">₹</span>
                <input 
                  type="number"
                  step="500"
                  className="form-control font-bold-input"
                  value={selfBuiltCustomPrice}
                  onChange={(e) => setSelfBuiltCustomPrice(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="direct-features-list">
              <h4 className="direct-features-title">What Self-Built Means on TripWise:</h4>
              <div className="direct-feature-point">
                <CheckCircle2 size={16} className="text-emerald" />
                <span><strong>No shopping stops:</strong> You choose where to go, not where driver gets kickbacks.</span>
              </div>
              <div className="direct-feature-point">
                <CheckCircle2 size={16} className="text-emerald" />
                <span><strong>Itemized invoices:</strong> Exact receipts for trains, hotels, and rentals.</span>
              </div>
              <div className="direct-feature-point">
                <CheckCircle2 size={16} className="text-emerald" />
                <span><strong>Flexible itinerary:</strong> Wake up at your own pace; stay longer at cafes.</span>
              </div>
              <div className="direct-feature-point">
                <CheckCircle2 size={16} className="text-emerald" />
                <span><strong>Direct local guides:</strong> Govt. certified historians paid directly.</span>
              </div>
            </div>

            <div className="equivalence-toggle-box">
              <label className="checkbox-container">
                <input 
                  type="checkbox"
                  checked={isServiceEquivalent}
                  onChange={(e) => setIsServiceEquivalent(e.target.checked)}
                />
                <span className="checkmark" />
                <span className="checkbox-label">
                  <strong>Services are comparable in standard</strong> (similar hotel rating, similar transit class).
                </span>
              </label>
              <p className="equivalence-hint">
                Note: TripWise avoids labeling the difference as pure "broker profit" if service tiers or meal inclusions differ significantly.
              </p>
            </div>
          </div>
        </div>

        {/* COMPARISON RESULTS SCORECARD */}
        <div className="comparison-scorecard card">
          <div className="scorecard-header">
            <GitCompare size={24} className="text-teal" />
            <div>
              <h3 className="scorecard-title">Detailed Side-by-Side Analysis</h3>
              <p className="scorecard-subtitle">
                Comparing <strong>{agentName}</strong> vs <strong>TripWise Self-Built Trip</strong>
              </p>
            </div>
          </div>

          <div className="grid-3 scorecard-metrics">
            {/* Metric 1: Agent Package */}
            <div className="metric-box card-agent-quote">
              <span className="metric-tag">Agent Package Quote</span>
              <div className="metric-price">₹{Number(agentQuotedPrice).toLocaleString('en-IN')}</div>
              <span className="metric-footnote">Lump-sum quote with bundled services</span>
            </div>

            {/* Metric 2: Self-Built Direct */}
            <div className="metric-box card-direct-quote">
              <span className="metric-tag">Self-Built Direct Cost</span>
              <div className="metric-price">₹{Number(selfBuiltCustomPrice).toLocaleString('en-IN')}</div>
              <span className="metric-footnote">Sum of individual verified items</span>
            </div>

            {/* Metric 3: Difference */}
            <div className={`metric-box ${costDifference >= 0 ? 'card-diff-positive' : 'card-diff-negative'}`}>
              <span className="metric-tag">
                {costDifference >= 0 ? 'Estimated Difference' : 'Self-Built Upgrade Difference'}
              </span>
              <div className="metric-price">
                {costDifference >= 0 ? `₹${costDifference.toLocaleString('en-IN')}` : `-₹${Math.abs(costDifference).toLocaleString('en-IN')}`}
              </div>
              <span className="metric-footnote">
                {costDifference >= 0 ? `${percentDifference}% higher than direct cost` : `Self-built has premium selections`}
              </span>
            </div>
          </div>

          {/* Nuanced Academic Explanation Banner */}
          <div className="analysis-explanation-banner">
            <div className="explanation-icon-col">
              <Info size={22} className="text-teal" />
            </div>
            <div className="explanation-text-col">
              <h4 className="explanation-title">
                {isServiceEquivalent && costDifference > 0
                  ? 'Estimated Broker Commission & Intermediary Markup Analysis'
                  : 'Fair Value & Service Parity Assessment'}
              </h4>
              <p className="explanation-p">
                {isServiceEquivalent ? (
                  costDifference > 0 ? (
                    <>
                      Because both trips feature comparable 3-star accommodations and sleeper rail/air connections, the 
                      <strong> ₹{costDifference.toLocaleString('en-IN')} difference </strong> 
                      principally represents agency marketing overhead, broker commission margin (approx. <strong>{percentDifference}%</strong>), and risk buffering. 
                      By booking directly via TripWise's itemized links, you retain these funds or can reallocate them to luxury dining.
                    </>
                  ) : (
                    <>
                      Your self-built itinerary is currently priced slightly above the travel-agent package. This typically indicates 
                      you have selected premium boutique stays or higher-tier direct flights compared to the agency’s group wholesale inventory.
                    </>
                  )
                ) : (
                  <>
                    Since the compared itineraries contain different service tiers (e.g. standard resort vs boutique haveli), 
                    this difference of <strong>₹{Math.abs(costDifference).toLocaleString('en-IN')}</strong> reflects 
                    differing quality standards and optional add-ons rather than pure intermediary profit. 
                    All stated figures remain academic estimates.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Inclusions vs Hidden Traps Table */}
          <div className="services-comparison-table-wrapper">
            <h4 className="table-section-title">
              <Layers size={16} /> Included In Package vs Hidden Exclusions
            </h4>

            <div className="grid-2 inclusion-cards-row">
              <div className="inclusion-box">
                <span className="inclusion-box-title text-success">
                  <CheckCircle2 size={16} /> Included by Agent:
                </span>
                <ul className="inclusions-list">
                  {inclusionsArray.map((inc, i) => (
                    <li key={i}>{inc}</li>
                  ))}
                </ul>
              </div>

              <div className="exclusion-box">
                <span className="exclusion-box-title text-danger">
                  <AlertCircle size={16} /> Typical Agent Exclusions / Hidden Gotchas:
                </span>
                <ul className="exclusions-list">
                  {exclusionsArray.map((exc, i) => (
                    <li key={i}>{exc}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePackagesPage;
