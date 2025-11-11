import React, { useState, useEffect } from 'react';

const PlayerCard = ({ player, onStartAuction, isCurrentPlayer }) => {
  const [playerImage, setPlayerImage] = useState(null);

  useEffect(() => {
    // Check if player image exists
    const checkImage = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/check-player-image/${encodeURIComponent(player.name)}`);
        const data = await response.json();
        if (data.exists) {
          setPlayerImage(data.filename);
        }
      } catch (error) {
        console.error('Error checking player image:', error);
      }
    };
    
    checkImage();
  }, [player.name]);

  const formatPrice = (price) => {
    return `₹${(price / 100000).toFixed(1)}L`;
  };

  return (
    <div className={`player-card ${isCurrentPlayer ? 'current-player' : ''}`}>
      <div className="player-info">
        <div className="player-header">
          {playerImage ? (
            <img 
              src={`http://localhost:5000/player-images/${playerImage}`} 
              alt={player.name}
              className="player-profile-circle"
            />
          ) : (
            <div className="player-profile-circle placeholder">
              👤
            </div>
          )}
          <div className="player-details">
            <h3 className="player-name">{player.name}</h3>
            <p className="player-role">{player.role}</p>
          </div>
        </div>
        <p className="player-base-price">Base: {formatPrice(player.basePrice)}</p>
      </div>
      <button 
        className="start-bid-btn"
        onClick={() => onStartAuction(player)}
        disabled={isCurrentPlayer}
      >
        {isCurrentPlayer ? 'In Auction' : 'Start Bidding'}
      </button>
    </div>
  );
};

export default PlayerCard;
