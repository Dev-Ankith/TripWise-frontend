import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  SlidersHorizontal, 
  Compass, 
  IndianRupee,
  Layers,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { destinationsData as initialMockDestinations } from '../data/destinationsData';
import { DestinationApi } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import { useTrip } from '../context/TripContext';
import './ExploreDestinationsPage.css';

const categories = ['All', 'Mountains', 'Beaches', 'Heritage', 'Nature', 'Adventure', 'Spiritual'];
const travelStylesList = ['All', 'Adventure', 'Couple', 'Family', 'Solo', 'Backpacking', 'Heritage'];

const ExploreDestinationsPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'All';

  const [destinationsList, setDestinationsList] = useState(initialMockDestinations);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [maxBudget, setMaxBudget] = useState(30000);

  const navigate = useNavigate();
  const { updateCurrentTrip } = useTrip();

  // Fetch destinations from Spring Boot Backend
  useEffect(() => {
    DestinationApi.getAll()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          // Map backend entities to frontend display model
          const mapped = res.data.map((d, index) => {
            const fallback = initialMockDestinations.find(
              (m) => m.name.toLowerCase().includes(d.name.toLowerCase().slice(0, 4))
            ) || initialMockDestinations[index % initialMockDestinations.length];

            return {
              id: d.id,
              name: d.name,
              state: d.state,
              category: d.travelCategory || fallback.category,
              image: d.imageUrl || fallback.image,
              description: d.description || fallback.description,
              estCostPerPerson: Number(d.estimatedStartingCost) || fallback.estCostPerPerson,
              rating: fallback.rating || 4.8,
              reviewsCount: fallback.reviewsCount || 250,
              popularAttractions: fallback.popularAttractions || [d.name, 'Sightseeing', 'Local Market'],
              travelStyles: fallback.travelStyles || ['Adventure', 'Leisure', 'Culture'],
              durationDays: fallback.durationDays || '4-5 Days'
            };
          });
          setDestinationsList(mapped);
        }
      })
      .catch((err) => {
        console.info('Backend destinations fetch fallback to local mock:', err.message);
      });
  }, []);

  // Filtered & sorted destinations
  const filteredDestinations = useMemo(() => {
    return destinationsList
      .filter((dest) => {
        // Query match
        const matchesQuery = 
          dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.popularAttractions.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category filter
        const matchesCategory = selectedCategory === 'All' || dest.category === selectedCategory;

        // Travel style filter
        const matchesStyle = selectedStyle === 'All' || dest.travelStyles.includes(selectedStyle);

        // Budget cap
        const matchesBudget = dest.estCostPerPerson <= maxBudget;

        return matchesQuery && matchesCategory && matchesStyle && matchesBudget;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.estCostPerPerson - b.estCostPerPerson;
        if (sortBy === 'priceDesc') return b.estCostPerPerson - a.estCostPerPerson;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.reviewsCount - a.reviewsCount; // popular default
      });
  }, [searchQuery, selectedCategory, selectedStyle, sortBy, maxBudget]);

  const handlePickForBuilder = (destination) => {
    updateCurrentTrip({
      destination: destination.id,
      destinationName: destination.name,
      budget: destination.estCostPerPerson * 2
    });
    navigate(`/build-my-trip?destination=${destination.id}`);
  };

  return (
    <div className="explore-page-wrapper">
      {/* Header Banner */}
      <div className="explore-header-banner">
        <div className="container">
          <div className="explore-header-content">
            <span className="badge badge-teal">Transparent Destination Catalog</span>
            <h1 className="explore-title">Explore Indian Destinations</h1>
            <p className="explore-subtitle">
              Browse authentic Indian circuits with real itemized baseline costs, suitable travel styles, and verified attractions.
            </p>
          </div>
        </div>
      </div>

      <div className="container explore-content-container">
        {/* Filter Controls Bar */}
        <div className="filters-control-card card">
          <div className="filter-row-top">
            {/* Search Input */}
            <div className="search-box-wrap">
              <Search size={18} className="search-icon" />
              <input 
                type="text"
                className="filter-search-input"
                placeholder="Search destination, state, or attraction (e.g. Pangong, Tea Gardens, Goa)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="clear-query-btn"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="sort-dropdown-wrap">
              <label className="sort-label">
                <ArrowUpDown size={15} /> Sort by:
              </label>
              <select 
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="filter-row-middle">
            <span className="filter-group-label">Circuit Type:</span>
            <div className="category-chips-list">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`chip-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style & Budget Range Slider */}
          <div className="filter-row-bottom">
            <div className="style-filter-wrap">
              <span className="filter-group-label">Travel Style:</span>
              <div className="style-chips-list">
                {travelStylesList.map((style) => (
                  <button
                    key={style}
                    className={`chip-btn chip-sm ${selectedStyle === style ? 'active' : ''}`}
                    onClick={() => setSelectedStyle(style)}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="budget-slider-wrap">
              <div className="budget-slider-head">
                <span className="filter-group-label">Max Cost / Person:</span>
                <span className="budget-slider-val">₹{maxBudget.toLocaleString('en-IN')}</span>
              </div>
              <input 
                type="range"
                min="8000"
                max="35000"
                step="1000"
                className="budget-range-input"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="results-meta-bar">
          <p className="results-count">
            Showing <strong>{filteredDestinations.length}</strong> {filteredDestinations.length === 1 ? 'destination' : 'destinations'}
            {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
            {searchQuery && <span> matching <em>"{searchQuery}"</em></span>}
          </p>
        </div>

        {/* Destination Cards Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid-3 destinations-results-grid">
            {filteredDestinations.map((dest) => (
              <DestinationCard 
                key={dest.id} 
                destination={dest} 
                onSelectForBuilder={handlePickForBuilder}
              />
            ))}
          </div>
        ) : (
          <div className="empty-results-box card">
            <Compass size={48} className="empty-icon" />
            <h3 className="empty-title">No Destinations Found</h3>
            <p className="empty-desc">
              We couldn't find any destinations matching your current search query or budget filter (₹{maxBudget.toLocaleString('en-IN')}).
            </p>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedStyle('All');
                setMaxBudget(30000);
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreDestinationsPage;
