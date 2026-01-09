import React, { useState, useEffect } from 'react';

const PlayerImageGrid = ({ players, onStartAuction, currentPlayerId, teams = [], currentPlayer, currentBid, onPlaceBid, onSold, onUnsold }) => {
  const [jerseyQuery, setJerseyQuery] = useState('');
  const [nameQuery, setNameQuery] = useState('');
  const [teamImages, setTeamImages] = useState({});

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

  const handleRandomPlayer = () => {
    if (!players || players.length === 0) {
      alert('No available players to select');
      return;
    }

    // Pick a random available player
    const idx = Math.floor(Math.random() * players.length);
    const randomPlayer = players[idx];

    // Clear inputs and start auction
    setJerseyQuery('');
    setNameQuery('');
    onStartAuction(randomPlayer);
  };

  const handlePlaceBid = () => {
    if (!currentPlayer || !onPlaceBid) return;
    onPlaceBid(null, currentPlayer.name, currentBid + 100); // !!important - later change the +100 to the input bid amount.
  };

  const handleSold = async () => {
    if (!currentPlayer || !onSold) {
      alert('No player in auction');
      return;
    }
    try {
      await onSold(null);
    } catch (error) {
      console.error('Error marking player as sold:', error);
    }
  };

  const handleUnsold = () => {
    if (!currentPlayer || !onUnsold) {
      alert('No player in auction');
      return;
    }
    onUnsold();
  }; 

  useEffect(() => {
    const fetchTeamImages = async () => {
      const imageChecks = {};
      for (const team of teams) {
        const imageFilename = await checkTeamImage(team.name);
        if (imageFilename) {
          imageChecks[team.id] = imageFilename;
        }
      }
      setTeamImages(imageChecks);
    };

    fetchTeamImages();
  }, [teams]);

  const checkTeamImage = async (teamName) => {
    try {
      const response = await fetch(`/api/check-team-image/${encodeURIComponent(teamName)}`);
      const data = await response.json();
      return data.exists ? data.filename : null;
    } catch (error) {
      console.error('Error checking team image:', error);
      return null;
    }
  };


  return (
    <div className="player-image-grid-section">
      <div className="player-search-form">
        <div className="form-row">
          <div className="form-group">
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
          <div className="form-group jersey-small">
            <input
              type="number"
              name="jersey"
              value={jerseyQuery}
              onChange={(e) => setJerseyQuery(e.target.value)}
              placeholder="No."
              min="0"
              step="1"
            />
          </div>
          <button type="button" className="find-btn" onClick={handleFindPlayer}>
            Find Player
          </button>
          <button
            type="button"
            className="random-btn"
            onClick={handleRandomPlayer}
            disabled={!players || players.length === 0}
          >
            New Player
          </button>



          <div className="action-buttons-small">
            <button onClick={handlePlaceBid} className="bid-btn-small" title="Place Bid">Bid</button>
            <button onClick={handleSold} className="sold-btn-small" title="Mark as Sold">Sold</button>
            <button onClick={handleUnsold} className="unsold-btn-small" title="Mark as Unsold">Unsold</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerImageGrid;
