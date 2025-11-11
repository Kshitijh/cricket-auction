import React from 'react';

const PlayerCard = ({ player, onStartAuction, isCurrentPlayer }) => {
  const formatPrice = (price) => {
    return `₹${(price / 100000).toFixed(1)}L`;
  };

  return (
    <div className={`player-card ${isCurrentPlayer ? 'current-player' : ''}`}>
      <div className="player-info">
        <h3 className="player-name">{player.name}</h3>
        <p className="player-role">{player.role}</p>
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
