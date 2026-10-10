import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Calendar, Sliders, ArrowRight } from 'lucide-react';
import './DestinationCard.css';

const DestinationCard = ({ destination, onSelectForBuilder }) => {
  const {
    id,
    name,
    category,
    image,
    description,
    estCostPerPerson,
    rating,
    reviewsCount,
    popularAttractions,
    durationDays
  } = destination;

  return (
    <div className="destination-card card">
      <div className="dest-image-wrapper">
        <img src={image} alt={name} className="dest-image" loading="lazy" />
        <span className="dest-category-pill">{category}</span>
        <div className="dest-rating-pill">
          <Star size={13} fill="#F59E0B" color="#F59E0B" />
          <span>{rating}</span>
          <span className="reviews-cnt">({reviewsCount})</span>
        </div>
      </div>

      <div className="dest-content">
        <div className="dest-header">
          <h3 className="dest-title">
            <MapPin size={17} className="dest-pin-icon" />
            {name}
          </h3>
          <span className="dest-duration"><Calendar size={13} /> {durationDays}</span>
        </div>

        <p className="dest-desc">{description}</p>

        <div className="dest-attractions-wrap">
          <span className="attractions-label">Highlights:</span>
          <div className="attraction-tags">
            {popularAttractions.slice(0, 3).map((item, idx) => (
              <span key={idx} className="attraction-chip">{item}</span>
            ))}
            {popularAttractions.length > 3 && (
              <span className="attraction-chip more-chip">+{popularAttractions.length - 3} more</span>
            )}
          </div>
        </div>

        <div className="dest-footer">
          <div className="dest-price-box">
            <span className="price-prefix">Direct estimate from</span>
            <div className="price-value">
              ₹{estCostPerPerson.toLocaleString('en-IN')}
              <span className="price-suffix">/person</span>
            </div>
          </div>

          <div className="dest-actions">
            {onSelectForBuilder ? (
              <button 
                onClick={() => onSelectForBuilder(destination)} 
                className="btn btn-sm btn-primary"
              >
                Plan This <ArrowRight size={14} />
              </button>
            ) : (
              <Link 
                to={`/build-my-trip?destination=${id}`} 
                className="btn btn-sm btn-primary"
              >
                Plan Trip <Sliders size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
