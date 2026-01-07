import React, { useState } from 'react';

const PlayerImageGrid = ({ players, onStartAuction, currentPlayerId }) => {
  const [jerseyQuery, setJerseyQuery] = useState('');
  const [nameQuery, setNameQuery] = useState('');

  const handleFindPlayer = () => {
    const jerseyProvided = jerseyQuery !== '' && jerseyQuery !== null;
    const nameProvided = nameQuery.trim() !== '';

    // Require at least one search field
    if (!jerseyProvided && !nameProvided) {
      alert('Please enter a Jersey No. or Player Name to search');
      return;
    }

    let found = null;

    if (jerseyProvided) {
      const j = Number(jerseyQuery);
      if (Number.isNaN(j) || !Number.isInteger(j) || j < 0) {
        alert('Jersey number must be a non-negative integer');
        return;
      }

      if (nameProvided) {
        const q = nameQuery.trim().toLowerCase();
        // Match both jersey number and name substring
        found = players.find(p => p.jersey_no === j && p.name.toLowerCase().includes(q));
      } else {
        // Match by jersey number only
        found = players.find(p => p.jersey_no === j);
      }
    } else if (nameProvided) {
      const q = nameQuery.trim().toLowerCase();
      found = players.find(p => p.name.toLowerCase().includes(q));
    }

    if (found) {
      // Clear inputs and start auction
      setJerseyQuery('');
      setNameQuery('');
      onStartAuction(found);
    } else {
      alert('Player not found');
    }
  }; 



  return (
    <div className="player-image-grid-section">
      <div className="player-search-form">
        <h2 className="section-title">Find Player</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Jersey No.</label>
            <input
              type="number"
              name="jersey"
              value={jerseyQuery}
              onChange={(e) => setJerseyQuery(e.target.value)}
              placeholder="Enter jersey number"
              min="0"
              step="1"
            />
            <small>Integer only</small>
          </div>

          <div className="form-group">
            <label>Player Name</label>
            <input
              type="text"
              name="playerName"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="Enter player name"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="find-btn" onClick={handleFindPlayer}>
            Find Player
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerImageGrid;
