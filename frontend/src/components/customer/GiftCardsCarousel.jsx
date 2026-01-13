import React from 'react';
import './GiftCardsCarousel.css';

const GiftCardsCarousel = ({ cards }) => {
  const defaultCards = [
    { 
      id: 1, 
      title: 'I LOVE YOU',
      subtitle: 'Annoying',
      category: 'Featured',
      gradient: 'linear-gradient(135deg, #F5D0C5 0%, #E8B4B8 100%)',
      textColor: '#8B4557'
    },
    { 
      id: 2, 
      title: 'THANK YOU',
      subtitle: 'So Much',
      category: 'Featured',
      gradient: 'linear-gradient(135deg, #D4E5D7 0%, #A8D5BA 100%)',
      textColor: '#2D5A3D'
    },
    { 
      id: 3, 
      title: 'This Cup\'s',
      subtitle: 'FOR YOU',
      category: 'Featured',
      gradient: 'linear-gradient(135deg, #FFE4B5 0%, #F5D089 100%)',
      textColor: '#8B6914'
    },
    { 
      id: 4, 
      title: 'Happy',
      subtitle: 'BIRTHDAY',
      category: 'Birthday',
      gradient: 'linear-gradient(135deg, #E8D5E3 0%, #D4B5C8 100%)',
      textColor: '#6B4560'
    },
    { 
      id: 5, 
      title: 'Celebration',
      subtitle: 'Time!',
      category: 'Birthday',
      gradient: 'linear-gradient(135deg, #B5D8E8 0%, #89C4DC 100%)',
      textColor: '#2A5B7A'
    },
  ];

  const displayCards = cards || defaultCards;

  // Group cards by category
  const categories = [...new Set(displayCards.map(card => card.category))];

  return (
    <div className="gift-cards-carousel">
      {categories.map(category => (
        <div key={category} className="cards-category">
          <div className="category-header">
            <h3 className="category-title">{category}</h3>
            <span className="category-count">ดูทั้งหมด {displayCards.filter(c => c.category === category).length}</span>
          </div>
          <div className="cards-scroll">
            {displayCards
              .filter(card => card.category === category)
              .map(card => (
                <div 
                  key={card.id}
                  className="gift-card"
                  style={{ background: card.gradient }}
                >
                  <div className="card-content" style={{ color: card.textColor }}>
                    <span className="card-title">{card.title}</span>
                    <span className="card-subtitle">{card.subtitle}</span>
                  </div>
                  <div className="card-logo">
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: card.textColor, opacity: 0.3 }}>
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GiftCardsCarousel;
