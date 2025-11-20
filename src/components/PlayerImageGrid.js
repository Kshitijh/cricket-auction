import React, { useState, useEffect } from 'react';

const PlayerImageGrid = ({ players, onStartAuction, currentPlayerId }) => {
  const [playerImages, setPlayerImages] = useState({});

  useEffect(() => {
    const fetchPlayerImages = async () => {
      const imageChecks = {};
      for (const player of players) {
        const imageUrl = await checkPlayerImage(player.name);
        if (imageUrl) {
          imageChecks[player.id] = imageUrl;
        }
      }
      setPlayerImages(imageChecks);
    };
    
    fetchPlayerImages();
  }, [players]);

  const checkPlayerImage = async (playerName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/check-player-image/${encodeURIComponent(playerName)}`);
      const data = await response.json();
      return data.exists ? `http://localhost:5000/player-images/${data.filename}` : null;
    } catch (error) {
      console.error('Error checking player image:', error);
      return null;
    }
  };

  const formatPrice = (price) => {
    return `₹${(price / 100000).toFixed(1)}L`;
  };

  return (
    <div className="player-image-grid-section">
      <h2 className="section-title">Available Players - Click to Start Bidding</h2>
      {players.length === 0 ? (
        <p className="no-players-message">All players have been sold or marked as unsold.</p>
      ) : (
        <div className="player-image-grid">
          {players.map(player => (
            <button
              key={player.id}
              className={`player-image-button ${currentPlayerId === player.id ? 'current-player-button' : ''}`}
              onClick={() => onStartAuction(player)}
              title={`${player.name} - ${player.role} - ${formatPrice(player.basePrice)}`}
            >
              <div className="player-image-wrapper">
                {playerImages[player.id] ? (
                  <img 
                    src={playerImages[player.id]} 
                    alt={player.name}
                    className="player-grid-image"
                  />
                ) : (
                  <div className="player-grid-image placeholder">
                    👤
                  </div>
                )}
                {currentPlayerId === player.id && (
                  <div className="current-badge">BIDDING</div>
                )}
              </div>
              <div className="player-image-info">
                <h3 className="player-grid-name">{player.name}</h3>
                <p className="player-grid-role">{player.role}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerImageGrid;
